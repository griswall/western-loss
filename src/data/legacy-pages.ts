import pages from "./legacy-pages.json";

export type LegacyPage = {
  title: string;
  html: string;
};

export type LegacyPages = {
  about: LegacyPage;
  aboutBylaws: LegacyPage;
  aboutNews: LegacyPage;
  aboutOfficers: LegacyPage;
  aboutEvents: LegacyPage;
  aboutPresentations: LegacyPage;
  membersOverview: LegacyPage;
  membership: LegacyPage;
  membershipCommittee: LegacyPage;
  becomeMember: LegacyPage;
  jobs: LegacyPage;
};

export const legacyPages = pages as LegacyPages;
