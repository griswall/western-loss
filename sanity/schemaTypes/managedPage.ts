import { defineField, defineType } from "sanity";

const PAGE_OPTIONS = [
  { title: "About", value: "about" },
  { title: "By-Laws", value: "aboutBylaws" },
  { title: "Officers", value: "aboutOfficers" },
  { title: "Presentations", value: "aboutPresentations" },
  { title: "Membership Committee", value: "membershipCommittee" },
  { title: "Become a Member", value: "becomeMember" },
  { title: "Members Directory Intro", value: "membersOverview" },
];

export const managedPageType = defineType({
  name: "managedPage",
  title: "Managed Page",
  type: "document",
  fields: [
    defineField({
      name: "pageKey",
      title: "Page",
      type: "string",
      options: {
        list: PAGE_OPTIONS,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Page Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "bodyHtml",
      title: "Body HTML",
      type: "text",
      rows: 24,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      pageKey: "pageKey",
    },
    prepare(selection) {
      return {
        title: selection.title || "Managed Page",
        subtitle: selection.pageKey || "No page key",
      };
    },
  },
});
