interface Page {
  id: string
  text: any
}

interface Response {
  page: Page | null
}

export function useMainPage() {
  return useFetch<Response>('/api/main-page', {
    key: 'main-page',
  })
}