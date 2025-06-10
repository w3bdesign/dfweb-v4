import {defineField, defineType} from 'sanity'
import {FiSettings} from 'react-icons/fi'

export default defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  icon: FiSettings,
  liveEdit: true,
  fields: [
    defineField({
      name: 'footerCopyrightText',
      title: 'Footer Copyright Text',
      type: 'string',
      description:
        'The copyright text displayed in the site footer (e.g., "Copyright Daniel Fjeldstad"). The year is added automatically.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
      }
    },
  },
})
