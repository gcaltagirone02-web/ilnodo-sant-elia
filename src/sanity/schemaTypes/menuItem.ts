import { defineField, defineType } from "sanity";
import { LemonIcon } from "@sanity/icons";

export const menuItemType = defineType({
  name: "menuItem",
  title: "Menu Item",
  type: "document",
  icon: LemonIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name (IT)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "nameEn",
      title: "Name (EN)",
      type: "string",
    }),
    defineField({
      name: "nameFr",
      title: "Name (FR)",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
      description: "Format: € 8.00",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description (IT)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "descriptionEn",
      title: "Description (EN)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "descriptionFr",
      title: "Description (FR)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "ingredients",
      title: "Ingredients (IT)",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "ingredientsEn",
      title: "Ingredients (EN)",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "ingredientsFr",
      title: "Ingredients (FR)",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "isHighlight",
      title: "Highlight Item",
      type: "boolean",
      initialValue: false,
      description: "Mark this item as signature or recommended",
    }),
    defineField({
      name: "orderRank",
      title: "Order Rank",
      type: "number",
      description: "Controls the display order within categories (lower numbers first)",
      initialValue: 10,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category.title",
      isHighlight: "isHighlight",
    },
    prepare(selection) {
      const { title, subtitle, isHighlight } = selection;
      return {
        title: `${isHighlight ? "⭐ " : ""}${title}`,
        subtitle: subtitle,
      };
    },
  },
});
