import { useContentful } from './contentful'

interface NormalizedContact {
  id: string
  type: string
  content: string
}

const fetchContactsRaw = async (): Promise<NormalizedContact[]> => {
  const client = useContentful()

  const response = await client.getEntries({
    content_type: 'contacts',
    limit: 100,
  })

  return response.items.map((entry: any) => {
    const fields = entry.fields ?? {}
    return {
      id: entry.sys.id,
      type: fields.type ?? '',
      content: fields.content ?? '',
    }
  })
}

export const fetchContacts = defineCachedFunction(fetchContactsRaw, {
  maxAge: 60 * 15, // 15 минут
  name: 'fetchContacts',
})