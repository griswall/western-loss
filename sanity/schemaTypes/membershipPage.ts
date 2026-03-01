import { defineField, defineType } from "sanity";

export const membershipPageType = defineType({
  name: "membershipPage",
  title: "Membership Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      initialValue: "Membership",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Page Description",
      type: "text",
      rows: 3,
      initialValue: "Membership purpose, eligibility, and officer qualifications.",
    }),
    defineField({
      name: "intro",
      title: "Intro Paragraph",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "purpose",
      title: "Purpose",
      type: "text",
      rows: 6,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "eligibility",
      title: "Eligibility",
      type: "text",
      rows: 6,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "officers",
      title: "Officers",
      type: "text",
      rows: 6,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Membership Page",
    }),
  },
});
