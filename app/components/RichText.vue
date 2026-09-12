<template>
  <div class="rich-text" v-html="html"></div>
</template>

<script setup lang="ts">
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'

const props = defineProps<{
  document: any
}>()

const html = computed(() => {
  if (!props.document) return ''

  const options = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const url = node.data.target.fields.file.url
        const alt = node.data.target.fields.title || ''
        return `<img src="https:${url}" alt="${alt}" />`
      },
      [INLINES.HYPERLINK]: (node: any) => {
        const url = node.data.uri
        const text = node.content.map((c: any) => c.value).join('')
        return `<a href="${url}" target="_blank" rel="noopener">${text}</a>`
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
  line-height: 1.6;
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