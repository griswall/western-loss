import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { getCliClient } from "sanity/cli";

import legacyPages from "../src/data/legacy-pages.json";
import { parseNewsPosts } from "../src/lib/news-parser";

const LEGACY_HOSTS = new Set(["westernloss.org", "www.westernloss.org"]);
const MIRROR_PREFIX = "/legacy-news-assets";
const MIRROR_BASE_URL = "https://griswall.github.io/western-loss";

type NewsPhoto = {
  _key?: string;
  image?: unknown;
  externalUrl?: string;
  alt?: string;
  caption?: string;
};

type NewsAlbum = {
  _key?: string;
  title?: string;
  photos?: NewsPhoto[];
};

type NewsPostRow = {
  _id: string;
  albums?: NewsAlbum[];
};

function normalizeLegacyKey(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl);
    if (!LEGACY_HOSTS.has(parsed.hostname.toLowerCase())) {
      return null;
    }

    const pathname = parsed.pathname.trim();
    if (!pathname || pathname === "/") {
      return null;
    }

    return `https://westernloss.org${pathname}`;
  } catch {
    return null;
  }
}

function toMirrorRelativePath(rawUrl: string): string | null {
  const key = normalizeLegacyKey(rawUrl);
  if (!key) {
    return null;
  }

  const parsed = new URL(key);
  return `${MIRROR_PREFIX}${parsed.pathname}`;
}

function toMirrorAbsoluteUrl(rawUrl: string): string | null {
  const relative = toMirrorRelativePath(rawUrl);
  if (!relative) {
    return null;
  }

  return `${MIRROR_BASE_URL}${relative}`;
}

function resolveOutputPath(projectRoot: string, relativePath: string): string {
  const normalized = path.posix.normalize(relativePath);
  const withoutLeadingSlash = normalized.replace(/^\/+/, "");
  return path.join(projectRoot, "public", withoutLeadingSlash);
}

async function downloadLegacyImage(sourceUrl: string, outputPath: string): Promise<boolean> {
  try {
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      return false;
    }

    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    if (!contentType.startsWith("image/")) {
      return false;
    }

    const body = Buffer.from(await response.arrayBuffer());
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, body);
    return true;
  } catch {
    return false;
  }
}

async function run() {
  console.log("Mirroring legacy news images...");

  const projectRoot = process.cwd();
  const aboutNewsHtml = legacyPages.aboutNews?.html ?? "";

  if (!aboutNewsHtml.trim()) {
    throw new Error("Legacy aboutNews HTML was not found in src/data/legacy-pages.json.");
  }

  const posts = parseNewsPosts(aboutNewsHtml);
  const legacyUrlSet = new Set<string>();

  for (const post of posts) {
    for (const album of post.albums) {
      for (const image of album.images) {
        const key = normalizeLegacyKey(image.fullSrc);
        if (key) {
          legacyUrlSet.add(key);
        }
      }
    }
  }

  const legacyUrls = Array.from(legacyUrlSet.values());
  console.log(`Found ${legacyUrls.length} unique legacy image URLs.`);

  let downloaded = 0;
  let failed = 0;

  for (let index = 0; index < legacyUrls.length; index += 1) {
    const sourceUrl = legacyUrls[index];
    const relativePath = toMirrorRelativePath(sourceUrl);

    if (!relativePath) {
      failed += 1;
      continue;
    }

    const outputPath = resolveOutputPath(projectRoot, relativePath);
    const ok = await downloadLegacyImage(sourceUrl, outputPath);
    if (ok) {
      downloaded += 1;
    } else {
      failed += 1;
    }

    if ((index + 1) % 20 === 0 || index + 1 === legacyUrls.length) {
      console.log(`Downloaded ${downloaded}/${legacyUrls.length} (failed: ${failed})...`);
    }
  }

  const client = getCliClient({
    apiVersion: "2024-08-01",
    useCdn: false,
  });

  const rows = await client.fetch<NewsPostRow[]>(
    `*[_type == "newsPost" && count(albums) > 0]{_id, albums}`,
  );

  let patchedDocs = 0;
  let committed = 0;
  const chunkSize = 20;

  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const tx = client.transaction();
    let chunkChanges = 0;

    for (const row of chunk) {
      const albums = row.albums ?? [];
      let changed = false;

      const nextAlbums = albums.map((album) => {
        const photos = album.photos ?? [];
        const nextPhotos = photos.map((photo) => {
          const current = photo.externalUrl?.trim();
          if (!current) {
            return photo;
          }

          const mirrored = toMirrorAbsoluteUrl(current);
          if (!mirrored || mirrored === current) {
            return photo;
          }

          changed = true;
          return {
            ...photo,
            externalUrl: mirrored,
          };
        });

        return {
          ...album,
          photos: nextPhotos,
        };
      });

      if (!changed) {
        continue;
      }

      tx.patch(row._id, {
        set: {
          albums: nextAlbums,
        },
      });
      patchedDocs += 1;
      chunkChanges += 1;
    }

    if (chunkChanges > 0) {
      await tx.commit();
      committed += chunkChanges;
      console.log(`Patched ${committed} news post(s) with mirrored image URLs...`);
    }
  }

  console.log(
    `Mirror complete. Downloaded ${downloaded}/${legacyUrls.length} images (failed: ${failed}).`,
  );
  console.log(`Patched ${patchedDocs} news post(s) to GitHub-hosted image URLs.`);
}

run().catch((error) => {
  console.error("News image mirroring failed.");
  console.error(error);
  process.exitCode = 1;
});
