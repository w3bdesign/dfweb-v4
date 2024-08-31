import { RiArticleLine } from "react-icons/ri";
import { defineField, defineType } from 'sanity'

const herocontent = defineType({
  // This is the display name for the type
  title: "Hero content",

  // The identifier for this document type used in the api's
  name: "herocontent",

  icon: RiArticleLine,

  // Documents have the type 'document'. Your schema may describe types beyond documents
  // but let's get back to that later.
  type: "object",

  // Now we proceed to list the fields of our document
  fields: [
    defineField({
      title: "Text",
      name: "text",
      type: "string"
    })
  ]
});

export default herocontent;
