import { useContentful } from './contentful'

interface NormalizedPage {
  id: string
  text: any
}

const fetchMainPageRaw = async (): Promise<NormalizedPage | null> => {
  const client = useContentful()

  const response = await client.getEntries({
    content_type: 'mainPage',
    limit: 1,
  })

  if (!response.items.length) return null

  const entry = response.items[0] as any
  return {
    id: entry.sys.id,
    text: entry.fields?.text ?? null,
  }
}

export const fetchMainPage = defineCachedFunction(fetchMainPageRaw, {
  maxAge: 60 * 15, // 15 минут
  name: 'fetchMainPage',
})