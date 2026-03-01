import { homeCards, type HomeCard } from "@/data/home";
import type { MemberEntry } from "@/data/members-directory";
import { fetchSanityQuery, hasSanityConfig } from "@/lib/sanity";

export type HomePageContent = {
  eyebrow: string;
  heading: string;
  intro: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  quickAccessEyebrow: string;
  quickAccessHeading: string;
  cards: HomeCard[];
};

export const DEFAULT_HOME_PAGE_CONTENT: HomePageContent = {
  eyebrow: "Since 1871",
  heading: "Western Loss Association",
  intro:
    "Education, collaboration, and professional development for property insurance leaders, adjusters, consultants, engineers, and legal experts.",
  primaryCtaLabel: "View Members Directory",
  primaryCtaHref: "/members-2",
  secondaryCtaLabel: "Upcoming Events",
  secondaryCtaHref: "/about/events",
  quickAccessEyebrow: "Quick Access",
  quickAccessHeading: "Find what you need fast",
  cards: homeCards,
};

export type EventsPageContent = {
  title: string;
  description: string;
  bodyHtml: string;
};

export const DEFAULT_EVENTS_PAGE_CONTENT: EventsPageContent = {
  title: "Events",
  description: "Association event updates.",
  bodyHtml: "<p>No upcoming events, check back soon.</p>",
};

export type MembershipPageContent = {
  title: string;
  description: string;
  html: string;
};

export type ManagedPageKey =
  | "about"
  | "aboutBylaws"
  | "aboutOfficers"
  | "aboutPresentations"
  | "membershipCommittee"
  | "becomeMember"
  | "membersOverview";

export type ManagedPageContent = {
  title: string;
  description: string;
  bodyHtml: string;
};

export type ContactPageContent = {
  eyebrow: string;
  heading: string;
  description: string;
  formHeading: string;
  subject: string;
  submitLabel: string;
  recipientEmail: string;
};

export const DEFAULT_CONTACT_PAGE_CONTENT: ContactPageContent = {
  eyebrow: "Contact",
  heading: "Get in Touch",
  description: "Use the form below to contact the association.",
  formHeading: "Contact Form",
  subject: "Western Loss Association Contact Form",
  submitLabel: "Send Message",
  recipientEmail: "info@westernloss.org",
};

type SanityHomeCard = {
  title?: string;
  eyebrow?: string;
  body?: string;
  href?: string;
  cta?: string;
  icon?: string;
  tone?: string;
};

type SanityHomePage = {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  quickAccessEyebrow?: string;
  quickAccessHeading?: string;
  cards?: SanityHomeCard[];
};

type SanityEventsPage = {
  title?: string;
  description?: string;
  bodyHtml?: string;
};

type SanityMembershipPage = {
  title?: string;
  description?: string;
  intro?: string;
  purpose?: string;
  eligibility?: string;
  officers?: string;
};

type SanityMemberCompany = {
  company?: string;
  contacts?: string[];
};

type SanityManagedPage = {
  title?: string;
  description?: string;
  bodyHtml?: string;
};

type SanityContactPage = {
  eyebrow?: string;
  heading?: string;
  description?: string;
  formHeading?: string;
  subject?: string;
  submitLabel?: string;
  recipientEmail?: string;
};

const HOME_PAGE_QUERY = `
  *[_type == "homePage"]
    | order(_updatedAt desc)[0]{
      eyebrow,
      heading,
      intro,
      primaryCtaLabel,
      primaryCtaHref,
      secondaryCtaLabel,
      secondaryCtaHref,
      quickAccessEyebrow,
      quickAccessHeading,
      cards[]{
        title,
        eyebrow,
        body,
        href,
        cta,
        icon,
        tone
      }
    }
`;

const EVENTS_PAGE_QUERY = `
  *[_type == "eventsPage"]
    | order(_updatedAt desc)[0]{
      title,
      description,
      bodyHtml
    }
`;

const MEMBERSHIP_PAGE_QUERY = `
  *[_type == "membershipPage"]
    | order(_updatedAt desc)[0]{
      title,
      description,
      intro,
      purpose,
      eligibility,
      officers
    }
`;

const MEMBER_COMPANIES_QUERY = `
  *[_type == "memberCompany"]
    | order(company asc){
      company,
      contacts
    }
`;

const MANAGED_PAGE_QUERY = `
  *[_type == "managedPage" && pageKey == $pageKey]
    | order(_updatedAt desc)[0]{
      title,
      description,
      bodyHtml
    }
`;

const CONTACT_PAGE_QUERY = `
  *[_type == "contactPage"]
    | order(_updatedAt desc)[0]{
      eyebrow,
      heading,
      description,
      formHeading,
      subject,
      submitLabel,
      recipientEmail
    }
`;

function isCardIcon(value: string): value is HomeCard["icon"] {
  return value === "membership" || value === "events" || value === "news";
}

function isCardTone(value: string): value is HomeCard["tone"] {
  return value === "blue" || value === "navy" || value === "sky";
}

function normalizeHref(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();

  if (!trimmed) {
    return fallback;
  }

  if (trimmed.startsWith("/") || trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `/${trimmed}`;
}

function mapHomeCards(input: SanityHomeCard[] | undefined): HomeCard[] {
  if (!input?.length) {
    return [];
  }

  return input
    .map((card) => {
      const title = card.title?.trim();
      const eyebrow = card.eyebrow?.trim();
      const body = card.body?.trim();
      const href = card.href?.trim();
      const cta = card.cta?.trim();
      const icon = card.icon?.trim().toLowerCase();
      const tone = card.tone?.trim().toLowerCase();

      if (!title || !eyebrow || !body || !href || !cta || !icon || !tone) {
        return null;
      }

      if (!isCardIcon(icon) || !isCardTone(tone)) {
        return null;
      }

      return {
        title,
        eyebrow,
        body,
        href: normalizeHref(href, "/"),
        cta,
        icon,
        tone,
      } satisfies HomeCard;
    })
    .filter((card): card is HomeCard => Boolean(card));
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatPlainText(value: string): string {
  return escapeHtml(value.trim()).replace(/\r?\n/g, "<br />");
}

function toMembershipHtml(data: SanityMembershipPage): string {
  const intro = data.intro?.trim();
  const purpose = data.purpose?.trim();
  const eligibility = data.eligibility?.trim();
  const officers = data.officers?.trim();
  const blocks: string[] = [];

  if (intro) {
    blocks.push(`<p>${formatPlainText(intro)}</p>`);
  }

  if (purpose) {
    blocks.push(`<div class="membership-row"><h3>Purpose</h3><p>${formatPlainText(purpose)}</p></div>`);
  }

  if (eligibility) {
    blocks.push(
      `<div class="membership-row"><h3>Eligibility</h3><p>${formatPlainText(eligibility)}</p></div>`,
    );
  }

  if (officers) {
    blocks.push(`<div class="membership-row"><h3>Officers</h3><p>${formatPlainText(officers)}</p></div>`);
  }

  return blocks.join("\n");
}

export async function getSanityHomePageContent(): Promise<HomePageContent | null> {
  if (!hasSanityConfig()) {
    return null;
  }

  try {
    const row = await fetchSanityQuery<SanityHomePage | null>(HOME_PAGE_QUERY);
    if (!row) {
      return null;
    }

    const cards = mapHomeCards(row.cards);

    return {
      eyebrow: row.eyebrow?.trim() || DEFAULT_HOME_PAGE_CONTENT.eyebrow,
      heading: row.heading?.trim() || DEFAULT_HOME_PAGE_CONTENT.heading,
      intro: row.intro?.trim() || DEFAULT_HOME_PAGE_CONTENT.intro,
      primaryCtaLabel: row.primaryCtaLabel?.trim() || DEFAULT_HOME_PAGE_CONTENT.primaryCtaLabel,
      primaryCtaHref: normalizeHref(row.primaryCtaHref, DEFAULT_HOME_PAGE_CONTENT.primaryCtaHref),
      secondaryCtaLabel: row.secondaryCtaLabel?.trim() || DEFAULT_HOME_PAGE_CONTENT.secondaryCtaLabel,
      secondaryCtaHref: normalizeHref(row.secondaryCtaHref, DEFAULT_HOME_PAGE_CONTENT.secondaryCtaHref),
      quickAccessEyebrow: row.quickAccessEyebrow?.trim() || DEFAULT_HOME_PAGE_CONTENT.quickAccessEyebrow,
      quickAccessHeading: row.quickAccessHeading?.trim() || DEFAULT_HOME_PAGE_CONTENT.quickAccessHeading,
      cards: cards.length ? cards : DEFAULT_HOME_PAGE_CONTENT.cards,
    };
  } catch (error) {
    console.error("Sanity home page fetch failed, using local defaults.", error);
    return null;
  }
}

export async function getSanityEventsPageContent(): Promise<EventsPageContent | null> {
  if (!hasSanityConfig()) {
    return null;
  }

  try {
    const row = await fetchSanityQuery<SanityEventsPage | null>(EVENTS_PAGE_QUERY);
    if (!row) {
      return null;
    }

    return {
      title: row.title?.trim() || DEFAULT_EVENTS_PAGE_CONTENT.title,
      description: row.description?.trim() || DEFAULT_EVENTS_PAGE_CONTENT.description,
      bodyHtml: row.bodyHtml?.trim() || DEFAULT_EVENTS_PAGE_CONTENT.bodyHtml,
    };
  } catch (error) {
    console.error("Sanity events page fetch failed, using local defaults.", error);
    return null;
  }
}

export async function getSanityMembershipPageContent(): Promise<MembershipPageContent | null> {
  if (!hasSanityConfig()) {
    return null;
  }

  try {
    const row = await fetchSanityQuery<SanityMembershipPage | null>(MEMBERSHIP_PAGE_QUERY);
    if (!row) {
      return null;
    }

    const html = toMembershipHtml(row);
    if (!html) {
      return null;
    }

    return {
      title: row.title?.trim() || "Membership",
      description: row.description?.trim() || "Membership purpose, eligibility, and officer qualifications.",
      html,
    };
  } catch (error) {
    console.error("Sanity membership page fetch failed, using local defaults.", error);
    return null;
  }
}

export async function getSanityMemberCompanies(): Promise<MemberEntry[]> {
  if (!hasSanityConfig()) {
    return [];
  }

  try {
    const rows = await fetchSanityQuery<SanityMemberCompany[]>(MEMBER_COMPANIES_QUERY);

    return rows
      .map((row) => {
        const company = row.company?.trim();
        if (!company) {
          return null;
        }

        const contacts = (row.contacts ?? [])
          .map((contact) => contact.trim())
          .filter((contact) => Boolean(contact));

        return {
          company,
          contacts,
        } satisfies MemberEntry;
      })
      .filter((entry): entry is MemberEntry => Boolean(entry));
  } catch (error) {
    console.error("Sanity member companies fetch failed, using local defaults.", error);
    return [];
  }
}

export async function getSanityManagedPageContent(pageKey: ManagedPageKey): Promise<ManagedPageContent | null> {
  if (!hasSanityConfig()) {
    return null;
  }

  try {
    const row = await fetchSanityQuery<SanityManagedPage | null>(MANAGED_PAGE_QUERY, { pageKey });
    if (!row) {
      return null;
    }

    const title = row.title?.trim();
    const bodyHtml = row.bodyHtml?.trim();

    if (!title || !bodyHtml) {
      return null;
    }

    return {
      title,
      description: row.description?.trim() || "",
      bodyHtml,
    };
  } catch (error) {
    console.error(`Sanity managed page fetch failed for "${pageKey}", using local defaults.`, error);
    return null;
  }
}

export async function getSanityContactPageContent(): Promise<ContactPageContent | null> {
  if (!hasSanityConfig()) {
    return null;
  }

  try {
    const row = await fetchSanityQuery<SanityContactPage | null>(CONTACT_PAGE_QUERY);
    if (!row) {
      return null;
    }

    return {
      eyebrow: row.eyebrow?.trim() || DEFAULT_CONTACT_PAGE_CONTENT.eyebrow,
      heading: row.heading?.trim() || DEFAULT_CONTACT_PAGE_CONTENT.heading,
      description: row.description?.trim() || DEFAULT_CONTACT_PAGE_CONTENT.description,
      formHeading: row.formHeading?.trim() || DEFAULT_CONTACT_PAGE_CONTENT.formHeading,
      subject: row.subject?.trim() || DEFAULT_CONTACT_PAGE_CONTENT.subject,
      submitLabel: row.submitLabel?.trim() || DEFAULT_CONTACT_PAGE_CONTENT.submitLabel,
      recipientEmail: row.recipientEmail?.trim() || DEFAULT_CONTACT_PAGE_CONTENT.recipientEmail,
    };
  } catch (error) {
    console.error("Sanity contact page fetch failed, using local defaults.", error);
    return null;
  }
}
