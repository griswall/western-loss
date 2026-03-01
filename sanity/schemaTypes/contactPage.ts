import { defineField, defineType } from "sanity";

export const contactPageType = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      initialValue: "Contact",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Get in Touch",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      initialValue: "Use the form below to contact the association.",
    }),
    defineField({
      name: "formHeading",
      title: "Form Heading",
      type: "string",
      initialValue: "Contact Form",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subject",
      title: "Email Subject",
      type: "string",
      initialValue: "Western Loss Association Contact Form",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "submitLabel",
      title: "Submit Button Label",
      type: "string",
      initialValue: "Send Message",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "recipientEmail",
      title: "Recipient Email",
      type: "string",
      initialValue: "info@westernloss.org",
      validation: (rule) => rule.required().email(),
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Contact Page",
    }),
  },
});
