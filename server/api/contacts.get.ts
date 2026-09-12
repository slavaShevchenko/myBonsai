import { defineEventHandler } from 'h3'
import { fetchContacts } from '../utils/contacts'

export default defineEventHandler(async () => {
  try {
    const items = await fetchContacts()
    return { success: true, items }
  } catch (error: any) {
    return { success: false, error: error?.message, items: [] }
  }
})