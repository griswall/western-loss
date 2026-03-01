import { LegacyHtml } from "@/components/legacy-html";
import { MembersDirectoryClient } from "@/components/members-directory-client";
import { memberEntries } from "@/data/members-directory";
import { legacyPages } from "@/data/legacy-pages";
import { getSanityManagedPageContent, getSanityMemberCompanies } from "@/lib/sanity-site-content";

export default async function MembersDirectoryPage() {
  const introContent = await getSanityManagedPageContent("membersOverview");
  const cmsEntries = await getSanityMemberCompanies();
  const entries = cmsEntries.length ? cmsEntries : memberEntries;

  return (
    <main className="page-main" id="top">
      <section className="hero-band">
        <div className="container hero-copy">
          <p className="eyebrow">Western Loss Association</p>
          <h1>Members</h1>
          <p className="hero-description">
            Search by company or contact and jump by letter.
          </p>
        </div>
      </section>

      <section className="container directory-intro">
        <LegacyHtml html={introContent?.bodyHtml ?? legacyPages.membersOverview.html} />
      </section>

      <section className="container">
        <MembersDirectoryClient entries={entries} />
      </section>
    </main>
  );
}
