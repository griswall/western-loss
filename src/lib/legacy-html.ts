const WESTERNLOSS_ROOT = "https://westernloss.org";

export function normalizeLegacyHtml(input: string): string {
  return input
    .replace(/&#038;/gi, "&")
    .replace(
      /(href|src)=(["'])https?:\/\/(www\.)?westernloss\.org\/job\//gi,
      (_: string, attr: string, quote: string) => `${attr}=${quote}/job/`,
    )
    .replace(
      /(href|src)=(["'])https?:\/\/(www\.)?westernloss\.org\/wla_donation\.pdf/gi,
      (_: string, attr: string, quote: string) => `${attr}=${quote}/job/wla_donation.pdf`,
    )
    .replace(
      /(href|src)=(["'])\/wla_donation\.pdf/gi,
      (_: string, attr: string, quote: string) => `${attr}=${quote}/job/wla_donation.pdf`,
    )
    .replace(/https?:\/\/(www\.)?westernloss\.org/gi, WESTERNLOSS_ROOT)
    .replace(
      /(href|src)=(["'])\/(wp-content|wp-includes)\//gi,
      (_, attr: string, quote: string, section: string) =>
        `${attr}=${quote}${WESTERNLOSS_ROOT}/${section}/`,
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
