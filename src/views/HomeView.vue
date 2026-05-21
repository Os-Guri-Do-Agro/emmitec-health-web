<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from 'primevue/button'

import {
  Activity,
  Cpu,
  Users,
  Check,
  ArrowRight,
  HeartPulse,
  Cloud,
  Heart,
  HandHeart,
  Sparkles,
  Layers,
  Calendar,
  Tag,
  BookOpen,
} from 'lucide-vue-next'

// Imagens (hero + seções split)
import imgRPM from '@/assets/home/RPM.jpg'
import imgMonitoramento from '@/assets/home/monitoramento.jpg'
import headerIMG from '@/assets/home/header_img.png'

const { t, locale } = useI18n()
const router = useRouter()

const calendlyUrl = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `https://calendly.com/emilio-machado-emmitec-health/vamos-nos-reunir-agende-sua-reuniao-online?month=${year}-${month}`
})

gsap.registerPlugin(ScrollTrigger)

// ── HERO ──
const heroBadge = ref<HTMLElement | null>(null)
const heroTitle = ref<HTMLElement | null>(null)
const heroSub = ref<HTMLElement | null>(null)
const heroActions = ref<HTMLElement | null>(null)
const heroStats = ref<HTMLElement | null>(null)
const heroStatNumbers = ref<HTMLElement[]>([])

const heroStatsData = computed(() => [
  { num: 98, suffix: '%', label: t('hero.stats.accuracy') },
  { num: 500, suffix: '+', label: t('hero.stats.clinics') },
  { num: 24, suffix: '/7', label: t('hero.stats.support') },
])

// Animação de contagem dos números
function animateCounter(element: HTMLElement, targetValue: number, duration: number = 1.5) {
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
  t('hero.stats.accuracy'),
  t('hero.stats.clinics'),
  t('hero.stats.support'),
  t('cards.rpm.label'),
  t('cards.ai.label'),
  t('cards.dashboard.label'),
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

function goHomeBlogPost(id: number) {
  router.push(`/blog/${id}`)
}

onMounted(() => {
  // Hero entrance
  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .from(heroBadge.value, { opacity: 0, y: 20, duration: 0.6 })
    .from(heroTitle.value, { opacity: 0, y: 34, duration: 0.8 }, '-=0.3')
    .from(heroSub.value, { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
    .from(heroActions.value, { opacity: 0, y: 20, duration: 0.6 }, '-=0.35')
    .from(heroStats.value, { opacity: 0, y: 16, duration: 0.5 }, '-=0.25')

  // Animação de contagem dos números
  heroStatNumbers.value.forEach((el, index) => {
    const targetValue = heroStatsData.value[index]?.num
    if (el && targetValue !== undefined) {
      animateCounter(el, targetValue, 3)
    }
  })

  // Intro reveal
  if (introSection.value) {
    gsap.from(introSection.value, {
      opacity: 0,
      y: 36,
      duration: 0.75,
      ease: 'power3.out',
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
      scrollTrigger: { trigger: cardsSection.value, start: 'top 86%', once: true },
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
      scrollTrigger: { trigger: benefitsSection.value, start: 'top 86%', once: true },
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
      scrollTrigger: { trigger: ctaSection.value, start: 'top 80%', once: true },
    })
  }

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

watch([locale, marqueeItems], () => {
  marqueeW.value = 0
  void nextTick(() => {
    measureMarqueeWidth()
    bindMarqueeResizeObserver()
  })
}, { flush: 'post' })
</script>

<template>
  <div class="font-body text-black overflow-x-hidden w-full">
    <!-- ── HERO ── -->
    <section
      class="min-h-[50vh] sm:min-h-[65vh] lg:min-h-[70vh] bg-dark relative overflow-hidden w-full"
    >
      <!-- Grid background -->
      <div class="hero-grid absolute inset-0 pointer-events-none" />

      <!-- Content grid -->
      <div
        class="grid grid-cols-1 lg:grid-cols-2 min-h-[50vh] sm:min-h-[65vh] lg:min-h-[70vh] w-full"
      >
        <!-- Left content -->
        <div
          class="flex flex-col justify-center items-end px-4 sm:px-6 lg:px-12 xl:px-16 lg:py-0 z-10 py-20"
        >
          <div class="w-full max-w-xl flex flex-col gap-5">
            <h1
              ref="heroTitle"
              class="font-display font-extrabold text-white leading-[1.08] tracking-tight text-xl sm:text-2xl lg:text-3xl mb-5 text-left"
            >
              {{ t('hero.title') }}
            </h1>

            <p
              ref="heroSub"
              class="text-white/50 text-[12px] sm:text-[14px] leading-relaxed max-w-md mb-8 font-light text-left"
            >
              {{ t('hero.subtitle') }}
            </p>

            <div ref="heroActions" class="flex gap-4 flex-wrap justify-start">
              <a :href="calendlyUrl" target="_blank" rel="noopener noreferrer">
                <Button
                  :label="t('hero.button.demo')"
                  unstyled
                  class="btn-primary font-display font-bold"
                />
              </a>
              <Button
                :label="t('hero.button.solutions') + ' →'"
                unstyled
                class="btn-ghost font-display font-bold"
              />
            </div>

            <div
              ref="heroStats"
              class="flex gap-6 sm:gap-10 mt-10 pt-8 border-t border-white/8 flex-wrap justify-start"
            >
              <div v-for="(s, index) in heroStatsData" :key="'hero-stat-' + index" class="text-left">
                <div
                  class="font-display font-extrabold text-white text-[18px] sm:text-[20px] tracking-tight"
                >
                  <span class="font-display font-extrabold" :ref="(el) => setHeroStatNumberRef(index, el)"
                    >0</span
                  ><span class="text-primary text-[14px] sm:text-[18px]">{{ s.suffix }}</span>
                </div>
                <div class="text-muted text-[9px] md:text-[11px] mt-0.5 font-medium tracking-wide">
                  {{ s.label }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right image -->
        <div class="hidden lg:block relative h-full">
          <img
            :src="headerIMG"
            :alt="t('hero.imageAlt')"
            class="absolute inset-0 w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-linear-to-r from-dark via-dark/60 to-transparent" />
        </div>
      </div>
    </section>

    <!-- ── MARQUEE (loop infinito via CSS; duas faixas idênticas + translateX(-50%)) ── -->
    <div
      class="marquee bg-dark border-t border-white/10 py-4 overflow-hidden w-full"
      aria-hidden="true"
    >
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
            class="marquee-item flex shrink-0 items-center font-display font-bold uppercase tracking-[3px] text-white/35 text-[12px] sm:text-[13px] px-8"
          >
            <span>{{ item }}</span>
            <span class="text-primary ml-8">◆</span>
          </div>
        </div>
        <div class="marquee-set flex shrink-0 items-center">
          <div
            v-for="item in marqueeItems"
            :key="'b-' + item"
            class="marquee-item flex shrink-0 items-center font-display font-bold uppercase tracking-[3px] text-white/35 text-[12px] sm:text-[13px] px-8"
          >
            <span>{{ item }}</span>
            <span class="text-primary ml-8">◆</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── INTRO ── -->
    <section
      ref="introSection"
      class="bg-white py-12 sm:py-16 w-full flex flex-col items-center justify-center gap-8 sm:gap-12"
    >
      <div class="flex flex-col items-center justify-center gap-4 px-6 text-center sm:gap-5">
        <span class="inline-block font-display text-[11px] font-bold uppercase text-primary">{{
          t('intro.badge')
        }}</span>
        <h2
          class="font-display font-extrabold text-black text-[clamp(20px,2vw,30px)] tracking-tight leading-tight max-w-xl mx-auto"
        >
          {{ t('intro.title') }}
        </h2>
        <p class="text-gray-500 text-[14px] leading-relaxed max-w-md mx-auto text-center">
          {{ t('intro.description') }}
        </p>
      </div>

      <!-- Cards soluções (não clicáveis — visual de produto, não blog) -->

      <!-- Desktop: Grid -->
      <div
        ref="cardsSection"
        class="hidden w-full max-w-7xl grid-cols-2 items-stretch gap-6 px-4 sm:px-6 md:grid lg:grid-cols-3 lg:gap-8"
      >
        <div
          v-for="c in cardsData"
          :key="c.title"
          class="service-card flex h-full flex-col rounded-xl border border-gray-200/90 bg-mid/40"
        >
          <div class="flex flex-col gap-4 p-5 sm:p-6">
            <div class="flex items-start gap-4">
              <div
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary ring-1 ring-primary/20"
              >
                <component :is="c.icon" :size="22" stroke-width="2.2" aria-hidden="true" />
              </div>
              <div class="min-w-0 flex-1">
                <p
                  class="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-primary/90"
                >
                  {{ c.headerLabel }}
                </p>
                <h3 class="mt-1.5 font-display text-[16px] font-bold leading-snug tracking-tight text-black sm:text-[17px]">
                  {{ c.title }}
                </h3>
              </div>
            </div>
            <p class="text-[13px] leading-relaxed text-gray-600">{{ c.description }}</p>
          </div>
        </div>
      </div>

      <!-- Mobile: Carousel -->
      <div
        class="mx-auto flex w-full max-w-md flex-col gap-6 px-4 md:hidden"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
      >
        <div class="relative overflow-hidden">
          <div
            class="flex transition-transform duration-300 ease-out"
            :style="{ transform: `translateX(-${currentCardIndex * 100}%)` }"
          >
            <div
              v-for="c in cardsData"
              :key="c.title"
              class="service-card flex w-full shrink-0 flex-col rounded-xl border border-gray-200/90 bg-mid/40"
            >
              <div class="flex flex-col gap-4 p-5">
                <div class="flex items-start gap-4">
                  <div
                    class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary ring-1 ring-primary/20"
                  >
                    <component :is="c.icon" :size="22" stroke-width="2.2" aria-hidden="true" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p
                      class="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-primary/90"
                    >
                      {{ c.headerLabel }}
                    </p>
                    <h3
                      class="mt-1.5 font-display text-[16px] font-bold leading-snug tracking-tight text-black"
                    >
                      {{ c.title }}
                    </h3>
                  </div>
                </div>
                <p class="text-[13px] leading-relaxed text-gray-600">{{ c.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Indicators -->
        <div class="flex justify-center gap-2.5 pt-2">
          <button
            v-for="(_, index) in cardsData"
            :key="index"
            @click="goToCard(index)"
            class="w-2 h-2 rounded-full transition-colors"
            :class="index === currentCardIndex ? 'bg-primary' : 'bg-gray-300'"
            :aria-label="t('aria.goToCard', { index: index + 1 })"
          />
        </div>
      </div>
    </section>

    <!-- ── CUIDADO INTELIGENTE (monitoring) ── -->
    <section
      ref="split1"
      class="split-section-monitoring relative flex w-full flex-col items-center justify-center overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      <div class="split-monitoring-glow pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        class="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-14 px-4 sm:px-6 sm:gap-16 lg:grid lg:grid-cols-12 lg:items-center lg:justify-center lg:gap-x-14 lg:gap-y-12 lg:px-8 xl:gap-x-20"
      >
        <div
          class="flex w-full flex-col items-center gap-7 text-center sm:gap-8 lg:col-span-5 lg:items-start lg:text-left"
        >
          <div
            class="split-reveal flex items-center justify-center gap-3 border-l-0 pl-0 lg:justify-start lg:border-l-[3px] lg:border-primary lg:pl-6"
          >
            <span
              class="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white/90 px-3 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-primary shadow-[0_8px_30px_rgba(17,211,211,0.12)] backdrop-blur-sm"
            >
              <Sparkles :size="12" class="shrink-0 opacity-90" stroke-width="2.5" aria-hidden="true" />
              {{ splitMonitoring.tag }}
            </span>
          </div>
          <h2
            class="split-reveal font-display text-[clamp(1.5rem,4vw,2.15rem)] font-extrabold leading-[1.12] tracking-tight text-black"
          >
            {{ splitMonitoring.title }}
          </h2>
          <p class="split-reveal max-w-xl text-[14px] leading-relaxed text-muted sm:text-[15px]">
            {{ splitMonitoring.body }}
          </p>
          <ul class="grid w-full max-w-xl list-none grid-cols-1 gap-4 p-0 sm:gap-5 lg:max-w-none" role="list">
            <li
              v-for="(item, idx) in splitMonitoring.items"
              :key="item"
              class="split-reveal split-monitoring-card group flex w-full gap-4 rounded-2xl border border-gray-200/90 bg-white/80 p-5 shadow-[0_4px_24px_rgba(15,23,42,0.04)] backdrop-blur-sm sm:gap-5 sm:p-6"
            >
              <span
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 font-display text-xs font-extrabold text-primary ring-1 ring-primary/20"
                >{{ String(idx + 1).padStart(2, '0') }}</span
              >
              <span class="flex items-center text-left text-[13px] leading-snug text-gray-700 sm:text-[14px]">
                {{ item }}
              </span>
            </li>
          </ul>
          <div class="split-reveal flex justify-center lg:justify-start">
            <a
              href="/what-is-rpm"
              class="split-cta-monitoring split-cta-monitoring--primary font-display text-[13px] font-bold no-underline"
            >
              <span class="split-cta-monitoring__inner">
                {{ splitMonitoring.btnLabel }}
                <span class="split-cta-monitoring__icon" aria-hidden="true">
                  <ArrowRight :size="17" stroke-width="2.5" />
                </span>
              </span>
            </a>
          </div>
        </div>

        <div class="split-reveal relative flex w-full justify-center lg:col-span-7">
          <div
            class="split-visual split-visual--framed relative aspect-4/3 w-full max-w-none overflow-hidden rounded-[1.35rem] sm:rounded-3xl"
          >
            <div
              class="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-primary/20 blur-2xl sm:h-36 sm:w-36"
              aria-hidden="true"
            />
            <div
              class="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/15 blur-3xl"
              aria-hidden="true"
            />
            <div
              class="absolute inset-0 rounded-[1.25rem] ring-1 ring-gray-200/90 sm:rounded-[1.65rem] sm:ring-2"
            />
            <img
              :src="splitMonitoring.image"
              :alt="splitMonitoring.imgAlt"
              class="absolute inset-[5px] h-[calc(100%-10px)] w-[calc(100%-10px)] rounded-[1.05rem] object-cover sm:inset-2 sm:h-[calc(100%-16px)] sm:w-[calc(100%-16px)] sm:rounded-[1.35rem]"
            />
            <div
              class="absolute bottom-4 left-4 flex flex-wrap gap-2 sm:bottom-6 sm:left-6"
              aria-hidden="true"
            >
              <span
                class="rounded-lg border border-white/25 bg-dark/55 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-wider text-white/95 backdrop-blur-md"
                >{{ t('features.monitoring.imageBadges.rpm') }}</span
              >
              <span
                class="rounded-lg border border-primary/40 bg-primary/90 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-wider text-dark shadow-lg"
                >{{ t('features.monitoring.imageBadges.ai') }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── SERVIÇOS ── -->
    <section
      ref="split2"
      class="split-section-services relative flex w-full flex-col items-center justify-center overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      <div class="split-services-mesh pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        class="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center justify-items-center gap-14 px-4 sm:gap-16 sm:px-6 lg:grid-cols-12 lg:items-center lg:justify-center lg:justify-items-stretch lg:gap-x-14 lg:gap-y-12 lg:px-8 xl:gap-x-20"
      >
        <div class="split-reveal order-2 flex w-full justify-center lg:order-1 lg:col-span-6 lg:justify-start">
          <div
            class="split-visual split-visual--services relative aspect-4/3 w-full overflow-hidden rounded-2xl sm:rounded-3xl"
          >
            <img
              :src="splitServices.image"
              :alt="splitServices.imgAlt"
              class="absolute inset-0 h-full w-full object-cover"
            />
            <div
              class="pointer-events-none absolute inset-0 bg-linear-to-tr from-dark/80 via-dark/25 to-transparent"
            />
            <div
              class="absolute bottom-5 left-5 flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md sm:bottom-7 sm:left-7"
            >
              <Layers :size="18" class="text-primary" aria-hidden="true" />
              <span class="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-white/90"
                >{{ t('features.monitoring.imageBadges.rpm') }}</span
              >
            </div>
          </div>
        </div>

        <div
          class="order-1 flex w-full flex-col items-center gap-7 text-center sm:gap-8 lg:order-2 lg:col-span-6 lg:items-start lg:text-left"
        >
          <div class="split-reveal flex justify-center lg:justify-start">
            <span
              class="inline-block rounded-full border border-primary/45 bg-primary/10 px-4 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-primary"
            >
              {{ splitServices.tag }}
            </span>
          </div>
          <h2
            class="split-reveal font-display text-[clamp(1.45rem,3.6vw,2rem)] font-extrabold leading-[1.12] tracking-tight text-white"
          >
            {{ splitServices.title }}
          </h2>
          <p class="split-reveal text-[14px] leading-relaxed text-white/58 sm:text-[15px]">
            {{ splitServices.body }}
          </p>
          <ul
            class="grid w-full max-w-2xl list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 sm:gap-5 lg:max-w-none"
            role="list"
          >
            <li
              v-for="item in splitServices.items"
              :key="item"
              class="split-reveal split-services-card flex w-full gap-4 rounded-xl border border-white/12 bg-white/6 p-4 backdrop-blur-md sm:p-5"
            >
              <span
                class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary ring-1 ring-primary/30"
              >
                <Check :size="14" stroke-width="3" />
              </span>
              <span class="text-left text-[12px] leading-snug text-white/72 sm:text-[13px]">
                {{ item }}
              </span>
            </li>
          </ul>
          <div class="split-reveal flex justify-center lg:justify-start">
            <a
              href="/apps"
              class="split-cta-services font-display text-[13px] font-bold no-underline"
            >
              <span class="split-cta-services__inner">
                {{ splitServices.btnLabel }}
                <span class="split-cta-services__icon" aria-hidden="true">
                  <ArrowRight :size="17" stroke-width="2.5" />
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ── BENEFITS ── -->
    <section
      ref="benefitsSection"
      class="bg-white py-12 sm:py-16 w-full flex items-center justify-center flex-col gap-5"
    >
      <div class="text-center mb-10 flex flex-col items-center justify-center gap-5">
        <h2
          class="font-display font-extrabold text-black mt-1 text-[clamp(24px,2.5vw,36px)] tracking-tight leading-tight max-w-3xl mx-auto text-center"
        >
          {{ t('benefits.title') }}
        </h2>
        <p class="text-gray-500 text-[14px] leading-relaxed max-w-xl mx-auto text-center">
          {{ t('benefits.subtitle') }}
        </p>
      </div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-7xl mx-auto px-4 sm:px-6 items-stretch"
      >
        <div
          v-for="b in benefitsData"
          :key="b.title"
          class="benefit-item text-center px-3 sm:px-4 py-4 sm:py-6 group cursor-default flex flex-col items-center h-full gap-3"
        >
          <div
            class="icon-box w-12 h-12 p-3 rounded-[14px] bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 text-primary group-hover:bg-primary/20 group-hover:shadow-[0_0_28px_rgba(17,211,211,.22)] transition-all duration-300"
          >
            <component :is="b.icon" :size="24" />
          </div>
          <h4 class="font-display font-bold text-black text-[14px] mb-2 tracking-tight">
            {{ b.title }}
          </h4>
          <p class="text-muted text-[13px] leading-relaxed">{{ b.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ── BLOG (convite — meio da página, antes do CTA) ── -->
    <section
      ref="blogStripSection"
      class="border-y border-gray-200/90 bg-linear-to-b from-white via-mid to-white py-14 sm:py-20 w-full flex items-center justify-center"
    >
      <div
        class="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 sm:gap-12 sm:px-6 lg:px-8"
      >
        <div
          class="flex flex-col items-center gap-5 text-center md:flex-row md:items-end md:justify-between md:gap-8 md:text-left"
        >
          <div class="flex max-w-2xl flex-col items-center gap-3 md:items-start md:gap-4">
            <span
              class="blog-strip-reveal inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white px-3 py-1 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-primary shadow-sm"
            >
              <BookOpen :size="12" stroke-width="2.5" aria-hidden="true" />
              {{ t('homeBlogStrip.badge') }}
            </span>
            <h2
              class="blog-strip-reveal font-display text-[clamp(1.35rem,3vw,1.85rem)] font-extrabold leading-tight tracking-tight text-black"
            >
              {{ t('homeBlogStrip.title') }}
            </h2>
            <p
              class="blog-strip-reveal text-[13px] leading-relaxed text-gray-500 sm:text-[14px]"
            >
              {{ t('homeBlogStrip.subtitle') }}
            </p>
          </div>
          <a
            href="/blog"
            class="blog-strip-reveal inline-flex shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 font-display text-[12px] font-bold text-gray-800 no-underline shadow-sm hover:border-primary/40 hover:text-primary"
          >
            {{ t('homeBlogStrip.cta') }}
            <ArrowRight :size="14" class="text-primary" aria-hidden="true" />
          </a>
        </div>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
          <a
            v-for="post in homeBlogStripPosts"
            :key="post.id"
            :href="`/blog/${post.id}`"
            class="home-blog-card group flex flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white text-inherit no-underline shadow-[0_6px_28px_rgba(15,23,42,0.06)] outline-none ring-primary/0 focus-visible:ring-2 focus-visible:ring-primary md:hover:border-primary/35 md:hover:shadow-[0_18px_44px_-16px_rgba(17,211,211,0.22)]"
            @click.prevent="goHomeBlogPost(post.id)"
          >
            <div
              class="relative flex h-28 shrink-0 items-center justify-center bg-dark sm:h-32"
            >
              <div
                class="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/20 via-dark to-dark"
              />
              <div class="hero-grid absolute inset-0 opacity-35" />
              <BookOpen
                :size="36"
                stroke-width="2"
                class="relative z-10 text-primary"
                aria-hidden="true"
              />
              <span
                class="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 font-display text-[9px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm"
              >
                <Tag :size="10" class="shrink-0" aria-hidden="true" />
                {{ post.catLabel }}
              </span>
            </div>
            <div class="flex flex-1 flex-col gap-2 p-5 sm:p-6">
              <h3
                class="font-display text-[15px] font-bold leading-snug tracking-tight text-black group-hover:text-primary sm:text-[16px]"
              >
                {{ post.title }}
              </h3>
              <p class="line-clamp-2 text-[13px] leading-relaxed text-gray-500">
                {{ post.excerpt }}
              </p>
              <div
                class="mt-auto flex items-center gap-2 border-t border-gray-100 pt-3 text-[11px] text-gray-400"
              >
                <Calendar :size="12" aria-hidden="true" />
                {{ post.date }}
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- ── CTA ── -->
    <section
      ref="ctaSection"
      class="bg-dark py-12 sm:py-[72px] relative overflow-hidden w-full flex items-center justify-center"
    >
      <div
        class="absolute -top-48 left-1/2 -translate-x-1/2 w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] lg:w-[680px] lg:h-[680px] rounded-full pointer-events-none cta-glow"
      />

      <!-- Ghost brand type -->
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
        ref="ctaInner"
        class="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 flex flex-col gap-5"
      >
        <span
          class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary mb-3"
          >{{ t('cta.badge') }}</span
        >
        <h2
          class="font-display font-extrabold text-white mt-2 mb-4 text-[clamp(22px,2.2vw,36px)] leading-tight tracking-tight"
        >
          {{ t('cta.title') }}
        </h2>
        <p class="text-white/45 text-[14px] leading-relaxed mb-8">
          {{ t('cta.subtitle') }}
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <a :href="calendlyUrl" target="_blank" rel="noopener noreferrer">
            <Button :label="t('cta.button.primary')" unstyled class="btn-primary font-display" />
          </a>
          <a href="/equipment">
            <Button :label="t('cta.button.secondary')" unstyled class="btn-ghost font-display" />
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Marquee: deslocamento = largura medida da 1ª faixa (--marquee-shift), evita salto de -50% */
.marquee-track {
  animation: none;
  will-change: transform;
}
.marquee-track.marquee-track--ready {
  animation: marquee-scroll-pixel var(--marquee-dur, 55s) linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .marquee-track.marquee-track--ready {
    animation: none;
  }
}
@keyframes marquee-scroll-pixel {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(calc(-1 * var(--marquee-shift, 0px)), 0, 0);
  }
}

/* Background patterns */
.hero-grid {
  background-image:
    linear-gradient(rgba(17, 211, 211, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(17, 211, 211, 0.04) 1px, transparent 1px);
  background-size: 64px 64px;
}
.stripe-bg {
  background-image: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 12px,
    rgba(17, 211, 211, 0.03) 12px,
    rgba(17, 211, 211, 0.03) 24px
  );
}
.cta-glow {
  background: radial-gradient(circle, rgba(17, 211, 211, 0.08) 0%, transparent 70%);
}

/* CTA ghost headline */
.cta-ghost {
  font-size: clamp(120px, 20vw, 340px);
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.07);
  letter-spacing: -0.05em;
}

/* Split sections — monitoring (claro) */
.split-section-monitoring {
  background:
    linear-gradient(180deg, #ffffff 0%, #f4f6f7 42%, #fafcfd 100%);
}
.split-monitoring-glow {
  background:
    radial-gradient(ellipse 90% 70% at 100% 0%, rgba(17, 211, 211, 0.14), transparent 55%),
    radial-gradient(ellipse 60% 50% at 0% 100%, rgba(17, 211, 211, 0.08), transparent 50%);
}

/* Split sections — serviços (escuro) */
.split-section-services {
  background: linear-gradient(165deg, #0e1117 0%, #121a24 45%, #0e1117 100%);
}
.split-services-mesh {
  background-image:
    linear-gradient(rgba(17, 211, 211, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(17, 211, 211, 0.035) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 85% 75% at 50% 50%, black 20%, transparent 72%);
}
.split-services-mesh::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 70% 20%, rgba(17, 211, 211, 0.12), transparent 42%),
    radial-gradient(circle at 15% 80%, rgba(17, 211, 211, 0.06), transparent 40%);
  pointer-events: none;
}

/* CTAs split: hover em CSS (transform só no ícone interno — o GSAP anima o .split-reveal pai) */
.split-cta-monitoring--primary .split-cta-monitoring__inner {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.125rem 0.625rem 1.25rem;
  border-radius: 0.5rem;
  background: #11d3d3;
  color: #0e1117;
  box-shadow: 0 8px 28px rgba(17, 211, 211, 0.32);
  transition:
    box-shadow 0.28s ease,
    filter 0.28s ease;
}
.split-cta-monitoring__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.28s ease;
}
.split-cta-services .split-cta-services__inner {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.125rem 0.625rem 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(17, 211, 211, 0.45);
  background: rgba(17, 211, 211, 0.1);
  color: #11d3d3;
  box-shadow: 0 0 0 0 rgba(17, 211, 211, 0);
  transition:
    border-color 0.28s ease,
    background-color 0.28s ease,
    box-shadow 0.28s ease,
    color 0.28s ease;
}
.split-cta-services__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.28s ease;
}

.split-cta-monitoring--primary:focus-visible .split-cta-monitoring__inner,
.split-cta-services:focus-visible .split-cta-services__inner {
  outline: 2px solid #11d3d3;
  outline-offset: 3px;
}

@media (hover: hover) {
  .split-cta-monitoring--primary:hover .split-cta-monitoring__inner {
    box-shadow: 0 14px 40px rgba(17, 211, 211, 0.48);
    filter: brightness(1.06);
  }
  .split-cta-monitoring--primary:hover .split-cta-monitoring__icon {
    transform: translateX(4px);
  }
  .split-cta-services:hover .split-cta-services__inner {
    border-color: rgba(17, 211, 211, 0.85);
    background: rgba(17, 211, 211, 0.18);
    color: #5ee8e8;
    box-shadow: 0 0 32px -4px rgba(17, 211, 211, 0.35);
  }
  .split-cta-services:hover .split-cta-services__icon {
    transform: translateX(4px);
  }
  .split-monitoring-card:hover {
    border-color: rgba(17, 211, 211, 0.45);
    box-shadow: 0 16px 48px -12px rgba(17, 211, 211, 0.18);
  }
  .split-services-card:hover {
    border-color: rgba(17, 211, 211, 0.38);
    background-color: rgba(255, 255, 255, 0.09);
  }
}

/* Split visual */
.split-visual {
  position: relative;
  background: linear-gradient(135deg, #1e3040, #0d1e2a);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.18);
}
.split-visual--framed {
  box-shadow:
    0 28px 72px rgba(15, 23, 42, 0.12),
    0 0 0 1px rgba(17, 211, 211, 0.08);
}
.split-visual--services {
  box-shadow:
    0 0 0 1px rgba(17, 211, 211, 0.22),
    0 28px 80px rgba(0, 0, 0, 0.45),
    0 0 100px -20px rgba(17, 211, 211, 0.25);
}

/* Pulse animation */
.em-pulse {
  animation: em-pulse 2s infinite;
}
@keyframes em-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(17, 211, 211, 0.65);
  }
  50% {
    box-shadow: 0 0 0 7px rgba(17, 211, 211, 0);
  }
}

/* Buttons */
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
