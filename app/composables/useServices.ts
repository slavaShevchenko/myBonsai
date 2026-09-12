interface Service {
  id: string
  title: string
  description: string
  price?: string
  imageUrl?: string
}

interface Response {
  items: Service[]
}

export function useServices() {
  return useFetch<Response>('/api/services', {
    key: 'services',
  })
}