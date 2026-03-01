import { PageShell } from "@/components/page-shell";
import { legacyPages } from "@/data/legacy-pages";
import { aboutNav } from "@/lib/site-nav";

export default function AboutPage() {
  return (
    <PageShell
      title={legacyPages.about.title}
      description="History, mission, and focus of the Western Loss Association."
      html={legacyPages.about.html}
      sidebarTitle="About"
      sidebarLinks={aboutNav}
      activePath="/about"
    />
  );
}
