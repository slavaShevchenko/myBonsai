import type { NormalizedBonsai } from '#shared/types/contentful'
import { useContentful, normalizeImage, type RawImage, type AssetImage } from './contentful'
import { makeUniqueSlug } from '#shared/utils/slugify'

interface RawTag {
  sys: {
    id: string
  }
}

function normalizeBonsai(entry: any, includes: RawImage[]): Omit<NormalizedBonsai, 'slug'> {
  const fields = entry.fields ?? {}

  const images = (fields.images ?? [])
    .map((image: RawImage) => normalizeImage(image, includes))
    .filter((image: AssetImage | null): image is AssetImage => image !== null)

  return {
    id: entry.sys.id,
    title: fields.title ?? '',
    images,
    description: fields.description,
    price: fields.price,
    videoLink: fields.videoLink,
    tags: (entry.metadata?.tags ?? []).map((tag: RawTag) => tag.sys.id),
    style: fields.style,
    age: fields.age,
    height: fields.height,
    sold: fields.sold ?? false,
    updatedAt: entry.sys.updatedAt,
  }
}

const fetchBonsaisRaw = async (): Promise<NormalizedBonsai[]> => {
  const client = useContentful()

  const response = await client.getEntries({
    content_type: 'bonsais',
    limit: 1000,
  })

  const includes = ((response as any).includes?.Asset ?? []) as RawImage[]
  const usedSlugs = new Set<string>()

  return response.items
    .map((entry: any) => {
      const normalized = normalizeBonsai(entry, includes)
      const slug = makeUniqueSlug(normalized.title, normalized.id, usedSlugs)
      return { ...normalized, slug }
    })
    .filter((item) => item.title)
}

export const fetchBonsais = defineCachedFunction(fetchBonsaisRaw, {
  maxAge: 60 * 5, // 5 минут
  name: 'fetchBonsais',
})

export async function fetchBonsaiBySlug(slug: string): Promise<NormalizedBonsai | null> {
  const all = await fetchBonsais()
  return all.find((item) => item.slug === slug) ?? null
}