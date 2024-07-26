import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
//import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'dfweb-v4',
  projectId: '41s7iutf',
  dataset: 'production',
  //plugins: [structureTool(), visionTool()],
  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
})
