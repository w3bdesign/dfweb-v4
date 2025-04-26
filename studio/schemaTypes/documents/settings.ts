import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'

export default defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  // This is a singleton, meaning there should only be one
  liveEdit: true,
  fields: [
    defineField({
      name: 'footerCopyrightText',
      title: 'Footer Copyright Text',
      type: 'string',
      description: 'The copyright text displayed in the site footer (e.g., "Copyright Daniel Fjeldstad"). The year is added automatically.',
      validation: (Rule) => Rule.required(),
    }),
    // Room for additional site-wide settings
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings'
      }
    }
  }
})
