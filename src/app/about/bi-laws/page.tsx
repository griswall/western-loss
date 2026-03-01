import { PageShell } from "@/components/page-shell";
import { legacyPages } from "@/data/legacy-pages";
import { aboutNav } from "@/lib/site-nav";

export default function AboutBylawsPage() {
  const formattedHtml = legacyPages.aboutBylaws.html
    .replace(/<p><strong>(ARTICLE [^<]+)<br\s*\/?>\s*<\/strong>/gi, "<h2>$1</h2><p>")
    .replace(/<p><strong>(ARTICLE [^<]+)<\/strong>\s*<br\s*\/?>/gi, "<h2>$1</h2><p>")
    .replace(
      /<p><strong>\s*Section\s+(\d+)\.\s*<\/strong>/gi,
      '<p><span class="bylaw-section">Section $1.</span> ',
    );

  return (
    <PageShell
      title={legacyPages.aboutBylaws.title}
      description="Constitution and by-laws of the Western Loss Association."
      html={formattedHtml}
      sidebarTitle="About"
      sidebarLinks={aboutNav}
      contentClassName="bylaws-content"
      activePath="/about/bi-laws"
    />
  );
}
