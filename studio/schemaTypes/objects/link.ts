import {RiExternalLinkLine} from 'react-icons/ri'
import {defineField, defineType, StringRule, BooleanRule} from 'sanity'

const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: RiExternalLinkLine,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'url',
      title: 'Url',
      description: 'URL',
      type: 'string',
      validation: (Rule: StringRule) => Rule.required(),
    }),
    defineField({
      name: 'external',
      title: 'External',
      description: 'Is link external?',
      type: 'boolean',
      validation: (Rule: BooleanRule) => Rule.required(),
    }),
  ],
  initialValue: {
    external: false,
  },
  preview: {
    select: {
      title: 'title',
      url: 'url',
    },
    prepare({title, url}: {title?: string; url?: string}) {
      return {
        title: title ?? url,
      }
    },
  },
})

export default link
