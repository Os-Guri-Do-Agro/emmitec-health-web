<script setup lang="ts">
/**
 * Hero das páginas internas: o mesmo gradiente vivo do Início, título que entra
 * palavra a palavra e a faixa de meta (texto · rolar · ações), um pouco mais baixo.
 */
import { useI18n } from 'vue-i18n'
import EmHeroGradient from './EmHeroGradient.vue'
import EmSplit from './EmSplit.vue'

withDefaults(defineProps<{ eyebrow: string; title: string; em?: string; subtitle?: string }>(), {
  em: '',
  subtitle: '',
})

const { t } = useI18n()
</script>

<template>
  <header class="em-hero em-hero--page">
    <EmHeroGradient />
    <div v-parallax.fade="0.14" class="em-hero__inner">
      <span v-reveal="100" class="em-chip em-chip--glass"
        ><span class="em-dot em-dot--live" />{{ eyebrow }}</span
      >
      <EmSplit tag="h1" class="em-hero__title" :text="title" :em="em" :delay="200" />
      <div class="em-hero__meta">
        <div v-reveal="900">
          <p v-if="subtitle">{{ subtitle }}</p>
          <slot name="lead" />
        </div>
        <span v-reveal="1100" class="em-hero__scroll">{{ t('hero.scroll') }}<i /></span>
        <div v-reveal="1000" class="em-hero__actions">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </header>
</template>
