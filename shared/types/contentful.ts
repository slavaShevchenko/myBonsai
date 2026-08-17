export interface NormalizedImage {
  id: string
  url: string
}

export interface ParsedPrice {
  value: number | null
  sold: boolean
  display: string | null
}

export interface NormalizedBonsai {
  id: string
  title: string
  slug: string
  images: NormalizedImage[]
  description?: string
  price?: ParsedPrice
  videoLink?: string
  tags: string[]
}