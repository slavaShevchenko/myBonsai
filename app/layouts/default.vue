<template>
  <div class="container">
    <a href="#main-content" class="skip-link">Skip to content</a>
    <Header />
    <Navigation />
    <div id="main-content" class="content" tabindex="-1">
      <Breadcrumb />
      <img
        src="/decor-icon.svg"
        alt=""
        aria-hidden="true"
        class="content__left-img"
        width="800"
        height="800"
        loading="lazy"
      />
      <img
        src="/decor-icon.svg"
        alt=""
        aria-hidden="true"
        class="content__right-img"
        width="800"
        height="800"
        loading="lazy"
      />
      <slot />
      <Footer />
    </div>
  </div>

  <Transition name="fade" mode="out-in">
    <Loading v-if="isLoading" />
  </Transition>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLoaderStore } from '~/stores/loader'

const loaderStore = useLoaderStore()
const { isLoading } = storeToRefs(loaderStore)
</script>

<style scoped>
.skip-link {
  position: absolute;
  top: -48px;
  left: 16px;
  z-index: 100;
  padding: 8px 16px;
  background: var(--white-color, #fff);
  color: var(--accent-color, #BC002D);
  border-radius: var(--border-radius-8, 8px);
  box-shadow: 0 2px 10px var(--shadow-light, rgba(0, 0, 0, 0.1));
  text-decoration: none;
  font-weight: 600;
  transition: top 0.2s ease;
}

.skip-link:focus {
  top: 16px;
}
</style>