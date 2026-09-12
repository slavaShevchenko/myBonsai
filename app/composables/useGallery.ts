interface GalleryItem {
  id: string
  images: { id: string; url: string }[]
  description?: string
}

interface Response {
  success: boolean
  items: GalleryItem[]
}

export function useGallery() {
  return useFetch<Response>('/api/gallery', {
    key: 'gallery',
    default: () => ({ success: false, items: [] }),
  })
}