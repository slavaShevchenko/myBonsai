interface Contact {
  id: string
  type: string
  content: string
}

interface Response {
  success: boolean
  items: Contact[]
}

export function useContacts() {
  return useFetch<Response>('/api/contacts', {
    key: 'contacts',
    default: () => ({ success: false, items: [] }),
  })
}