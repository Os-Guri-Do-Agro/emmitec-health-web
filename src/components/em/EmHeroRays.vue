<script setup lang="ts">
/**
 * Fundo do hero das páginas internas: brilho que vem de cima e se abre em
 * feixes de luz que ondulam devagar, como reflexo na água (WebGL).
 * Sem WebGL, cai para feixes em CSS com o mesmo desenho, mais simples.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { glRays } from '@/lib/gradient'

const props = withDefaults(defineProps<{ origin?: number }>(), { origin: 0.5 })

const canvas = ref<HTMLCanvasElement | null>(null)
const hasGl = ref(true)
let cleanup: (() => void) | null = null

onMounted(() => {
  const c = canvas.value ? glRays(canvas.value, props.origin) : null
  if (c) cleanup = c
  else hasGl.value = false
})
onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <canvas v-if="hasGl" ref="canvas" class="em-hero__gl em-rays" aria-hidden="true" />
  <div v-else class="em-rays-css" aria-hidden="true"><i /><i /></div>
</template>
