import { defineArrayMember, defineField, defineType } from "sanity";

export const newsPostType = defineType({
  name: "newsPost",
  title: "News Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Headline",
      type: "string",
      validation: (rule) => rule.required().min(5),
    }),
    defineField({
      name: "shortTitle",
      title: "Short Card Headline",
      type: "string",
      description: "Optional shorter headline shown on the News card.",
    }),
    defineField({
      name: "publishedAt",
      title: "Publish Date",
      type: "datetime",
      validation: (rule) => rule.required(),
      options: {
        dateFormat: "MMMM D, YYYY",
        timeFormat: "h:mm A",
      },
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "bodyHtml",
      title: "Body HTML",
      type: "text",
      rows: 18,
      description: "Optional HTML body content. Leave empty for summary-only entries.",
    }),
    defineField({
      name: "albums",
      title: "Photo Albums",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "album",
          fields: [
            defineField({
              name: "title",
              title: "Album Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "photos",
              title: "Photos",
              type: "array",
              of: [
                defineArrayMember({
                  type: "image",
                  options: { hotspot: true },
                  fields: [
                    defineField({
                      name: "alt",
                      title: "Photo Alt Text",
                      type: "string",
                    }),
                    defineField({
                      name: "caption",
                      title: "Caption (internal)",
                      type: "string",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "publishedAt",
    },
  },
});
