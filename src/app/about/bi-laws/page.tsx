import { PageShell } from "@/components/page-shell";
import { legacyPages } from "@/data/legacy-pages";
import { getSanityManagedPageContent } from "@/lib/sanity-site-content";
import { aboutNav } from "@/lib/site-nav";

export default async function AboutBylawsPage() {
  const content = await getSanityManagedPageContent("aboutBylaws");
  const sourceHtml = content?.bodyHtml ?? legacyPages.aboutBylaws.html;

  const formattedHtml = sourceHtml
    .replace(/<p><strong>(ARTICLE [^<]+)<br\s*\/?>\s*<\/strong>/gi, "<h2>$1</h2><p>")
    .replace(/<p><strong>(ARTICLE [^<]+)<\/strong>\s*<br\s*\/?>/gi, "<h2>$1</h2><p>")
    .replace(
      /<p><strong>\s*Section\s+(\d+)\.\s*<\/strong>/gi,
      '<p><span class="bylaw-section">Section $1.</span> ',
    );

  return (
    <PageShell
      title={content?.title ?? legacyPages.aboutBylaws.title}
      description={content?.description || "Constitution and by-laws of the Western Loss Association."}
      html={formattedHtml}
      sidebarTitle="About"
      sidebarLinks={aboutNav}
      contentClassName="bylaws-content"
      activePath="/about/bi-laws"
    />
  );
}
