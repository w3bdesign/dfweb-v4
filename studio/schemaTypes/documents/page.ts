import {RiPagesLine} from 'react-icons/ri'
import {defineField, defineType, SchemaTypeDefinition} from 'sanity'

const page: SchemaTypeDefinition = defineType({
  title: 'Page',
  name: 'page',
  icon: RiPagesLine,
  type: 'document',
  fields: [
    defineField({
      title: 'Name',
      name: 'title',
      type: 'string',
    }),
    defineField({
      title: 'Header',
      name: 'header',
      type: 'string',
    }),
    defineField({
      title: 'Hero content',
      description: 'Only supported in Hjem/Index page',
      name: 'hero',
      type: 'array',
      of: [{type: 'herocontent'}],
      hidden: ({document}) => document?.title !== 'Hjem',
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      title: 'Main content',
      description: 'Only supported in Hjem/Index page',
      name: 'content',
      type: 'array',
      of: [{type: 'pagecontent'}],
      hidden: ({document}) => document?.title !== 'Hjem',
    }),
  ],
})

export default page
