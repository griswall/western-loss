import { PageShell } from "@/components/page-shell";
import { legacyPages } from "@/data/legacy-pages";
import { getSanityMembershipPageContent } from "@/lib/sanity-site-content";
import { membershipNav } from "@/lib/site-nav";

function cleanupSectionHtml(input: string): string {
  return input
    .replace(/^(?:\s*<br\s*\/?>\s*)+/i, "")
    .replace(/(?:\s*<br\s*\/?>\s*)+$/i, "")
    .trim();
}

function formatMembershipHtml(rawHtml: string): string {
  const compact = rawHtml.replace(/<\/p>\s*<p>\s*<\/p>/gi, "").trim();
  const purposeMarker = /<strong>\s*PURPOSE:\s*<\/strong>/i;
  const eligibilityMarker = /<strong>\s*ELIGIBILITY:\s*<\/strong>/i;
  const officersMarker = /<strong>\s*OFFICERS:\s*<\/strong>/i;

  if (!purposeMarker.test(compact) || !eligibilityMarker.test(compact) || !officersMarker.test(compact)) {
    return rawHtml;
  }

  const withoutOuterP = compact.replace(/^<p>/i, "").replace(/<\/p>\s*$/i, "");
  const [intro, afterPurpose] = withoutOuterP.split(purposeMarker);
  if (!afterPurpose) {
    return rawHtml;
  }

  const [purposeText, afterEligibility] = afterPurpose.split(eligibilityMarker);
  if (!afterEligibility) {
    return rawHtml;
  }

  const [eligibilityText, officersTextRaw] = afterEligibility.split(officersMarker);
  if (!officersTextRaw) {
    return rawHtml;
  }

  const officersText = officersTextRaw;

  return `
    <p>${cleanupSectionHtml(intro)}</p>
    <div class="membership-row">
      <h3>Purpose</h3>
      <p>${cleanupSectionHtml(purposeText)}</p>
    </div>
    <div class="membership-row">
      <h3>Eligibility</h3>
      <p>${cleanupSectionHtml(eligibilityText)}</p>
    </div>
    <div class="membership-row">
      <h3>Officers</h3>
      <p>${cleanupSectionHtml(officersText)}</p>
    </div>
  `.trim();
}

export default async function MembershipPage() {
  const content = await getSanityMembershipPageContent();

  return (
    <PageShell
      title={content?.title ?? legacyPages.membership.title}
      description={content?.description ?? "Membership purpose, eligibility, and officer qualifications."}
      html={content?.html ?? formatMembershipHtml(legacyPages.membership.html)}
      sidebarTitle="Membership"
      sidebarLinks={membershipNav}
      contentClassName="membership-content"
      activePath="/members"
    />
  );
}
