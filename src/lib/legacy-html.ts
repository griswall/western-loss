const WESTERNLOSS_ROOT = "https://westernloss.org";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() || "";

function withBasePath(pathname: string): string {
  if (!pathname.startsWith("/")) {
    return pathname;
  }

  return basePath ? `${basePath}${pathname}` : pathname;
}

export function normalizeLegacyHtml(input: string): string {
  return input
    .replace(/&#038;/gi, "&")
    .replace(
      /(href|src)=(["'])https?:\/\/(www\.)?westernloss\.org\/job\//gi,
      (_: string, attr: string, quote: string) => `${attr}=${quote}${withBasePath("/job/")}`,
    )
    .replace(
      /(href|src)=(["'])https?:\/\/(www\.)?westernloss\.org\/wla_donation\.pdf/gi,
      (_: string, attr: string, quote: string) =>
        `${attr}=${quote}${withBasePath("/job/wla_donation.pdf")}`,
    )
    .replace(
      /(href|src)=(["'])\/wla_donation\.pdf/gi,
      (_: string, attr: string, quote: string) =>
        `${attr}=${quote}${withBasePath("/job/wla_donation.pdf")}`,
    )
    .replace(
      /(href|src)=(["'])\/job\//gi,
      (_: string, attr: string, quote: string) => `${attr}=${quote}${withBasePath("/job/")}`,
    )
    .replace(/https?:\/\/(www\.)?westernloss\.org/gi, WESTERNLOSS_ROOT)
    .replace(
      /(href|src)=(["'])\/(wp-content|wp-includes)\//gi,
      (_, attr: string, quote: string, section: string) =>
        `${attr}=${quote}${basePath ? withBasePath(`/${section}/`) : `${WESTERNLOSS_ROOT}/${section}/`}`,
    )
    .replace(/<strong>\s*(<a\b[^>]*>[\s\S]*?<\/a>)\s*<\/strong>/gi, "$1")
    .replace(/<b>\s*(<a\b[^>]*>[\s\S]*?<\/a>)\s*<\/b>/gi, "$1")
    .replace(/<a\b([^>]*)>\s*<strong>([\s\S]*?)<\/strong>\s*<\/a>/gi, "<a$1>$2</a>")
    .replace(/<a\b([^>]*)>\s*<b>([\s\S]*?)<\/b>\s*<\/a>/gi, "<a$1>$2</a>")
    .replace(/<a\b([^>]*)>\s*<em>\s*<strong>([\s\S]*?)<\/strong>\s*<\/em>\s*<\/a>/gi, "<a$1>$2</a>")
    .replace(/<strong>\s*<em>\s*(<a\b[^>]*>[\s\S]*?<\/a>)\s*<\/em>\s*<\/strong>/gi, "$1")
    .replace(/\sstyle=(["'])[\s\S]*?\1/gi, "")
    .replace(/<p>\s*<\/p>/g, "")
    .trim();
}
