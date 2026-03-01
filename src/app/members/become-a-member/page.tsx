import { PageShell } from "@/components/page-shell";
import { legacyPages } from "@/data/legacy-pages";
import { getSanityManagedPageContent } from "@/lib/sanity-site-content";
import { membershipNav } from "@/lib/site-nav";

export default async function BecomeMemberPage() {
  const content = await getSanityManagedPageContent("becomeMember");

  return (
    <PageShell
      title={content?.title ?? legacyPages.becomeMember.title}
      description={content?.description || "Membership application forms and resources."}
      html={content?.bodyHtml ?? legacyPages.becomeMember.html}
      sidebarTitle="Membership"
      sidebarLinks={membershipNav}
      activePath="/members/become-a-member"
    />
  );
}
