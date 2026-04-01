import { normalizeLegacyHtml } from "@/lib/legacy-html";

export type NewsAlbumImage = {
  fullSrc: string;
  thumbSrc: string;
  title: string;
};

export type NewsAlbum = {
  id: string;
  title: string;
  images: NewsAlbumImage[];
};

export type NewsPost = {
  id: string;
  date: string;
  title: string;
  bodyHtml: string;
  albums: NewsAlbum[];
};

const GENERIC_IMAGE_TITLE =
  /^(?:photo|image|img|on tap[-\s]?[a-z]?|post[\s_-]*\d+|[a-z]?\d{3,}|20\d{2}[_-]?post[_-]?\d+)$/i;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() || "";

function withBasePath(pathname: string): string {
  if (!pathname.startsWith("/")) {
    return pathname;
  }

  return basePath ? `${basePath}${pathname}` : pathname;
}

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

function truncateWords(input: string, maxLength = 86): string {
  if (input.length <= maxLength) {
    return input;
  }

  const truncated = input.slice(0, maxLength).replace(/\s+\S*$/, "").trim();
  return truncated;
}

function titleFromEventKeywords(input: string): string {
  const lower = input.toLowerCase();

  if (lower.includes("bags tournament")) {
    return "WLA Bags Tournament Recap";
  }

  if (lower.includes("spring seminar")) {
    return "WLA Spring Seminar Recap";
  }

  if (lower.includes("charity golf")) {
    return "WLA Charity Golf Outing Recap";
  }

  if (lower.includes("post-holiday") || lower.includes("post holiday")) {
    return "Post-Holiday Party Recap";
  }

  if (lower.includes("holiday party")) {
    return "Holiday Party Recap";
  }

  if (lower.includes("fall conference")) {
    return "WLA Fall Conference Recap";
  }

  if (lower.includes("annual conference")) {
    return "Annual Conference Recap";
  }

  if (lower.includes("madison college") && lower.includes("donat")) {
    return "Madison College Donation Update";
  }

  if (lower.includes("cubs rooftop")) {
    return "Cubs Rooftop Networking Event";
  }

  if (lower.includes("cubs") && lower.includes("rooftop")) {
    return "Cubs Rooftop Networking Event";
  }

  if (lower.includes("shriners")) {
    return "Shriners Hospital Donation Update";
  }

  if (lower.includes("shiners")) {
    return "Shriners Hospital Donation Update";
  }

  if (lower.includes("golf outing")) {
    return "WLA Golf Outing Recap";
  }

  if (lower.includes("gold outing")) {
    return "WLA Golf Outing Recap";
  }

  if (lower.includes("spring event")) {
    return "WLA Spring Event Recap";
  }

  if (lower.includes("networking event")) {
    return "WLA Networking Event Recap";
  }

  if (lower.includes("member appreciation party")) {
    return "Member Appreciation Party Recap";
  }

  if (lower.includes("holiday card")) {
    return "Holiday Donation Thank-You";
  }

  if (lower.includes("live burn") || lower.includes("fall meeting")) {
    return "Annual Fall Meeting Live Burn";
  }

  if (lower.includes("lifetime member award") || lower.includes("theresa noska")) {
    return "Lifetime Member Award Presentation";
  }

  return "";
}

function shortenAtBoundary(input: string): string {
  if (input.length <= 68) {
    return input;
  }

  const boundaries = [",", ";", " with ", " where ", " who ", " which ", " at ", " for ", " and "];
  const lower = input.toLowerCase();

  for (const boundary of boundaries) {
    const idx = lower.indexOf(boundary);
    if (idx > 18 && idx <= 68) {
      return input.slice(0, idx).trim();
    }
  }

  return truncateWords(input, 68);
}

function normalizeHeadline(raw: string): string {
  let text = stripTags(raw)
    .replace(/^["'“”]+|["'“”]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();

  text = text
    .replace(/^check out (?:some )?(?:photos?|pictures?) from (?:our|the)\s+/i, "")
    .replace(/^check out (?:some )?(?:photos?|pictures?)\s+/i, "")
    .replace(/^here are (?:some )?(?:photos?|pictures?) from (?:our|the)\s+/i, "")
    .replace(/^view (?:photos?|pictures?) from (?:our|the)\s+/i, "")
    .replace(/^what an incredible turnout we had at(?: the)?\s+/i, "")
    .replace(/^it was a blast seeing everyone compete at(?: our)?\s+/i, "")
    .replace(/^the western loss association was honored to present\s+/i, "")
    .replace(/^the western loss association would like to thank everyone that helped make\s+/i, "")
    .trim();

  const sentence = text.split(/(?<=[.!?])\s+/)[0] ?? text;
  const cleanSentence = sentence.replace(/[.!?]+$/, "").trim();
  const normalized = cleanSentence || text || "Association Update";
  const eventTitle = titleFromEventKeywords(normalized);

  if (eventTitle) {
    return eventTitle;
  }

  const short = shortenAtBoundary(normalized);
  const sentenceCase = /^\d/.test(normalized)
    ? short
    : short.replace(/^([^A-Za-z]*)([A-Za-z])/, (_, prefix: string, first: string) => {
        return `${prefix}${first.toUpperCase()}`;
      });

  return sentenceCase;
}

function deriveTitle(titleHint: string, bodyHtml: string, index: number): string {
  if (titleHint) {
    return normalizeHeadline(titleHint);
  }

  const plain = stripTags(bodyHtml);
  if (!plain) {
    return `Update ${index + 1}`;
  }

  const lead = plain.split(/(?<=[.!?])\s+/)[0] ?? plain;
  return normalizeHeadline(lead);
}

function isLikelyInlineHeadline(text: string): boolean {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return false;
  }

  const wordCount = normalized.split(" ").length;
  const sentenceCount = (normalized.match(/[.!?](?:\s|$)/g) ?? []).length;

  if (normalized.length > 96 || wordCount > 15 || sentenceCount > 1) {
    return false;
  }

  if (/[.!?]/.test(normalized) && wordCount > 11) {
    return false;
  }

  return true;
}

function splitLeadParagraph(bodyHtml: string): { lead: string; remainder: string } {
  const leadMatch = bodyHtml.match(/^<p>\s*([\s\S]*?)\s*<\/p>/i);
  if (!leadMatch) {
    return { lead: "", remainder: bodyHtml };
  }

  const lead = stripTags(leadMatch[1]);
  const remainder = bodyHtml.replace(leadMatch[0], "").trim();
  return { lead, remainder };
}

function hasMeaningfulBodyContent(html: string): boolean {
  const plain = stripTags(html)
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > 0;
}

function removeInlineImages(html: string): string {
  return html
    .replace(/<a\b[^>]*>\s*<img[^>]*>\s*<\/a>/gi, "")
    .replace(/<img[^>]*>/gi, "")
    .replace(/<p>\s*(?:<br\s*\/?>|\u00a0|&nbsp;|\s)*<\/p>/gi, "")
    .trim();
}

function stripWordPressThumbSuffix(pathname: string): string {
  return pathname.replace(/-\d+x\d+(?=\.[a-z0-9]+$)/i, "");
}

function normalizeAlbumImagePath(url: string, preferOriginal = false): string {
  const trimmed = url.trim();
  const uploadMatch = trimmed.match(
    /^(?:https?:\/\/(?:www\.)?westernloss\.org)?(\/wp-content\/uploads\/[^?#]+)(?:[?#].*)?$/i,
  );

  if (uploadMatch) {
    const uploadPath = preferOriginal ? stripWordPressThumbSuffix(uploadMatch[1]) : uploadMatch[1];
    return withBasePath(`/legacy-news-assets${uploadPath}`);
  }

  if (trimmed.startsWith("/")) {
    return withBasePath(trimmed);
  }

  return trimmed;
}

function albumTitleCandidate(raw: string): string {
  const cleaned = stripTags(raw)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned || GENERIC_IMAGE_TITLE.test(cleaned)) {
    return "";
  }

  return truncateWords(cleaned, 62);
}

function nameAlbumsForPost(albums: NewsAlbum[], postTitle: string): NewsAlbum[] {
  if (!albums.length) {
    return albums;
  }

  const fallback = truncateWords(postTitle, 62);

  return albums.map((album, index) => {
    const imageTitle = album.images[0]?.title ?? "";
    const base = albumTitleCandidate(imageTitle) || fallback || `Album ${index + 1}`;
    const suffix = albums.length > 1 ? ` (Part ${index + 1})` : "";

    return {
      ...album,
      title: `${base}${suffix}`,
    };
  });
}

function extractAlbums(html: string, postIndex: number): { bodyHtml: string; albums: NewsAlbum[] } {
  const galleryRegex = /<div id=['"]gallery-[\s\S]*?<\/div>/gi;
  const albumMatches = [...html.matchAll(galleryRegex)];

  let cleaned = html;
  const albums: NewsAlbum[] = [];

  for (let i = 0; i < albumMatches.length; i += 1) {
    const block = albumMatches[i][0];
    const imageMatches = [
      ...block.matchAll(
        /<a[^>]*href=['"]([^'"]+)['"][^>]*?(?:title=['"]([^'"]*)['"])?[^>]*>\s*<img[^>]*src=['"]([^'"]+)['"][^>]*>/gi,
      ),
    ];

    const images: NewsAlbumImage[] = imageMatches.map((match) => ({
      fullSrc: normalizeAlbumImagePath(match[1]),
      title: stripTags(match[2] ?? "Photo"),
      thumbSrc: normalizeAlbumImagePath(match[3], true),
    }));

    if (images.length) {
      albums.push({
        id: `album-${postIndex + 1}-${i + 1}`,
        title: `Album ${i + 1}`,
        images,
      });
    }

    cleaned = cleaned.replace(block, "");
  }

  return { bodyHtml: cleaned, albums };
}

export function parseNewsPosts(rawHtml: string): NewsPost[] {
  const normalized = normalizeLegacyHtml(rawHtml)
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<p>\s*&nbsp;\s*<\/p>/gi, "")
    .trim();

  const chunks = normalized
    .split(/<hr\s*\/?\s*>/i)
    .map((chunk) => chunk.trim())
    .filter((chunk) => stripTags(chunk).length > 0);

  const posts: NewsPost[] = [];

  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index];
    const headerMatch = chunk.match(
      /^<p>\s*<strong>([\s\S]*?)<\/strong>(?:\s*<br\s*\/?\s*>([\s\S]*?))?\s*<\/p>/i,
    );

    let date = "Archive";
    let explicitTitle = "";
    let bodyHtml = chunk;

    if (headerMatch) {
      date = stripTags(headerMatch[1]) || "Archive";
      const inlineTextHtml = (headerMatch[2] ?? "").trim();
      const inlineText = stripTags(inlineTextHtml);
      bodyHtml = chunk.replace(headerMatch[0], "").trim();

      if (inlineText) {
        if (isLikelyInlineHeadline(inlineText)) {
          explicitTitle = inlineText;
        } else {
          const recoveredLead = `<p>${inlineTextHtml}</p>`;
          bodyHtml = [recoveredLead, bodyHtml].filter(Boolean).join("\n");
        }
      }
    }

    const { bodyHtml: htmlWithoutAlbums, albums } = extractAlbums(bodyHtml, index);
    let cleanedBody = removeInlineImages(htmlWithoutAlbums.replace(/<p>\s*<\/p>/gi, "").trim());

    if (!cleanedBody && albums.length === 0) {
      continue;
    }

    const { lead, remainder } = splitLeadParagraph(cleanedBody);
    const titleSource = explicitTitle || lead;
    const title = deriveTitle(titleSource, cleanedBody, index);

    // Remove duplicated lead paragraph after promoting it to the post headline.
    if (!explicitTitle && lead && remainder && hasMeaningfulBodyContent(remainder)) {
      cleanedBody = remainder;
    }

    posts.push({
      id: `news-post-${index + 1}`,
      date,
      title,
      bodyHtml: cleanedBody,
      albums: nameAlbumsForPost(albums, title),
    });
  }

  return posts;
}
