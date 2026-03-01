import type { Metadata } from "next";

import "./globals.css";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() || "";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || (basePath ? "https://griswall.github.io" : "https://westernloss.org");

function withBasePath(pathname: string): string {
  if (!basePath) {
    return pathname;
  }

  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${basePath}${normalizedPath}`;
}

export const metadata: Metadata = {
  title: "Western Loss Association",
  description:
    "Western Loss Association: property claims education, member networking, events, and industry resources.",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [{ url: withBasePath("/wla-pill.svg"), type: "image/svg+xml" }],
    shortcut: [{ url: withBasePath("/wla-pill.svg"), type: "image/svg+xml" }],
    apple: [{ url: withBasePath("/wla-pill.svg"), type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Western Loss Association",
    description:
      "Property claims education, member networking, events, and industry resources.",
    type: "website",
    images: [
      {
        url: withBasePath("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: "Western Loss Association",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Western Loss Association",
    description:
      "Property claims education, member networking, events, and industry resources.",
    images: [withBasePath("/opengraph-image")],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="site-bg">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
