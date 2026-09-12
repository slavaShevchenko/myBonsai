<template>
  <div>
    <div class="main__header">
      <div class="main__header-wrap">
        Page not found
        <NavigationIcon :size="48" />
      </div>
    </div>
    <div class="not-found">
      <div class="not-found__text">
        Go back to <NuxtLink to="/">Main page</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Page Not Found | My Bonsai',
  meta: [
    {
      name: 'description',
      content: 'The page you are looking for could not be found.',
    },
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