import type { NormalizedBonsai } from '../../shared/types/contentful'

interface Response {
  items: NormalizedBonsai[]
}

export function useBonsais() {
  return useFetch<Response>('/api/bonsais', {
    key: 'bonsais',
  })
}