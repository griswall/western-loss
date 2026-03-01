import members from "./members-directory.json";

export type MemberEntry = {
  company: string;
  contacts: string[];
};

export const memberEntries = members as MemberEntry[];
