import { defineEventHandler } from 'h3'
import { fetchGallery } from '../utils/gallery'

export default defineEventHandler(async () => {
  try {
    const items = await fetchGallery()
    return { success: true, items }
  } catch (error: any) {
    return { success: false, error: error?.message, items: [] }
  }
})