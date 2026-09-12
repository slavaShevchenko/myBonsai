<template>
  <div class="container">
    <Header />
    <Navigation />
    <div class="content">
      <div class="content__left-img">
        <NavigationIcon :size="800" />
      </div>
      <div class="content__right-img">
        <NavigationIcon :size="800" />
      </div>
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