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

interface NormalizedImage {
  id: string
  url: string
}

interface NormalizedGalleryItem {
  id: string
  images: NormalizedImage[]
  description?: string
}

function normalizeImage(image: RawImage, includes: RawImage[]): NormalizedImage | null {
  const asset = image.sys.type === 'Link'
    ? includes.find((item) => item.sys.id === image.sys.id)
    : image

  if (!asset?.fields?.file?.url) {
    return null
  }

  return {
    id: asset.sys.id,
    url: `https:${asset.fields.file.url}`,
  }
}

export async function fetchGallery(): Promise<NormalizedGalleryItem[]> {
  const client = useContentful()

  const response = await client.getEntries({
    content_type: 'gallery',
    limit: 100,
  })

  const includes = ((response as any).includes?.Asset ?? []) as RawImage[]

  return response.items.map((entry: any) => {
    const fields = entry.fields ?? {}
    const rawImages = (fields.image ?? []) as RawImage[]

    const images = rawImages
      .map((image) => normalizeImage(image, includes))
      .filter((image): image is NormalizedImage => image !== null)

    return {
      id: entry.sys.id,
      images,
      description: fields.description,
    }
  })
}