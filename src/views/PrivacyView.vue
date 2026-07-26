<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()

const sections = computed(() => tm('privacyPage.sections') as { title: string; body: string }[])
</script>

<template>
  <div class="font-body text-black overflow-x-hidden w-full">
    <section class="bg-dark relative overflow-hidden w-full flex items-center justify-center">
      <div class="privacy-grid absolute inset-0 pointer-events-none opacity-40" />
      <div
        class="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center gap-4 relative z-10"
      >
        <span
          class="inline-block text-[11px] font-bold uppercase text-primary font-display tracking-[2px]"
        >
          {{ t('privacyPage.badge') }}
        </span>
        <h1
          class="font-display font-extrabold text-white leading-[1.08] tracking-tight text-2xl sm:text-3xl lg:text-[44px]"
        >
          {{ t('privacyPage.title') }}
        </h1>
        <p class="text-white/55 text-[14px] sm:text-[16px] leading-relaxed max-w-2xl font-light">
          {{ t('privacyPage.subtitle') }}
        </p>
        <p class="text-white/35 text-[12px]">{{ t('privacyPage.updated') }}</p>
      </div>
    </section>

    <section class="py-14 sm:py-20 bg-white w-full flex items-center justify-center">
      <div class="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        <article
          v-for="(section, i) in sections"
          :key="i"
          class="flex flex-col gap-3"
        >
          <h2 class="font-display font-bold text-black text-[18px] sm:text-[20px] tracking-tight">
            {{ section.title }}
          </h2>
          <p class="text-gray-500 text-[14px] sm:text-[15px] leading-relaxed whitespace-pre-line">
            {{ section.body }}
          </p>
        </article>

        <div class="pt-6 border-t border-gray-100">
          <p class="text-gray-400 text-[13px] leading-relaxed">
            {{ t('privacyPage.contactNote') }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.privacy-grid {
  background-image:
    linear-gradient(rgba(17, 211, 211, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(17, 211, 211, 0.04) 1px, transparent 1px);
  background-size: 64px 64px;
}
</style>
