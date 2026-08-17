import { defineEventHandler } from 'h3'
import { fetchBonsais } from '../utils/bonsai'

export default defineEventHandler(async () => {
  try {
    const items = await fetchBonsais()
    return { success: true, items }
  } catch (error: any) {
    return { success: false, error: error?.message, items: [] }
  }
})