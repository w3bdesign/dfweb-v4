import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'cv',
  title: 'CV',
  type: 'document',
  fields: [
    defineField({
      name: 'keyQualifications',
      title: 'Key Qualifications',
      type: 'array',
      of: [{type: 'text'}],
    }),
    defineField({
      name: 'experience',
      title: 'Experience',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'period', title: 'Period', type: 'string'}),
            defineField({name: 'company', title: 'Company', type: 'string'}),
            defineField({name: 'role', title: 'Role', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text'}),
          ],
        },
      ],
    }),
    defineField({
      name: 'education',
      title: 'Education',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'period', title: 'Period', type: 'string'}),
            defineField({name: 'institution', title: 'Institution', type: 'string'}),
            defineField({name: 'degree', title: 'Degree', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text'}),
          ],
        },
      ],
    }),
  ],
})
