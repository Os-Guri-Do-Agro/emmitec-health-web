<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
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
} from 'lucide-vue-next'

// Imagens
import imgRPM from '@/assets/home/RPM.jpg'
import imgTecnologiaRPM from '@/assets/home/tecnologia_rpm.jpg'
import imgRevolucionando from '@/assets/home/revolucionando.jpg'
import imgMonitoramento from '@/assets/home/monitoramento.jpg'
import imgNossaHistoria from '@/assets/home/nossa_historia.jpg'
import headerIMG from '@/assets/home/header_img.png'

const { t, locale } = useI18n()

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

// ── MARQUEE ──
const marquee = ref<HTMLElement | null>(null)
let marqueeTween: gsap.core.Tween | null = null

const marqueeItems = computed(() => [
  t('hero.stats.accuracy'),
  t('hero.stats.clinics'),
  t('hero.stats.support'),
  t('cards.rpm.label'),
  t('cards.ai.label'),
  t('cards.dashboard.label'),
])

function startMarquee() {
  if (!marquee.value) return
  const track = marquee.value.querySelector('.marquee-track') as HTMLElement | null
  if (!track) return
  marqueeTween?.kill()
  gsap.set(track, { x: 0 })
  const half = track.scrollWidth / 2
  if (half <= 0) return
  marqueeTween = gsap.to(track, {
    x: -half,
    duration: Math.max(24, half / 55),
    ease: 'none',
    repeat: -1,
  })
}

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
    image: imgTecnologiaRPM,
  },
  {
    icon: Cpu,
    headerLabel: t('cards.ai.label'),
    title: t('cards.ai.title'),
    description: t('cards.ai.description'),
    image: imgNossaHistoria,
  },
  {
    icon: Users,
    headerLabel: t('cards.dashboard.label'),
    title: t('cards.dashboard.title'),
    description: t('cards.dashboard.description'),
    image: imgRevolucionando,
  },
])

// ── SPLIT FEATURES ──
const split1 = ref<Element | null>(null)
const split2 = ref<Element | null>(null)

const splitFeatures = computed(() => [
  {
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
    dark: false,
    reverse: false,
  },
  {
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
    dark: true,
    reverse: true,
  },
])

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

// ── CTA ──
const ctaSection = ref<HTMLElement | null>(null)
const ctaInner = ref<HTMLElement | null>(null)

onMounted(() => {
  startMarquee()

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

  // Split sections
  ;[split1.value, split2.value].forEach((el) => {
    if (el && el instanceof Element) {
      gsap.from(el.querySelectorAll('h2, p, ul, button, .split-visual'), {
        opacity: 0,
        y: 30,
        stagger: 0.09,
        duration: 0.72,
        ease: 'power3.out',
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
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((t) => t.kill())
  marqueeTween?.kill()
})

// Re-animar números quando o idioma mudar
watch(locale, async () => {
  heroStatNumbers.value.forEach((el, index) => {
    const targetValue = heroStatsData.value[index]?.num
    if (el && targetValue !== undefined) {
      // Reset para 0 antes de animar
      el.textContent = '0'
      animateCounter(el, targetValue, 1.5)
    }
  })
  await nextTick()
  startMarquee()
})
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
              <Button
                :label="t('hero.button.demo')"
                unstyled
                class="btn-primary font-display font-bold"
              />
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
              <div v-for="(s, index) in heroStatsData" :key="s.label" class="text-left">
                <div
                  class="font-display font-extrabold text-white text-[18px] sm:text-[20px] tracking-tight"
                >
                  <span
                    class="font-display font-extrabold"
                    :ref="
                      (el) => {
                        if (el) heroStatNumbers[index] = el as HTMLElement
                      }
                    "
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

    <!-- ── MARQUEE ── -->
    <div
      ref="marquee"
      class="marquee bg-dark border-t border-white/10 py-4 overflow-hidden w-full"
      aria-hidden="true"
    >
      <div class="marquee-track flex whitespace-nowrap will-change-transform">
        <template v-for="n in 2" :key="n">
          <div
            v-for="item in marqueeItems"
            :key="item + n"
            class="marquee-item flex items-center font-display font-bold uppercase tracking-[3px] text-white/35 text-[12px] sm:text-[13px] px-8"
          >
            <span>{{ item }}</span>
            <span class="text-primary ml-8">◆</span>
          </div>
        </template>
      </div>
    </div>

    <!-- ── INTRO ── -->
    <section
      ref="introSection"
      class="bg-white py-12 sm:py-16 w-full flex flex-col items-center justify-center gap-5"
    >
      <div class="text-center px-6 flex flex-col items-center justify-center gap-5">
        <span class="inline-block text-[11px] font-bold uppercase text-primary mb-3 font-display">{{
          t('intro.badge')
        }}</span>
        <h2
          class="font-display font-extrabold text-black text-[clamp(20px,2vw,30px)] tracking-tight leading-tight max-w-xl mx-auto mb-4 mt-1"
        >
          {{ t('intro.title') }}
        </h2>
        <p class="text-gray-500 text-[14px] leading-relaxed max-w-md mx-auto text-center">
          {{ t('intro.description') }}
        </p>
      </div>

      <!-- Cards dentro da intro -->

      <!-- Desktop: Grid -->
      <div
        ref="cardsSection"
        class="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-7xl mx-auto px-4 sm:px-6"
      >
        <article
          v-for="(c, i) in cardsData"
          :key="c.title"
          class="service-card group relative rounded-2xl border border-gray-200/80 bg-white overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_24px_60px_-20px_rgba(17,211,211,0.35)]"
        >
          <!-- Imagem -->
          <div class="relative overflow-hidden aspect-16/10">
            <img
              :src="c.image"
              :alt="c.title"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-900 ease-out group-hover:scale-[1.06]"
            />
            <div class="absolute inset-0 bg-linear-to-t from-[#0a1218]/90 via-[#0a1218]/35 to-transparent" />

            <!-- Index chip -->
            <span
              class="absolute top-4 right-4 font-mono text-[10px] tracking-[3px] text-white/80 bg-white/5 backdrop-blur-sm border border-white/15 rounded-full px-2.5 py-1"
            >
              0{{ i + 1 }} / 0{{ cardsData.length }}
            </span>

            <!-- Label -->
            <span
              class="absolute bottom-4 left-4 font-mono text-[10px] text-primary tracking-[3px] uppercase font-semibold"
            >
              {{ c.headerLabel }}
            </span>

            <!-- Icon flutuante -->
            <div
              class="absolute -bottom-5 right-5 w-12 h-12 rounded-xl bg-primary text-dark flex items-center justify-center shadow-[0_10px_28px_rgba(17,211,211,0.45)] transition-all duration-500 group-hover:-translate-y-1 group-hover:rotate-[-4deg]"
            >
              <component :is="c.icon" :size="20" stroke-width="2.2" />
            </div>
          </div>

          <!-- Corpo -->
          <div class="p-6 pt-8 flex flex-col gap-3">
            <h3
              class="font-display font-bold text-gray-900 text-[17px] leading-snug tracking-tight"
            >
              {{ c.title }}
            </h3>
            <p class="text-gray-500 text-[13px] leading-[1.7]">{{ c.description }}</p>

            <div class="mt-4 pt-5 border-t border-gray-100 flex items-center justify-between">
              <a
                href="#"
                class="card-cta relative inline-flex items-center gap-2 text-primary text-[12px] font-display font-semibold tracking-wide no-underline"
              >
                <span>{{ t('cards.cta') }}</span>
                <ArrowRight :size="14" class="arrow-slide" />
              </a>
              <span class="font-mono text-[10px] text-gray-300 tracking-[2px]">
                {{ c.headerLabel.split(' ')[0] }}
              </span>
            </div>
          </div>
        </article>
      </div>

      <!-- Mobile: Carousel -->
      <div
        class="md:hidden w-full max-w-md mx-auto px-4"
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
              class="service-card group w-full shrink-0 rounded-2xl border border-gray-200/80 bg-white overflow-hidden"
            >
              <!-- Imagem -->
              <div class="relative overflow-hidden aspect-16/10">
                <img
                  :src="c.image"
                  :alt="c.title"
                  class="absolute inset-0 w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-linear-to-t from-[#0a1218]/90 via-[#0a1218]/35 to-transparent" />

                <span
                  class="absolute top-4 right-4 font-mono text-[10px] tracking-[3px] text-white/80 bg-white/5 backdrop-blur-sm border border-white/15 rounded-full px-2.5 py-1"
                >
                  0{{ i + 1 }} / 0{{ cardsData.length }}
                </span>

                <span
                  class="absolute bottom-4 left-4 font-mono text-[10px] text-primary tracking-[3px] uppercase font-semibold"
                >
                  {{ c.headerLabel }}
                </span>

                <div
                  class="absolute -bottom-5 right-5 w-12 h-12 rounded-xl bg-primary text-dark flex items-center justify-center shadow-[0_10px_28px_rgba(17,211,211,0.45)]"
                >
                  <component :is="c.icon" :size="20" stroke-width="2.2" />
                </div>
              </div>

              <!-- Corpo -->
              <div class="p-6 pt-8 flex flex-col gap-3">
                <h3
                  class="font-display font-bold text-gray-900 text-[17px] leading-snug tracking-tight"
                >
                  {{ c.title }}
                </h3>
                <p class="text-gray-500 text-[13px] leading-[1.7]">{{ c.description }}</p>

                <div class="mt-4 pt-5 border-t border-gray-100 flex items-center justify-between">
                  <a
                    href="#"
                    class="card-cta relative inline-flex items-center gap-2 text-primary text-[12px] font-display font-semibold tracking-wide no-underline"
                  >
                    <span>{{ t('cards.cta') }}</span>
                    <ArrowRight :size="14" class="arrow-slide" />
                  </a>
                  <span class="font-mono text-[10px] text-gray-300 tracking-[2px]">
                    {{ c.headerLabel.split(' ')[0] }}
                  </span>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- Indicators -->
        <div class="flex justify-center gap-2 mt-12 pt-4">
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

    <!-- ── SPLIT FEATURES ── -->
    <section
      v-for="(f, i) in splitFeatures"
      :key="f.tag"
      :ref="
        (el) => {
          if (el) {
            const el2 = '$el' in el ? el.$el : el
            i === 0 ? (split1 = el2) : (split2 = el2)
          }
        }
      "
      class="py-12 sm:py-16 w-full flex items-center justify-center"
      :class="f.dark ? 'bg-dark-2' : 'bg-mid'"
    >
      <div
        class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-center"
        :style="f.reverse ? 'direction:rtl' : ''"
      >
        <!-- Text -->
        <div :style="f.reverse ? 'direction:ltr' : ''" class="flex flex-col gap-5 pb-7 md:pb-0">
          <span
            v-if="f.tag"
            class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary mb-3"
            >{{ f.tag }}</span
          >
          <h2
            class="font-display font-extrabold tracking-tight leading-tight text-[clamp(22px,4vw,28px)] mb-3 mt-1"
            :class="f.dark ? 'text-white' : 'text-black'"
          >
            {{ f.title }}
          </h2>
          <p class="text-muted text-[14px] leading-relaxed">{{ f.body }}</p>
          <ul class="list-none mt-5 mb-6 flex flex-col gap-2.5 text-left">
            <li
              v-for="item in f.items"
              :key="item"
              class="flex items-start gap-2.5 text-[13px]"
              :class="f.dark ? 'text-white/55' : 'text-sec'"
            >
              <span
                class="icon-box w-5 h-5 p-1 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0 mt-0.5 text-primary"
              >
                <Check :size="12" stroke-width="3" />
              </span>
              {{ item }}
            </li>
          </ul>
          <Button :label="f.btnLabel" unstyled class="btn-primary font-display font-extrabold" />
        </div>
        <!-- Image -->
        <div :style="f.reverse ? 'direction:ltr' : ''">
          <div
            class="split-visual rounded-2xl overflow-hidden aspect-video md:aspect-4/3 relative shadow-[0_28px_72px_rgba(0,0,0,.22)]"
          >
            <img
              :src="f.image"
              :alt="f.imgAlt"
              class="absolute inset-0 w-full h-full object-cover"
            />
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
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-7xl mx-auto px-4 sm:px-6"
      >
        <div
          v-for="b in benefitsData"
          :key="b.title"
          class="benefit-item text-center px-3 sm:px-4 py-4 sm:py-6 group cursor-default flex flex-col items-center justify-center gap-3"
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
          <Button :label="t('cta.button.specialist')" unstyled class="btn-primary font-display" />
          <Button :label="t('cta.button.cases')" unstyled class="btn-ghost font-display" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
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

/* Service card CTA — underline animado + seta desliza */
.card-cta {
  position: relative;
}
.card-cta::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 0;
  height: 1px;
  background: currentColor;
  transition: width 0.35s ease;
}
.service-card:hover .card-cta::after {
  width: 100%;
}
.arrow-slide {
  transition: transform 0.35s ease;
}
.service-card:hover .arrow-slide {
  transform: translateX(4px);
}

/* Split visual placeholder */
.split-visual {
  border-radius: 20px;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  position: relative;
  background: linear-gradient(135deg, #1e3040, #0d1e2a);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.18);
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
