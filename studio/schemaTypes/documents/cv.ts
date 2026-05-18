import {defineType, defineField, defineArrayMember} from 'sanity'
import {RiFileList3Line} from 'react-icons/ri'

interface PreviewSelection {
  keyQualifications?: string[]
}

export default defineType({
  name: 'cv',
  title: 'CV',
  type: 'document',
  icon: RiFileList3Line,
  preview: {
    select: {
      keyQualifications: 'keyQualifications',
    },
    prepare(selection: PreviewSelection) {
      const {keyQualifications} = selection
      const mainQualification = keyQualifications?.[0] || 'No qualifications added'

      return {
        title: 'CV',
        subtitle: mainQualification,
      }
    },
  },
  fields: [
    defineField({
      name: 'keyQualifications',
      title: 'Key Qualifications',
      type: 'array',
      of: [defineArrayMember({type: 'text'})],
    }),
    defineField({
      name: 'experience',
      title: 'Experience',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'period', title: 'Period', type: 'string'}),
            defineField({
              name: 'company',
              title: 'Company/Project',
              type: 'string',
              description: 'Company name or personal project/community name',
            }),
            defineField({
              name: 'role',
              title: 'Role',
              type: 'string',
              description: 'Job title or role in the project/community',
            }),
            defineField({name: 'description', title: 'Description', type: 'text'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'education',
      title: 'Education',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'period', title: 'Period', type: 'string'}),
            defineField({name: 'institution', title: 'Institution', type: 'string'}),
            defineField({name: 'degree', title: 'Degree', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'volunteerWork',
      title: 'Volunteer work',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'period', title: 'Period', type: 'string'}),
            defineField({
              name: 'organization',
              title: 'Organization',
              type: 'string',
              description: 'Name of the community or organization',
            }),
            defineField({
              name: 'role',
              title: 'Role',
              type: 'string',
              description: 'Your role in the community',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              description: 'Describe your contributions and impact',
            }),
          ],
        }),
      ],
    }),
  ],
})
