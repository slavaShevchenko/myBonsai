<template>
  <div>
    <div class="main__header">
      <div class="main__header-wrap">
        Gallery
        <NavigationIcon :size="48" />
      </div>
    </div>

    <div v-if="pending" class="loader">Loading...</div>

    <div v-else class="gallery__grid">
      <div v-for="item in gallery" :key="item.id" class="gallery__grid-item">
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
                <img :src="img.url" alt="Gallery image" />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <div v-if="item.description" class="gallery__grid-item-description">
          {{ item.description }}
        </div>
      </div>
    </div>

    <div v-if="popupImage" class="popup" @click.self="closePopup">
      <div class="popup__content">
        <button class="popup__close" @click="closePopup">&times;</button>
        <img :src="popupImage" alt="Enlarged image" class="popup__image" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

useHead({
  title: 'Bonsai Gallery | Japanese Bonsai Collection',
  meta: [
    {
      name: 'description',
      content: 'Explore our bonsai gallery featuring Japanese bonsai trees, customer projects and handcrafted miniature trees.',
    },
  ],
})

const { data, pending } = await useGallery()
const gallery = computed(() => data.value?.items ?? [])
const popupImage = ref<string | null>(null)

const openPopup = (imageUrl: string) => {
  popupImage.value = imageUrl
}

const closePopup = () => {
  popupImage.value = null
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