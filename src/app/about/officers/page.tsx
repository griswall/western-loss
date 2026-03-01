import { PageShell } from "@/components/page-shell";
import { legacyPages } from "@/data/legacy-pages";
import { getSanityManagedPageContent } from "@/lib/sanity-site-content";
import { aboutNav } from "@/lib/site-nav";

export default async function AboutOfficersPage() {
  const content = await getSanityManagedPageContent("aboutOfficers");

  return (
    <PageShell
      title={content?.title ?? legacyPages.aboutOfficers.title}
      description={content?.description || "Current officers, executive committee, and recent past presidents."}
      html={content?.bodyHtml ?? legacyPages.aboutOfficers.html}
      sidebarTitle="About"
      sidebarLinks={aboutNav}
      activePath="/about/officers"
    />
  );
}
