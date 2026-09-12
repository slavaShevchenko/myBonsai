import { defineSitemapEventHandler, asSitemapUrl } from '#imports'
import { fetchBonsais } from '../../utils/bonsai'
import { getAllStyles } from '../../../shared/data/styles'

export default defineSitemapEventHandler(async () => {
  const bonsais = await fetchBonsais()
  const styles = getAllStyles()

  const bonsaiUrls = bonsais.map((bonsai) => {
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

  const styleUrls = styles.map((style) => {
    return asSitemapUrl({
      loc: `/bonsai/style/${style.slug}`,
      lastmod: new Date(),
      changefreq: 'monthly',
      priority: 0.7,
    })
  })

  return [...bonsaiUrls, ...styleUrls]
})