import {
  RiNavigationLine,
  RiHome4Line,
  RiProjectorLine,
  RiFileList3Line,
  RiGithubLine,
  RiMailLine,
} from 'react-icons/ri'
import {defineField, defineType, StringRule, BooleanRule} from 'sanity'

const iconMap = {
  RiHome4Line,
  RiProjectorLine,
  RiFileList3Line,
  RiGithubLine,
  RiMailLine,
}

const requiredString = (rule: StringRule) => rule.required()
const requiredBoolean = (rule: BooleanRule) => rule.required()

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: RiNavigationLine,
  fields: [
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: requiredString,
    }),
    defineField({
      name: 'links',
      title: 'Navigation Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              title: 'Title',
              validation: requiredString,
            }),
            defineField({
              name: 'name',
              type: 'string',
              title: 'Name',
              validation: requiredString,
            }),
            defineField({
              name: 'hash',
              type: 'string',
              title: 'Hash',
              validation: requiredString,
            }),
            defineField({
              name: 'href',
              type: 'string',
              title: 'Href',
              validation: requiredString,
            }),
            defineField({
              name: 'externalLink',
              type: 'boolean',
              title: 'External Link',
              validation: requiredBoolean,
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  {title: 'Home', value: 'RiHome4Line'},
                  {title: 'Projects', value: 'RiProjectorLine'},
                  {title: 'CV', value: 'RiFileList3Line'},
                  {title: 'GitHub', value: 'RiGithubLine'},
                  {title: 'Contact', value: 'RiMailLine'},
                ],
              },
            }),
          ],
          preview: {
            select: {
              title: 'title',
              icon: 'icon',
            },
            prepare(selection) {
              const {title, icon} = selection
              return {
                title,
                media:
                  icon && icon in iconMap
                    ? iconMap[icon as keyof typeof iconMap]
                    : RiNavigationLine,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare(selection) {
      const {title} = selection
      return {
        title,
        media: RiNavigationLine,
      }
    },
  },
})
