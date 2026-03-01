import type { NewsAlbum, NewsPost } from "@/lib/news-parser";
import { fetchSanityQuery, hasSanityConfig } from "@/lib/sanity";

type SanityPhoto = {
  url?: string;
  caption?: string;
};

type SanityAlbum = {
  _key?: string;
  title?: string;
  photos?: SanityPhoto[];
};

type SanityNewsPost = {
  _id: string;
  title?: string;
  shortTitle?: string;
  summary?: string;
  bodyHtml?: string;
  publishedAt?: string;
  albums?: SanityAlbum[];
};

const NEWS_QUERY = `
  *[_type == "newsPost"]
    | order(coalesce(publishedAt, _createdAt) desc) {
      _id,
      title,
      shortTitle,
      summary,
      bodyHtml,
      publishedAt,
      albums[]{
        _key,
        title,
        photos[]{
          "url": coalesce(image.asset->url, externalUrl),
          "caption": coalesce(alt, caption, "")
        }
      }
    }
`;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(value: string | undefined): string {
  if (!value) {
    return "Update";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Update";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function buildThumbUrl(url: string): string {
  if (!url.includes(".sanity.io/")) {
    return url;
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}auto=format&w=360&h=240&fit=crop`;
}

function toAlbums(input: SanityAlbum[] | undefined, fallbackTitle: string): NewsAlbum[] {
  if (!input?.length) {
    return [];
  }

  const albums = input
    .map((album, albumIndex) => {
      const photos = (album.photos ?? []).filter((photo) => Boolean(photo.url));

      if (!photos.length) {
        return null;
      }

      const title = album.title?.trim() || `${fallbackTitle} Photos`;
      return {
        id: album._key || `sanity-album-${albumIndex + 1}`,
        title,
        images: photos.map((photo) => ({
          fullSrc: photo.url as string,
          thumbSrc: buildThumbUrl(photo.url as string),
          title: photo.caption?.trim() || "Photo",
        })),
      };
    })
    .filter((album): album is NewsAlbum => Boolean(album));

  return albums;
}

export async function getSanityNewsPosts(): Promise<NewsPost[]> {
  if (!hasSanityConfig()) {
    return [];
  }

  try {
    const rows = await fetchSanityQuery<SanityNewsPost[]>(NEWS_QUERY);

    return rows
      .map((row, index) => {
        const title = row.shortTitle?.trim() || row.title?.trim() || `Update ${index + 1}`;
        const bodyHtml = row.bodyHtml?.trim() || (row.summary ? `<p>${escapeHtml(row.summary)}</p>` : "");
        const albums = toAlbums(row.albums, title);

        if (!bodyHtml && albums.length === 0) {
          return null;
        }

        return {
          id: row._id,
          date: formatDate(row.publishedAt),
          title,
          bodyHtml,
          albums,
        };
      })
      .filter((post): post is NewsPost => Boolean(post));
  } catch (error) {
    console.error("Sanity news fetch failed, using legacy data.", error);
    return [];
  }
}
