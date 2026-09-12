import { defineEventHandler } from 'h3'
import { fetchMainPage } from '../utils/page'

export default defineEventHandler(async () => {
  const page = await fetchMainPage()
  return { page }
})