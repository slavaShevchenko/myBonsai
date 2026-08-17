import type { NormalizedBonsai } from '../../shared/types/contentful'

interface Response {
  success: boolean
  items: NormalizedBonsai[]
  error?: string
}

export function useBonsais() {
  return useFetch<Response>('/api/bonsais', {
    key: 'bonsais',
    default: () => ({ success: false, items: [] }),
  })
}