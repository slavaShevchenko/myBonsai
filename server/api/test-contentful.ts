import { defineEventHandler } from 'h3'
import { fetchBonsais } from '../utils/bonsai'

export default defineEventHandler(async () => {
  try {
    const items = await fetchBonsais()

    return {
      success: true,
      total: items.length,
      items,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.message,
    }
  }
})