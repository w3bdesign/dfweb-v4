interface PreviewSelection {
  keyQualifications?: string[]
}

export default {
  name: 'cv',
  title: 'CV',
  type: 'document',
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
    {
      name: 'keyQualifications',
      title: 'Key Qualifications',
      type: 'array',
      of: [{type: 'text'}],
    },
    {
      name: 'experience',
      title: 'Experience',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'period', title: 'Period', type: 'string'},
            {
              name: 'company',
              title: 'Company/Project',
              type: 'string',
              description: 'Company name or personal project/community name',
            },
            {
              name: 'role',
              title: 'Role',
              type: 'string',
              description: 'Job title or role in the project/community',
            },
            {name: 'description', title: 'Description', type: 'text'},
          ],
        },
      ],
    },
    {
      name: 'education',
      title: 'Education',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'period', title: 'Period', type: 'string'},
            {name: 'institution', title: 'Institution', type: 'string'},
            {name: 'degree', title: 'Degree', type: 'string'},
            {name: 'description', title: 'Description', type: 'text'},
          ],
        },
      ],
    },
    {
      name: 'volunteerWork',
      title: 'Volunteer work',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'period', title: 'Period', type: 'string'},
            {
              name: 'organization',
              title: 'Organization',
              type: 'string',
              description: 'Name of the community or organization',
            },
            {
              name: 'role',
              title: 'Role',
              type: 'string',
              description: 'Your role in the community',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              description: 'Describe your contributions and impact',
            },
          ],
        },
      ],
    },
  ],
}
