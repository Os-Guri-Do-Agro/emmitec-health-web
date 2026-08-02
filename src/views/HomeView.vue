<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import {
  Activity,
  ArrowRight,
  BellRing,
  BookOpen,
  Calendar,
  CalendarClock,
  Check,
  Clock,
  Cloud,
  Cpu,
  Gauge,
  HandHeart,
  Heart,
  HeartPulse,
  Layers,
  MonitorSmartphone,
  ShieldCheck,
  Sparkles,
  Tag,
  Users,
} from 'lucide-vue-next'

// Imagens (hero + seções split)
import imgRPM from '@/assets/home/RPM.jpg'
import imgMonitoramento from '@/assets/home/monitoramento.jpg'
import headerIMG from '@/assets/home/header_img.png'
import HeroLogoMark from '@/components/HeroLogoMark.vue'

const { t, locale } = useI18n()

const calendlyUrl = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `https://calendly.com/emilio-machado-emmitec-health/vamos-nos-reunir-agende-sua-reuniao-online?month=${year}-${month}`
})

gsap.registerPlugin(ScrollTrigger)

/** Usuários com "reduzir movimento" recebem o conteúdo já no estado final. */
function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

// ── HERO ──
const heroBadge = ref<HTMLElement | null>(null)
const heroTitle = ref<HTMLElement | null>(null)
const heroSub = ref<HTMLElement | null>(null)
const heroActions = ref<HTMLElement | null>(null)
const heroTrust = ref<HTMLElement | null>(null)
const heroVisual = ref<HTMLElement | null>(null)
const heroStats = ref<HTMLElement | null>(null)
const heroStatNumbers = ref<HTMLElement[]>([])

const heroStatsData = computed(() => [
  { num: 98, suffix: '%', label: t('hero.stats.accuracy') },
  { num: 500, suffix: '+', label: t('hero.stats.clinics') },
  { num: 24, suffix: '/7', label: t('hero.stats.support') },
])

const heroTrustData = computed(() => [
  { icon: MonitorSmartphone, label: t('hero.trust.devices') },
  { icon: ShieldCheck, label: t('hero.trust.security') },
  { icon: Clock, label: t('hero.trust.support') },
])

const heroVitals = computed(() => [
  { icon: HeartPulse, label: t('hero.live.hr'), value: '78', unit: 'bpm' },
  { icon: Activity, label: t('hero.live.spo2'), value: '98', unit: '%' },
  { icon: Gauge, label: t('hero.live.bp'), value: '118/76', unit: 'mmHg' },
])

// Animação de contagem dos números
function animateCounter(element: HTMLElement, targetValue: number, duration: number = 1.5) {
  if (prefersReducedMotion()) {
    element.textContent = String(targetValue)
    return
  }
  const counter = { value: 0 }
  gsap.to(counter, {
    value: targetValue,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = Math.round(counter.value).toString()
    },
  })
}

function setHeroStatNumberRef(index: number, el: unknown) {
  if (el instanceof HTMLElement) {
    heroStatNumbers.value[index] = el
  } else {
    delete heroStatNumbers.value[index]
  }
}

// ── MARQUEE (CSS — duas cópias; deslocamento em px da 1ª faixa = sem salto por arredondamento de -50%) ──
const marqueeItems = computed(() => [
  t('marquee.a'),
  t('marquee.b'),
  t('marquee.c'),
  t('marquee.d'),
  t('marquee.e'),
  t('marquee.f'),
])

const marqueeSetA = ref<HTMLElement | null>(null)
const marqueeW = ref(0)
let marqueeResizeObserver: ResizeObserver | null = null

function measureMarqueeWidth() {
  requestAnimationFrame(() => {
    const el = marqueeSetA.value
    if (!el) return
    const w = Math.round(el.getBoundingClientRect().width)
    if (w > 0) marqueeW.value = w
  })
}

function bindMarqueeResizeObserver() {
  marqueeResizeObserver?.disconnect()
  marqueeResizeObserver = null
  const el = marqueeSetA.value
  if (!el || typeof ResizeObserver === 'undefined') return
  marqueeResizeObserver = new ResizeObserver(() => measureMarqueeWidth())
  marqueeResizeObserver.observe(el)
}

const marqueeDuration = computed(() => {
  const w = marqueeW.value
  if (w <= 0) return '55s'
  return `${Math.max(24, Math.round(w / 42))}s`
})

// ── INTRO ──
const introSection = ref<HTMLElement | null>(null)

// ── CARDS ──
const cardsSection = ref<HTMLElement | null>(null)
const currentCardIndex = ref(0)
const touchStartX = ref(0)
const touchEndX = ref(0)

function goToCard(index: number) {
  currentCardIndex.value = index
}

function nextCard() {
  currentCardIndex.value = (currentCardIndex.value + 1) % cardsData.value.length
}

function prevCard() {
  currentCardIndex.value =
    (currentCardIndex.value - 1 + cardsData.value.length) % cardsData.value.length
}

function onTouchStart(e: TouchEvent) {
  touchStartX.value = e.changedTouches[0]?.screenX ?? 0
}

function onTouchEnd(e: TouchEvent) {
  touchEndX.value = e.changedTouches[0]?.screenX ?? 0
  handleSwipe()
}

function handleSwipe() {
  const swipeThreshold = 50
  const diff = touchStartX.value - touchEndX.value
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextCard()
    } else {
      prevCard()
    }
  }
}

const cardsData = computed(() => [
  {
    icon: Activity,
    headerLabel: t('cards.rpm.label'),
    title: t('cards.rpm.title'),
    description: t('cards.rpm.description'),
  },
  {
    icon: Cpu,
    headerLabel: t('cards.ai.label'),
    title: t('cards.ai.title'),
    description: t('cards.ai.description'),
  },
  {
    icon: Users,
    headerLabel: t('cards.dashboard.label'),
    title: t('cards.dashboard.title'),
    description: t('cards.dashboard.description'),
  },
])

const homeBlogStripPosts = computed(() => [
  {
    id: 1,
    catLabel: t('blogPage.categories.tech'),
    title: t('blogPage.articles.a1.title'),
    excerpt: t('blogPage.articles.a1.excerpt'),
    date: t('blogPage.articles.a1.date'),
  },
  {
    id: 2,
    catLabel: t('blogPage.categories.rpm'),
    title: t('blogPage.articles.a2.title'),
    excerpt: t('blogPage.articles.a2.excerpt'),
    date: t('blogPage.articles.a2.date'),
  },
  {
    id: 3,
    catLabel: t('blogPage.categories.cases'),
    title: t('blogPage.articles.a3.title'),
    excerpt: t('blogPage.articles.a3.excerpt'),
    date: t('blogPage.articles.a3.date'),
  },
])

// ── SPLIT FEATURES ──
const split1 = ref<Element | null>(null)
const split2 = ref<Element | null>(null)

const splitMonitoring = computed(() => ({
  tag: t('features.monitoring.tag'),
  title: t('features.monitoring.title'),
  body: t('features.monitoring.body'),
  items: [
    t('features.monitoring.items[0]'),
    t('features.monitoring.items[1]'),
    t('features.monitoring.items[2]'),
  ],
  image: imgRPM,
  imgAlt: t('features.monitoring.imageAlt'),
  btnLabel: t('features.monitoring.button'),
}))

const splitServices = computed(() => ({
  tag: t('features.services.tag'),
  title: t('features.services.title'),
  body: t('features.services.body'),
  items: [
    t('features.services.items[0]'),
    t('features.services.items[1]'),
    t('features.services.items[2]'),
    t('features.services.items[3]'),
  ],
  image: imgMonitoramento,
  imgAlt: t('features.services.imageAlt'),
  btnLabel: t('features.services.button'),
}))

// ── BENEFITS ──
const benefitsSection = ref<HTMLElement | null>(null)

const benefitsData = computed(() => [
  {
    icon: HandHeart,
    title: t('benefits.items.home.title'),
    desc: t('benefits.items.home.desc'),
  },
  {
    icon: HeartPulse,
    title: t('benefits.items.flexible.title'),
    desc: t('benefits.items.flexible.desc'),
  },
  {
    icon: Cloud,
    title: t('benefits.items.access.title'),
    desc: t('benefits.items.access.desc'),
  },
  {
    icon: Heart,
    title: t('benefits.items.partnership.title'),
    desc: t('benefits.items.partnership.desc'),
  },
])

// ── BLOG (faixa antes do CTA final) ──
const blogStripSection = ref<HTMLElement | null>(null)

// ── CTA ──
const ctaSection = ref<HTMLElement | null>(null)
const ctaInner = ref<HTMLElement | null>(null)

onMounted(() => {
  const reduced = prefersReducedMotion()

  if (!reduced) {
    // Hero entrance
    gsap
      .timeline({ defaults: { ease: 'power3.out' } })
      .from(heroBadge.value, { opacity: 0, y: 18, duration: 0.55 })
      .from(heroTitle.value, { opacity: 0, y: 32, duration: 0.85 }, '-=0.28')
      .from(heroSub.value, { opacity: 0, y: 20, duration: 0.65 }, '-=0.5')
      .from(heroActions.value, { opacity: 0, y: 18, duration: 0.6 }, '-=0.42')
      .from(heroTrust.value, { opacity: 0, y: 16, duration: 0.55 }, '-=0.4')
      .from(heroVisual.value, { opacity: 0, y: 40, duration: 0.95 }, '-=0.95')
      .from(heroStats.value, { opacity: 0, y: 16, duration: 0.55 }, '-=0.35')

    // Intro reveal
    if (introSection.value) {
      gsap.from(introSection.value.querySelectorAll('.intro-reveal'), {
        opacity: 0,
        y: 28,
        stagger: 0.09,
        duration: 0.7,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: introSection.value, start: 'top 86%', once: true },
      })
    }

    // Cards stagger
    if (cardsSection.value) {
      gsap.from(cardsSection.value.querySelectorAll('.service-card'), {
        opacity: 0,
        y: 42,
        stagger: 0.12,
        duration: 0.75,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: cardsSection.value, start: 'top 88%', once: true },
      })
    }

    // Split sections (sem transition/transform em .split-reveal — conflita com GSAP)
    ;[split1.value, split2.value].forEach((el) => {
      if (el && el instanceof Element) {
        gsap.from(el.querySelectorAll('.split-reveal'), {
          opacity: 0,
          y: 28,
          stagger: 0.08,
          duration: 0.72,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        })
      }
    })

    // Benefits stagger
    if (benefitsSection.value) {
      gsap.from(benefitsSection.value.querySelectorAll('.benefit-item'), {
        opacity: 0,
        y: 32,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: benefitsSection.value, start: 'top 88%', once: true },
      })
    }

    if (blogStripSection.value) {
      gsap.from(blogStripSection.value.querySelectorAll('.blog-strip-reveal'), {
        opacity: 0,
        y: 22,
        stagger: 0.09,
        duration: 0.65,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: blogStripSection.value, start: 'top 84%', once: true },
      })
    }

    // CTA reveal
    if (ctaInner.value && ctaSection.value) {
      gsap.from(ctaInner.value, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: ctaSection.value, start: 'top 82%', once: true },
      })
    }
  }

  // Contagem dos números (respeita reduced-motion internamente)
  heroStatNumbers.value.forEach((el, index) => {
    const targetValue = heroStatsData.value[index]?.num
    if (el && targetValue !== undefined) {
      animateCounter(el, targetValue, 2.4)
    }
  })

  void nextTick(() => {
    measureMarqueeWidth()
    bindMarqueeResizeObserver()
  })
})

onUnmounted(() => {
  marqueeResizeObserver?.disconnect()
  marqueeResizeObserver = null
  ScrollTrigger.getAll().forEach((t) => t.kill())
})

// Re-animar números quando o idioma mudar (flush 'post': após o DOM / refs novos — 'pre' animava nós antigos)
watch(
  locale,
  () => {
    void nextTick(() => {
      heroStatNumbers.value.forEach((el, index) => {
        const targetValue = heroStatsData.value[index]?.num
        if (el && targetValue !== undefined) {
          el.textContent = '0'
          animateCounter(el, targetValue, 1.5)
        }
      })
    })
  },
  { flush: 'post' },
)

watch(
  [locale, marqueeItems],
  () => {
    marqueeW.value = 0
    void nextTick(() => {
      measureMarqueeWidth()
      bindMarqueeResizeObserver()
    })
  },
  { flush: 'post' },
)
</script>

<template>
  <div class="font-body w-full overflow-x-hidden text-black">
    <!-- ══════════ HERO ══════════ -->
    <section class="relative w-full overflow-hidden bg-dark">
      <!-- Camadas de fundo -->
      <div class="hero-aurora pointer-events-none absolute inset-0" aria-hidden="true" />
      <div class="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div class="hero-noise pointer-events-none absolute inset-0" aria-hidden="true" />
      <HeroLogoMark variant="section" />

      <!-- Lavagem da imagem no mobile (o painel visual só existe em lg+) -->
      <img
        :src="headerIMG"
        alt=""
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 top-0 h-[62%] w-full object-cover object-center opacity-[0.18] lg:hidden"
      />
      <div
        class="pointer-events-none absolute inset-0 bg-linear-to-b from-dark/50 via-dark/85 to-dark lg:hidden"
        aria-hidden="true"
      />

      <div
        class="relative z-10 mx-auto w-full max-w-7xl px-6 pb-14 pt-28 sm:px-8 sm:pb-16 lg:px-10 lg:pb-16 lg:pt-32"
      >
        <div
          class="grid items-center gap-14 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,1fr)] lg:gap-16"
        >
          <!-- Coluna de texto -->
          <div class="flex flex-col items-start">
            <h1 ref="heroTitle" class="display-1 text-white">
              {{ t('hero.titleLead') }}
              <span class="text-gradient-brand">{{ t('hero.titleHighlight') }}</span>
              {{ t('hero.titleTail') }}
            </h1>

            <p ref="heroSub" class="lead mt-6 max-w-xl text-white/55">
              {{ t('hero.subtitle') }}
            </p>

            <div ref="heroActions" class="mt-9 flex flex-wrap items-center gap-4">
              <a
                :href="calendlyUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-primary font-display"
              >
                <CalendarClock :size="17" stroke-width="2.3" aria-hidden="true" />
                {{ t('hero.button.demo') }}
              </a>
              <RouterLink to="/what-is-rpm" class="btn-ghost font-display group">
                {{ t('hero.button.solutions') }}
                <ArrowRight
                  :size="16"
                  stroke-width="2.5"
                  aria-hidden="true"
                  class="transition-transform duration-300 group-hover:translate-x-1"
                />
              </RouterLink>
            </div>

            <ul ref="heroTrust" class="mt-10 flex list-none flex-wrap gap-x-8 gap-y-4 p-0">
              <li
                v-for="item in heroTrustData"
                :key="item.label"
                class="flex items-center gap-2 text-[12.5px] font-medium text-white/55"
              >
                <component
                  :is="item.icon"
                  :size="15"
                  stroke-width="2.2"
                  class="shrink-0 text-primary"
                  aria-hidden="true"
                />
                {{ item.label }}
              </li>
            </ul>
          </div>

          <!-- Painel visual -->
          <div ref="heroVisual" class="relative mx-auto hidden w-full max-w-md lg:block">
            <div class="hero-frame relative aspect-7/8 w-full overflow-hidden rounded-[28px]">
              <img
                :src="headerIMG"
                :alt="t('hero.imageAlt')"
                class="absolute inset-0 h-full w-full object-cover"
              />
              <div
                class="pointer-events-none absolute inset-0 bg-linear-to-t from-dark via-dark/25 to-transparent"
              />
            </div>

            <!-- Card de sinais vitais -->
            <div
              class="hero-glass hero-float absolute -left-10 bottom-12 w-[276px] rounded-2xl p-5"
            >
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span
                  class="inline-flex items-center gap-2 font-display text-[10px] font-bold uppercase tracking-[0.16em] text-primary"
                >
                  <span class="live-dot" aria-hidden="true" />
                  {{ t('hero.live.status') }}
                </span>
                <span class="text-[9.5px] font-medium text-white/35">
                  {{ t('hero.live.patient') }}
                </span>
              </div>

              <div class="mt-4 flex flex-col gap-3">
                <div v-for="v in heroVitals" :key="v.label" class="flex items-center gap-3">
                  <span
                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary ring-1 ring-primary/20"
                  >
                    <component :is="v.icon" :size="15" stroke-width="2.4" aria-hidden="true" />
                  </span>
                  <span class="min-w-0 flex-1 truncate text-[11px] text-white/60">
                    {{ v.label }}
                  </span>
                  <span class="font-display text-[13px] font-bold text-white">
                    {{ v.value }}
                    <span class="ml-0.5 text-[9.5px] font-semibold text-white/35">{{
                      v.unit
                    }}</span>
                  </span>
                </div>
              </div>

              <svg
                class="mt-3.5 h-9 w-full"
                viewBox="0 0 260 40"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <polyline
                  class="ecg-line"
                  points="0,28 30,28 42,28 50,10 58,34 66,22 76,28 110,28 122,28 130,12 138,36 146,24 156,28 190,28 202,28 210,10 218,34 226,22 236,28 260,28"
                  stroke="#11d3d3"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <!-- Chip de alerta preditivo -->
            <div
              class="hero-glass hero-float hero-float--delayed absolute -right-6 top-10 flex w-[236px] items-start gap-3.5 rounded-2xl p-4"
            >
              <span
                class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-dark shadow-[0_8px_24px_-6px_rgba(17,211,211,0.8)]"
              >
                <BellRing :size="15" stroke-width="2.4" aria-hidden="true" />
              </span>
              <p class="text-[11px] font-semibold leading-snug text-white/80">
                {{ t('hero.live.alert') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Faixa de números — some no mobile, onde alonga demais a hero -->
        <div
          ref="heroStats"
          class="mt-12 hidden gap-10 border-t border-white/10 pt-10 sm:grid sm:grid-cols-3 lg:mt-14"
        >
          <div
            v-for="(s, index) in heroStatsData"
            :key="'hero-stat-' + index"
            class="flex flex-col items-center text-center"
          >
            <div
              class="font-display text-[clamp(1.9rem,3.2vw,2.6rem)] font-extrabold leading-none tracking-tight text-white"
            >
              <span :ref="(el) => setHeroStatNumberRef(index, el)">0</span
              ><span class="text-gradient-brand">{{ s.suffix }}</span>
            </div>
            <div class="mt-2.5 text-[12.5px] font-medium text-white/55">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════ MARQUEE ══════════ -->
    <div
      class="relative w-full overflow-hidden border-y border-white/8 bg-dark-2 py-5"
      aria-hidden="true"
    >
      <div class="marquee-mask">
        <div
          :key="locale"
          class="marquee-track flex w-max"
          :class="{ 'marquee-track--ready': marqueeW > 0 }"
          :style="{
            '--marquee-shift': marqueeW > 0 ? `${marqueeW}px` : '0px',
            '--marquee-dur': marqueeDuration,
          }"
        >
          <div ref="marqueeSetA" class="marquee-set flex shrink-0 items-center">
            <div
              v-for="item in marqueeItems"
              :key="'a-' + item"
              class="marquee-item flex shrink-0 items-center px-8 font-display text-[12px] font-bold uppercase tracking-[3px] text-white/40 sm:text-[13px]"
            >
              <span>{{ item }}</span>
              <span class="ml-8 text-primary">◆</span>
            </div>
          </div>
          <div class="marquee-set flex shrink-0 items-center">
            <div
              v-for="item in marqueeItems"
              :key="'b-' + item"
              class="marquee-item flex shrink-0 items-center px-8 font-display text-[12px] font-bold uppercase tracking-[3px] text-white/40 sm:text-[13px]"
            >
              <span>{{ item }}</span>
              <span class="ml-8 text-primary">◆</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════ SOLUÇÕES ══════════ -->
    <section
      ref="introSection"
      class="relative w-full overflow-hidden bg-white py-20 sm:py-24 lg:py-28"
    >
      <div class="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <div class="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <span class="intro-reveal eyebrow eyebrow--light">{{ t('intro.badge') }}</span>
          <h2 class="intro-reveal display-2 text-black">{{ t('intro.title') }}</h2>
          <p class="intro-reveal lead max-w-2xl text-gray-500">{{ t('intro.description') }}</p>
        </div>

        <!-- Desktop: grid -->
        <div
          ref="cardsSection"
          class="mt-16 hidden grid-cols-2 items-stretch gap-7 md:grid lg:grid-cols-3 lg:gap-8"
        >
          <article
            v-for="(c, i) in cardsData"
            :key="c.title"
            class="service-card step-card group relative flex h-full flex-col rounded-2xl border border-gray-200/80 bg-white p-8 transition-all duration-500 last:col-span-2 last:mx-auto last:w-[calc(50%-0.875rem)] hover:-translate-y-1.5 hover:border-primary/35 hover:shadow-[0_30px_64px_-30px_rgba(17,211,211,0.55)] lg:last:col-span-1 lg:last:mx-0 lg:last:w-auto"
          >
            <!-- linha do topo: número do passo → régua → ícone -->
            <div class="flex items-center gap-4">
              <span
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-white font-display text-[15px] font-extrabold text-primary transition-all duration-500 group-hover:border-primary group-hover:bg-primary group-hover:text-dark group-hover:shadow-[0_10px_26px_-8px_rgba(17,211,211,0.75)]"
              >
                {{ String(i + 1).padStart(2, '0') }}
              </span>
              <span
                class="h-px flex-1 bg-linear-to-r from-gray-200 to-transparent"
                aria-hidden="true"
              />
              <component
                :is="c.icon"
                :size="24"
                stroke-width="1.9"
                class="shrink-0 text-gray-300 transition-colors duration-500 group-hover:text-primary"
                aria-hidden="true"
              />
            </div>

            <p
              class="mt-8 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-primary"
            >
              {{ c.headerLabel }}
            </p>
            <h3 class="display-3 mt-3 text-black">{{ c.title }}</h3>
            <p class="mt-4 text-[14px] leading-relaxed text-gray-500">{{ c.description }}</p>
          </article>
        </div>

        <!-- Mobile: carrossel -->
        <div
          class="mx-auto mt-14 flex w-full max-w-md flex-col gap-7 md:hidden"
          @touchstart="onTouchStart"
          @touchend="onTouchEnd"
        >
          <div class="relative overflow-hidden">
            <div
              class="flex transition-transform duration-300 ease-out"
              :style="{ transform: `translateX(-${currentCardIndex * 100}%)` }"
            >
              <article
                v-for="(c, i) in cardsData"
                :key="c.title"
                class="relative flex w-full shrink-0 flex-col rounded-2xl border border-gray-200/80 bg-white p-7"
              >
                <div class="flex items-center gap-4">
                  <span
                    class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-white font-display text-[14px] font-extrabold text-primary"
                  >
                    {{ String(i + 1).padStart(2, '0') }}
                  </span>
                  <span
                    class="h-px flex-1 bg-linear-to-r from-gray-200 to-transparent"
                    aria-hidden="true"
                  />
                  <component
                    :is="c.icon"
                    :size="22"
                    stroke-width="1.9"
                    class="shrink-0 text-gray-300"
                    aria-hidden="true"
                  />
                </div>
                <p
                  class="mt-7 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-primary"
                >
                  {{ c.headerLabel }}
                </p>
                <h3 class="display-3 mt-3 text-black">{{ c.title }}</h3>
                <p class="mt-4 text-[14px] leading-relaxed text-gray-500">{{ c.description }}</p>
              </article>
            </div>
          </div>

          <div class="flex justify-center gap-2.5 pt-1">
            <button
              v-for="(_, index) in cardsData"
              :key="index"
              @click="goToCard(index)"
              class="h-2 rounded-full transition-all duration-300"
              :class="index === currentCardIndex ? 'w-6 bg-primary' : 'w-2 bg-gray-300'"
              :aria-label="t('aria.goToCard', { index: index + 1 })"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════ CUIDADO INTELIGENTE ══════════ -->
    <section
      ref="split1"
      class="split-section-monitoring relative w-full overflow-hidden py-20 sm:py-24 lg:py-28"
    >
      <div class="split-monitoring-glow pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        class="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-6 sm:gap-20 sm:px-8 lg:grid-cols-12 lg:gap-x-16 lg:px-10 xl:gap-x-24"
      >
        <div class="flex w-full flex-col items-start gap-8 text-left lg:col-span-5">
          <span class="split-reveal eyebrow eyebrow--light">
            <Sparkles :size="12" stroke-width="2.5" aria-hidden="true" />
            {{ splitMonitoring.tag }}
          </span>

          <h2 class="split-reveal display-2 text-black">{{ splitMonitoring.title }}</h2>

          <p class="split-reveal lead max-w-xl text-muted">{{ splitMonitoring.body }}</p>

          <ul class="m-0 w-full max-w-xl list-none p-0 lg:max-w-none" role="list">
            <li
              v-for="(item, idx) in splitMonitoring.items"
              :key="item"
              class="split-reveal split-monitoring-row group flex items-start gap-4 border-t border-gray-200/80 py-5"
            >
              <span
                class="mt-px flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-display text-[11px] font-extrabold text-primary ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary group-hover:text-dark"
              >
                {{ String(idx + 1).padStart(2, '0') }}
              </span>
              <span class="text-[14.5px] leading-relaxed text-gray-700">{{ item }}</span>
            </li>
          </ul>

          <RouterLink to="/what-is-rpm" class="split-reveal btn-primary font-display group">
            {{ splitMonitoring.btnLabel }}
            <ArrowRight
              :size="16"
              stroke-width="2.5"
              aria-hidden="true"
              class="transition-transform duration-300 group-hover:translate-x-1"
            />
          </RouterLink>
        </div>

        <div class="split-reveal relative flex w-full justify-center lg:col-span-7">
          <div
            class="split-visual split-visual--framed relative aspect-4/3 w-full overflow-hidden rounded-3xl"
          >
            <div
              class="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-primary/20 blur-2xl sm:h-40 sm:w-40"
              aria-hidden="true"
            />
            <div
              class="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/15 blur-3xl"
              aria-hidden="true"
            />
            <img
              :src="splitMonitoring.image"
              :alt="splitMonitoring.imgAlt"
              class="absolute inset-2.5 h-[calc(100%-20px)] w-[calc(100%-20px)] rounded-[1.15rem] object-cover"
            />
            <div
              class="absolute bottom-7 left-7 flex flex-wrap gap-2 sm:bottom-9 sm:left-9"
              aria-hidden="true"
            >
              <span
                class="rounded-lg border border-white/25 bg-dark/55 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-wider text-white/95 backdrop-blur-md"
              >
                {{ t('features.monitoring.imageBadges.rpm') }}
              </span>
              <span
                class="rounded-lg border border-primary/40 bg-primary/90 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-wider text-dark shadow-lg"
              >
                {{ t('features.monitoring.imageBadges.ai') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════ SERVIÇOS ══════════ -->
    <section
      ref="split2"
      class="split-section-services relative w-full overflow-hidden py-20 sm:py-24 lg:py-28"
    >
      <div class="split-services-mesh pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        class="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-6 sm:gap-20 sm:px-8 lg:grid-cols-12 lg:gap-x-16 lg:px-10 xl:gap-x-24"
      >
        <div class="split-reveal order-2 w-full lg:order-1 lg:col-span-6">
          <div
            class="split-visual split-visual--services relative aspect-4/3 w-full overflow-hidden rounded-3xl"
          >
            <img
              :src="splitServices.image"
              :alt="splitServices.imgAlt"
              class="absolute inset-0 h-full w-full object-cover"
            />
            <div
              class="pointer-events-none absolute inset-0 bg-linear-to-tr from-dark/85 via-dark/25 to-transparent"
            />
            <div
              class="absolute bottom-5 left-5 flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md sm:bottom-7 sm:left-7"
            >
              <Layers :size="18" class="text-primary" aria-hidden="true" />
              <span
                class="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-white/90"
              >
                {{ t('features.monitoring.imageBadges.rpm') }}
              </span>
            </div>
          </div>
        </div>

        <div
          class="order-1 flex w-full flex-col items-start gap-8 text-left lg:order-2 lg:col-span-6"
        >
          <span class="split-reveal eyebrow eyebrow--dark">{{ splitServices.tag }}</span>

          <h2 class="split-reveal display-2 text-white">{{ splitServices.title }}</h2>

          <p class="split-reveal lead text-white/55">{{ splitServices.body }}</p>

          <ul
            class="grid w-full max-w-2xl list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 sm:gap-5 lg:max-w-none"
            role="list"
          >
            <li
              v-for="item in splitServices.items"
              :key="item"
              class="split-reveal split-services-card flex w-full gap-4 rounded-xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-md"
            >
              <span
                class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary ring-1 ring-primary/30"
              >
                <Check :size="14" stroke-width="3" aria-hidden="true" />
              </span>
              <span class="text-[13px] leading-snug text-white/70">{{ item }}</span>
            </li>
          </ul>

          <RouterLink to="/apps" class="split-reveal btn-ghost font-display group">
            {{ splitServices.btnLabel }}
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

    <!-- ══════════ BENEFÍCIOS ══════════ -->
    <section
      ref="benefitsSection"
      class="benefits-section relative w-full overflow-hidden py-20 sm:py-24 lg:py-28"
    >
      <div class="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <div class="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <span class="benefit-item eyebrow eyebrow--light">{{ t('benefits.badge') }}</span>
          <h2 class="benefit-item display-2 text-black">{{ t('benefits.title') }}</h2>
          <p class="benefit-item lead max-w-2xl text-gray-500">{{ t('benefits.subtitle') }}</p>
        </div>

        <div
          class="mt-16 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7"
        >
          <article
            v-for="b in benefitsData"
            :key="b.title"
            class="benefit-item group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-7 transition-all duration-400 hover:-translate-y-1.5 hover:border-primary/35 hover:shadow-[0_26px_58px_-28px_rgba(17,211,211,0.5)]"
          >
            <!-- barra de acento que cresce no hover -->
            <span
              class="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-linear-to-r from-primary to-primary/10 transition-transform duration-500 group-hover:scale-x-100"
              aria-hidden="true"
            />
            <div
              class="flex h-13 w-13 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary transition-all duration-400 group-hover:bg-primary group-hover:text-dark group-hover:shadow-[0_10px_26px_-8px_rgba(17,211,211,0.75)]"
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

    <!-- ══════════ BLOG ══════════ -->
    <section
      ref="blogStripSection"
      class="w-full border-y border-gray-200/80 bg-linear-to-b from-mid via-white to-mid py-20 sm:py-24 lg:py-28"
    >
      <div class="mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 sm:px-8 lg:px-10">
        <div
          class="flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:justify-between md:gap-8 md:text-left"
        >
          <div class="flex max-w-2xl flex-col items-center gap-5 md:items-start">
            <span class="blog-strip-reveal eyebrow eyebrow--light">
              <BookOpen :size="12" stroke-width="2.5" aria-hidden="true" />
              {{ t('homeBlogStrip.badge') }}
            </span>
            <h2 class="blog-strip-reveal display-2 text-black">{{ t('homeBlogStrip.title') }}</h2>
            <p class="blog-strip-reveal text-[14.5px] leading-relaxed text-gray-500">
              {{ t('homeBlogStrip.subtitle') }}
            </p>
          </div>
          <RouterLink to="/blog" class="blog-strip-reveal btn-light font-display group shrink-0">
            {{ t('homeBlogStrip.cta') }}
            <ArrowRight
              :size="15"
              class="text-primary transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </RouterLink>
        </div>

        <div class="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          <RouterLink
            v-for="(post, index) in homeBlogStripPosts"
            :key="post.id"
            :to="`/blog/${post.id}`"
            class="home-blog-card blog-strip-reveal group flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white text-inherit no-underline shadow-[0_6px_28px_rgba(15,23,42,0.05)] outline-none transition-all duration-400 focus-visible:ring-2 focus-visible:ring-primary sm:last:col-span-2 sm:last:mx-auto sm:last:w-[calc(50%-0.875rem)] md:hover:-translate-y-1.5 md:hover:border-primary/35 md:hover:shadow-[0_26px_54px_-26px_rgba(17,211,211,0.4)] lg:last:col-span-1 lg:last:mx-0 lg:last:w-auto"
          >
            <!-- capa gerada: malha + número fantasma + categoria -->
            <div class="relative flex h-36 shrink-0 items-end overflow-hidden bg-dark p-5">
              <div
                class="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/30 via-dark to-dark"
                aria-hidden="true"
              />
              <div class="hero-grid absolute inset-0 opacity-40" aria-hidden="true" />
              <span
                class="pointer-events-none absolute -top-5 right-1 font-display text-[92px] font-extrabold leading-none text-white/6 transition-colors duration-500 group-hover:text-primary/15"
                aria-hidden="true"
              >
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <BookOpen
                :size="28"
                stroke-width="1.7"
                class="pointer-events-none absolute bottom-5 right-5 text-primary/40 transition-colors duration-500 group-hover:text-primary/70"
                aria-hidden="true"
              />
              <span
                class="relative z-10 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 font-display text-[9.5px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm"
              >
                <Tag :size="10" class="shrink-0" aria-hidden="true" />
                {{ post.catLabel }}
              </span>
            </div>

            <div class="flex flex-1 flex-col gap-3 p-7">
              <h3
                class="font-display text-[16.5px] font-bold leading-snug tracking-tight text-black transition-colors duration-300 group-hover:text-primary"
              >
                {{ post.title }}
              </h3>
              <p class="line-clamp-2 text-[13.5px] leading-relaxed text-gray-500">
                {{ post.excerpt }}
              </p>
              <div
                class="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-4"
              >
                <span class="flex items-center gap-2 text-[11px] text-gray-400">
                  <Calendar :size="12" aria-hidden="true" />
                  {{ post.date }}
                </span>
                <ArrowRight
                  :size="15"
                  stroke-width="2.4"
                  aria-hidden="true"
                  class="shrink-0 text-gray-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary"
                />
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ══════════ CTA ══════════ -->
    <section
      ref="ctaSection"
      class="relative flex w-full items-center justify-center overflow-hidden bg-dark py-20 sm:py-24 lg:py-28"
    >
      <div
        class="cta-glow pointer-events-none absolute -top-48 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full sm:h-[500px] sm:w-[500px] lg:h-[680px] lg:w-[680px]"
        aria-hidden="true"
      />
      <div class="hero-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />

      <div
        class="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <span
          class="cta-ghost font-display font-extrabold leading-[0.8] tracking-[-0.05em] whitespace-nowrap"
        >
          EMMITEC&nbsp;HEALTH
        </span>
      </div>

      <div
        ref="ctaInner"
        class="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-7 px-6 text-center sm:px-8"
      >
        <span class="eyebrow eyebrow--dark">{{ t('cta.badge') }}</span>
        <h2 class="display-2 text-white">{{ t('cta.title') }}</h2>
        <p class="lead max-w-2xl text-white/50">{{ t('cta.subtitle') }}</p>

        <div class="mt-3 flex flex-wrap justify-center gap-4">
          <a
            :href="calendlyUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary font-display"
          >
            <CalendarClock :size="17" stroke-width="2.3" aria-hidden="true" />
            {{ t('cta.button.primary') }}
          </a>
          <RouterLink to="/equipment" class="btn-ghost font-display group">
            {{ t('cta.button.secondary') }}
            <ArrowRight
              :size="16"
              stroke-width="2.5"
              aria-hidden="true"
              class="transition-transform duration-300 group-hover:translate-x-1"
            />
          </RouterLink>
        </div>

        <p class="text-[12px] font-medium text-white/35">{{ t('cta.note') }}</p>

        <!-- reforço final: os mesmos selos da hero, fechando o ciclo -->
        <ul
          class="mt-4 flex list-none flex-wrap justify-center gap-x-8 gap-y-3 border-t border-white/10 p-0 pt-8"
        >
          <li
            v-for="item in heroTrustData"
            :key="'cta-' + item.label"
            class="flex items-center gap-2 text-[12.5px] font-medium text-white/55"
          >
            <component
              :is="item.icon"
              :size="15"
              stroke-width="2.2"
              class="shrink-0 text-primary"
              aria-hidden="true"
            />
            {{ item.label }}
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ─── Hero ─── */
.hero-aurora {
  background:
    radial-gradient(ellipse 70% 55% at 72% 12%, rgba(17, 211, 211, 0.2), transparent 62%),
    radial-gradient(ellipse 55% 45% at 8% 80%, rgba(74, 168, 255, 0.13), transparent 58%),
    radial-gradient(ellipse 80% 60% at 50% 110%, rgba(17, 211, 211, 0.08), transparent 60%);
}
.hero-grid {
  background-image:
    linear-gradient(rgba(17, 211, 211, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(17, 211, 211, 0.045) 1px, transparent 1px);
  background-size: 64px 64px;
}
.hero-noise {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.03;
  mix-blend-mode: overlay;
}

.hero-frame {
  box-shadow:
    0 0 0 1px rgba(17, 211, 211, 0.16),
    0 40px 90px -30px rgba(0, 0, 0, 0.75),
    0 0 120px -40px rgba(17, 211, 211, 0.35);
}

.hero-glass {
  background: rgba(14, 17, 23, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 24px 60px -24px rgba(0, 0, 0, 0.9);
}

.hero-float {
  animation: hero-float 7s ease-in-out infinite;
}
.hero-float--delayed {
  animation-delay: -3.5s;
}
@keyframes hero-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.live-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  flex-shrink: 0;
  border-radius: 999px;
  background: #11d3d3;
  box-shadow: 0 0 0 0 rgba(17, 211, 211, 0.65);
  animation: live-pulse 2.1s infinite;
}
@keyframes live-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(17, 211, 211, 0.65);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(17, 211, 211, 0);
  }
}

.ecg-line {
  stroke-dasharray: 300;
  stroke-dashoffset: 300;
  animation: ecg-draw 3.4s ease-in-out infinite;
}
@keyframes ecg-draw {
  0% {
    stroke-dashoffset: 300;
  }
  55% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -300;
  }
}

/* ─── Marquee ─── */
/* A máscara fica só na faixa de conteúdo — se ficasse no wrapper, apagaria o fundo escuro nas bordas */
.marquee-mask {
  mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
  -webkit-mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
}
.marquee-track {
  animation: none;
  will-change: transform;
}
.marquee-track.marquee-track--ready {
  animation: marquee-scroll-pixel var(--marquee-dur, 55s) linear infinite;
}
@keyframes marquee-scroll-pixel {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(calc(-1 * var(--marquee-shift, 0px)), 0, 0);
  }
}

/* ─── CTA ─── */
.cta-glow {
  background: radial-gradient(circle, rgba(17, 211, 211, 0.12) 0%, transparent 70%);
}
.cta-ghost {
  font-size: clamp(120px, 20vw, 340px);
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.07);
  letter-spacing: -0.05em;
}

/* ─── Soluções: conector entre os 3 passos (só quando os 3 ficam na mesma linha) ─── */
@media (min-width: 1024px) {
  .step-card + .step-card::before {
    content: '';
    position: absolute;
    /* p-8 (32px) + metade do círculo de 48px = centro do número */
    top: 56px;
    left: -2rem; /* = lg:gap-8 */
    width: 2rem;
    height: 1px;
    background: linear-gradient(90deg, rgba(17, 211, 211, 0), rgba(17, 211, 211, 0.5));
  }
}

/* ─── Benefícios ─── */
.benefits-section {
  background: linear-gradient(180deg, #ffffff 0%, #f7f9fa 55%, #ffffff 100%);
}

/* ─── Split: cuidado inteligente (claro) ─── */
.split-section-monitoring {
  background: linear-gradient(180deg, #ffffff 0%, #f4f6f7 45%, #fafcfd 100%);
}
.split-monitoring-glow {
  background:
    radial-gradient(ellipse 90% 70% at 100% 0%, rgba(17, 211, 211, 0.14), transparent 55%),
    radial-gradient(ellipse 60% 50% at 0% 100%, rgba(74, 168, 255, 0.09), transparent 50%);
}

/* ─── Split: serviços (escuro) ─── */
.split-section-services {
  background: linear-gradient(165deg, #0e1117 0%, #121a24 45%, #0e1117 100%);
}
.split-services-mesh {
  background-image:
    linear-gradient(rgba(17, 211, 211, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(17, 211, 211, 0.035) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 85% 75% at 50% 50%, black 20%, transparent 72%);
  -webkit-mask-image: radial-gradient(ellipse 85% 75% at 50% 50%, black 20%, transparent 72%);
}
.split-services-mesh::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 70% 20%, rgba(17, 211, 211, 0.12), transparent 42%),
    radial-gradient(circle at 15% 80%, rgba(74, 168, 255, 0.07), transparent 40%);
  pointer-events: none;
}

.split-visual {
  position: relative;
  background: linear-gradient(135deg, #1e3040, #0d1e2a);
}
/* Moldura branca (o gradiente escuro do .split-visual não combina com a seção clara) */
.split-visual--framed {
  background: #ffffff;
  box-shadow:
    0 32px 80px -30px rgba(15, 23, 42, 0.3),
    0 0 0 1px rgba(15, 23, 42, 0.07);
}
.split-visual--services {
  box-shadow:
    0 0 0 1px rgba(17, 211, 211, 0.22),
    0 32px 84px -24px rgba(0, 0, 0, 0.7),
    0 0 110px -30px rgba(17, 211, 211, 0.3);
}

@media (hover: hover) {
  .split-monitoring-row {
    transition: border-color 0.3s ease;
  }
  .split-monitoring-row:hover {
    border-color: rgba(17, 211, 211, 0.5);
  }
  .split-services-card {
    transition:
      border-color 0.35s ease,
      background-color 0.35s ease;
  }
  .split-services-card:hover {
    border-color: rgba(17, 211, 211, 0.38);
    background-color: rgba(255, 255, 255, 0.09);
  }
}

/* ─── Acessibilidade: reduzir movimento ─── */
@media (prefers-reduced-motion: reduce) {
  .marquee-track.marquee-track--ready,
  .hero-float,
  .live-dot,
  .ecg-line {
    animation: none;
  }
  .ecg-line {
    stroke-dashoffset: 0;
  }
}
</style>
