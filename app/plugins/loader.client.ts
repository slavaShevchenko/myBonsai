import { useLoaderStore } from '~/stores/loader'

export default defineNuxtPlugin(() => {
  const loaderStore = useLoaderStore()
  const router = useRouter()

  router.beforeEach(async () => {
    loaderStore.setLoader(true)
    await new Promise((resolve) => setTimeout(resolve, 200))
  })

  router.afterEach(() => {
    setTimeout(() => {
      loaderStore.setLoader(false)
    }, 200)
  })
})