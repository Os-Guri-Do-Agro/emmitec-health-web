<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from 'primevue/button'

import emmitecHealthImg from '@/assets/apps/emmitec-health.png'
import emmitecJudicemedImg from '@/assets/apps/emmitec-judicemed.png'
import emmitecHealthBlueImg from '@/assets/apps/emmitec-health-blue.png'
import emmitecCuidemeCareImg from '@/assets/apps/emmitec-cuideme-care.png'
import emmitecLongTermCareImg from '@/assets/apps/emmitec-long-term-care.png'
import emmitecGuardianHealthImg from '@/assets/apps/emmitec-guardian-health.png'

import appStoreWhiteImg from '@/assets/apps/app-store-white.png'
import appStoreBlackImg from '@/assets/apps/app-store-black.png'
import googlePlayWhiteImg from '@/assets/apps/google-play-white.png'
import googlePlayBlackImg from '@/assets/apps/google-play-black.png'

import {
  Smartphone,
  Stethoscope,
  Bell,
  Calendar,
  MessageSquare,
  HeartPulse,
  Pill,
  Check,
  ShieldCheck,
  Zap,
} from 'lucide-vue-next'

const { t } = useI18n()

const calendlyUrl = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `https://calendly.com/emilio-machado-emmitec-health/vamos-nos-reunir-agende-sua-reuniao-online?month=${year}-${month}`
})

gsap.registerPlugin(ScrollTrigger)

const heroTitle = ref<HTMLElement | null>(null)
const heroSub = ref<HTMLElement | null>(null)
const heroActions = ref<HTMLElement | null>(null)

const appsListSection = ref<HTMLElement | null>(null)
const patientAppSection = ref<HTMLElement | null>(null)
const clinicalAppSection = ref<HTMLElement | null>(null)
const featuresSection = ref<HTMLElement | null>(null)
const downloadSection = ref<HTMLElement | null>(null)

const apps = [
  {
    img: emmitecHealthImg,
    name: 'Emmitec Health',
    google: 'https://play.google.com/store/apps/details?id=com.emmitec.wl1&pcampaignid=web_share',
    apple: 'https://apps.apple.com/us/app/emmitec-wl1/id1635668189',
  },
  {
    img: emmitecJudicemedImg,
    name: 'Emmitec Judicemed',
    google: 'https://play.google.com/store/apps/details?id=com.emmitec.jd1&pcampaignid=web_share',
    apple: 'https://apps.apple.com/us/app/emmitec-jd1/id6670299440',
  },
  {
    img: emmitecHealthBlueImg,
    name: 'Emmitec Health Blue',
    google: 'https://play.google.com/store/apps/details?id=com.emmitec.eh1&pcampaignid=web_share',
    apple: 'https://apps.apple.com/us/app/emmitec-eh1/id6740423403',
  },
  {
    img: emmitecCuidemeCareImg,
    name: 'Emmitec Cuideme Care',
    google: null,
    apple: 'https://apps.apple.com/us/app/emmitec-cc1/id6738710484',
  },
  {
    img: emmitecGuardianHealthImg,
    name: 'Emmitec Guardian Health',
    google: 'https://play.google.com/store/apps/details?id=com.emmitec.gd1&pcampaignid=web_share',
    apple: null,
  },
  {
    img: emmitecLongTermCareImg,
    name: 'Emmitec Long Term Care',
    google: 'https://play.google.com/store/apps/details?id=com.emmitec.lt1&pcampaignid=web_share',
    apple: 'https://apps.apple.com/us/app/emmitec-lt1/id6743580958',
  },
]

const patientFeatures = computed(() => [
  t('appsPage.patient.feature1'),
  t('appsPage.patient.feature2'),
  t('appsPage.patient.feature3'),
  t('appsPage.patient.feature4'),
])

const clinicalFeatures = computed(() => [
  t('appsPage.clinical.feature1'),
  t('appsPage.clinical.feature2'),
  t('appsPage.clinical.feature3'),
  t('appsPage.clinical.feature4'),
])

const featureGrid = computed(() => [
  {
    icon: Bell,
    title: t('appsPage.features.card1.title'),
    desc: t('appsPage.features.card1.desc'),
  },
  {
    icon: ShieldCheck,
    title: t('appsPage.features.card2.title'),
    desc: t('appsPage.features.card2.desc'),
  },
  { icon: Zap, title: t('appsPage.features.card3.title'), desc: t('appsPage.features.card3.desc') },
  {
    icon: MessageSquare,
    title: t('appsPage.features.card4.title'),
    desc: t('appsPage.features.card4.desc'),
  },
  {
    icon: Calendar,
    title: t('appsPage.features.card5.title'),
    desc: t('appsPage.features.card5.desc'),
  },
  {
    icon: Pill,
    title: t('appsPage.features.card6.title'),
    desc: t('appsPage.features.card6.desc'),
  },
])

onMounted(() => {
  gsap
    .timeline({ defaults: { ease: 'power3.out', clearProps: 'opacity,transform' } })
    .from(heroTitle.value, { opacity: 0, y: 34, duration: 0.8 })
    .from(heroSub.value, { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
    .from(heroActions.value, { opacity: 0, y: 20, duration: 0.6 }, '-=0.35')

  const animate = (el: HTMLElement | null, selector: string, opts: gsap.TweenVars = {}) => {
    if (!el) return
    gsap.from(el.querySelectorAll(selector), {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.7,
      ease: 'power3.out',
      clearProps: 'opacity,transform',
      scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      ...opts,
    })
  }

  animate(appsListSection.value, '.app-card', { stagger: 0.1 })
  animate(patientAppSection.value, '.animate-in')
  animate(clinicalAppSection.value, '.animate-in')
  animate(featuresSection.value, '.feature-card', { stagger: 0.08 })
  animate(downloadSection.value, '.download-item', { stagger: 0.12 })
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((t) => t.kill())
})
</script>

<template>
  <div class="font-body text-black overflow-x-hidden w-full">
    <!-- ── HERO ── -->
    <section class="min-h-[60vh] sm:min-h-[70vh] bg-dark relative overflow-hidden w-full">
      <div class="hero-grid absolute inset-0 pointer-events-none" />

      <div class="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh] sm:min-h-[70vh] w-full">
        <div
          class="flex flex-col justify-center items-end px-4 sm:px-6 lg:px-12 xl:px-20 py-20 lg:py-0 z-10"
        >
          <div class="w-full max-w-xl flex flex-col gap-5">
            <span
              class="inline-block text-[11px] font-bold uppercase text-primary font-display tracking-[2px]"
            >
              {{ t('appsPage.hero.badge') }}
            </span>
            <h1
              ref="heroTitle"
              class="font-display font-extrabold text-white leading-[1.08] tracking-tight text-xl sm:text-2xl lg:text-[34px]"
            >
              {{ t('appsPage.hero.title') }}
            </h1>
            <p
              ref="heroSub"
              class="text-white/50 text-[12px] sm:text-[14px] leading-relaxed max-w-md font-light"
            >
              {{ t('appsPage.hero.subtitle') }}
            </p>
            <div ref="heroActions" class="flex gap-4 flex-wrap mt-4">
              <a :href="calendlyUrl" target="_blank" rel="noopener noreferrer">
                <Button
                  label="Solicitar Demonstração"
                  unstyled
                  class="btn-primary font-display font-bold"
                />
              </a>
              <Button
                :label="t('appsPage.hero.button.secondary') + ' →'"
                unstyled
                class="btn-ghost font-display font-bold"
              />
            </div>
          </div>
        </div>

        <!-- Right visual: phone mockups -->
        <div class="hidden lg:flex relative h-full items-center justify-center p-12">
          <div class="relative">
            <!-- Back phone -->
            <div
              class="absolute -left-12 top-8 w-44 h-[330px] rounded-[28px] bg-dark-2 border border-white/10 p-3 rotate-[-8deg] shadow-2xl"
            >
              <div
                class="w-full h-full rounded-[22px] bg-linear-to-br from-primary/10 to-transparent border border-white/5 p-4 flex flex-col gap-3"
              >
                <div class="flex items-center gap-2">
                  <Stethoscope :size="14" class="text-primary" />
                  <span class="text-white font-display font-bold text-[10px]">Clinical</span>
                </div>
                <div class="rounded-lg bg-white/5 p-2">
                  <div class="text-white/40 text-[8px] uppercase">Patients</div>
                  <div class="text-white font-display font-extrabold text-lg">128</div>
                </div>
              </div>
            </div>
            <!-- Front phone -->
            <div
              class="relative w-48 h-[360px] rounded-[28px] bg-dark-2 border border-white/15 p-3 shadow-2xl rotate-6"
            >
              <div
                class="w-full h-full rounded-[22px] bg-linear-to-br from-primary/15 to-transparent border border-white/5 p-4 flex flex-col gap-3"
              >
                <div class="flex items-center gap-2">
                  <HeartPulse :size="14" class="text-primary" />
                  <span class="text-white font-display font-bold text-[10px]">My Health</span>
                </div>
                <div class="rounded-lg bg-white/5 p-2">
                  <div class="text-white/40 text-[8px] uppercase">Heart Rate</div>
                  <div class="text-white font-display font-extrabold text-lg">72 bpm</div>
                </div>
                <div class="rounded-lg bg-white/5 p-2">
                  <div class="text-white/40 text-[8px] uppercase">Today</div>
                  <div class="text-emerald-400 font-display font-bold text-xs">All good ✓</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── APPS SUITE ── -->
    <section
      ref="appsListSection"
      class="py-16 sm:py-20 bg-mid relative overflow-hidden w-full flex items-center justify-center"
    >
      <div class="hero-grid absolute inset-0 pointer-events-none opacity-40" />
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center mb-12 flex flex-col items-center gap-4 pb-5">
          <span
            class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary"
          >
            {{ t('appsPage.suite.badge') }}
          </span>
          <h2
            class="font-display font-extrabold text-dark text-[clamp(24px,3vw,38px)] tracking-tight leading-tight"
          >
            {{ t('appsPage.suite.title') }}
          </h2>
          <p class="text-dark/50 text-[14px] sm:text-[16px] leading-relaxed max-w-2xl">
            {{ t('appsPage.suite.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <article
            v-for="app in apps"
            :key="app.name"
            class="app-card group rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_20px_60px_-16px_rgba(17,211,211,0.2)]"
          >
            <div class="relative overflow-hidden">
              <img
                :src="app.img"
                :alt="app.name"
                class="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div
                class="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-dark-2 to-transparent pointer-events-none"
              />
            </div>
            <div class="px-5 py-4 flex items-center justify-between gap-4 flex-wrap bg-dark">
              <span class="font-display font-bold text-white text-[15px]">{{ app.name }}</span>
              <div class="flex gap-2 flex-wrap">
                <a
                  v-if="app.apple"
                  :href="app.apple"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="store-badge"
                >
                  <img :src="appStoreWhiteImg" alt="Download on the App Store" class="h-9" />
                </a>
                <a
                  v-if="app.google"
                  :href="app.google"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="store-badge"
                >
                  <img :src="googlePlayWhiteImg" alt="Get it on Google Play" class="h-9" />
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ── DOWNLOAD CTA ── -->
    <section
      ref="downloadSection"
      class="bg-dark py-16 sm:py-[80px] relative overflow-hidden w-full flex items-center justify-center"
    >
      <div
        class="absolute -top-48 left-1/2 -translate-x-1/2 w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] lg:w-[680px] lg:h-[680px] rounded-full pointer-events-none cta-glow"
      />
      <div
        class="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          class="cta-ghost font-display font-extrabold tracking-[-0.05em] whitespace-nowrap leading-[0.8]"
        >
          EMMITEC&nbsp;HEALTH
        </span>
      </div>
      <div
        class="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 flex flex-col gap-5 items-center justify-center"
      >
        <span
          class="download-item inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary"
        >
          {{ t('appsPage.cta.badge') }}
        </span>
        <h2
          class="download-item font-display font-extrabold text-white mt-2 mb-4 text-[clamp(24px,2.5vw,40px)] leading-tight tracking-tight"
        >
          {{ t('appsPage.cta.title') }}
        </h2>
        <p
          class="download-item text-white/45 text-[14px] sm:text-[16px] leading-relaxed mb-8 max-w-2xl mx-auto"
        >
          {{ t('appsPage.cta.subtitle') }}
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero-grid {
  background-image:
    linear-gradient(rgba(17, 211, 211, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(17, 211, 211, 0.04) 1px, transparent 1px);
  background-size: 64px 64px;
}

.cta-glow {
  background: radial-gradient(circle, rgba(17, 211, 211, 0.08) 0%, transparent 70%);
}

.cta-ghost {
  font-size: clamp(120px, 20vw, 340px);
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.07);
  letter-spacing: -0.05em;
}

.store-badge {
  transition:
    transform 0.25s,
    box-shadow 0.25s;
}
.store-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
}

:deep(.btn-primary),
.btn-primary {
  background: #11d3d3;
  color: #0e1117;
  font-size: 13px;
  font-weight: 700 !important;
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: inline-block;
  transition:
    box-shadow 0.25s,
    transform 0.25s;
}
:deep(.btn-primary:hover),
.btn-primary:hover {
  box-shadow: 0 8px 32px rgba(17, 211, 211, 0.35);
  transform: translateY(-2px);
}

:deep(.btn-ghost),
.btn-ghost {
  background: transparent;
  color: rgba(255, 255, 255, 0.75);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 700 !important;
  font-size: 13px;
  padding: 10px 24px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  cursor: pointer;
  display: inline-block;
  transition:
    border-color 0.25s,
    color 0.25s;
}
:deep(.btn-ghost:hover),
.btn-ghost:hover {
  border-color: #11d3d3;
  color: #11d3d3;
}
</style>
