import { List } from "phosphor-react";

const navigation = {
  name: "navigation",
  title: "Navigation",
  type: "document",
  icon: List,
  fields: [
    {
      title: "Title",
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required()
    },
    {
      name: "links",
      title: "Navigation Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Title" },
            { name: "name", type: "string", title: "Name" },
            { name: "hash", type: "string", title: "Hash" },
            { name: "href", type: "string", title: "Href" },
            { name: "externalLink", type: "boolean", title: "External Link" }
          ]
        }
      ]
    }
  ]
};

export default navigation;