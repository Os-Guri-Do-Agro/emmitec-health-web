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
import googlePlayWhiteImg from '@/assets/apps/google-play-white.png'
import heroPhoneMenuImg from '@/assets/apps/tela-01.jpeg'
import heroPhoneScanImg from '@/assets/apps/tela-02.jpeg'
import HeroLogoMark from '@/components/HeroLogoMark.vue'

import {
  Bell,
  Calendar,
  MessageSquare,
  Pill,
  Check,
  ShieldCheck,
  Zap,
  ChevronLeft,
  ChevronRight,
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
const heroPhones = ref<HTMLElement | null>(null)

const appsListSection = ref<HTMLElement | null>(null)
const standardsSection = ref<HTMLElement | null>(null)
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

const APPS_PER_PAGE = 2

const appPages = computed(() => {
  const pages: (typeof apps)[] = []
  for (let i = 0; i < apps.length; i += APPS_PER_PAGE) {
    pages.push(apps.slice(i, i + APPS_PER_PAGE))
  }
  return pages
})

const currentAppPage = ref(0)
const touchStartX = ref(0)
const touchEndX = ref(0)

const AUTOPLAY_MS = 3000
let autoplayTimer: ReturnType<typeof setInterval> | null = null

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

function startAutoplay() {
  stopAutoplay()
  autoplayTimer = setInterval(() => {
    nextAppPage()
  }, AUTOPLAY_MS)
}

function goToAppPage(index: number) {
  currentAppPage.value = index
  startAutoplay()
}

function nextAppPage() {
  currentAppPage.value = (currentAppPage.value + 1) % appPages.value.length
}

function prevAppPage() {
  currentAppPage.value = (currentAppPage.value - 1 + appPages.value.length) % appPages.value.length
}

function goNextAppPage() {
  nextAppPage()
  startAutoplay()
}

function goPrevAppPage() {
  prevAppPage()
  startAutoplay()
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
    if (diff > 0) goNextAppPage()
    else goPrevAppPage()
  }
}

const standardsBlocks = computed(() => [
  {
    badge: t('appsPage.patient.badge'),
    title: t('appsPage.patient.title'),
    description: t('appsPage.patient.description'),
    items: [
      t('appsPage.patient.feature1'),
      t('appsPage.patient.feature2'),
      t('appsPage.patient.feature3'),
      t('appsPage.patient.feature4'),
    ],
  },
  {
    badge: t('appsPage.clinical.badge'),
    title: t('appsPage.clinical.title'),
    description: t('appsPage.clinical.description'),
    items: [
      t('appsPage.clinical.feature1'),
      t('appsPage.clinical.feature2'),
      t('appsPage.clinical.feature3'),
      t('appsPage.clinical.feature4'),
    ],
  },
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

  if (heroPhones.value) {
    const back = heroPhones.value.querySelector('.hero-phone--back')
    const front = heroPhones.value.querySelector('.hero-phone--front')
    gsap
      .timeline({ defaults: { ease: 'power3.out' } })
      .from(back, { opacity: 0, x: -28, y: 24, duration: 0.9 }, 0.2)
      .from(front, { opacity: 0, x: 28, y: 28, duration: 0.9 }, 0.32)

    gsap.to(back, {
      y: -8,
      duration: 3.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })
    gsap.to(front, {
      y: 8,
      duration: 3.8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 0.35,
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

  animate(appsListSection.value, '.apps-carousel', { stagger: 0.1 })
  animate(standardsSection.value, '.standards-block', { stagger: 0.12 })
  animate(featuresSection.value, '.feature-card', { stagger: 0.08 })
  animate(downloadSection.value, '.download-item', { stagger: 0.12 })

  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
  if (heroPhones.value) gsap.killTweensOf(heroPhones.value.querySelectorAll('.hero-phone'))
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
              {{ t('appsPage.hero.badge') }}
            </span>
            <h1 ref="heroTitle" class="display-2 text-white">
              {{ t('appsPage.hero.title') }}
            </h1>
            <p ref="heroSub" class="lead max-w-xl text-white/55">
              {{ t('appsPage.hero.subtitle') }}
            </p>
            <div ref="heroActions" class="flex gap-4 flex-wrap mt-4">
              <a :href="calendlyUrl" target="_blank" rel="noopener noreferrer">
                <Button
                  :label="t('appsPage.hero.button.primary')"
                  unstyled
                  class="btn-primary font-display font-bold"
                />
              </a>
            </div>
          </div>
        </div>

        <!-- Right visual: phone mockups -->
        <div class="hidden lg:flex relative h-full items-center justify-center p-10 xl:p-14">
          <div
            ref="heroPhones"
            class="hero-phones relative z-10 h-[420px] w-[340px] xl:h-[460px] xl:w-[380px]"
          >
            <div
              class="hero-phones-glow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              aria-hidden="true"
            />

            <!-- Back phone: scanning -->
            <div class="hero-phone hero-phone--back absolute left-0 top-8">
              <div class="hero-phone-tilt hero-phone-tilt--back">
                <div class="hero-phone-shell">
                  <img
                    :src="heroPhoneScanImg"
                    alt="Emmitec Health — escaneamento"
                    class="hero-phone-screen"
                    draggable="false"
                  />
                </div>
              </div>
            </div>

            <!-- Front phone: menu -->
            <div class="hero-phone hero-phone--front absolute right-0 top-0">
              <div class="hero-phone-tilt hero-phone-tilt--front">
                <div class="hero-phone-shell hero-phone-shell--front">
                  <img
                    :src="heroPhoneMenuImg"
                    alt="Emmitec Health — menu principal"
                    class="hero-phone-screen"
                    draggable="false"
                  />
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
      class="py-20 sm:py-24 lg:py-28 bg-mid relative overflow-hidden w-full flex items-center justify-center"
    >
      <div class="hero-grid absolute inset-0 pointer-events-none opacity-40" />
      <div class="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        <div class="mx-auto mb-16 flex max-w-3xl flex-col items-center gap-6 text-center">
          <span class="eyebrow eyebrow--light">
            {{ t('appsPage.suite.badge') }}
          </span>
          <h2 class="display-2 text-dark">
            {{ t('appsPage.suite.title') }}
          </h2>
          <p class="lead max-w-2xl text-dark/55">
            {{ t('appsPage.suite.subtitle') }}
          </p>
        </div>

        <div
          class="apps-carousel flex flex-col gap-6"
          @touchstart="onTouchStart"
          @touchend="onTouchEnd"
        >
          <div class="relative flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              class="carousel-nav hidden sm:flex shrink-0"
              :aria-label="t('aria.prevSlide')"
              @click="goPrevAppPage"
            >
              <ChevronLeft :size="22" stroke-width="2.5" />
            </button>

            <div class="relative flex-1 overflow-hidden">
              <div
                class="flex transition-transform duration-500 ease-out"
                :style="{ transform: `translateX(-${currentAppPage * 100}%)` }"
              >
                <div
                  v-for="(page, pageIndex) in appPages"
                  :key="pageIndex"
                  class="grid w-full shrink-0 grid-cols-2 gap-3 sm:gap-5 px-0.5"
                >
                  <article
                    v-for="app in page"
                    :key="app.name"
                    class="app-card rounded-2xl overflow-hidden flex flex-col"
                  >
                    <div class="relative overflow-hidden">
                      <img
                        :src="app.img"
                        :alt="app.name"
                        class="block w-full h-auto object-cover"
                        loading="lazy"
                      />
                      <div
                        class="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-dark-2 to-transparent pointer-events-none"
                      />
                    </div>
                    <div
                      class="px-3 sm:px-5 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4 flex-wrap bg-dark"
                    >
                      <span class="font-display font-bold text-white text-[12px] sm:text-[15px]">{{
                        app.name
                      }}</span>
                      <div class="flex gap-1.5 sm:gap-2 flex-wrap">
                        <a
                          v-if="app.apple"
                          :href="app.apple"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="store-badge"
                        >
                          <img
                            :src="appStoreWhiteImg"
                            alt="Download on the App Store"
                            class="h-7 sm:h-9"
                          />
                        </a>
                        <a
                          v-if="app.google"
                          :href="app.google"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="store-badge"
                        >
                          <img
                            :src="googlePlayWhiteImg"
                            alt="Get it on Google Play"
                            class="h-7 sm:h-9"
                          />
                        </a>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>

            <button
              type="button"
              class="carousel-nav hidden sm:flex shrink-0"
              :aria-label="t('aria.nextSlide')"
              @click="goNextAppPage"
            >
              <ChevronRight :size="22" stroke-width="2.5" />
            </button>
          </div>

          <div class="flex justify-center gap-2.5">
            <button
              v-for="(_, index) in appPages"
              :key="index"
              type="button"
              class="h-2 rounded-full transition-all duration-300"
              :class="
                index === currentAppPage ? 'w-6 bg-primary' : 'w-2 bg-dark/20 hover:bg-dark/35'
              "
              :aria-label="t('aria.goToSlide', { index: index + 1 })"
              @click="goToAppPage(index)"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ── PADRÃO INTERNACIONAL + PLATAFORMA MODULAR ── -->
    <section ref="standardsSection" class="w-full bg-white py-20 sm:py-24 lg:py-28">
      <div class="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <div class="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <article
            v-for="block in standardsBlocks"
            :key="block.badge"
            class="standards-block flex flex-col items-start gap-6"
          >
            <span class="eyebrow eyebrow--light">{{ block.badge }}</span>
            <h2 class="display-3 text-black">{{ block.title }}</h2>
            <p class="max-w-[62ch] text-[15px] leading-[1.8] text-gray-500">
              {{ block.description }}
            </p>
            <ul class="m-0 w-full list-none p-0">
              <li
                v-for="item in block.items"
                :key="item"
                class="standards-row group flex items-start gap-4 border-t border-gray-200/80 py-4"
              >
                <span
                  class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/25 transition-all duration-300 group-hover:bg-primary group-hover:text-dark"
                >
                  <Check :size="13" stroke-width="3" aria-hidden="true" />
                </span>
                <span class="text-[14.5px] leading-relaxed text-gray-700">{{ item }}</span>
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <!-- ── DIFERENCIAIS ── -->
    <section ref="featuresSection" class="apps-features w-full py-20 sm:py-24 lg:py-28">
      <div class="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <div class="mx-auto mb-16 flex max-w-3xl flex-col items-center gap-6 text-center">
          <span class="eyebrow eyebrow--light">{{ t('appsPage.features.badge') }}</span>
          <h2 class="display-2 text-black">{{ t('appsPage.features.title') }}</h2>
          <p class="lead max-w-2xl text-gray-500">{{ t('appsPage.features.subtitle') }}</p>
        </div>

        <div class="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          <article
            v-for="f in featureGrid"
            :key="f.title"
            class="feature-card group relative flex h-full gap-5 overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-7"
          >
            <span
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary transition-all duration-400 group-hover:bg-primary group-hover:text-dark"
            >
              <component :is="f.icon" :size="22" stroke-width="2.1" aria-hidden="true" />
            </span>
            <div class="min-w-0">
              <h3 class="font-display text-[15.5px] font-bold tracking-tight text-black">
                {{ f.title }}
              </h3>
              <p class="mt-2.5 text-[13.5px] leading-relaxed text-muted">{{ f.desc }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ── DOWNLOAD CTA ── -->
    <section
      ref="downloadSection"
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
/* Diferenciais */
.apps-features {
  background: linear-gradient(180deg, #ffffff 0%, #f7f9fa 55%, #ffffff 100%);
}
.feature-card {
  transition:
    transform 0.4s ease,
    border-color 0.4s ease,
    box-shadow 0.4s ease;
}
.standards-row {
  transition: border-color 0.3s ease;
}
@media (hover: hover) {
  .feature-card:hover {
    transform: translateY(-5px);
    border-color: rgba(17, 211, 211, 0.35);
    box-shadow: 0 24px 54px -28px rgba(17, 211, 211, 0.45);
  }
  .standards-row:hover {
    border-color: rgba(17, 211, 211, 0.5);
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

.hero-phones-glow {
  width: 280px;
  height: 280px;
  border-radius: 999px;
  background: radial-gradient(
    circle,
    rgba(17, 211, 211, 0.22) 0%,
    rgba(17, 211, 211, 0.05) 45%,
    transparent 70%
  );
  filter: blur(8px);
  pointer-events: none;
}

.hero-phone--back {
  width: 196px;
  z-index: 1;
}

.hero-phone--front {
  width: 220px;
  z-index: 2;
}

.hero-phone-tilt--back {
  transform: rotate(-9deg);
}

.hero-phone-tilt--front {
  transform: rotate(7deg);
}

.hero-phone-shell {
  position: relative;
  border-radius: 34px;
  padding: 10px;
  background: linear-gradient(160deg, #1c2430 0%, #0e1117 55%, #121820 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 28px 60px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(17, 211, 211, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.hero-phone-shell--front {
  box-shadow:
    0 34px 70px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(17, 211, 211, 0.12),
    0 0 0 1px rgba(17, 211, 211, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.hero-phone-screen {
  display: block;
  width: 100%;
  aspect-ratio: 9 / 19.5;
  object-fit: cover;
  object-position: top center;
  border-radius: 26px;
  background: #fff;
}

@media (prefers-reduced-motion: reduce) {
  .hero-phone--back,
  .hero-phone--front {
    animation: none !important;
  }
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

.carousel-nav {
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 9999px;
  border: 1px solid rgba(14, 17, 23, 0.12);
  background: #fff;
  color: #0e1117;
  cursor: pointer;
  transition:
    border-color 0.25s,
    color 0.25s,
    background 0.25s,
    transform 0.25s,
    box-shadow 0.25s;
}
.carousel-nav:hover {
  border-color: #11d3d3;
  color: #11d3d3;
  box-shadow: 0 8px 24px rgba(17, 211, 211, 0.18);
  transform: translateY(-1px);
}
</style>
