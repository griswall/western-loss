import { getCliClient } from "sanity/cli";

import legacyPages from "../src/data/legacy-pages.json";

type ManagedSeed = {
  pageKey:
    | "about"
    | "aboutBylaws"
    | "aboutOfficers"
    | "aboutPresentations"
    | "membershipCommittee"
    | "becomeMember"
    | "membersOverview";
  title: string;
  description: string;
  bodyHtml: string;
};

const MANAGED_PAGES: ManagedSeed[] = [
  {
    pageKey: "about",
    title: legacyPages.about?.title || "About",
    description: "History, mission, and focus of the Western Loss Association.",
    bodyHtml: legacyPages.about?.html || "",
  },
  {
    pageKey: "aboutBylaws",
    title: legacyPages.aboutBylaws?.title || "By-Laws",
    description: "Constitution and by-laws of the Western Loss Association.",
    bodyHtml: legacyPages.aboutBylaws?.html || "",
  },
  {
    pageKey: "aboutOfficers",
    title: legacyPages.aboutOfficers?.title || "Officers",
    description: "Current officers, executive committee, and recent past presidents.",
    bodyHtml: legacyPages.aboutOfficers?.html || "",
  },
  {
    pageKey: "aboutPresentations",
    title: legacyPages.aboutPresentations?.title || "Presentations",
    description: "Presentation downloads and educational materials.",
    bodyHtml: legacyPages.aboutPresentations?.html || "",
  },
  {
    pageKey: "membershipCommittee",
    title: legacyPages.membershipCommittee?.title || "Membership Committee",
    description: "Membership and administrative team contacts.",
    bodyHtml: legacyPages.membershipCommittee?.html || "",
  },
  {
    pageKey: "becomeMember",
    title: legacyPages.becomeMember?.title || "Become a Member",
    description: "Membership application forms and resources.",
    bodyHtml: legacyPages.becomeMember?.html || "",
  },
  {
    pageKey: "membersOverview",
    title: legacyPages.membersOverview?.title || "Members",
    description: "Members directory intro content.",
    bodyHtml: legacyPages.membersOverview?.html || "",
  },
];

async function run() {
  console.log("Seeding managed pages...");

  const client = getCliClient({
    apiVersion: "2024-08-01",
    useCdn: false,
  });

  const existing = await client.fetch<Array<{ _id: string; pageKey?: string }>>(
    `*[_type == "managedPage"]{_id, pageKey}`,
  );

  const existingByKey = new Map<string, string>();
  for (const row of existing) {
    const key = row.pageKey?.trim();
    if (key && !existingByKey.has(key)) {
      existingByKey.set(key, row._id);
    }
  }

  const tx = client.transaction();
  let creates = 0;
  let updates = 0;

  for (const page of MANAGED_PAGES) {
    const existingId = existingByKey.get(page.pageKey);
    const data = {
      pageKey: page.pageKey,
      title: page.title,
      description: page.description,
      bodyHtml: page.bodyHtml,
    };

    if (existingId) {
      tx.patch(existingId, { set: data });
      updates += 1;
    } else {
      tx.create({
        _type: "managedPage",
        ...data,
      });
      creates += 1;
    }
  }

  tx.createOrReplace({
    _id: "contactPage",
    _type: "contactPage",
    eyebrow: "Contact",
    heading: "Get in Touch",
    description: "Use the form below to contact the association.",
    formHeading: "Contact Form",
    subject: "Western Loss Association Contact Form",
    submitLabel: "Send Message",
    recipientEmail: "info@westernloss.org",
  });

  await tx.commit();
  console.log(`Managed pages seeded. Updated ${updates}, created ${creates}.`);
  console.log("Contact page seeded as singleton document.");
}

run().catch((error) => {
  console.error("Seeding managed pages failed.");
  console.error(error);
  process.exitCode = 1;
});
