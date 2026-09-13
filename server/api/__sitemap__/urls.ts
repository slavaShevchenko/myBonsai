import { defineSitemapEventHandler, asSitemapUrl } from '#imports'
import { fetchBonsais } from '../../utils/bonsai'
import { getAllStyles } from '../../../shared/data/styles'

export default defineSitemapEventHandler(async () => {
  const bonsais = await fetchBonsais()
  const styles = getAllStyles()

  const bonsaiUrls = bonsais.map((bonsai) => {
    return asSitemapUrl({
      loc: `/bonsai/${bonsai.slug}`,
      // Реальная дата последнего изменения записи в Contentful
      ...(bonsai.updatedAt ? { lastmod: bonsai.updatedAt } : {}),
      changefreq: 'weekly',
      priority: 0.8,
      images: bonsai.images.slice(0, 5).map((img) => ({
        loc: img.url,
        title: bonsai.title,
      })),
    })
  })

  // Статичные страницы стилей: данные лежат в коде,
  // поэтому lastmod не указываем — не обманываем поисковик
  const styleUrls = styles.map((style) => {
    return asSitemapUrl({
      loc: `/bonsai/style/${style.slug}`,
      changefreq: 'monthly',
      priority: 0.7,
    })
  })

  return [...bonsaiUrls, ...styleUrls]
})