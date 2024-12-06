import { createClient, QueryParams } from '@sanity/client'
import type { AllSanitySchemaTypes } from '../../types/sanity.types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "41s7iutf";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-05-03";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: {
    enabled: process.env.NODE_ENV === 'development',
    studioUrl: '/studio',
  },
})

// Type-safe fetch method
export async function sanityFetch<Query extends AllSanitySchemaTypes>(
  query: string,
  params?: QueryParams,
  options?: { cache?: RequestCache }
): Promise<Query> {
  return client.fetch<Query>(query, params, {
    ...options,
    cache: options?.cache ?? 'force-cache',
  })
}
