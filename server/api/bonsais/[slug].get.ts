import { defineEventHandler, getRouterParam, createError } from 'h3'
import { fetchBonsaiBySlug } from '../../utils/bonsai'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug' })
  }

  const item = await fetchBonsaiBySlug(slug)
  if (!item) {
    throw createError({ statusCode: 404, statusMessage: 'Bonsai not found' })
  }

  return { success: true, item }
})