interface Contact {
  id: string
  type: string
  content: string
}

interface Response {
  items: Contact[]
}

export function useContacts() {
  return useFetch<Response>('/api/contacts', {
    key: 'contacts',
  })
}