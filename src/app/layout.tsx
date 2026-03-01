import type { Metadata } from "next";

import "./globals.css";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Western Loss Association",
  description:
    "Western Loss Association: property claims education, member networking, events, and industry resources.",
  metadataBase: new URL("https://westernloss.org"),
  icons: {
    icon: [{ url: "/wla-pill.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/wla-pill.svg", type: "image/svg+xml" }],
    apple: [{ url: "/wla-pill.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Western Loss Association",
    description:
      "Property claims education, member networking, events, and industry resources.",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Western Loss Association",
      },
    ],
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
