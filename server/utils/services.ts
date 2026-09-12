import { useContentful, normalizeImage, type RawImage } from './contentful'

interface NormalizedService {
  id: string
  title: string
  description: string
  price?: string
  imageUrl?: string
}

const fetchServicesRaw = async (): Promise<NormalizedService[]> => {
  const client = useContentful()

  const response = await client.getEntries({
    content_type: 'services',
    limit: 100,
  })

  const includes = ((response as any).includes?.Asset ?? []) as RawImage[]

  return response.items.map((entry: any) => {
    const fields = entry.fields ?? {}

    const imageUrl = fields.image
      ? normalizeImage(fields.image as RawImage, includes)?.url
      : undefined

    return {
      id: entry.sys.id,
      title: fields.title ?? '',
      description: fields.description ?? '',
      price: fields.price,
      imageUrl,
    }
  })
}

export const fetchServices = defineCachedFunction(fetchServicesRaw, {
  maxAge: 60 * 15, // 15 минут
  name: 'fetchServices',
})