import { PageShell } from "@/components/page-shell";
import { legacyPages } from "@/data/legacy-pages";
import { membershipNav } from "@/lib/site-nav";

export default function BecomeMemberPage() {
  return (
    <PageShell
      title={legacyPages.becomeMember.title}
      description="Membership application forms and resources."
      html={legacyPages.becomeMember.html}
      sidebarTitle="Membership"
      sidebarLinks={membershipNav}
      activePath="/members/become-a-member"
    />
  );
}
