import {RiEraserLine} from 'react-icons/ri'
import {defineField, defineType, defineArrayMember} from 'sanity'

const project = defineType({
  title: 'Project',
  name: 'project',
  icon: RiEraserLine,
  type: 'document',
  preview: {
    select: {
      title: 'name',
      media: 'projectimage',
      published: 'published',
    },
    prepare({title, media, published}) {
      return {
        title: title ?? 'Untitled',
        subtitle: published ? '✅ Visible on site' : '🚫 Hidden from site',
        media,
      }
    },
  },
  fields: [
    defineField({
      title: 'Id',
      name: 'id',
      type: 'number',
    }),
    defineField({
      title: 'Name',
      name: 'name',
      type: 'string',
    }),
    defineField({
      title: 'Description',
      name: 'description',
      type: 'string',
    }),
    defineField({
      title: 'Technologies',
      name: 'subdescription',
      type: 'string',
    }),
    defineField({
      title: 'Project category',
      name: 'projectcategory',
      type: 'reference',
      to: [{type: 'category'}],
    }),
    defineField({
      title: 'Project URL',
      name: 'urlwww',
      type: 'array',
      of: [defineArrayMember({type: 'link'})],
    }),
    defineField({
      title: 'Github URL',
      name: 'urlgithub',
      type: 'array',
      of: [defineArrayMember({type: 'link'})],
    }),
    defineField({
      title: 'Project image',
      name: 'projectimage',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Describe the image for screen readers and SEO',
          validation: (rule) => rule.warning('Alt text is important for accessibility and SEO'),
        }),
      ],
    }),
    defineField({
      title: 'Visible on Site',
      name: 'published',
      type: 'boolean',
      description: 'Set to false to hide this project from the portfolio site',
      initialValue: true,
    }),
    defineField({
      title: 'Featured',
      name: 'featured',
      type: 'boolean',
      description: 'Set to true to feature this project at the top of the page',
    }),
    defineField({
      title: 'Feature Order',
      name: 'featureOrder',
      type: 'number',
      description: 'Order of the featured project (lower numbers appear first)',
      hidden: ({document}) => !document?.featured,
    }),
  ],
})

export default project
