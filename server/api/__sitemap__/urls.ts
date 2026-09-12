import { defineSitemapEventHandler, asSitemapUrl } from '#imports'
import { fetchBonsais } from '../../utils/bonsai'

export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig()
  const bonsais = await fetchBonsais()

  return bonsais.map((bonsai) => {
    return asSitemapUrl({
      loc: `/bonsai/${bonsai.slug}`,
      lastmod: new Date(),
      changefreq: 'weekly',
      priority: 0.8,
      images: bonsai.images.slice(0, 5).map((img) => ({
        loc: img.url,
        title: bonsai.title,
      })),
    })
  })
})