import { PageShell } from "@/components/page-shell";
import { legacyPages } from "@/data/legacy-pages";
import { getSanityManagedPageContent } from "@/lib/sanity-site-content";
import { membershipNav } from "@/lib/site-nav";

function formatMembershipCommitteeHtml(rawHtml: string): string {
  const cleaned = rawHtml.replace(/^<p>\s*<br\s*\/?>\s*<\/p>\s*/i, "").trim();
  return `<h2>Membership Committee</h2>\n${cleaned}`;
}

export default async function MembershipCommitteePage() {
  const content = await getSanityManagedPageContent("membershipCommittee");
  const sourceHtml = content?.bodyHtml ?? legacyPages.membershipCommittee.html;

  return (
    <PageShell
      title={content?.title ?? legacyPages.membershipCommittee.title}
      description={content?.description || "Membership and administrative team contacts."}
      html={formatMembershipCommitteeHtml(sourceHtml)}
      sidebarTitle="Membership"
      sidebarLinks={membershipNav}
      contentClassName="membership-committee-content"
      activePath="/members/membership-committee"
    />
  );
}
