import {Browser} from 'phosphor-react'

const project = {
  title: 'Project',
  name: 'project',
  icon: Browser,
  type: 'document',
  fields: [
    {
      title: 'Id',
      name: 'id',
      type: 'number',
    },
    {
      title: 'Name',
      name: 'name',
      type: 'string',
    },
    {
      title: 'Description',
      name: 'description',
      type: 'string',
    },
    {
      title: 'Technologies',
      name: 'subdescription',
      type: 'string',
    },
    {
      title: 'Project category',
      name: 'projectcategory',
      type: 'reference',
      to: [{type: 'category'}],
    },
    {
      title: 'Project URL',
      name: 'urlwww',
      type: 'array',
      of: [{type: 'link'}],
    },
    {
      title: 'Github URL',
      name: 'urlgithub',
      type: 'array',
      of: [{type: 'link'}],
    },
    {
      title: 'Project image',
      name: 'projectimage',
      type: 'image',
    },
    {
      title: 'Featured',
      name: 'featured',
      type: 'boolean',
      description: 'Set to true to feature this project at the top of the page',
    },
    {
      title: 'Feature Order',
      name: 'featureOrder',
      type: 'number',
      description: 'Order of the featured project (lower numbers appear first)',
      hidden: ({document}) => !document?.featured,
    },
  ],
}

export default project
