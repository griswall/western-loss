import { getCliClient } from "sanity/cli";

import members from "../src/data/members-directory.json";

type MemberEntry = {
  company: string;
  contacts: string[];
};

type ExistingMemberCompany = {
  _id: string;
  company?: string;
};

function normalizeCompany(value: string): string {
  return value.trim().toLowerCase();
}

function cleanEntry(entry: MemberEntry): MemberEntry | null {
  const company = entry.company?.trim();
  if (!company) {
    return null;
  }

  const contacts = (entry.contacts ?? [])
    .map((contact) => contact.trim())
    .filter((contact) => Boolean(contact));

  return {
    company,
    contacts,
  };
}

async function run() {
  console.log("Starting member company import...");

  const client = getCliClient({
    apiVersion: "2024-08-01",
    useCdn: false,
  });

  const existing = await client.fetch<ExistingMemberCompany[]>(
    `*[_type == "memberCompany"]{_id, company}`,
  );
  console.log(`Found ${existing.length} existing memberCompany docs in Sanity.`);

  const existingByCompany = new Map<string, string>();
  for (const doc of existing) {
    const company = doc.company?.trim();
    if (!company) {
      continue;
    }

    const key = normalizeCompany(company);
    if (!existingByCompany.has(key)) {
      existingByCompany.set(key, doc._id);
    }
  }

  const uniqueIncoming = new Map<string, MemberEntry>();
  for (const raw of members as MemberEntry[]) {
    const cleaned = cleanEntry(raw);
    if (!cleaned) {
      continue;
    }

    uniqueIncoming.set(normalizeCompany(cleaned.company), cleaned);
  }

  const patches: Array<{ _id: string; company: string; contacts: string[] }> = [];
  const creates: Array<{ _type: "memberCompany"; company: string; contacts: string[] }> = [];

  for (const [companyKey, entry] of uniqueIncoming.entries()) {
    const existingId = existingByCompany.get(companyKey);

    if (existingId) {
      patches.push({
        _id: existingId,
        company: entry.company,
        contacts: entry.contacts,
      });
      continue;
    }

    creates.push({
      _type: "memberCompany",
      company: entry.company,
      contacts: entry.contacts,
    });
  }

  const totalUpdates = patches.length;
  const totalCreates = creates.length;
  const totalMutations = totalUpdates + totalCreates;

  if (totalMutations === 0) {
    console.log("No member companies found to import.");
    return;
  }

  console.log(
    `Prepared ${totalMutations} mutations (${totalUpdates} updates, ${totalCreates} creates).`,
  );

  const chunkSize = 40;
  let committed = 0;

  for (let i = 0; i < patches.length; i += chunkSize) {
    const chunk = patches.slice(i, i + chunkSize);
    const tx = client.transaction();
    for (const item of chunk) {
      tx.patch(item._id, {
        set: {
          company: item.company,
          contacts: item.contacts,
        },
      });
    }
    await tx.commit();
    committed += chunk.length;
    console.log(`Committed ${committed}/${totalMutations}...`);
  }

  for (let i = 0; i < creates.length; i += chunkSize) {
    const chunk = creates.slice(i, i + chunkSize);
    const tx = client.transaction();
    for (const item of chunk) {
      tx.create(item);
    }
    await tx.commit();
    committed += chunk.length;
    console.log(`Committed ${committed}/${totalMutations}...`);
  }

  console.log(`Import complete. Updated ${totalUpdates}, created ${totalCreates}.`);
}

run().catch((error) => {
  console.error("Member company import failed.");
  console.error(error);
  process.exitCode = 1;
});
