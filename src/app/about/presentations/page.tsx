import { PageShell } from "@/components/page-shell";
import { legacyPages } from "@/data/legacy-pages";
import { aboutNav } from "@/lib/site-nav";

function formatPresentationsHtml(rawHtml: string): string {
  const itemRegex = /<p>\s*([\s\S]*?)\s*<\/p>/gi;
  const items: string[] = [];
  let match: RegExpExecArray | null = itemRegex.exec(rawHtml);

  while (match) {
    const inner = match[1].trim();
    if (inner) {
      const parsed = inner.match(/^(.*)\s+\((.*?)\s+of\s+(.*?)\)\s*$/i);
      if (parsed) {
        const [, titleHtml, presenter, company] = parsed;
        items.push(`
          <article class="presentation-item">
            <h3>${titleHtml.trim()}</h3>
            <p class="presentation-presenter">${presenter.trim()}</p>
            <p class="presentation-company">${company.trim()}</p>
          </article>
        `);
      } else {
        items.push(`<article class="presentation-item"><h3>${inner}</h3></article>`);
      }
    }
    match = itemRegex.exec(rawHtml);
  }

  if (!items.length) {
    return rawHtml;
  }

  return `<div class="presentation-list">${items.join("")}</div>`;
}

export default function AboutPresentationsPage() {
  return (
    <PageShell
      title={legacyPages.aboutPresentations.title}
      description="Presentation downloads and educational materials."
      html={formatPresentationsHtml(legacyPages.aboutPresentations.html)}
      sidebarTitle="About"
      sidebarLinks={aboutNav}
      contentClassName="presentations-content"
      activePath="/about/presentations"
    />
  );
}
