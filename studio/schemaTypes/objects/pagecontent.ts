import {RiArticleLine} from 'react-icons/ri'
import {defineType, defineField, defineArrayMember} from 'sanity'

const pagecontent = defineType({
  title: 'Page content',
  name: 'pagecontent',
  icon: RiArticleLine,
  type: 'object',
  fields: [
    defineField({
      title: 'Id',
      name: 'id',
      type: 'number',
    }),
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
    }),
    defineField({
      title: 'Text',
      name: 'text',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
  ],
})

export default pagecontent
