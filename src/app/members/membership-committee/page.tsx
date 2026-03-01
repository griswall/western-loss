import { PageShell } from "@/components/page-shell";
import { legacyPages } from "@/data/legacy-pages";
import { membershipNav } from "@/lib/site-nav";

function formatMembershipCommitteeHtml(rawHtml: string): string {
  const cleaned = rawHtml.replace(/^<p>\s*<br\s*\/?>\s*<\/p>\s*/i, "").trim();
  return `<h2>Membership Committee</h2>\n${cleaned}`;
}

export default function MembershipCommitteePage() {
  return (
    <PageShell
      title={legacyPages.membershipCommittee.title}
      description="Membership and administrative team contacts."
      html={formatMembershipCommitteeHtml(legacyPages.membershipCommittee.html)}
      sidebarTitle="Membership"
      sidebarLinks={membershipNav}
      contentClassName="membership-committee-content"
      activePath="/members/membership-committee"
    />
  );
}
