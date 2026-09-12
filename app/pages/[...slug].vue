<template>
  <div>
    <h1 class="main__header">
      <div class="main__header-wrap">
        Page not found
        <NavigationIcon :size="48" />
      </div>
    </h1>
    <div class="not-found">
      <div class="not-found__text">
        Go back to <NuxtLink to="/">Main page</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const pageUrl = `${config.public.siteUrl}/404`
const pageTitle = 'Page Not Found'
const pageDescription = 'The page you are looking for could not be found.'

useHead({
  title: pageTitle,
  meta: [
    {
      name: 'description',
      content: pageDescription,
    },
    { name: 'robots', content: 'noindex' },
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
})
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
}

.not-found a {
  color: var(--accent-color);
  text-decoration: none;
}
</style>