<<<<<<< Updated upstream
// @ts-ignore
import {Browsers} from 'phosphor-react'
=======
import { RiBrowsersLine } from "react-icons/ri";
>>>>>>> Stashed changes

const page = {
  // This is the display name for the type
  title: 'Page',

  // The identifier for this document type used in the api's
  name: 'page',

  icon: RiBrowsersLine,

  // Documents have the type 'document'. Your schema may describe types beyond documents
  // but let's get back to that later.
  type: 'document',

  // Now we proceed to list the fields of our document
  fields: [
    {
      title: 'Name',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Header',
      name: 'header',
      type: 'string',
    },
    {
      title: 'Hero content',
      description: 'Only supported in Hjem/Index page',
      name: 'hero',
      type: 'array',
      of: [{type: 'herocontent'}],
      hidden: ({document}: any) => document?.title !== 'Hjem',
      validation: (Rule: any) => Rule.max(3),
    },
    {
      title: 'Main content',
      description: 'Only supported in Hjem/Index page',
      name: 'content',
      type: 'array',
      of: [{type: 'pagecontent'}],
      hidden: ({document}: any) => document?.title !== 'Hjem',
    },
  ],
}

export default page
