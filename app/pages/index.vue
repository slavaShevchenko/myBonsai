<template>
  <div>
    <div v-if="pending" class="page-loader">Loading...</div>

    <RichText v-else-if="page?.text" :document="page.text" />

    <div v-else class="page-loader">Content not found</div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

useHead({
  title: 'Buy Bonsai Trees in Ireland & Europe',
  meta: [
    {
      name: 'description',
      content: 'Buy premium Japanese bonsai trees with delivery across Ireland and Europe. Discover indoor and outdoor bonsai, expert care and professional bonsai services.',
    },
    // OpenGraph
    { property: 'og:title', content: 'Buy Bonsai Trees in Ireland & Europe' },
    { property: 'og:description', content: 'Premium Japanese bonsai trees with delivery across Ireland and Europe. Indoor and outdoor specimens, expert care and professional services.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${config.public.siteUrl}/` },
    { property: 'og:image', content: `${config.public.siteUrl}/header-desktop.webp` },
    { property: 'og:site_name', content: 'My Bonsai' },
    { property: 'og:locale', content: 'en_IE' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Buy Bonsai Trees in Ireland & Europe' },
    { name: 'twitter:description', content: 'Premium Japanese bonsai trees with delivery across Ireland and Europe.' },
    { name: 'twitter:image', content: `${config.public.siteUrl}/header-desktop.webp` },
  ],
  link: [
    {
      rel: 'canonical',
      href: `${config.public.siteUrl}/`,
    },
  ],
})

const { data, pending } = await useMainPage()
const page = computed(() => data.value?.page)
</script>

<style scoped>
.page-loader {
  text-align: center;
  padding: 60px 0;
  font-size: 18px;
  color: var(--text-muted);
}
</style>