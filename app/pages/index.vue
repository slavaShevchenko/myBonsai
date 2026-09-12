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
  title: 'Buy Bonsai Trees in Ireland & Europe | My Bonsai',
  meta: [
    {
      name: 'description',
      content: 'Buy premium Japanese bonsai trees with delivery across Ireland and Europe. Discover indoor and outdoor bonsai, expert care and professional bonsai services.',
    },
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