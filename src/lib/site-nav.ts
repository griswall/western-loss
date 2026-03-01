export type NavItem = {
  label: string;
  href: string;
};

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "News", href: "/news" },
  { label: "Members", href: "/members-2" },
  { label: "Membership", href: "/members" },
  { label: "Contact", href: "/contact" },
];

export const aboutNav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "By-Laws", href: "/about/bi-laws" },
  { label: "News", href: "/about/news" },
  { label: "Officers", href: "/about/officers" },
  { label: "Events", href: "/about/events" },
  { label: "Presentations", href: "/about/presentations" },
];

export const membershipNav: NavItem[] = [
  { label: "Membership", href: "/members" },
  { label: "Membership Committee", href: "/members/membership-committee" },
  { label: "Become a Member", href: "/members/become-a-member" },
  { label: "Members Directory", href: "/members-2" },
];
