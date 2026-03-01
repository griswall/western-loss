import { defineField, defineType } from "sanity";

export const eventsPageType = defineType({
  name: "eventsPage",
  title: "Events Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      initialValue: "Events",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Page Description",
      type: "text",
      rows: 3,
      initialValue: "Association event updates.",
    }),
    defineField({
      name: "bodyHtml",
      title: "Body HTML",
      type: "text",
      rows: 20,
      description:
        "Use simple HTML such as paragraphs, links, lists, and headings. Example: <p>No upcoming events, check back soon.</p>",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Events Page",
    }),
  },
});
