interface ContentfulImageOptions {
  w?: number
  h?: number
  fit?: 'crop' | 'scale' | 'pad' | 'fill' | 'thumb'
  q?: number
  fm?: 'webp' | 'jpg' | 'png' | 'avif'
}

export function contentfulImageUrl(url: string, options: ContentfulImageOptions = {}): string {
  if (!url) return ''

  const params: string[] = []

  if (options.w) params.push(`w=${options.w}`)
  if (options.h) params.push(`h=${options.h}`)
  if (options.fit) params.push(`fit=${options.fit}`)
  if (options.q) params.push(`q=${options.q}`)

  params.push(`fm=${options.fm || 'webp'}`)

  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}${params.join('&')}`
}