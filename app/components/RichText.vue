<template>
  <div class="rich-text" v-html="html"></div>
</template>

<script setup lang="ts">
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import { contentfulImageUrl } from '../../shared/utils/contentful-image'

const props = defineProps<{
  document: any
}>()

// Экранирование значений атрибутов (защита от выхода из alt="" и href="")
function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Экранирование HTML-текста
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Разрешаем только безопасные протоколы ссылок
function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url, 'https://example.com')
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

const html = computed(() => {
  if (!props.document) return ''

  const options = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const file = node.data.target?.fields?.file
        if (!file?.url) return ''
        const url = escapeAttr(contentfulImageUrl(`https:${file.url}`, { w: 1600, q: 80 }))
        const alt = escapeAttr(file.title || '')
        return `<img src="${url}" alt="${alt}" loading="lazy" decoding="async" />`
      },
      [INLINES.HYPERLINK]: (node: any) => {
        const url = node.data.uri || ''
        const text = escapeHtml(node.content.map((c: any) => c.value).join(''))
        if (!isSafeUrl(url)) return text
        return `<a href="${escapeAttr(url)}" target="_blank" rel="noopener">${text}</a>`
      },
    },
  }

  return documentToHtmlString(props.document, options)
})
</script>

<style scoped>
.rich-text {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
}

.rich-text :deep(img) {
  display: block;
  max-width: 100%;
  max-height: 80dvh;
  margin: 24px auto;
  border-radius: var(--border-radius-8);
}

.rich-text :deep(p) {
  margin: 16px 0;
  font-size: 16px;
  line-height: 1.4;
}

.rich-text :deep(h1),
.rich-text :deep(h2),
.rich-text :deep(h3) {
  margin: 24px 0 16px;
  font-weight: 700;
}

.rich-text :deep(blockquote) {
  margin: 24px 0;
  padding: 0 16px;
  font-weight: 300;
  text-align: center;
  font-style: italic;
}

.rich-text :deep(ul),
.rich-text :deep(ol) {
  margin: 16px 0;
  padding-left: 32px;
}

.rich-text :deep(li) {
  margin: 8px 0;
}
</style>