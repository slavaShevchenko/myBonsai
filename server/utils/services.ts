import { useContentful } from './contentful'

interface RawImage {
  sys: {
    id: string
    type?: string
  }
  fields?: {
    file?: {
      url?: string
    }
  }
}

interface NormalizedService {
  id: string
  title: string
  description: string
  price?: string
  imageUrl?: string
}

function normalizeImage(image: RawImage, includes: RawImage[]): string | null {
  const asset = image.sys.type === 'Link'
    ? includes.find((item) => item.sys.id === image.sys.id)
    : image

  if (!asset?.fields?.file?.url) {
    return null
  }

  return `https:${asset.fields.file.url}`
}

export async function fetchServices(): Promise<NormalizedService[]> {
  const client = useContentful()

  const response = await client.getEntries({
    content_type: 'services',
    limit: 100,
  })

  const includes = ((response as any).includes?.Asset ?? []) as RawImage[]

  return response.items.map((entry: any) => {
    const fields = entry.fields ?? {}

    const imageUrl = fields.image
      ? normalizeImage(fields.image as RawImage, includes) ?? undefined
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