# Caching Strategy

This document explains the multi-layered caching strategy implemented for the Prosjekter page and how to maintain it.

## Overview

The application uses a comprehensive caching strategy combining:
1. **Static Generation with ISR** - Pre-rendered pages served instantly
2. **Next.js Data Cache** - Cross-request data caching with `unstable_cache`
3. **CDN Caching** - HTTP cache headers for edge caching
4. **On-demand Revalidation** - Webhook-triggered cache invalidation

## Cache Layers

### 1. Page-Level Static Generation (ISR)

**File:** [`src/app/prosjekter/page.tsx`](../src/app/prosjekter/page.tsx)

```tsx
export const revalidate = 86400; // 24 hours
export const dynamic = 'force-static'; // Force static generation
```

**Behavior:**
- Page pre-rendered at build time
- Served instantly from static HTML
- Automatically regenerates in background every 24 hours
- Zero cold start delay

### 2. Data Fetching Cache

**File:** [`src/app/prosjekter/actions.ts`](../src/app/prosjekter/actions.ts)

```typescript
export const getProjects = unstable_cache(
  async (): Promise<Project[]> => {
    // fetch logic
  },
  ['projects-list'], // Cache key
  {
    revalidate: 86400, // 24 hours
    tags: ['projects'], // For on-demand revalidation
  }
);
```

**Behavior:**
- Caches data across requests (not just per-request like React's `cache()`)
- Tagged with `'projects'` for on-demand invalidation
- Revalidates every 24 hours

### 3. Sanity Client Caching

**File:** [`src/lib/sanity/client.ts`](../src/lib/sanity/client.ts)

```typescript
export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 86400, // 24 hours default
  tags = [],
}: {...}): Promise<T> {
  return client.fetch<T>(query, params, {
    cache: 'force-cache', // Required for Next.js 15+
    next: {
      revalidate: tags.length ? false : revalidate,
      tags,
    },
  });
}
```

**Behavior:**
- Explicitly enables fetch caching (required in Next.js 15+)
- Default 24-hour revalidation
- Supports tag-based invalidation

### 4. CDN/Browser Caching

**File:** [`next.config.ts`](../next.config.ts)

```typescript
{
  source: "/prosjekter",
  headers: [
    {
      key: "Cache-Control",
      value: "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  ],
}
```

**Behavior:**
- `s-maxage=86400`: CDN caches for 24 hours
- `stale-while-revalidate=604800`: Serve stale content for up to 7 days while revalidating in background
- `public`: Cacheable by browsers and CDN

## On-Demand Revalidation

For immediate cache invalidation when content changes in Sanity:

### Setup

1. **Add environment variable:**
   ```env
   REVALIDATE_SECRET=your_random_secret_here
   ```
   Generate a secure random string (use a password manager or `openssl rand -base64 32`)

2. **Configure Sanity webhook:**
   - Go to Sanity Studio → Settings → Webhooks
   - Create new webhook:
     - **URL:** `https://your-domain.com/api/revalidate?secret=YOUR_SECRET&tag=projects&immediate=true`
     - **Dataset:** production
     - **Trigger on:** Create, Update, Delete
     - **Filter:** `_type == "project"`
     - **HTTP method:** POST

### Revalidation API

**File:** [`src/app/api/revalidate/route.ts`](../src/app/api/revalidate/route.ts)

**Parameters:**
- `secret` (required): Must match `REVALIDATE_SECRET` env var
- `tag` (required): Cache tag to invalidate (e.g., `'projects'`)
- `immediate` (optional): If `'true'`, expires immediately. Otherwise uses stale-while-revalidate

**Examples:**

Stale-while-revalidate (recommended):
```bash
POST /api/revalidate?secret=YOUR_SECRET&tag=projects
```

Immediate expiration (for webhooks requiring instant updates):
```bash
POST /api/revalidate?secret=YOUR_SECRET&tag=projects&immediate=true
```

**Response:**
```json
{
  "revalidated": true,
  "tag": "projects",
  "mode": "immediate",
  "now": 1718852400000
}
```

## Performance Characteristics

### Before Optimization
- **First load:** 2-3 seconds (dynamic rendering on each request)
- **Subsequent loads:** 2-3 seconds (no caching)
- **User experience:** Slow, spinner visible

### After Optimization
- **First load (after build):** ~50-100ms (static HTML)
- **Subsequent loads:** <50ms (CDN/browser cache)
- **Data staleness:** Max 24 hours (or immediate via webhook)
- **User experience:** Instant, no loading state

## Cache Invalidation Timeline

### Automatic (Time-based)
1. **24 hours:** Background regeneration triggered
2. **Fresh data fetched** from Sanity
3. **New page pre-rendered**
4. **Subsequent requests** serve updated content

### Manual (Webhook-triggered)
1. **Content updated** in Sanity
2. **Webhook fires** to `/api/revalidate`
3. **Cache invalidated** immediately or marked stale
4. **Next request** triggers regeneration

## Cache Tags

Current cache tags in use:
- `'projects'` - All project data (used in `getProjects`)

To add new cache tags:
1. Add tag to `unstable_cache` options in action/function
2. Update webhook filter to match content type
3. Document tag in this file

## Monitoring

### Check if page is cached
```bash
curl -I https://your-domain.com/prosjekter
```

Look for:
- `Cache-Control` header with `s-maxage=86400`
- `X-Vercel-Cache` header (if on Vercel):
  - `HIT` = served from cache
  - `MISS` = cache miss, regenerated
  - `STALE` = served stale while revalidating

### Verify revalidation
```bash
curl -X POST "https://your-domain.com/api/revalidate?secret=YOUR_SECRET&tag=projects&immediate=true"
```

Expected response:
```json
{"revalidated":true,"tag":"projects","mode":"immediate","now":1718852400000}
```

## Troubleshooting

### Page still slow after deployment
1. **Check build logs** - ensure page was pre-rendered
2. **Verify revalidate exports** in page.tsx
3. **Check CDN cache** headers in network tab
4. **Rebuild** to regenerate static pages

### Webhook not invalidating cache
1. **Verify secret** matches `REVALIDATE_SECRET`
2. **Check webhook logs** in Sanity Studio
3. **Test manually** with curl
4. **Check server logs** for errors

### Stale data showing
1. **Check last revalidation time** (24 hours since last build/update)
2. **Trigger manual revalidation** via API
3. **Verify cache tags** match between action and webhook

## Best Practices

1. **Use stale-while-revalidate** for most cases (better UX)
2. **Only use immediate expiration** for critical updates requiring instant visibility
3. **Set revalidation time** based on content update frequency:
   - Rarely changes: 24+ hours
   - Daily updates: 1-6 hours
   - Frequent updates: Use webhooks instead
4. **Monitor cache hit rates** to optimize revalidation times
5. **Test webhooks** in development before production deployment

## Related Files

- [`src/app/prosjekter/page.tsx`](../src/app/prosjekter/page.tsx) - Page with ISR config
- [`src/app/prosjekter/actions.ts`](../src/app/prosjekter/actions.ts) - Data fetching with `unstable_cache`
- [`src/lib/sanity/client.ts`](../src/lib/sanity/client.ts) - Sanity fetch wrapper
- [`next.config.ts`](../next.config.ts) - HTTP cache headers
- [`src/app/api/revalidate/route.ts`](../src/app/api/revalidate/route.ts) - Webhook endpoint
- [`.env.example`](../.env.example) - Environment variables template
