<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from 'primevue/button'

import {
  ArrowRight,
  HeartHandshake,
  Home,
  Clock,
  Smile,
  TrendingDown,
  Users,
  Activity,
  Check,
  Minus,
  Building2,
  DollarSign,
  Sparkles,
} from 'lucide-vue-next'

import HeroLogoMark from '@/components/HeroLogoMark.vue'

const { t, locale } = useI18n()

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
const benefitsVisual = ref<HTMLElement | null>(null)

const patientSection = ref<HTMLElement | null>(null)
const clinicSection = ref<HTMLElement | null>(null)
const statsSection = ref<HTMLElement | null>(null)
const comparisonSection = ref<HTMLElement | null>(null)

// Mock de painel — animado ao entrar em tela
const dashboardCard = ref<HTMLElement | null>(null)
const dashActive = ref<HTMLElement | null>(null)
const dashSaved = ref<HTMLElement | null>(null)
const dashBars = ref<HTMLElement | null>(null)
const dashAdherence = ref<HTMLElement | null>(null)
const dashAdherenceBar = ref<HTMLElement | null>(null)

const weeklyBars = [38, 62, 45, 78, 55, 88, 70]

const numberLocale: Record<string, string> = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' }
function formatCount(value: number) {
  return Math.round(value).toLocaleString(numberLocale[locale.value] ?? 'pt-BR')
}

const patientBenefits = computed(() => [
  {
    icon: Home,
    title: t('benefitsPage.patient.card1.title'),
    desc: t('benefitsPage.patient.card1.desc'),
  },
  {
    icon: Clock,
    title: t('benefitsPage.patient.card2.title'),
    desc: t('benefitsPage.patient.card2.desc'),
  },
  {
    icon: Smile,
    title: t('benefitsPage.patient.card3.title'),
    desc: t('benefitsPage.patient.card3.desc'),
  },
  {
    icon: HeartHandshake,
    title: t('benefitsPage.patient.card4.title'),
    desc: t('benefitsPage.patient.card4.desc'),
  },
])

const clinicItems = computed(() => [
  t('benefitsPage.clinic.item1'),
  t('benefitsPage.clinic.item2'),
  t('benefitsPage.clinic.item3'),
  t('benefitsPage.clinic.item4'),
  t('benefitsPage.clinic.item5'),
])

const stats = computed(() => [
  { num: '-38%', label: t('benefitsPage.stats.readmissions'), icon: TrendingDown },
  { num: '+62%', label: t('benefitsPage.stats.adherence'), icon: Activity },
  { num: '4.8/5', label: t('benefitsPage.stats.satisfaction'), icon: Smile },
  { num: '24/7', label: t('benefitsPage.stats.monitoring'), icon: Clock },
])

const comparison = computed(() =>
  [1, 2, 3, 4, 5].map((n) => ({
    label: t(`benefitsPage.comparison.row${n}`),
    traditional: t(`benefitsPage.comparison.row${n}trad`),
    rpm: t(`benefitsPage.comparison.row${n}rpm`),
  })),
)

function animateDashboard() {
  const card = dashboardCard.value
  if (!card) return

  const reduced =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const bars = dashBars.value?.querySelectorAll<HTMLElement>('.dash-bar') ?? []
  const setFinalState = () => {
    if (dashActive.value) dashActive.value.textContent = formatCount(1284)
    if (dashSaved.value) dashSaved.value.textContent = '$420K'
    if (dashAdherence.value) dashAdherence.value.textContent = '87%'
    if (dashAdherenceBar.value) dashAdherenceBar.value.style.width = '87%'
    bars.forEach((b) => (b.style.height = b.style.getPropertyValue('--bar-h')))
  }

  if (reduced) {
    setFinalState()
    return
  }

  const counters = { active: 0, saved: 0, adherence: 0 }
  const tl = gsap.timeline({
    defaults: { ease: 'power2.out' },
    scrollTrigger: { trigger: card, start: 'top 82%', once: true },
  })

  tl.to(counters, {
    active: 1284,
    duration: 1.5,
    onUpdate: () => {
      if (dashActive.value) dashActive.value.textContent = formatCount(counters.active)
    },
  })
    .to(
      counters,
      {
        saved: 420,
        duration: 1.5,
        onUpdate: () => {
          if (dashSaved.value) dashSaved.value.textContent = `$${Math.round(counters.saved)}K`
        },
      },
      0,
    )
    .fromTo(
      bars,
      { height: '0%' },
      { height: (i: number) => `${weeklyBars[i]}%`, duration: 0.7, stagger: 0.07 },
      0.25,
    )
    .to(
      counters,
      {
        adherence: 87,
        duration: 1.2,
        onUpdate: () => {
          if (dashAdherence.value)
            dashAdherence.value.textContent = `${Math.round(counters.adherence)}%`
          if (dashAdherenceBar.value) dashAdherenceBar.value.style.width = `${counters.adherence}%`
        },
      },
      0.5,
    )
}

onMounted(() => {
  gsap
    .timeline({ defaults: { ease: 'power3.out', clearProps: 'opacity,transform' } })
    .from(heroTitle.value, { opacity: 0, y: 34, duration: 0.8 })
    .from(heroSub.value, { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
    .from(heroActions.value, { opacity: 0, y: 20, duration: 0.6 }, '-=0.35')

  if (benefitsVisual.value) {
    const root = benefitsVisual.value
    const hub = root.querySelector('.benefit-hub')
    const orbit = root.querySelector('.benefit-orbit')
    const glow = root.querySelector('.benefit-glow')
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.benefit-chip'))
    const nums = root.querySelectorAll<HTMLElement>('.benefit-num')

    gsap.set([hub, glow, orbit, ...cards], { opacity: 0 })
    gsap.set(hub, { scale: 0.7 })
    gsap.set(cards, { y: 18, scale: 0.94 })

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.to(glow, { opacity: 1, duration: 0.7 }, 0.2)
      .to(orbit, { opacity: 1, duration: 0.6 }, 0.25)
      .to(hub, { opacity: 1, scale: 1, duration: 0.75, ease: 'back.out(1.6)' }, 0.3)
      .to(cards, { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.14 }, 0.5)

    nums.forEach((el) => {
      const target = Number(el.dataset.value)
      const prefix = el.dataset.prefix ?? ''
      const suffix = el.dataset.suffix ?? ''
      const decimals = Number(el.dataset.decimals ?? 0)
      if (Number.isNaN(target)) return
      const state = { value: 0 }
      tl.to(
        state,
        {
          value: target,
          duration: 1.15,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${prefix}${state.value.toFixed(decimals)}${suffix}`
          },
        },
        0.75,
      )
    })

    // Idle: soft float
    cards.forEach((card, i) => {
      gsap.to(card, {
        y: i % 2 === 0 ? -6 : 6,
        duration: 3 + i * 0.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2 + i * 0.2,
      })
    })

    // Idle: orbit drift
    gsap.to(orbit, {
      rotation: 360,
      duration: 40,
      ease: 'none',
      repeat: -1,
    })

    // Idle: glow breathe
    gsap.to(glow, {
      scale: 1.12,
      opacity: 0.55,
      duration: 2.6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.8,
    })

    // Idle: highlight each benefit in turn
    const spotlight = gsap.timeline({ repeat: -1, delay: 2.6 })
    cards.forEach((card) => {
      spotlight
        .to(card, {
          boxShadow: '0 16px 40px rgba(17,211,211,0.22)',
          filter: 'brightness(1.12)',
          duration: 0.4,
        })
        .to(card, {
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          filter: 'brightness(1)',
          duration: 0.4,
          delay: 1.15,
        })
    })
  }

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

  animate(patientSection.value, '.patient-card', { stagger: 0.08 })
  animate(clinicSection.value, '.animate-in')
  animate(statsSection.value, '.stat-item', { stagger: 0.08, y: 24 })
  animate(comparisonSection.value, '.comparison-row', { stagger: 0.06, y: 16 })

  animateDashboard()
})

onUnmounted(() => {
  if (benefitsVisual.value) gsap.killTweensOf(benefitsVisual.value.querySelectorAll('*'))
  ScrollTrigger.getAll().forEach((t) => t.kill())
})
</script>

<template>
  <div class="font-body text-black overflow-x-hidden w-full">
    <!-- ── HERO ── -->
    <section class="min-h-[60vh] sm:min-h-[70vh] bg-dark relative overflow-hidden w-full">
      <div class="page-hero-aurora pointer-events-none absolute inset-0" aria-hidden="true" />
      <div class="hero-grid absolute inset-0 pointer-events-none" />
      <HeroLogoMark variant="section" />

      <div class="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh] sm:min-h-[70vh] w-full">
        <div
          class="z-10 flex flex-col justify-center px-6 pb-16 pt-28 sm:px-8 sm:pt-32 lg:items-end lg:px-12 lg:pb-20 lg:pt-32 xl:px-20"
        >
          <div class="w-full max-w-xl flex flex-col gap-5">
            <span class="eyebrow eyebrow--dark">
              {{ t('benefitsPage.hero.badge') }}
            </span>
            <h1 ref="heroTitle" class="display-2 text-white">
              {{ t('benefitsPage.hero.title') }}
            </h1>
            <p ref="heroSub" class="lead max-w-xl text-white/55">
              {{ t('benefitsPage.hero.subtitle') }}
            </p>
            <div ref="heroActions" class="flex gap-4 flex-wrap mt-4">
              <a :href="calendlyUrl" target="_blank" rel="noopener noreferrer">
                <Button
                  :label="t('benefitsPage.hero.button.primary')"
                  unstyled
                  class="btn-primary font-display font-bold"
                />
              </a>
            </div>
          </div>
        </div>

        <!-- Right visual: floating benefit chips -->
        <div class="hidden lg:flex relative h-full items-center justify-center p-10 xl:p-14">
          <div
            ref="benefitsVisual"
            class="benefit-visual relative z-10 h-[360px] w-full max-w-[420px]"
          >
            <div
              class="benefit-glow absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full"
            />
            <div
              class="benefit-orbit absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              aria-hidden="true"
            />

            <div class="benefit-chip benefit-chip--tl">
              <div class="benefit-chip-icon benefit-chip-icon--teal">
                <TrendingDown :size="18" stroke-width="2.2" />
              </div>
              <div>
                <div
                  class="benefit-num font-display text-[17px] font-extrabold leading-none text-white"
                  data-prefix="-"
                  data-suffix="%"
                  data-value="38"
                  data-decimals="0"
                >
                  -0%
                </div>
                <div class="mt-1 text-[11px] text-white/45">
                  {{ t('benefitsPage.stats.readmissions') }}
                </div>
              </div>
            </div>

            <div class="benefit-chip benefit-chip--tr">
              <div class="benefit-chip-icon benefit-chip-icon--emerald">
                <Smile :size="18" stroke-width="2.2" />
              </div>
              <div>
                <div
                  class="benefit-num font-display text-[17px] font-extrabold leading-none text-white"
                  data-suffix="/5"
                  data-value="4.8"
                  data-decimals="1"
                >
                  0/5
                </div>
                <div class="mt-1 text-[11px] text-white/45">
                  {{ t('benefitsPage.stats.satisfaction') }}
                </div>
              </div>
            </div>

            <div class="benefit-chip benefit-chip--bl">
              <div class="benefit-chip-icon benefit-chip-icon--blue">
                <Clock :size="18" stroke-width="2.2" />
              </div>
              <div>
                <div class="font-display text-[17px] font-extrabold leading-none text-white">
                  24/7
                </div>
                <div class="mt-1 text-[11px] text-white/45">
                  {{ t('benefitsPage.stats.monitoring') }}
                </div>
              </div>
            </div>

            <div class="benefit-chip benefit-chip--br">
              <div class="benefit-chip-icon benefit-chip-icon--rose">
                <Activity :size="18" stroke-width="2.2" />
              </div>
              <div>
                <div
                  class="benefit-num font-display text-[17px] font-extrabold leading-none text-white"
                  data-prefix="+"
                  data-suffix="%"
                  data-value="62"
                  data-decimals="0"
                >
                  +0%
                </div>
                <div class="mt-1 text-[11px] text-white/45">
                  {{ t('benefitsPage.stats.adherence') }}
                </div>
              </div>
            </div>

            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div class="benefit-hub">
                <Sparkles :size="34" class="text-primary" stroke-width="2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── PATIENT BENEFITS ── -->
    <section
      ref="patientSection"
      class="py-20 sm:py-24 lg:py-28 bg-white w-full flex items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div class="mx-auto mb-16 flex max-w-3xl flex-col items-center gap-6 text-center">
          <span class="eyebrow eyebrow--light">
            {{ t('benefitsPage.patient.badge') }}
          </span>
          <h2 class="display-2 text-black">
            {{ t('benefitsPage.patient.title') }}
          </h2>
          <p class="lead max-w-2xl text-gray-500">
            {{ t('benefitsPage.patient.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          <article
            v-for="b in patientBenefits"
            :key="b.title"
            class="patient-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/35 hover:shadow-[0_26px_58px_-28px_rgba(17,211,211,0.5)]"
          >
            <span
              class="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-linear-to-r from-primary to-primary/10 transition-transform duration-500 group-hover:scale-x-100"
              aria-hidden="true"
            />
            <div
              class="flex h-13 w-13 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary transition-all duration-400 group-hover:bg-primary group-hover:text-dark"
            >
              <component :is="b.icon" :size="24" stroke-width="2.1" aria-hidden="true" />
            </div>
            <h3 class="mt-6 font-display text-[16px] font-bold tracking-tight text-black">
              {{ b.title }}
            </h3>
            <p class="mt-3.5 text-[13.5px] leading-relaxed text-muted">{{ b.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ── CLINIC BENEFITS (split) ── -->
    <section
      ref="clinicSection"
      class="py-20 sm:py-24 lg:py-28 bg-mid w-full flex items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div class="animate-in flex flex-col items-start gap-6">
            <span class="eyebrow eyebrow--light">
              {{ t('benefitsPage.clinic.badge') }}
            </span>
            <h2 class="display-2 text-black">
              {{ t('benefitsPage.clinic.title') }}
            </h2>
            <p class="max-w-[62ch] text-[15.5px] leading-[1.75] text-gray-500">
              {{ t('benefitsPage.clinic.description') }}
            </p>
            <ul class="m-0 w-full max-w-xl list-none p-0">
              <li
                v-for="item in clinicItems"
                :key="item"
                class="clinic-row group flex items-start gap-4 border-t border-gray-300/50 py-4"
              >
                <span
                  class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/25 transition-all duration-300 group-hover:bg-primary group-hover:text-dark"
                >
                  <Check :size="13" stroke-width="3" aria-hidden="true" />
                </span>
                <span class="text-[14.5px] leading-relaxed text-gray-700">{{ item }}</span>
              </li>
            </ul>
            <a
              :href="calendlyUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary font-display mt-2"
            >
              {{ t('benefitsPage.hero.button.primary') }}
              <ArrowRight :size="16" stroke-width="2.5" aria-hidden="true" />
            </a>
          </div>

          <div class="animate-in">
            <div
              ref="dashboardCard"
              class="dashboard-card relative rounded-2xl overflow-hidden bg-linear-to-br from-dark to-dark-2 p-8 shadow-[0_28px_72px_rgba(0,0,0,.18)]"
            >
              <div class="hero-grid absolute inset-0 pointer-events-none opacity-50" />
              <div class="relative z-10 flex flex-col gap-5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center"
                    >
                      <Building2 :size="18" class="text-primary" />
                    </div>
                    <div>
                      <div class="text-white font-display font-bold text-sm">Hospital ABC</div>
                      <div class="text-white/40 text-xs">
                        {{ t('benefitsPage.clinic.dashboard.subtitle') }}
                      </div>
                    </div>
                  </div>
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400"
                  >
                    <span class="dash-live-dot" aria-hidden="true" />
                    {{ t('benefitsPage.clinic.dashboard.live') }}
                  </span>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div class="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div class="mb-2 flex items-center gap-2">
                      <Users :size="14" class="text-primary" aria-hidden="true" />
                      <span class="text-[10.5px] uppercase tracking-wider text-white/60">
                        {{ t('benefitsPage.clinic.dashboard.active') }}
                      </span>
                    </div>
                    <div
                      ref="dashActive"
                      class="font-display text-2xl font-extrabold tabular-nums text-white"
                    >
                      0
                    </div>
                    <div class="mt-1 text-xs text-emerald-400">
                      {{ t('benefitsPage.clinic.dashboard.activeDelta') }}
                    </div>
                  </div>
                  <div class="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div class="mb-2 flex items-center gap-2">
                      <DollarSign :size="14" class="text-primary" aria-hidden="true" />
                      <span class="text-[10.5px] uppercase tracking-wider text-white/60">
                        {{ t('benefitsPage.clinic.dashboard.saved') }}
                      </span>
                    </div>
                    <div
                      ref="dashSaved"
                      class="font-display text-2xl font-extrabold tabular-nums text-white"
                    >
                      $0K
                    </div>
                    <div class="mt-1 text-xs text-emerald-400">
                      {{ t('benefitsPage.clinic.dashboard.savedNote') }}
                    </div>
                  </div>
                </div>

                <!-- Telemetria da semana: barras que sobem quando a seção entra em tela -->
                <div class="rounded-xl border border-white/10 bg-white/5 p-4">
                  <span class="text-[10.5px] uppercase tracking-wider text-white/60">
                    {{ t('benefitsPage.clinic.dashboard.weekly') }}
                  </span>
                  <div ref="dashBars" class="mt-3.5 flex h-16 items-end gap-1.5">
                    <span
                      v-for="(h, i) in weeklyBars"
                      :key="i"
                      class="dash-bar flex-1 rounded-sm"
                      :style="{ '--bar-h': h + '%' }"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div class="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  <div class="flex items-center justify-between">
                    <span class="text-[10.5px] uppercase tracking-wider text-white/60">
                      {{ t('benefitsPage.clinic.dashboard.adherence') }}
                    </span>
                    <span
                      ref="dashAdherence"
                      class="font-display text-sm font-bold tabular-nums text-white"
                    >
                      0%
                    </span>
                  </div>
                  <div class="h-2 overflow-hidden rounded-full bg-white/10">
                    <div ref="dashAdherenceBar" class="h-full w-0 rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── STATS ── -->
    <section
      ref="statsSection"
      class="relative flex w-full items-center justify-center overflow-hidden bg-dark py-20 sm:py-24 lg:py-28"
    >
      <div class="hero-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div class="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <div class="mx-auto mb-16 flex max-w-3xl flex-col items-center gap-6 text-center">
          <span class="eyebrow eyebrow--dark">
            {{ t('benefitsPage.stats.badge') }}
          </span>
          <h2 class="display-2 text-white">
            {{ t('benefitsPage.stats.title') }}
          </h2>
        </div>

        <div class="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          <div
            v-for="s in stats"
            :key="s.label"
            class="stat-item flex flex-col items-center text-center"
          >
            <span
              class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/20"
            >
              <component :is="s.icon" :size="20" stroke-width="2.2" aria-hidden="true" />
            </span>
            <div class="benefit-stat-num mt-5">{{ s.num }}</div>
            <div class="mt-2.5 text-[12.5px] font-medium leading-snug text-white/55">
              {{ s.label }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── COMPARISON ── -->
    <section
      ref="comparisonSection"
      class="py-20 sm:py-24 lg:py-28 bg-mid w-full flex items-center justify-center"
    >
      <div class="mx-auto w-full max-w-5xl px-6 sm:px-8 lg:px-10">
        <div class="mx-auto mb-16 flex max-w-3xl flex-col items-center gap-6 text-center">
          <span class="eyebrow eyebrow--light">
            {{ t('benefitsPage.comparison.badge') }}
          </span>
          <h2 class="display-2 text-black">
            {{ t('benefitsPage.comparison.title') }}
          </h2>
          <p class="lead max-w-2xl text-gray-500">
            {{ t('benefitsPage.comparison.subtitle') }}
          </p>
        </div>

        <!-- O destaque da coluna RPM fica na própria célula: alinha sempre com a grade -->
        <div
          class="comparison-table overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_16px_44px_-20px_rgba(15,23,42,0.2)]"
        >
          <!-- Cabeçalho só faz sentido quando há colunas lado a lado -->
          <div
            class="hidden border-b border-gray-200/80 bg-gray-50/70 font-display text-[10.5px] font-bold uppercase tracking-[0.16em] text-gray-400 md:grid md:grid-cols-[1.05fr_1fr_1fr]"
          >
            <div class="px-7 py-4">{{ t('benefitsPage.comparison.feature') }}</div>
            <div class="px-7 py-4">{{ t('benefitsPage.comparison.traditional') }}</div>
            <div class="cell-rpm cell-rpm--head px-7 py-4 text-primary">RPM</div>
          </div>

          <div
            v-for="(row, i) in comparison"
            :key="i"
            class="comparison-row grid grid-cols-1 border-b border-gray-100 last:border-b-0 md:grid-cols-[1.05fr_1fr_1fr]"
          >
            <div class="px-7 pb-3 pt-6 md:flex md:items-center md:py-7">
              <h3 class="font-display text-[15px] font-bold leading-snug tracking-tight text-black">
                {{ row.label }}
              </h3>
            </div>

            <div class="px-7 pb-4 md:flex md:items-center md:py-7">
              <div>
                <span class="comparison-tag block md:hidden">
                  {{ t('benefitsPage.comparison.traditional') }}
                </span>
                <p class="mt-1.5 flex items-start gap-3 md:mt-0">
                  <span class="comparison-mark comparison-mark--off" aria-hidden="true">
                    <Minus :size="13" stroke-width="3.5" />
                  </span>
                  <span class="text-[14px] leading-relaxed text-gray-500">
                    {{ row.traditional }}
                  </span>
                </p>
              </div>
            </div>

            <div class="cell-rpm px-7 pb-6 pt-4 md:flex md:items-center md:py-7">
              <div>
                <span class="comparison-tag block text-primary md:hidden">RPM</span>
                <p class="mt-1.5 flex items-start gap-3 md:mt-0">
                  <span class="comparison-mark comparison-mark--on" aria-hidden="true">
                    <Check :size="13" stroke-width="3.5" />
                  </span>
                  <span class="text-[14.5px] font-semibold leading-relaxed text-gray-900">
                    {{ row.rpm }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA ── -->
    <section
      class="bg-dark py-20 sm:py-24 lg:py-28 relative overflow-hidden w-full flex items-center justify-center"
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
        <span class="eyebrow eyebrow--dark">
          {{ t('benefitsPage.cta.badge') }}
        </span>
        <h2 class="display-2 mt-2 mb-4 text-white">
          {{ t('benefitsPage.cta.title') }}
        </h2>
        <p class="text-white/45 text-[14px] sm:text-[16px] leading-relaxed mb-8 max-w-2xl mx-auto">
          {{ t('benefitsPage.cta.subtitle') }}
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <a :href="calendlyUrl" target="_blank" rel="noopener noreferrer">
            <Button
              :label="t('benefitsPage.cta.button.primary')"
              unstyled
              class="btn-primary font-display px-8 py-3"
            />
          </a>
          <RouterLink to="/about" class="btn-ghost font-display group">
            {{ t('benefitsPage.cta.button.secondary') }}
            <ArrowRight
              :size="16"
              stroke-width="2.5"
              aria-hidden="true"
              class="transition-transform duration-300 group-hover:translate-x-1"
            />
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Coluna RPM: faixa contínua feita célula a célula, sem overlay desalinhado */
.cell-rpm {
  background: rgba(17, 211, 211, 0.05);
  box-shadow: inset 1px 0 0 rgba(17, 211, 211, 0.16);
}
.cell-rpm--head {
  background: rgba(17, 211, 211, 0.1);
  box-shadow:
    inset 1px 0 0 rgba(17, 211, 211, 0.16),
    inset 0 2px 0 #11d3d3;
}
@media (max-width: 767px) {
  .cell-rpm {
    box-shadow: inset 0 1px 0 rgba(17, 211, 211, 0.16);
  }
}

/* NÃO usar display aqui: CSS scoped fica fora de layer e venceria o md:hidden */
.comparison-tag {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #9ca3af;
}

/* Marcadores de cada coluna */
.comparison-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  margin-top: 1px;
  border-radius: 7px;
}
.comparison-mark--off {
  background: #f3f4f6;
  color: #9ca3af;
}
.comparison-mark--on {
  background: rgba(17, 211, 211, 0.16);
  color: #0aa3a8;
}

/* ─── Mock de painel clínico ─── */
.dashboard-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
}
/* brilho suave que atravessa o card, sugerindo dado chegando */
.dashboard-card::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    100deg,
    transparent 35%,
    rgba(17, 211, 211, 0.07) 50%,
    transparent 65%
  );
  transform: translateX(-100%);
  animation: dash-sweep 6s ease-in-out infinite;
}

.dash-live-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  border-radius: 999px;
  background: currentColor;
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6);
  animation: dash-live-pulse 2.1s ease-out infinite;
}

.dash-bar {
  height: 0;
  min-height: 3px;
  background: linear-gradient(180deg, #11d3d3, rgba(17, 211, 211, 0.25));
  transition: none;
}

@keyframes dash-sweep {
  0%,
  55% {
    transform: translateX(-100%);
  }
  85%,
  100% {
    transform: translateX(100%);
  }
}
@keyframes dash-live-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6);
  }
  70%,
  100% {
    box-shadow: 0 0 0 7px rgba(16, 185, 129, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .dashboard-card::after,
  .dash-live-dot {
    animation: none;
  }
}

.clinic-row {
  transition: border-color 0.3s ease;
}
@media (hover: hover) {
  .clinic-row:hover {
    border-color: rgba(17, 211, 211, 0.5);
  }
}

/* Números da seção escura */
.benefit-stat-num {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: clamp(2rem, 3.4vw, 2.8rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
  background-image: linear-gradient(100deg, #11d3d3, #7cc4ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

/* Tabela comparativa */
.comparison-row {
  transition: background-color 0.25s ease;
}
@media (hover: hover) {
  .comparison-row:hover {
    background-color: rgba(15, 23, 42, 0.02);
  }
}

/* mesma assinatura de fundo da hero da home */
.page-hero-aurora {
  background:
    radial-gradient(ellipse 70% 55% at 78% 15%, rgba(17, 211, 211, 0.18), transparent 62%),
    radial-gradient(ellipse 55% 45% at 5% 85%, rgba(74, 168, 255, 0.12), transparent 58%);
}

.hero-grid {
  background-image:
    linear-gradient(rgba(17, 211, 211, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(17, 211, 211, 0.04) 1px, transparent 1px);
  background-size: 64px 64px;
}

.benefit-glow {
  background: radial-gradient(
    circle,
    rgba(17, 211, 211, 0.3) 0%,
    rgba(17, 211, 211, 0.08) 42%,
    transparent 70%
  );
  filter: blur(2px);
}

.benefit-orbit {
  border: 1px dashed rgba(17, 211, 211, 0.18);
  box-shadow: inset 0 0 40px rgba(17, 211, 211, 0.04);
}

.benefit-hub {
  display: flex;
  width: 96px;
  height: 96px;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid rgba(17, 211, 211, 0.45);
  background: linear-gradient(160deg, rgba(17, 211, 211, 0.22), rgba(17, 211, 211, 0.06));
  box-shadow:
    0 0 0 10px rgba(17, 211, 211, 0.05),
    0 16px 40px rgba(17, 211, 211, 0.15);
}

.benefit-chip {
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 158px;
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(22, 28, 38, 0.72);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(10px);
}

.benefit-chip--tl {
  top: 8%;
  left: 0;
  border-color: rgba(17, 211, 211, 0.28);
}
.benefit-chip--tr {
  top: 18%;
  right: 0;
  border-color: rgba(52, 211, 153, 0.28);
}
.benefit-chip--bl {
  bottom: 18%;
  left: 2%;
  border-color: rgba(96, 165, 250, 0.28);
}
.benefit-chip--br {
  bottom: 4%;
  right: 4%;
  border-color: rgba(251, 113, 133, 0.28);
}

.benefit-chip-icon {
  display: flex;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}
.benefit-chip-icon--teal {
  color: #11d3d3;
  background: rgba(17, 211, 211, 0.12);
}
.benefit-chip-icon--emerald {
  color: #34d399;
  background: rgba(52, 211, 153, 0.12);
}
.benefit-chip-icon--blue {
  color: #60a5fa;
  background: rgba(96, 165, 250, 0.12);
}
.benefit-chip-icon--rose {
  color: #fb7185;
  background: rgba(251, 113, 133, 0.12);
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
</style>
