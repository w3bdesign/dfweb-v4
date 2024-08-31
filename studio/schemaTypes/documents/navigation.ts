import {
  RiNavigationLine,
  RiHome4Line,
  RiProjectorLine,
  RiFileList3Line,
  RiGithubLine,
  RiMailLine,
} from 'react-icons/ri'
import {defineField, defineType, StringRule} from 'sanity'
import {IconType} from 'react-icons'

const iconMap: Record<string, IconType> = {
  RiHome4Line,
  RiProjectorLine,
  RiFileList3Line,
  RiGithubLine,
  RiMailLine,
}

const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: RiNavigationLine,
  fields: [
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: (Rule: StringRule) => Rule.required(),
    }),
    defineField({
      name: 'links',
      title: 'Navigation Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'title', type: 'string', title: 'Title'}),
            defineField({name: 'name', type: 'string', title: 'Name'}),
            defineField({name: 'hash', type: 'string', title: 'Hash'}),
            defineField({name: 'href', type: 'string', title: 'Href'}),
            defineField({name: 'externalLink', type: 'boolean', title: 'External Link'}),
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
            prepare: ({title, icon}: {title?: string; icon?: string}) => ({
              title,
              media: icon ? iconMap[icon] : RiNavigationLine,
            }),
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare(selection: {title: string}) {
      const {title} = selection
      return {
        title: title,
        media: RiNavigationLine,
      }
    },
  },
})

export default navigation
