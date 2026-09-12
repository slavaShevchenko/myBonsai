import { defineEventHandler } from 'h3'
import { fetchMainPage } from '../utils/page'

export default defineEventHandler(async () => {
  try {
    const page = await fetchMainPage()
    return { success: true, page }
  } catch (error: any) {
    return { success: false, error: error?.message, page: null }
  }
})