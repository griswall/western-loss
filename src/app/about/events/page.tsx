import { PageShell } from "@/components/page-shell";
import { DEFAULT_EVENTS_PAGE_CONTENT, getSanityEventsPageContent } from "@/lib/sanity-site-content";
import { aboutNav } from "@/lib/site-nav";

export default async function AboutEventsPage() {
  const content = (await getSanityEventsPageContent()) ?? DEFAULT_EVENTS_PAGE_CONTENT;

  return (
    <PageShell
      title={content.title}
      description={content.description}
      html={content.bodyHtml}
      sidebarTitle="About"
      sidebarLinks={aboutNav}
      activePath="/about/events"
    />
  );
}
