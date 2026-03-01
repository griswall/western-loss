import { defineArrayMember, defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Hero Eyebrow",
      type: "string",
      initialValue: "Since 1871",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heading",
      title: "Hero Heading",
      type: "string",
      initialValue: "Western Loss Association",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Hero Intro",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "primaryCtaLabel",
      title: "Primary Button Label",
      type: "string",
      initialValue: "View Members Directory",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "primaryCtaHref",
      title: "Primary Button Link",
      type: "string",
      description: "Internal path, for example /members-2",
      initialValue: "/members-2",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "secondaryCtaLabel",
      title: "Secondary Button Label",
      type: "string",
      initialValue: "Upcoming Events",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "secondaryCtaHref",
      title: "Secondary Button Link",
      type: "string",
      description: "Internal path, for example /about/events",
      initialValue: "/about/events",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "quickAccessEyebrow",
      title: "Quick Access Eyebrow",
      type: "string",
      initialValue: "Quick Access",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "quickAccessHeading",
      title: "Quick Access Heading",
      type: "string",
      initialValue: "Find what you need fast",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cards",
      title: "Homepage Cards",
      type: "array",
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: "object",
          name: "homeCard",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "eyebrow",
              title: "Eyebrow",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "text",
              rows: 4,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              title: "Link",
              type: "string",
              description: "Internal path, for example /members",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "cta",
              title: "Link Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Membership", value: "membership" },
                  { title: "Events", value: "events" },
                  { title: "News", value: "news" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "tone",
              title: "Card Tone",
              type: "string",
              options: {
                list: [
                  { title: "Blue", value: "blue" },
                  { title: "Navy", value: "navy" },
                  { title: "Sky", value: "sky" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "cta",
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Home Page",
    }),
  },
});
