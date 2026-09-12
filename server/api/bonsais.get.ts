import { defineEventHandler } from 'h3'
import { fetchBonsais } from '../utils/bonsai'

export default defineEventHandler(async () => {
  const items = await fetchBonsais()
  return { items }
})