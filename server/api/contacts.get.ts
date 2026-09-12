import { defineEventHandler } from 'h3'
import { fetchContacts } from '../utils/contacts'

export default defineEventHandler(async () => {
  const items = await fetchContacts()
  return { items }
})