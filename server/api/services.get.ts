import { defineEventHandler } from 'h3'
import { fetchServices } from '../utils/services'

export default defineEventHandler(async () => {
  try {
    const items = await fetchServices()
    return { success: true, items }
  } catch (error: any) {
    return { success: false, error: error?.message, items: [] }
  }
})