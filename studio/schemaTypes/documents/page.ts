import { Browsers } from "phosphor-react";
import { defineField, defineType } from 'sanity'

const page = defineType({
  // This is the display name for the type
  title: "Page",

  // The identifier for this document type used in the api's
  name: "page",

  icon: Browsers,

  // Documents have the type 'document'. Your schema may describe types beyond documents
  // but let's get back to that later.
  type: "document",

  // Now we proceed to list the fields of our document
  fields: [
    defineField({
      title: "Name",
      name: "title",
      type: "string"
    }),
    defineField({
      title: "Header",
      name: "header",
      type: "string"
    }),
    defineField({
      title: "Hero content",
      description: "Only supported in Hjem/Index page",
      name: "hero",
      type: "array",
      of: [{ type: "herocontent" }],
      hidden: ({ document }) => document?.title !== "Hjem",
      validation: (Rule) => Rule.max(3)
    }),
    defineField({
      title: "Main content",
      description: "Only supported in Hjem/Index page",
      name: "content",
      type: "array",
      of: [{ type: "pagecontent" }],
      hidden: ({ document }) => document?.title !== "Hjem"
    })
  ]
});

export default page;
