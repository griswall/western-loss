export type HomeCard = {
  title: string;
  eyebrow: string;
  body: string;
  href: string;
  cta: string;
  icon: "membership" | "events" | "news";
  tone: "blue" | "navy" | "sky";
};

export const homeCards: HomeCard[] = [
  {
    title: "Membership",
    eyebrow: "Become a member",
    body:
      "Eligibility is open to professionals affiliated with the property insurance industry, including staff adjusters, defense attorneys, independent adjusters, appraisers, salvors, contractors, engineers, and related experts.",
    href: "/members",
    cta: "Explore Membership",
    icon: "membership",
    tone: "blue",
  },
  {
    title: "Upcoming Events",
    eyebrow: "Attend our next conference",
    body:
      "October 1-2: Fall Conference at Grand Geneva Resort and Spa. Review event details, registration, and hotel booking information.",
    href: "/about/events",
    cta: "View Events",
    icon: "events",
    tone: "navy",
  },
  {
    title: "WLA News",
    eyebrow: "Latest update",
    body:
      "Read conference recaps, event photos, and association announcements from recent seasons.",
    href: "/about/news",
    cta: "Read News",
    icon: "news",
    tone: "sky",
  },
];
