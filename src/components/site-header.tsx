"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { primaryNav } from "@/lib/site-nav";

function isActivePrimaryLink(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  if (href === "/about") {
    return pathname.startsWith("/about") && !pathname.startsWith("/about/news");
  }

  if (href === "/news") {
    return pathname === "/news" || pathname.startsWith("/about/news");
  }

  if (href === "/members-2") {
    return pathname.startsWith("/members-2") || pathname === "/members-directory";
  }

  if (href === "/members") {
    return pathname === "/members" || pathname.startsWith("/members/");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="container header-row">
        <Link href="/" className="brand" aria-label="Western Loss Association home">
          <span className="brand-mark">WLA</span>
          <span>
            <strong>Western Loss Association</strong>
            <small>Property Claims Education and Networking</small>
          </span>
        </Link>
        <nav className="top-nav" aria-label="Primary">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`top-nav-link${isActivePrimaryLink(pathname, item.href) ? " top-nav-link-active" : ""}`}
              aria-current={isActivePrimaryLink(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
