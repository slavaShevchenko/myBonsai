import type { NormalizedBonsai } from '../../shared/types/contentful'

interface Response {
  success: boolean
  item: NormalizedBonsai
}

export function useBonsai(slug: string) {
  return useFetch<Response>(`/api/bonsais/${slug}`, {
    key: `bonsai-${slug}`,
    watch: false,
  })
}