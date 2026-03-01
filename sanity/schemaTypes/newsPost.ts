import { defineArrayMember, defineField, defineType } from "sanity";

export const newsPostType = defineType({
  name: "newsPost",
  title: "News Post",
  type: "document",
  fields: [
    defineField({
      name: "legacyId",
      title: "Legacy ID",
      type: "string",
      hidden: true,
      readOnly: true,
    }),
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
                  type: "object",
                  name: "albumPhoto",
                  fields: [
                    defineField({
                      name: "image",
                      title: "Uploaded Image",
                      type: "image",
                      options: { hotspot: true },
                    }),
                    defineField({
                      name: "externalUrl",
                      title: "External Image URL",
                      type: "string",
                      description: "Use for legacy/imported photos if you do not upload an image.",
                    }),
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
                  validation: (rule) =>
                    rule.custom((value) => {
                      if (!value || typeof value !== "object") {
                        return "Add an uploaded image or external image URL.";
                      }

                      const hasImage = Boolean((value as { image?: unknown }).image);
                      const hasExternalUrl = Boolean(
                        (value as { externalUrl?: string }).externalUrl?.trim(),
                      );

                      return hasImage || hasExternalUrl
                        ? true
                        : "Add an uploaded image or external image URL.";
                    }),
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
