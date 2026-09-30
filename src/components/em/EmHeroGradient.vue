<script setup lang="ts">
/**
 * Fundo vivo do hero: gradiente líquido em WebGL.
 * Sem WebGL, cai para manchas desfocadas que passeiam devagar.
 */
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { glGradient, blobsField } from '@/lib/gradient'

const canvas = ref<HTMLCanvasElement | null>(null)
const blobs = ref<HTMLElement | null>(null)
const hasGl = ref(true)
let cleanup: (() => void) | null = null

const BLOBS = [
  { c: 'var(--cyan-500)', o: 0.72, s: '48vw' },
  { c: 'var(--cyan-300)', o: 0.7, s: '42vw' },
  { c: 'var(--cyan-600)', o: 0.4, s: '34vw' },
  { c: 'var(--pastel-blue)', o: 1, s: '46vw' },
  { c: 'var(--cyan-100)', o: 1, s: '54vw' },
  { c: 'var(--cyan-500)', o: 0.5, s: '36vw' },
  { c: 'var(--cyan-300)', o: 0.55, s: '28vw' },
]

onMounted(() => {
  const c = canvas.value ? glGradient(canvas.value) : null
  if (c) {
    cleanup = c
    return
  }
  hasGl.value = false
  requestAnimationFrame(() => {
    if (blobs.value) cleanup = blobsField(blobs.value)
  })
})
onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <canvas v-if="hasGl" ref="canvas" class="em-hero__gl" aria-hidden="true" />
  <div v-else ref="blobs" class="em-blobs" aria-hidden="true">
    <i v-for="(b, i) in BLOBS" :key="i" :style="{ '--c': b.c, '--o': b.o, '--s': b.s }" />
  </div>
</template>
