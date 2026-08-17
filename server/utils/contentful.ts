import { createClient, type ContentfulClientApi, type Entry, type Asset } from 'contentful'

let client: ContentfulClientApi<undefined> | null = null

export function useContentful() {
  if (!client) {
    const config = useRuntimeConfig()
    client = createClient({
      space: config.contentfulSpace,
      accessToken: config.contentfulAccessToken,
      environment: config.contentfulEnvironment || 'master',
    })
  }

  return client
}

export function useContentfulPreview() {
  const config = useRuntimeConfig()
  return createClient({
    space: config.contentfulSpace,
    accessToken: config.contentfulPreviewAccessToken,
    environment: config.contentfulEnvironment || 'master',
    host: 'preview.contentful.com',
  })
}

export function getImageUrl(asset: Asset): string {
  return asset?.fields?.file?.url || ''
}

export type { Entry, Asset }