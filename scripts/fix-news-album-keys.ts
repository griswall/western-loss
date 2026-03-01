import { randomUUID } from "node:crypto";

import { getCliClient } from "sanity/cli";

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

type NewsPost = {
  _id: string;
  albums?: NewsAlbum[];
};

function makeKey(prefix: string): string {
  return `${prefix}-${randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

async function run() {
  console.log("Scanning news posts for missing album/photo keys...");

  const client = getCliClient({
    apiVersion: "2024-08-01",
    useCdn: false,
  });

  const rows = await client.fetch<NewsPost[]>(
    `*[_type == "newsPost" && count(albums) > 0]{_id, albums}`,
  );

  let changedDocs = 0;
  let committed = 0;
  const chunkSize = 20;

  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const tx = client.transaction();
    let chunkMutations = 0;

    for (const row of chunk) {
      const albums = row.albums ?? [];
      let changed = false;

      const nextAlbums = albums.map((album) => {
        const nextAlbum: NewsAlbum = {
          ...album,
          _key: album._key || makeKey("alb"),
        };

        if (!album._key) {
          changed = true;
        }

        const photos = album.photos ?? [];
        nextAlbum.photos = photos.map((photo) => {
          if (photo._key) {
            return photo;
          }

          changed = true;
          return {
            ...photo,
            _key: makeKey("img"),
          };
        });

        return nextAlbum;
      });

      if (!changed) {
        continue;
      }

      tx.patch(row._id, {
        set: {
          albums: nextAlbums,
        },
      });
      chunkMutations += 1;
      changedDocs += 1;
    }

    if (chunkMutations > 0) {
      await tx.commit();
      committed += chunkMutations;
      console.log(`Patched ${committed} post(s)...`);
    }
  }

  if (changedDocs === 0) {
    console.log("No missing keys found.");
    return;
  }

  console.log(`Done. Patched ${changedDocs} news post(s) with missing keys.`);
}

run().catch((error) => {
  console.error("Failed to repair news album keys.");
  console.error(error);
  process.exitCode = 1;
});
