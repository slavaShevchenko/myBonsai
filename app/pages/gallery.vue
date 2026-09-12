<template>
  <div>
    <h1 class="main__header">
      <div class="main__header-wrap">
        Gallery
        <NavigationIcon :size="48" />
      </div>
    </h1>

    <div v-if="pending" class="loader">Loading...</div>

    <div v-else class="gallery__grid">
      <div v-for="(item, index) in gallery" :key="item.id" class="gallery__grid-item">
        <div v-if="item.images.length" class="gallery__item-swiper">
          <Swiper
            :modules="[Pagination, Navigation]"
            :slides-per-view="1"
            :navigation="true"
            :pagination="{ clickable: true }"
            class="gallery__slider"
          >
            <SwiperSlide v-for="img in item.images" :key="img.id">
              <div class="gallery__slider-image" @click="openPopup(img.url)">
                <img
                  :src="contentfulImageUrl(img.url, { w: 900 })"
                  :alt="item.description || `Bonsai gallery image ${index + 1}`"
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <div v-if="item.description" class="gallery__grid-item-description">
          {{ item.description }}
        </div>
      </div>
    </div>

    <div
      v-if="popupImage"
      class="popup"
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged image view"
      @click.self="closePopup"
      @keydown.esc="closePopup"
    >
      <div class="popup__content">
        <button
          class="popup__close"
          @click="closePopup"
          aria-label="Close image preview"
        >
          &times;
        </button>
        <img
          :src="popupImage"
          :alt="`Enlarged: ${currentPopupAlt}`"
          class="popup__image"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { contentfulImageUrl } from '../../shared/utils/contentful-image'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const config = useRuntimeConfig()
const pageUrl = `${config.public.siteUrl}/gallery`
const pageTitle = 'Bonsai Gallery'
const pageDescription = 'Explore our bonsai gallery featuring Japanese bonsai trees, customer projects and handcrafted miniature trees.'

useHead({
  title: pageTitle,
  meta: [
    {
      name: 'description',
      content: pageDescription,
    },
    // OpenGraph
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: pageUrl },
    { property: 'og:image', content: `${config.public.siteUrl}/header-desktop.webp` },
    { property: 'og:site_name', content: 'My Bonsai' },
    { property: 'og:locale', content: 'en_IE' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: pageDescription },
    { name: 'twitter:image', content: `${config.public.siteUrl}/header-desktop.webp` },
  ],
  link: [
    {
      rel: 'canonical',
      href: pageUrl,
    },
  ],
})

const { data, pending } = await useGallery()
const gallery = computed(() => data.value?.items ?? [])
const popupImage = ref<string | null>(null)
const currentPopupAlt = ref<string>('')

const openPopup = (imageUrl: string, alt: string = '') => {
  popupImage.value = imageUrl
  currentPopupAlt.value = alt || 'Bonsai gallery image'
}

const closePopup = () => {
  popupImage.value = null
  currentPopupAlt.value = ''
}
</script>

<style scoped>
.loader {
  text-align: center;
  padding: 60px 0;
  font-size: 18px;
  color: var(--text-muted);
}

.gallery__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  position: relative;
  z-index: 2;
}

.gallery__grid-item {
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--white-color);
  padding: 16px;
  border-radius: var(--border-radius-16);
  box-shadow: 0 2px 10px var(--shadow-light);
  text-align: left;
}

.gallery__item-swiper {
  flex: 1 0 auto;
  margin-bottom: 16px;
}

.gallery__item-swiper .swiper {
  height: 100%;
  padding-bottom: 24px;
}

.gallery__slider-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  max-height: 600px;
  overflow: hidden;
  border-radius: var(--border-radius-8);
  cursor: zoom-in;
}

.gallery__slider-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.gallery__grid-item-description {
  padding-top: 8px;
  font-weight: 300;
  text-align: center;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: var(--accent-color);
}

:deep(.swiper-pagination-bullet) {
  background: var(--accent-color);
}

.popup {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: var(--popup-bg);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.popup__content {
  position: relative;
  max-width: 90dvw;
  max-height: 90dvh;
}

.popup__image {
  width: 100%;
  height: 100%;
  max-width: 90dvw;
  max-height: 90dvh;
  border-radius: var(--border-radius-8);
  object-fit: contain;
}

.popup__close {
  background: none;
  border: none;
  color: white;
  font-size: 32px;
  -webkit-text-stroke: 1px black;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

@media (max-width: 1299px) {
  .gallery__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .gallery__grid {
    grid-template-columns: 1fr;
  }
}
</style>