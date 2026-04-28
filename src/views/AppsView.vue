<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from 'primevue/button'

import {
  Smartphone,
  Stethoscope,
  Bell,
  Calendar,
  MessageSquare,
  HeartPulse,
  Pill,
  Apple,
  Play,
  Check,
  ShieldCheck,
  Zap,
} from 'lucide-vue-next'

const { t } = useI18n()

gsap.registerPlugin(ScrollTrigger)

const heroTitle = ref<HTMLElement | null>(null)
const heroSub = ref<HTMLElement | null>(null)
const heroActions = ref<HTMLElement | null>(null)

const patientAppSection = ref<HTMLElement | null>(null)
const clinicalAppSection = ref<HTMLElement | null>(null)
const featuresSection = ref<HTMLElement | null>(null)
const downloadSection = ref<HTMLElement | null>(null)

const patientFeatures = [
  t('appsPage.patient.feature1'),
  t('appsPage.patient.feature2'),
  t('appsPage.patient.feature3'),
  t('appsPage.patient.feature4'),
]

const clinicalFeatures = [
  t('appsPage.clinical.feature1'),
  t('appsPage.clinical.feature2'),
  t('appsPage.clinical.feature3'),
  t('appsPage.clinical.feature4'),
]

const featureGrid = [
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
]

onMounted(() => {
  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
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
      scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      ...opts,
    })
  }

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
              <Button
                :label="t('appsPage.hero.button.primary')"
                unstyled
                class="btn-primary font-display font-bold"
              />
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

    <!-- ── PATIENT APP ── -->
    <section
      ref="patientAppSection"
      class="py-16 sm:py-20 bg-white w-full flex items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <!-- Phone mockup -->
          <div class="animate-in flex justify-center">
            <div
              class="relative w-64 h-[520px] rounded-[36px] bg-dark border-10 border-dark-2 shadow-[0_28px_72px_rgba(0,0,0,.25)]"
            >
              <!-- Notch -->
              <div
                class="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-dark rounded-b-2xl z-10"
              />
              <div
                class="w-full h-full rounded-[26px] bg-linear-to-br from-dark to-dark-2 overflow-hidden p-4 pt-10 flex flex-col gap-3"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-white/50 text-[10px]">Bom dia</div>
                    <div class="text-white font-display font-bold text-sm">Maria</div>
                  </div>
                  <div
                    class="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center"
                  >
                    <Smartphone :size="16" class="text-primary" />
                  </div>
                </div>

                <div
                  class="rounded-2xl bg-primary/10 border border-primary/20 p-4 flex flex-col gap-2"
                >
                  <div class="flex items-center gap-2">
                    <HeartPulse :size="16" class="text-primary" />
                    <span class="text-white/70 text-[10px] uppercase tracking-wider">Now</span>
                  </div>
                  <div class="flex items-baseline gap-1">
                    <span class="text-white font-display font-extrabold text-3xl">72</span>
                    <span class="text-white/50 text-xs">bpm</span>
                  </div>
                  <div class="text-emerald-400 text-[10px] font-bold">Normal range ✓</div>
                </div>

                <div class="grid grid-cols-2 gap-2">
                  <div class="rounded-xl bg-white/5 border border-white/10 p-3">
                    <div class="text-white/40 text-[9px] uppercase">BP</div>
                    <div class="text-white font-display font-bold text-sm">120/80</div>
                  </div>
                  <div class="rounded-xl bg-white/5 border border-white/10 p-3">
                    <div class="text-white/40 text-[9px] uppercase">SpO₂</div>
                    <div class="text-white font-display font-bold text-sm">98%</div>
                  </div>
                </div>

                <div
                  class="rounded-xl bg-white/5 border border-white/10 p-3 flex items-center gap-2"
                >
                  <Pill :size="14" class="text-primary" />
                  <div class="flex-1">
                    <div class="text-white text-[11px] font-semibold">Atenolol</div>
                    <div class="text-white/40 text-[9px]">14:00 · 25mg</div>
                  </div>
                  <div
                    class="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="animate-in flex flex-col gap-5">
            <span
              class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary"
            >
              {{ t('appsPage.patient.badge') }}
            </span>
            <h2
              class="font-display font-extrabold text-black text-[clamp(24px,3vw,36px)] tracking-tight leading-tight"
            >
              {{ t('appsPage.patient.title') }}
            </h2>
            <p class="text-gray-500 text-[14px] sm:text-[16px] leading-relaxed">
              {{ t('appsPage.patient.description') }}
            </p>
            <ul class="flex flex-col gap-3 mt-2">
              <li
                v-for="f in patientFeatures"
                :key="f"
                class="flex items-start gap-3 text-[14px] text-gray-600"
              >
                <span
                  class="w-5 h-5 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0 mt-0.5 text-primary"
                >
                  <Check :size="12" stroke-width="3" />
                </span>
                {{ f }}
              </li>
            </ul>
            <div class="flex gap-3 flex-wrap mt-4">
              <a
                href="#"
                class="store-badge flex items-center gap-3 px-5 py-3 rounded-xl bg-black text-white"
              >
                <Apple :size="22" />
                <div class="flex flex-col leading-none">
                  <span class="text-[10px] opacity-70">Download on the</span>
                  <span class="font-display font-bold text-sm">App Store</span>
                </div>
              </a>
              <a
                href="#"
                class="store-badge flex items-center gap-3 px-5 py-3 rounded-xl bg-black text-white"
              >
                <Play :size="22" />
                <div class="flex flex-col leading-none">
                  <span class="text-[10px] opacity-70">GET IT ON</span>
                  <span class="font-display font-bold text-sm">Google Play</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CLINICAL APP ── -->
    <section
      ref="clinicalAppSection"
      class="py-16 sm:py-20 bg-mid w-full flex items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <!-- Content -->
          <div class="animate-in flex flex-col gap-5 order-2 lg:order-1">
            <span
              class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary"
            >
              {{ t('appsPage.clinical.badge') }}
            </span>
            <h2
              class="font-display font-extrabold text-black text-[clamp(24px,3vw,36px)] tracking-tight leading-tight"
            >
              {{ t('appsPage.clinical.title') }}
            </h2>
            <p class="text-gray-500 text-[14px] sm:text-[16px] leading-relaxed">
              {{ t('appsPage.clinical.description') }}
            </p>
            <ul class="flex flex-col gap-3 mt-2">
              <li
                v-for="f in clinicalFeatures"
                :key="f"
                class="flex items-start gap-3 text-[14px] text-gray-600"
              >
                <span
                  class="w-5 h-5 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0 mt-0.5 text-primary"
                >
                  <Check :size="12" stroke-width="3" />
                </span>
                {{ f }}
              </li>
            </ul>
            <Button
              :label="t('appsPage.clinical.button')"
              unstyled
              class="btn-primary font-display font-bold mt-4 self-start"
            />
          </div>

          <!-- Dashboard mockup -->
          <div class="animate-in order-1 lg:order-2">
            <div
              class="relative rounded-2xl bg-dark border border-white/10 p-5 shadow-[0_28px_72px_rgba(0,0,0,.25)]"
            >
              <div class="hero-grid absolute inset-0 pointer-events-none opacity-50 rounded-2xl" />
              <div class="relative z-10 flex flex-col gap-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-9 h-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center"
                    >
                      <Stethoscope :size="16" class="text-primary" />
                    </div>
                    <div>
                      <div class="text-white font-display font-bold text-sm">Clinical Suite</div>
                      <div class="text-white/40 text-[10px]">Dashboard</div>
                    </div>
                  </div>
                  <div class="flex gap-1">
                    <span class="w-2 h-2 rounded-full bg-rose-400" />
                    <span class="w-2 h-2 rounded-full bg-amber-400" />
                    <span class="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-3">
                  <div class="rounded-lg bg-white/5 border border-white/10 p-3">
                    <div class="text-white/40 text-[9px] uppercase">Active</div>
                    <div class="text-white font-display font-extrabold text-lg">128</div>
                  </div>
                  <div class="rounded-lg bg-white/5 border border-white/10 p-3">
                    <div class="text-white/40 text-[9px] uppercase">Alerts</div>
                    <div class="text-rose-400 font-display font-extrabold text-lg">3</div>
                  </div>
                  <div class="rounded-lg bg-white/5 border border-white/10 p-3">
                    <div class="text-white/40 text-[9px] uppercase">OK</div>
                    <div class="text-emerald-400 font-display font-extrabold text-lg">125</div>
                  </div>
                </div>

                <div class="rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                  <div
                    v-for="i in 3"
                    :key="i"
                    class="flex items-center gap-3 px-3 py-2.5 border-b border-white/5 last:border-b-0"
                  >
                    <div
                      class="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary text-[10px] font-bold"
                    >
                      P{{ i }}
                    </div>
                    <div class="flex-1">
                      <div class="text-white text-[11px] font-semibold">Patient {{ i }}</div>
                      <div class="text-white/40 text-[9px]">Last reading {{ i }}m ago</div>
                    </div>
                    <span
                      class="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold"
                      >OK</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── FEATURES GRID ── -->
    <section
      ref="featuresSection"
      class="py-16 sm:py-20 bg-white w-full flex items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12 flex flex-col items-center gap-5 pb-10">
          <span
            class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary"
          >
            {{ t('appsPage.features.badge') }}
          </span>
          <h2
            class="font-display font-extrabold text-black text-[clamp(26px,3vw,40px)] tracking-tight"
          >
            {{ t('appsPage.features.title') }}
          </h2>
          <p class="text-gray-500 text-[14px] sm:text-[16px] leading-relaxed max-w-2xl">
            {{ t('appsPage.features.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <article
            v-for="f in featureGrid"
            :key="f.title"
            class="feature-card group rounded-2xl border border-gray-200/80 bg-white p-6 flex flex-col gap-3 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_24px_60px_-20px_rgba(17,211,211,0.35)]"
          >
            <div
              class="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-2"
            >
              <component :is="f.icon" :size="22" />
            </div>
            <h3 class="font-display font-bold text-black text-[16px]">{{ f.title }}</h3>
            <p class="text-gray-500 text-[13px] leading-relaxed">{{ f.desc }}</p>
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
        <div class="download-item flex gap-4 justify-center flex-wrap">
          <a
            href="#"
            class="store-badge flex items-center gap-3 px-6 py-3 rounded-xl bg-white text-dark"
          >
            <Apple :size="24" />
            <div class="flex flex-col leading-none text-left">
              <span class="text-[10px] opacity-70">Download on the</span>
              <span class="font-display font-bold text-sm">App Store</span>
            </div>
          </a>
          <a
            href="#"
            class="store-badge flex items-center gap-3 px-6 py-3 rounded-xl bg-white text-dark"
          >
            <Play :size="24" />
            <div class="flex flex-col leading-none text-left">
              <span class="text-[10px] opacity-70">GET IT ON</span>
              <span class="font-display font-bold text-sm">Google Play</span>
            </div>
          </a>
        </div>
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
