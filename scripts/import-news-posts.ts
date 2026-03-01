import { getCliClient } from "sanity/cli";

import legacyPages from "../src/data/legacy-pages.json";
import { parseNewsPosts, type NewsPost } from "../src/lib/news-parser";

const LEGACY_HOSTS = new Set(["westernloss.org", "www.westernloss.org"]);
const MIRROR_PREFIX = "/legacy-news-assets";
const MIRROR_BASE_URL = "https://griswall.github.io/western-loss";

type ExistingNewsPost = {
  _id: string;
  legacyId?: string;
};

function stripTags(input: string): string {
  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#038;/gi, "&")
    .replace(/&amp;/gi, "&")
    .replace(/&#8217;/gi, "'")
    .replace(/&#8211;/gi, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function summarizeHtml(html: string): string {
  const text = stripTags(html);
  if (!text) {
    return "";
  }

  if (text.length <= 220) {
    return text;
  }

  return `${text.slice(0, 217).trim()}...`;
}

function toPublishedAt(dateText: string, index: number): string {
  const parsed = new Date(dateText);
  if (!Number.isNaN(parsed.getTime())) {
    return new Date(
      Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), 12, 0, 0, 0),
    ).toISOString();
  }

  // Stable fallback for non-date legacy labels.
  return new Date(Date.UTC(2000, 0, 1, 12, index % 60, 0, 0)).toISOString();
}

function toMirroredUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    if (!LEGACY_HOSTS.has(parsed.hostname.toLowerCase()) || !parsed.pathname) {
      return rawUrl;
    }

    return `${MIRROR_BASE_URL}${MIRROR_PREFIX}${parsed.pathname}`;
  } catch {
    return rawUrl;
  }
}

function mapAlbums(post: NewsPost) {
  return post.albums.map((album, albumIndex) => ({
    _type: "album",
    _key: `alb-${post.id}-${albumIndex + 1}`,
    title: album.title,
    photos: album.images
      .filter((image) => Boolean(image.fullSrc))
      .map((image, imageIndex) => ({
        _type: "albumPhoto",
        _key: `img-${post.id}-${albumIndex + 1}-${imageIndex + 1}`,
        externalUrl: toMirroredUrl(image.fullSrc),
        alt: image.title?.trim() || "",
        caption: "",
      })),
  }));
}

async function run() {
  console.log("Importing legacy news posts...");

  const client = getCliClient({
    apiVersion: "2024-08-01",
    useCdn: false,
  });

  const aboutNewsHtml = (legacyPages as { aboutNews?: { html?: string } }).aboutNews?.html ?? "";
  if (!aboutNewsHtml.trim()) {
    throw new Error("Legacy aboutNews HTML was not found in src/data/legacy-pages.json.");
  }

  const posts = parseNewsPosts(aboutNewsHtml);
  console.log(`Parsed ${posts.length} legacy news posts.`);

  const existingRows = await client.fetch<ExistingNewsPost[]>(
    `*[_type == "newsPost" && defined(legacyId)]{_id, legacyId}`,
  );
  const existingByLegacyId = new Map<string, string>();
  for (const row of existingRows) {
    if (row.legacyId) {
      existingByLegacyId.set(row.legacyId, row._id);
    }
  }

  let updates = 0;
  let creates = 0;
  let committed = 0;
  const chunkSize = 20;

  for (let i = 0; i < posts.length; i += chunkSize) {
    const chunk = posts.slice(i, i + chunkSize);
    const tx = client.transaction();

    for (let j = 0; j < chunk.length; j += 1) {
      const post = chunk[j];
      const globalIndex = i + j;
      const legacyId = `legacy-${post.id}`;
      const existingId = existingByLegacyId.get(legacyId);
      const summary = summarizeHtml(post.bodyHtml);
      const albums = mapAlbums(post);

      const payload = {
        legacyId,
        title: post.title || `Update ${globalIndex + 1}`,
        shortTitle: post.title || `Update ${globalIndex + 1}`,
        publishedAt: toPublishedAt(post.date, globalIndex),
        summary,
        bodyHtml: post.bodyHtml?.trim() || "",
        albums,
      };

      if (existingId) {
        tx.patch(existingId, { set: payload });
        updates += 1;
      } else {
        tx.create({
          _type: "newsPost",
          ...payload,
        });
        creates += 1;
      }
    }

    await tx.commit();
    committed += chunk.length;
    console.log(`Committed ${committed}/${posts.length} posts...`);
  }

  console.log(`News import complete. Updated ${updates}, created ${creates}.`);
}

run().catch((error) => {
  console.error("News import failed.");
  console.error(error);
  process.exitCode = 1;
});
