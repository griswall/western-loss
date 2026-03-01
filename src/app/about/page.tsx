import { PageShell } from "@/components/page-shell";
import { legacyPages } from "@/data/legacy-pages";
import { getSanityManagedPageContent } from "@/lib/sanity-site-content";
import { aboutNav } from "@/lib/site-nav";

export default async function AboutPage() {
  const content = await getSanityManagedPageContent("about");

  return (
    <PageShell
      title={content?.title ?? legacyPages.about.title}
      description={content?.description || "History, mission, and focus of the Western Loss Association."}
      html={content?.bodyHtml ?? legacyPages.about.html}
      sidebarTitle="About"
      sidebarLinks={aboutNav}
      activePath="/about"
    />
  );
}
