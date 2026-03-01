import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";

import { schemaTypes } from "./sanity/schemaTypes";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "replace-me";
const dataset =
  process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "default",
  title: "Western Loss CMS",
  projectId,
  dataset,
  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Home Page")
              .child(S.document().schemaType("homePage").documentId("homePage")),
            S.listItem()
              .title("Events Page")
              .child(S.document().schemaType("eventsPage").documentId("eventsPage")),
            S.listItem()
              .title("Membership Page")
              .child(S.document().schemaType("membershipPage").documentId("membershipPage")),
            S.divider(),
            S.documentTypeListItem("newsPost").title("News Posts"),
            S.documentTypeListItem("memberCompany").title("Member Companies"),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
