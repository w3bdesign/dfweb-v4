import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'dfweb-v4',
  projectId: '41s7iutf',
  dataset: 'production',  
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
})
