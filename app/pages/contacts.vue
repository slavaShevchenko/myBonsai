<template>
  <div>
    <div class="main__header">
      <div class="main__header-wrap">
        Contacts
        <NavigationIcon :size="48" />
      </div>
    </div>

    <div v-if="pending" class="loader">Loading...</div>

    <div v-else class="contacts__grid">
      <div
        v-for="(contact, index) in contacts"
        :key="contact.id"
        class="contacts__grid-item-wrap"
      >
        <NavigationIcon v-if="index !== 0" :size="40" />
        <div class="contacts__grid-item">
          <div class="contacts__item-type">{{ contact.type }}:</div>
          <div class="contacts__item-content">{{ contact.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Contact My Bonsai | Bonsai Shop Ireland',
  meta: [
    {
      name: 'description',
      content: 'Contact My Bonsai for bonsai sales, expert advice and professional bonsai services. We deliver across Ireland and Europe.',
    },
  ],
})

const { data, pending } = await useContacts()
const contacts = computed(() => data.value?.items ?? [])
</script>

<style scoped>
.loader {
  text-align: center;
  padding: 60px 0;
  font-size: 18px;
  color: var(--text-muted);
}

.contacts__grid {
  gap: 16px;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.contacts__grid-item-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.contacts__grid-item-wrap + .contacts__grid-item-wrap {
  margin-top: 16px;
}

.contacts__grid-item {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 4px;
  min-width: 100%;
  background: var(--white-color);
  padding: 16px;
  border-radius: var(--border-radius-16);
  box-shadow: 0 2px 10px var(--shadow-light);
  font-size: 24px;
  text-align: center;
}

.contacts__item-type {
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--accent-color);
}

@media (max-width: 767px) {
  .contacts__grid-item {
    display: block;
    padding: 8px;
    font-size: 20px;
  }
}
</style>