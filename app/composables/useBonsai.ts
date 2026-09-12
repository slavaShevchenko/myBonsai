import type { NormalizedBonsai } from '../../shared/types/contentful'

interface Response {
  item: NormalizedBonsai
}

export function useBonsai(slug: string) {
  return useFetch<Response>(`/api/bonsais/${slug}`, {
    key: `bonsai-${slug}`,
    watch: false,
  })
}