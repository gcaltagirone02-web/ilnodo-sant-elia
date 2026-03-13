import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export const operationsType = defineType({
  name: "operations",
  title: "Site Settings & Operations",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site Title",
      type: "string",
      group: "seo",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "siteDescription",
      title: "Site Description",
      type: "text",
      group: "seo",
      rows: 3,
    }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp Number",
      type: "string",
      group: "contact",
      description: "Format: +393XXXXXXXXX",
      validation: (Rule) =>
        Rule.required().regex(/^\+[1-9]\d{1,14}$/, {
          name: "international phone number",
          invert: false,
        }),
    }),
    defineField({
      name: "openingHours",
      title: "Opening Hours",
      type: "array",
      group: "operations",
      of: [
        {
          type: "object",
          name: "dailyHours",
          fields: [
            { name: "day", title: "Day", type: "string" },
            { name: "hours", title: "Hours", type: "string", placeholder: "10:00 - 00:00 or Closed" },
          ],
        },
      ],
    }),
    defineField({
      name: "notice",
      title: "Special Notice / Alert",
      type: "object",
      group: "operations",
      fields: [
        { name: "isActive", title: "Show Notice", type: "boolean", initialValue: false },
        { name: "text", title: "Notice Text (IT)", type: "string" },
        { name: "textEn", title: "Notice Text (EN)", type: "string" },
      ],
    }),
  ],
  groups: [
    { name: "seo", title: "SEO" },
    { name: "contact", title: "Contact Info" },
    { name: "operations", title: "Operations" },
  ],
});
