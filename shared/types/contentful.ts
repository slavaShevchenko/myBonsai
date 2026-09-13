export interface NormalizedImage {
  id: string
  url: string
}

export interface NormalizedBonsai {
  id: string
  title: string
  slug: string
  images: NormalizedImage[]
  description?: string
  price?: string
  videoLink?: string
  tags: string[]
  style?: string
  age?: number
  height?: number
  sold?: boolean
  updatedAt?: string
}