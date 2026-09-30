<script setup lang="ts">
/** Gradiente 2D suave e vivo, usado no rodapé e no card de CTA. */
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { softShader } from '@/lib/gradient'

const props = withDefaults(defineProps<{ veil?: number }>(), { veil: 0.2 })
const canvas = ref<HTMLCanvasElement | null>(null)
let cleanup: (() => void) | null = null

onMounted(() => {
  if (canvas.value) cleanup = softShader(canvas.value, props.veil)
})
onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <canvas ref="canvas" class="em-shader" aria-hidden="true" />
</template>
