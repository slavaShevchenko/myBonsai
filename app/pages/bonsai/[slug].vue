<template>
  <div class="bonsai-page">
    <div v-if="pending" class="loader">Loading...</div>

    <div v-else-if="!bonsai" class="not-found">
      <h1 class="main__header">
        <div class="main__header-wrap">
          Bonsai not found
          <NavigationIcon :size="48" />
        </div>
      </h1>
      <div class="not-found__text">
        Go back to <NuxtLink to="/bonsai">Catalog</NuxtLink>
      </div>
    </div>

    <div v-else>
      <h1 class="main__header">
        <div class="main__header-wrap">
          {{ bonsai.title }}
          <NavigationIcon :size="48" />
        </div>
      </h1>

      <div class="bonsai-detail">
        <div class="bonsai-detail__image">
          <Swiper
            v-if="bonsai.images.length"
            :modules="[Pagination, Navigation]"
            :slides-per-view="1"
            :navigation="true"
            :pagination="{ clickable: true }"
            class="bonsai-detail__slider"
          >
            <SwiperSlide v-for="(img, index) in bonsai.images" :key="img.id">
              <div
                class="bonsai-detail__slider-image"
                @click="popupImage = img.url"
              >
                <img
                  :src="contentfulImageUrl(img.url, { w: 1200, h: 900 })"
                  :alt="bonsai.title"
                  :loading="index === 0 ? 'eager' : 'lazy'"
                />
                <span v-if="bonsai.sold" class="bonsai-detail__sold">SOLD</span>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        <div class="bonsai-detail__info">
          <div class="bonsai-detail__row">
            <div v-if="bonsai.style" class="bonsai-detail__section">
              <div class="bonsai-detail__label">Style:</div>
              <div class="bonsai-detail__value">{{ bonsai.style }}</div>
            </div>
            <div v-if="bonsai.age" class="bonsai-detail__section">
              <div class="bonsai-detail__label">Age:</div>
              <div class="bonsai-detail__value">{{ bonsai.age }} years</div>
            </div>
            <div v-if="bonsai.height" class="bonsai-detail__section">
              <div class="bonsai-detail__label">Height:</div>
              <div class="bonsai-detail__value">{{ bonsai.height }} cm</div>
            </div>
          </div>

          <div v-if="bonsai.description" class="bonsai-detail__section bonsai-detail__section--description">
            <div class="bonsai-detail__label">Description:</div>
            <div class="bonsai-detail__value">{{ bonsai.description }}</div>
          </div>

          <div v-if="bonsai.price" class="bonsai-detail__section bonsai-detail__section--price">
            <div class="bonsai-detail__label">Price:</div>
            <div class="bonsai-detail__value price-value">{{ bonsai.price }}</div>
          </div>

          <a
            v-if="bonsai.videoLink"
            :href="bonsai.videoLink"
            target="_blank"
            rel="noopener"
            class="bonsai-detail__video"
          >
            Watch video on youtube <span>→</span>
          </a>

          <NuxtLink to="/bonsai" class="bonsai-detail__back">
            <span>←</span> Back to catalog
          </NuxtLink>
        </div>
      </div>
    </div>

    <ImageLightbox
      v-model="popupImage"
      :alt="bonsai?.title || 'Bonsai image'"
      aria-label="Enlarged bonsai image"
    />
  </div>
</template>

<script setup lang="ts">
import { contentfulImageUrl } from '../../../shared/utils/contentful-image'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const route = useRoute()
const config = useRuntimeConfig()
const slug = route.params.slug as string

const { data, pending, error } = await useBonsai(slug)
const bonsai = computed(() => data.value?.item ?? null)

if (error.value || !bonsai.value) {
  throw createError({ statusCode: 404, statusMessage: 'Bonsai not found' })
}

route.meta.breadcrumbTitle = bonsai.value.title

const pageUrl = `${config.public.siteUrl}/bonsai/${slug}`
const mainImage = bonsai.value.images[0]?.url
const pageTitle = bonsai.value.title
const pageDescription = bonsai.value.description ?? `Premium bonsai: ${bonsai.value.title}. ${bonsai.value.price ?? ''}`.trim()

const schemaPrice = computed(() => {
  if (!bonsai.value.price) return 0
  const match = String(bonsai.value.price).match(/(\d+(?:[\.,]\d+)?)/)
  return match ? Number(match[1].replace(',', '.')) : 0
})

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:type', content: 'product' },
    { property: 'og:url', content: pageUrl },
    ...(mainImage
      ? [
          { property: 'og:image', content: mainImage },
          { name: 'twitter:image', content: mainImage },
        ]
      : []),
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: pageDescription },
  ],
  link: [{ rel: 'canonical', href: pageUrl }],
})

useJsonld(() => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: bonsai.value.title,
  image: bonsai.value.images.map((img) => img.url),
  description: bonsai.value.description ?? '',
  brand: { '@type': 'Brand', name: 'My Bonsai' },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'EUR',
    price: schemaPrice.value,
    availability: bonsai.value.sold
      ? 'https://schema.org/OutOfStock'
      : 'https://schema.org/InStock',
    url: pageUrl,
  },
}))

const popupImage = ref<string | null>(null)
</script>

<style scoped>
.bonsai-page {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.not-found {
  text-align: center;
}

.not-found__text {
  font-size: 18px;
}

.not-found__text a {
  color: var(--accent-color, #BC002D);
  text-decoration: none;
}

.bonsai-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  background: var(--white-color, #fff);
  padding: 24px;
  border-radius: var(--border-radius-16, 16px);
  box-shadow: 0 2px 10px var(--shadow-light, rgba(0,0,0,0.1));
}

.bonsai-detail__slider {
  width: auto;
  max-width: 100%;
  user-select: none;
}

.bonsai-detail__slider-image {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: var(--border-radius-8, 8px);
  cursor: zoom-in;
}

.bonsai-detail__slider-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.bonsai-detail__sold {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--accent-color, #BC002D);
  color: var(--white-color, #fff);
  padding: 4px 12px;
  border-radius: var(--border-radius-4, 4px);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
}

.bonsai-detail__info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.bonsai-detail__row {
  display: flex;
  gap: 4px 16px;
  flex-wrap: wrap;
}

.bonsai-detail__section {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.bonsai-detail__section--description {
  flex: 1 1 auto;
  flex-direction: column;
}

.bonsai-detail__section--price {
  align-items: flex-end;
}

.bonsai-detail__label {
  font-weight: 700;
  color: var(--primary-color, #111813);
  line-height: 1.5;
}

.bonsai-detail__value {
  color: var(--text-muted, #666);
  font-size: 16px;
  line-height: 1.4;
  flex: 1;
}

.bonsai-detail__section--price .bonsai-detail__label {
  margin-bottom: 1px;
}
.bonsai-detail__section--price .bonsai-detail__label,
.bonsai-detail__section--price .bonsai-detail__value {
  line-height: 1;
}

.bonsai-detail__value.price-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--accent-color);
}

.bonsai-detail__video {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--link-color, #c46c64);
  text-decoration: none;
  transition: color 0.3s ease;
  user-select: none;
  font-weight: 500;
  margin-top: 8px;
}

.bonsai-detail__video span {
  transition: transform 0.3s ease;
}

.bonsai-detail__video:hover {
  color: var(--accent-color, #BC002D);
}

.bonsai-detail__video:hover span {
  transform: translateX(4px);
}

.bonsai-detail__back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-color, #111813);
  text-decoration: none;
  font-weight: 500;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #eee;
  transition: color 0.3s ease;
}

.bonsai-detail__back:hover {
  color: var(--accent-color, #BC002D);
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: var(--accent-color, #BC002D);
}

:deep(.swiper-pagination-bullet) {
  background: var(--accent-color, #BC002D);
}

@media (max-width: 1199px) {
  .bonsai-detail {
    display: block;
    padding: 16px;
  }
  .bonsai-detail__image {
    margin-bottom: 40px;
  }
}
</style>