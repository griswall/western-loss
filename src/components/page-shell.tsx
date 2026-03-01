import Link from "next/link";

import { LegacyHtml } from "@/components/legacy-html";
import type { NavItem } from "@/lib/site-nav";

type PageShellProps = {
  title: string;
  description?: string;
  html: string;
  sidebarTitle?: string;
  sidebarLinks?: NavItem[];
  contentClassName?: string;
  activePath?: string;
};

function canonicalPath(pathname: string): string {
  const normalized = pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  if (normalized === "/news") {
    return "/about/news";
  }

  if (normalized === "/members-directory") {
    return "/members-2";
  }

  return normalized;
}

export function PageShell({
  title,
  description,
  html,
  sidebarTitle,
  sidebarLinks,
  contentClassName,
  activePath,
}: PageShellProps) {
  const pathname = canonicalPath(activePath ?? "");
  const hasSidebar = Boolean(sidebarLinks?.length);

  return (
    <main className="page-main" id="top">
      <section className="hero-band">
        <div className="container hero-copy">
          <p className="eyebrow">Western Loss Association</p>
          <h1>{title}</h1>
          {description ? <p className="hero-description">{description}</p> : null}
        </div>
      </section>

      <section className="container content-grid-wrap">
        {hasSidebar ? (
          <aside className="content-sidebar" aria-label={sidebarTitle ?? "Section links"}>
            {sidebarTitle ? <h2>{sidebarTitle}</h2> : null}
            <nav>
              {sidebarLinks?.map((item) => {
                const itemPath = canonicalPath(item.href);
                const isActive = pathname === itemPath;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-link${isActive ? " sidebar-link-active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        ) : null}

        <article className={`content-card ${contentClassName ?? ""}`.trim()}>
          <LegacyHtml html={html} />
        </article>
      </section>
    </main>
  );
}
