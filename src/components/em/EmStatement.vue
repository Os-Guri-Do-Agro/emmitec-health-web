<script setup lang="ts">
/** Manifesto que acende palavra a palavra conforme a rolagem. */
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { RM, addFx, clamp } from '@/lib/motion'

const props = withDefaults(defineProps<{ text: string; em?: string; tag?: string }>(), {
  em: '',
  tag: 'p',
})

const root = ref<HTMLElement | null>(null)
const lit = ref(RM ? Infinity : 0)

const words = computed(() => {
  const text = props.text ?? ''
  const em = props.em?.trim().toLowerCase()
  const emWords = em ? em.split(/\s+/) : []
  const list = text.split(/\s+/).filter(Boolean)
  // marca como serifada a sequência de palavras igual ao trecho `em`
  let from = -1
  if (emWords.length) {
    const norm = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')
    for (let i = 0; i <= list.length - emWords.length; i++) {
      if (emWords.every((w, j) => norm(list[i + j] ?? '') === norm(w))) {
        from = i
        break
      }
    }
  }
  return list.map((w, i) => ({ w, serif: from >= 0 && i >= from && i < from + emWords.length }))
})

let off: (() => void) | null = null
onMounted(() => {
  if (RM) return
  off = addFx((_y, _dt, vh) => {
    const el = root.value
    if (!el) return
    const r = el.getBoundingClientRect()
    const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.4), 0, 1)
    lit.value = Math.round(p * words.value.length)
  })
})
onBeforeUnmount(() => off?.())
</script>

<template>
  <component :is="tag" ref="root" class="em-statement">
    <template v-for="(w, i) in words" :key="i">
      <span class="em-rw" :class="{ 'is-lit': i < lit, 'em-serif': w.serif }">{{ w.w }}</span
      >{{ i < words.length - 1 ? ' ' : '' }}
    </template>
  </component>
</template>
