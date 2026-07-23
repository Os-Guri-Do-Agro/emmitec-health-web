<script setup lang="ts">
import logoMarkImg from '@/assets/about/EMMITEC.png'

withDefaults(
  defineProps<{
    /** panel = preenche o painel direito; section = ancora à direita do hero inteiro */
    variant?: 'panel' | 'section'
  }>(),
  { variant: 'panel' },
)
</script>

<template>
  <img
    :src="logoMarkImg"
    alt=""
    aria-hidden="true"
    :class="[
      'hero-logo-mark pointer-events-none absolute select-none object-contain mix-blend-screen',
      variant === 'section' && 'hero-logo-mark--section',
    ]"
    draggable="false"
  />
</template>

<style scoped>
.hero-logo-mark {
  top: -2%;
  left: 4%;
  right: 2%;
  width: auto;
  height: 72%;
  max-width: none;
  object-fit: contain;
  object-position: top center;
  opacity: 0.09;
  z-index: 0;
}

.hero-logo-mark--section {
  left: auto;
  right: -2%;
  object-position: top right;
}
</style>
