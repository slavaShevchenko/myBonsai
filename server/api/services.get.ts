import { defineEventHandler } from 'h3'
import { fetchServices } from '../utils/services'

export default defineEventHandler(async () => {
  const items = await fetchServices()
  return { items }
})