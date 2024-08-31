import { List } from "@phosphor-icons/react";
import { defineField, defineType, StringRule } from 'sanity'

const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  icon: List,
  fields: [
    defineField({
      title: "Title",
      name: "title",
      type: "string",
      validation: (Rule: StringRule) => Rule.required()
    }),
    defineField({
      name: "links",
      title: "Navigation Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", title: "Title" }),
            defineField({ name: "name", type: "string", title: "Name" }),
            defineField({ name: "hash", type: "string", title: "Hash" }),
            defineField({ name: "href", type: "string", title: "Href" }),
            defineField({ name: "externalLink", type: "boolean", title: "External Link" })
          ]
        }
      ]
    })
  ]
});

export default navigation;