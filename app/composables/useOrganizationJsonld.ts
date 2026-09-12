interface Contact {
  id: string
  type: string
  content: string
}

export function useOrganizationJsonld(
  contacts: Ref<Contact[]> | ComputedRef<Contact[]> | null = null
) {
  const config = useRuntimeConfig()
  const baseUrl = config.public.siteUrl

  const jsonLd = computed(() => {
    const sameAs: string[] = []
    const contactPoint: any[] = []

    // Если контакты переданы — берём реальные данные из CMS
    if (contacts) {
      const list = unref(contacts) ?? []

      const phone = list.find((c) => c.type.toLowerCase().includes('phone'))
      const email = list.find((c) => c.type.toLowerCase().includes('mail'))
      const instagram = list.find((c) => c.type.toLowerCase().includes('instagram'))
      const whatsapp = list.find((c) => c.type.toLowerCase().includes('whatsapp'))

      if (phone) {
        const digits = phone.content.split(' ')[0].replace(/[^\d+]/g, '')
        if (digits) {
          contactPoint.push({
            '@type': 'ContactPoint',
            telephone: `+${digits}`,
            contactType: 'customer service',
            availableLanguage: ['English'],
          })
        }
      }

      if (email) {
        contactPoint.push({
          '@type': 'ContactPoint',
          email: email.content,
          contactType: 'customer service',
          availableLanguage: ['English'],
        })
      }

      if (instagram) {
        const username = instagram.content
          .replace(/^@/, '')
          .replace(/^https?:\/\/(?:www\.)?instagram\.com\//, '')
        sameAs.push(`https://instagram.com/${username}`)
      }

      if (whatsapp) {
        const handle = whatsapp.content
          .replace(/^@/, '')
          .replace(/^https?:\/\/(?:wa\.me|api\.whatsapp\.com\/send\?phone=)/, '')
        sameAs.push(`https://wa.me/${handle}`)
      }
    }

    const result: any = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'My Bonsai',
      url: baseUrl,
      logo: `${baseUrl}/header-desktop.webp`,
      sameAs,
    }

    if (contactPoint.length) {
      result.contactPoint = contactPoint
    }

    return result
  })

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(jsonLd.value),
      },
    ],
  })
}