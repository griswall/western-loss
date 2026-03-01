import { PageShell } from "@/components/page-shell";
import { legacyPages } from "@/data/legacy-pages";
import { aboutNav } from "@/lib/site-nav";

export default function AboutOfficersPage() {
  return (
    <PageShell
      title={legacyPages.aboutOfficers.title}
      description="Current officers, executive committee, and recent past presidents."
      html={legacyPages.aboutOfficers.html}
      sidebarTitle="About"
      sidebarLinks={aboutNav}
      activePath="/about/officers"
    />
  );
}
