<template>
  <div>
    <h1 class="main__header">
      <div class="main__header-wrap">
        Contacts
        <NavigationIcon :size="48" />
      </div>
    </h1>

    <div v-if="pending" class="loader">Loading...</div>

    <div v-else class="contacts__grid">
      <div
        v-for="(contact, index) in contactItems"
        :key="contact.id"
        class="contacts__grid-item-wrap"
      >
        <NavigationIcon v-if="index !== 0" :size="40" />
        <div class="contacts__grid-item">
          <div class="contacts__item-type">{{ contact.type }}:</div>
          <div class="contacts__item-content">
            <a
              v-if="contact.href"
              :href="contact.href"
              class="contacts__item-link"
              :target="contact.isExternal ? '_blank' : undefined"
              :rel="contact.isExternal ? 'noopener' : undefined"
            >
              {{ contact.content }}
            </a>
            <template v-else>{{ contact.content }}</template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const pageUrl = `${config.public.siteUrl}/contacts`
const pageTitle = 'Contact Bonsai Shop in Ireland'
const pageDescription = 'Contact My Bonsai for bonsai sales, expert advice and professional bonsai services. We deliver across Ireland and Europe.'

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: pageUrl },
    { property: 'og:image', content: `${config.public.siteUrl}/header-desktop.webp` },
    { property: 'og:site_name', content: 'My Bonsai' },
    { property: 'og:locale', content: 'en_IE' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: pageDescription },
    { name: 'twitter:image', content: `${config.public.siteUrl}/header-desktop.webp` },
  ],
  link: [{ rel: 'canonical', href: pageUrl }],
})

const { data, pending } = await useContacts()
const contacts = computed(() => data.value?.items ?? [])

// Organization JSON-LD с реальными контактами из CMS
useOrganizationJsonld(contacts)

function contactHref(type: string, content: string): string | null {
  const t = type.toLowerCase()
  const c = content.trim()

  if (!c) return null

  if (t.includes('phone') || t.includes('tel') || t.includes('mobile')) {
    const digits = c.split(' ')[0].replace(/[^\d+]/g, '')
    return digits ? `tel:${digits}` : null
  }

  if (t.includes('mail')) {
    return `mailto:${c}`
  }

  if (t.includes('instagram')) {
    const username = c.replace(/^@/, '').replace(/^https?:\/\/(?:www\.)?instagram\.com\//, '')
    return `https://instagram.com/${username}`
  }

  if (t.includes('whatsapp') || t.includes('wa')) {
    const handle = c.replace(/^@/, '').replace(/^https?:\/\/(?:wa\.me|api\.whatsapp\.com\/send\?phone=)/, '')
    return `https://wa.me/${handle}`
  }

  if (t.includes('facebook')) {
    const handle = c.replace(/^https?:\/\/(?:www\.)?facebook\.com\//, '')
    return `https://facebook.com/${handle}`
  }

  if (t.includes('web') || t.includes('site') || t.includes('social')) {
    if (c.startsWith('http://') || c.startsWith('https://')) return c
    return `https://${c.replace(/^www\./, 'www.')}`
  }

  if (c.includes('@') && !c.startsWith('http')) return `mailto:${c}`
  if (c.startsWith('http://') || c.startsWith('https://')) return c
  if (c.startsWith('www.')) return `https://${c}`

  return null
}

const contactItems = computed(() =>
  contacts.value.map((contact) => {
    const href = contactHref(contact.type ?? '', contact.content ?? '')
    return {
      ...contact,
      href,
      isExternal: href !== null && (href.startsWith('http://') || href.startsWith('https://')),
    }
  })
)
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

.contacts__item-link {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
  word-break: break-word;
}

.contacts__item-link:hover {
  color: var(--accent-color);
  border-color: var(--accent-color);
}

@media (max-width: 767px) {
  .contacts__grid-item {
    display: block;
    padding: 8px;
    font-size: 20px;
  }
}
</style>