import { RiBrowserLine } from 'react-icons/ri'
import { defineField, defineType } from 'sanity'

const project = defineType({
  title: 'Project',
  name: 'project',
  icon: RiBrowserLine,
  type: 'document',
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
      of: [{type: 'link'}],
    }),
    defineField({
      title: 'Github URL',
      name: 'urlgithub',
      type: 'array',
      of: [{type: 'link'}],
    }),
    defineField({
      title: 'Project image',
      name: 'projectimage',
      type: 'image',
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
