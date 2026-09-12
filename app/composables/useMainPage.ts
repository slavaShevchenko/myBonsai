interface Page {
  id: string
  text: any
}

interface Response {
  success: boolean
  page: Page | null
}

export function useMainPage() {
  return useFetch<Response>('/api/main-page', {
    key: 'main-page',
    default: () => ({ success: false, page: null }),
  })
}