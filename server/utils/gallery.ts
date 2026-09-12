import { useContentful, normalizeImage, type RawImage, type AssetImage } from './contentful'

interface NormalizedGalleryItem {
  id: string
  images: AssetImage[]
  description?: string
}

const fetchGalleryRaw = async (): Promise<NormalizedGalleryItem[]> => {
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
      .filter((image): image is AssetImage => image !== null)

    return {
      id: entry.sys.id,
      images,
      description: fields.description,
    }
  })
}

export const fetchGallery = defineCachedFunction(fetchGalleryRaw, {
  maxAge: 60 * 15, // 15 минут
  name: 'fetchGallery',
})