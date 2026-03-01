"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LegacyHtml } from "@/components/legacy-html";
import { NewsAlbumViewer } from "@/components/news-album-viewer";
import { parseNewsPosts, type NewsPost } from "@/lib/news-parser";
import { aboutNav } from "@/lib/site-nav";

type NewsFeedProps = {
  rawHtml?: string;
  posts?: NewsPost[];
};

export function NewsFeed({ rawHtml, posts }: NewsFeedProps) {
  const POSTS_PER_PAGE = 8;
  const pathname = usePathname();
  const normalizedPath = pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const canonicalPath = normalizedPath === "/news" ? "/about/news" : normalizedPath;
  const resolvedPosts = posts ?? parseNewsPosts(rawHtml ?? "");
  const totalPosts = resolvedPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = Math.min(totalPosts, startIndex + POSTS_PER_PAGE);
  const visiblePosts = resolvedPosts.slice(startIndex, endIndex);

  const jumpToPage = (page: number) => {
    setCurrentPage(page);
    if (typeof document !== "undefined") {
      const top = document.getElementById("top");
      if (top) {
        top.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <main className="page-main" id="top">
      <section className="hero-band">
        <div className="container hero-copy">
          <p className="eyebrow">Western Loss Association</p>
          <h1>News</h1>
          <p className="hero-description">
            Association announcements, conference recaps, and event albums.
          </p>
        </div>
      </section>

      <section className="container news-layout">
        <aside className="content-sidebar" aria-label="About">
          <h2>About</h2>
          <nav>
            {aboutNav.map((item) => {
              const itemPath =
                item.href !== "/" && item.href.endsWith("/") ? item.href.slice(0, -1) : item.href;
              const isActive = canonicalPath === itemPath;

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

        <div className="news-list">
          <div className="news-toolbar">
            <p className="news-pagination-meta">
              Showing {startIndex + 1}-{endIndex} of {totalPosts} stories
            </p>
            {totalPages > 1 ? (
              <nav className="news-pagination" aria-label="News pages">
                <button
                  type="button"
                  className={`pagination-link${currentPage === 1 ? " pagination-link-disabled" : ""}`}
                  onClick={() => jumpToPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, index) => {
                  const page = index + 1;
                  const isCurrent = page === currentPage;
                  return (
                    <button
                      type="button"
                      key={page}
                      className={`pagination-link${isCurrent ? " pagination-link-current" : ""}`}
                      aria-current={isCurrent ? "page" : undefined}
                      onClick={() => {
                        if (!isCurrent) {
                          jumpToPage(page);
                        }
                      }}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  type="button"
                  className={`pagination-link${currentPage === totalPages ? " pagination-link-disabled" : ""}`}
                  onClick={() => jumpToPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </nav>
            ) : null}
          </div>

          {visiblePosts.map((post) => (
            <article key={post.id} className="news-post">
              <header className="news-post-header">
                <p className="news-post-date">{post.date}</p>
                <h2>{post.title}</h2>
              </header>

              {post.bodyHtml ? (
                <div className="news-content">
                  <LegacyHtml html={post.bodyHtml} />
                </div>
              ) : null}

              {post.albums.length ? (
                <NewsAlbumViewer albums={post.albums} />
              ) : null}
            </article>
          ))}

          {totalPages > 1 ? (
            <nav className="news-pagination news-pagination-bottom" aria-label="News pages">
              <button
                type="button"
                className={`pagination-link${currentPage === 1 ? " pagination-link-disabled" : ""}`}
                onClick={() => jumpToPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                const isCurrent = page === currentPage;
                return (
                  <button
                    type="button"
                    key={`bottom-${page}`}
                    className={`pagination-link${isCurrent ? " pagination-link-current" : ""}`}
                    aria-current={isCurrent ? "page" : undefined}
                    onClick={() => {
                      if (!isCurrent) {
                        jumpToPage(page);
                      }
                    }}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                type="button"
                className={`pagination-link${currentPage === totalPages ? " pagination-link-disabled" : ""}`}
                onClick={() => jumpToPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </nav>
          ) : null}
        </div>
      </section>
    </main>
  );
}
