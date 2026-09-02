<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import HeroLogoMark from '@/components/HeroLogoMark.vue'

const { t, tm } = useI18n()

const sections = computed(() => tm('privacyPage.sections') as { title: string; body: string }[])
</script>

<template>
  <div class="font-body text-black overflow-x-hidden w-full">
    <section
      class="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden bg-dark sm:min-h-[70vh]"
    >
      <div class="page-hero-aurora pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        class="privacy-grid pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
      />
      <HeroLogoMark variant="section" />
      <div
        class="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-6 pb-20 pt-32 text-center sm:px-8 lg:pb-24 lg:pt-36"
      >
        <span class="eyebrow eyebrow--dark">{{ t('privacyPage.badge') }}</span>
        <h1 class="display-2 text-white">{{ t('privacyPage.title') }}</h1>
        <p class="lead max-w-2xl text-white/55">{{ t('privacyPage.subtitle') }}</p>
        <p class="text-[12px] font-medium text-white/40">{{ t('privacyPage.updated') }}</p>
      </div>
    </section>

    <section class="flex w-full items-center justify-center bg-white py-20 sm:py-24 lg:py-28">
      <div class="mx-auto flex w-full max-w-3xl flex-col gap-12 px-6 sm:px-8">
        <article v-for="(section, i) in sections" :key="i" class="flex flex-col gap-4">
          <h2 class="display-3 text-black">{{ section.title }}</h2>
          <p class="whitespace-pre-line text-[15px] leading-[1.75] text-gray-600">
            {{ section.body }}
          </p>
        </article>

        <div class="border-t border-gray-200/80 pt-8">
          <p class="text-[13.5px] leading-relaxed text-gray-500">
            {{ t('privacyPage.contactNote') }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* mesma assinatura de fundo da hero da home */
.page-hero-aurora {
  background:
    radial-gradient(ellipse 70% 55% at 78% 15%, rgba(17, 211, 211, 0.18), transparent 62%),
    radial-gradient(ellipse 55% 45% at 5% 85%, rgba(74, 168, 255, 0.12), transparent 58%);
}

.privacy-grid {
  background-image:
    linear-gradient(rgba(17, 211, 211, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(17, 211, 211, 0.04) 1px, transparent 1px);
  background-size: 64px 64px;
}
</style>
