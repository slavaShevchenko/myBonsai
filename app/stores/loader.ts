import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLoaderStore = defineStore('loader', () => {
  const loaderState = ref(true)
  const isLoading = computed(() => loaderState.value)

  const setLoader = (state: boolean) => {
    loaderState.value = state
  }

  return { loaderState, isLoading, setLoader }
})