import { useContentful } from './contentful'

interface NormalizedContact {
  id: string
  type: string
  content: string
}

export async function fetchContacts(): Promise<NormalizedContact[]> {
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