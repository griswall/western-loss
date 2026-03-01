import { defineArrayMember, defineField, defineType } from "sanity";

export const memberCompanyType = defineType({
  name: "memberCompany",
  title: "Member Company",
  type: "document",
  fields: [
    defineField({
      name: "company",
      title: "Company Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contacts",
      title: "Contacts",
      type: "array",
      of: [
        defineArrayMember({
          type: "string",
        }),
      ],
      description: "One contact per line, e.g. 'Jane Doe - 555.555.1212'.",
    }),
  ],
  preview: {
    select: {
      title: "company",
      contacts: "contacts",
    },
    prepare(selection) {
      const contacts = Array.isArray(selection.contacts) ? selection.contacts : [];
      return {
        title: selection.title || "Member Company",
        subtitle: contacts.length ? `${contacts.length} contact(s)` : "No contacts",
      };
    },
  },
});
