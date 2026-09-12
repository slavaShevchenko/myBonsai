import { defineEventHandler } from 'h3'
import { fetchGallery } from '../utils/gallery'

export default defineEventHandler(async () => {
  const items = await fetchGallery()
  return { items }
})