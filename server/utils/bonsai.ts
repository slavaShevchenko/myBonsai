import type { NormalizedBonsai, NormalizedImage, ParsedPrice } from '../../shared/types/contentful'
import { useContentful } from './contentful'
import { makeUniqueSlug } from '../../shared/utils/slugify'

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

interface RawTag {
  sys: {
    id: string
  }
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

function parsePrice(raw: unknown): ParsedPrice | null {
  if (typeof raw !== 'string' || !raw.trim()) return null
  const sold = raw.toUpperCase().includes('SOLD')
  const numericMatch = raw.match(/(\d+(?:[\.,]\d+)?)/)
  const value = numericMatch ? Number(numericMatch[1].replace(',', '.')) : null
  return { value, sold, display: raw.trim() }
}

function normalizeBonsai(entry: any, includes: RawImage[]): Omit<NormalizedBonsai, 'slug'> {
  const fields = entry.fields ?? {}

  const images = (fields.images ?? [])
    .map((image: RawImage) => normalizeImage(image, includes))
    .filter((image: NormalizedImage | null): image is NormalizedImage => image !== null)

  return {
    id: entry.sys.id,
    title: fields.title ?? '',
    images,
    description: fields.description,
    price: parsePrice(fields.price),
    videoLink: fields.videoLink,
    tags: (entry.metadata?.tags ?? []).map((tag: RawTag) => tag.sys.id),
  }
}

export async function fetchBonsais(): Promise<NormalizedBonsai[]> {
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

export async function fetchBonsaiBySlug(slug: string): Promise<NormalizedBonsai | null> {
  const all = await fetchBonsais()
  return all.find((item) => item.slug === slug) ?? null
}