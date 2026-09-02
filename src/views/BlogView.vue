<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from 'primevue/button'

import {
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Tag,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-vue-next'

import HeroLogoMark from '@/components/HeroLogoMark.vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const calendlyUrl = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `https://calendly.com/emilio-machado-emmitec-health/vamos-nos-reunir-agende-sua-reuniao-online?month=${year}-${month}`
})

gsap.registerPlugin(ScrollTrigger)

const heroTitle = ref<HTMLElement | null>(null)
const heroSub = ref<HTMLElement | null>(null)

const previewSection = ref<HTMLElement | null>(null)
const featuredSection = ref<HTMLElement | null>(null)
const articlesSection = ref<HTMLElement | null>(null)
const newsletterSection = ref<HTMLElement | null>(null)

const categoryIds = ['all', 'rpm', 'tech', 'cases', 'laws'] as const
type CategoryId = (typeof categoryIds)[number]

function resolveCategory(raw: unknown): CategoryId {
  const value = Array.isArray(raw) ? raw[0] : raw
  if (typeof value === 'string' && categoryIds.includes(value as CategoryId)) {
    return value as CategoryId
  }
  return 'all'
}

const activeCategory = ref<CategoryId>(resolveCategory(route.query.category))
const searchQuery = ref('')

function setCategory(id: CategoryId) {
  activeCategory.value = id
  const query = { ...route.query } as Record<string, string | string[] | undefined>
  if (id === 'all') delete query.category
  else query.category = id
  router.replace({ path: '/blog', query })
}

async function applyCategoryFromRoute(scroll = false) {
  activeCategory.value = resolveCategory(route.query.category)
  if (!scroll || activeCategory.value === 'all') return
  await nextTick()
  articlesSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

watch(
  () => route.query.category,
  () => {
    applyCategoryFromRoute(true)
  },
)

const categories = computed(() => [
  { id: 'all', label: t('blogPage.categories.all') },
  { id: 'rpm', label: t('blogPage.categories.rpm') },
  { id: 'tech', label: t('blogPage.categories.tech') },
  { id: 'cases', label: t('blogPage.categories.cases') },
  { id: 'laws', label: t('blogPage.categories.laws') },
])

const featuredArticle = computed(() => ({
  category: t('blogPage.categories.rpm'),
  title: t('blogPage.featured.title'),
  excerpt: t('blogPage.featured.excerpt'),
  author: t('blogPage.featured.author'),
  date: t('blogPage.featured.date'),
  readTime: '8 min',
  gradient: 'from-primary/30 via-primary/10 to-transparent',
}))

const articles = computed(() => [
  {
    id: 1,
    cat: 'tech',
    catLabel: t('blogPage.categories.tech'),
    title: t('blogPage.articles.a1.title'),
    excerpt: t('blogPage.articles.a1.excerpt'),
    date: t('blogPage.articles.a1.date'),
    readTime: '5 min',
    gradient: 'from-blue-500/30 via-blue-400/10 to-transparent',
  },
  {
    id: 2,
    cat: 'rpm',
    catLabel: t('blogPage.categories.rpm'),
    title: t('blogPage.articles.a2.title'),
    excerpt: t('blogPage.articles.a2.excerpt'),
    date: t('blogPage.articles.a2.date'),
    readTime: '6 min',
    gradient: 'from-primary/30 via-primary/10 to-transparent',
  },
  {
    id: 3,
    cat: 'cases',
    catLabel: t('blogPage.categories.cases'),
    title: t('blogPage.articles.a3.title'),
    excerpt: t('blogPage.articles.a3.excerpt'),
    date: t('blogPage.articles.a3.date'),
    readTime: '4 min',
    gradient: 'from-emerald-500/30 via-emerald-400/10 to-transparent',
  },
  {
    id: 4,
    cat: 'laws',
    catLabel: t('blogPage.categories.laws'),
    title: t('blogPage.articles.a4.title'),
    excerpt: t('blogPage.articles.a4.excerpt'),
    date: t('blogPage.articles.a4.date'),
    readTime: '7 min',
    gradient: 'from-amber-500/30 via-amber-400/10 to-transparent',
  },
  {
    id: 5,
    cat: 'tech',
    catLabel: t('blogPage.categories.tech'),
    title: t('blogPage.articles.a5.title'),
    excerpt: t('blogPage.articles.a5.excerpt'),
    date: t('blogPage.articles.a5.date'),
    readTime: '5 min',
    gradient: 'from-rose-500/30 via-rose-400/10 to-transparent',
  },
  {
    id: 6,
    cat: 'rpm',
    catLabel: t('blogPage.categories.rpm'),
    title: t('blogPage.articles.a6.title'),
    excerpt: t('blogPage.articles.a6.excerpt'),
    date: t('blogPage.articles.a6.date'),
    readTime: '6 min',
    gradient: 'from-purple-500/30 via-purple-400/10 to-transparent',
  },
])

const filteredArticles = computed(() => {
  let list = articles.value
  if (activeCategory.value !== 'all') {
    list = list.filter((a) => a.cat === activeCategory.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q),
    )
  }
  return list
})

/** Três posts para pré-visualização (convite à leitura). */
const previewPosts = computed(() => articles.value.slice(0, 3))

/** Até 5 posts no carrossel Em destaque. */
const FEATURED_MAX = 5
const featuredPosts = computed(() => {
  const main = {
    id: 0,
    catLabel: featuredArticle.value.category,
    title: featuredArticle.value.title,
    excerpt: featuredArticle.value.excerpt,
    date: featuredArticle.value.date,
    readTime: featuredArticle.value.readTime,
    gradient: featuredArticle.value.gradient,
    author: featuredArticle.value.author,
  }
  const rest = articles.value.slice(0, FEATURED_MAX - 1).map((a) => ({
    id: a.id,
    catLabel: a.catLabel,
    title: a.title,
    excerpt: a.excerpt,
    date: a.date,
    readTime: a.readTime,
    gradient: a.gradient,
    author: t('blogPage.featured.author'),
  }))
  return [main, ...rest]
})

const currentFeaturedPage = ref(0)
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
  if (featuredPosts.value.length <= 1) return
  autoplayTimer = setInterval(() => {
    nextFeaturedPage()
  }, AUTOPLAY_MS)
}

function goToFeaturedPage(index: number) {
  currentFeaturedPage.value = index
  startAutoplay()
}

function nextFeaturedPage() {
  const total = featuredPosts.value.length
  if (total === 0) return
  currentFeaturedPage.value = (currentFeaturedPage.value + 1) % total
}

function prevFeaturedPage() {
  const total = featuredPosts.value.length
  if (total === 0) return
  currentFeaturedPage.value = (currentFeaturedPage.value - 1 + total) % total
}

function goNextFeaturedPage() {
  nextFeaturedPage()
  startAutoplay()
}

function goPrevFeaturedPage() {
  prevFeaturedPage()
  startAutoplay()
}

function onFeaturedTouchStart(e: TouchEvent) {
  touchStartX.value = e.changedTouches[0]?.screenX ?? 0
}

function onFeaturedTouchEnd(e: TouchEvent) {
  touchEndX.value = e.changedTouches[0]?.screenX ?? 0
  const swipeThreshold = 50
  const diff = touchStartX.value - touchEndX.value
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) goNextFeaturedPage()
    else goPrevFeaturedPage()
  }
}

const goToArticle = (id: number) => {
  router.push(`/blog/${id}`)
}

onMounted(() => {
  applyCategoryFromRoute(Boolean(route.query.category))

  gsap
    .timeline({ defaults: { ease: 'power3.out', clearProps: 'opacity,transform' } })
    .from(heroTitle.value, { opacity: 0, y: 34, duration: 0.8 })
    .from(heroSub.value, { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')

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

  animate(previewSection.value, '.preview-card', { stagger: 0.1 })
  animate(featuredSection.value, '.featured-carousel', { stagger: 0.1 })
  animate(articlesSection.value, '.article-card', { stagger: 0.08 })
  animate(newsletterSection.value, '.animate-in')

  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
  ScrollTrigger.getAll().forEach((t) => t.kill())
})
</script>

<template>
  <div class="font-body text-black overflow-x-hidden w-full">
    <!-- ── HERO ── -->
    <section
      class="min-h-[60vh] sm:min-h-[70vh] bg-dark relative overflow-hidden w-full flex items-center justify-center"
    >
      <div class="page-hero-aurora pointer-events-none absolute inset-0" aria-hidden="true" />
      <div class="hero-grid absolute inset-0 pointer-events-none" />
      <HeroLogoMark variant="section" />

      <div
        class="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-6 px-6 py-24 text-center sm:px-8 lg:px-10 lg:py-32"
      >
        <span class="eyebrow eyebrow--dark">
          {{ t('blogPage.hero.badge') }}
        </span>
        <h1 ref="heroTitle" class="display-2 text-white">
          {{ t('blogPage.hero.title') }}
        </h1>
        <p ref="heroSub" class="lead max-w-2xl text-white/55">
          {{ t('blogPage.hero.subtitle') }}
        </p>
      </div>
    </section>

    <!-- ── FEATURED ARTICLES (carrossel) ── -->
    <section
      ref="featuredSection"
      class="py-20 sm:py-24 lg:py-28 bg-white w-full flex items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div class="flex items-center justify-between pb-8">
          <span class="eyebrow eyebrow--light">
            {{ t('blogPage.featured.badge') }}
          </span>
        </div>

        <div
          class="featured-carousel flex flex-col gap-5"
          @touchstart="onFeaturedTouchStart"
          @touchend="onFeaturedTouchEnd"
        >
          <div class="relative">
            <button
              type="button"
              class="carousel-nav absolute top-1/2 left-3 z-20 hidden -translate-y-1/2 sm:flex"
              :aria-label="t('aria.prevSlide')"
              @click.stop="goPrevFeaturedPage"
            >
              <ChevronLeft :size="22" stroke-width="2.5" />
            </button>

            <div class="overflow-hidden rounded-2xl">
              <div
                class="flex transition-transform duration-500 ease-out"
                :style="{ transform: `translateX(-${currentFeaturedPage * 100}%)` }"
              >
                <article
                  v-for="post in featuredPosts"
                  :key="post.id"
                  class="grid w-full shrink-0 grid-cols-1 lg:grid-cols-5 gap-0 lg:gap-0 border border-gray-200/80 overflow-hidden bg-white transition-all duration-500 hover:border-primary/30 hover:shadow-[0_24px_60px_-20px_rgba(17,211,211,0.35)] cursor-pointer"
                  @click="goToArticle(post.id)"
                >
                  <div
                    class="lg:col-span-3 relative aspect-16/10 lg:aspect-auto overflow-hidden min-h-[220px] lg:min-h-[280px]"
                  >
                    <div :class="`absolute inset-0 bg-linear-to-br ${post.gradient}`" />
                    <div
                      class="absolute inset-0 bg-linear-to-t from-[#0a1218]/85 via-[#0a1218]/30 to-transparent"
                    />
                    <div class="hero-grid absolute inset-0 pointer-events-none opacity-50" />
                    <div class="absolute top-5 left-5 flex items-center gap-2">
                      <span
                        class="px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-[10px] font-bold uppercase tracking-wider"
                      >
                        {{ post.catLabel }}
                      </span>
                    </div>
                    <div
                      class="absolute bottom-5 left-5 right-5 flex items-center gap-4 text-white/70 text-xs"
                    >
                      <span class="flex items-center gap-1.5">
                        <Calendar :size="12" />
                        {{ post.date }}
                      </span>
                      <span class="flex items-center gap-1.5">
                        <Clock :size="12" />
                        {{ post.readTime }}
                      </span>
                    </div>
                  </div>
                  <div class="lg:col-span-2 p-6 lg:p-10 flex flex-col gap-4 justify-center">
                    <h2 class="display-3 text-black">
                      {{ post.title }}
                    </h2>
                    <p class="text-gray-500 text-[14px] leading-relaxed">{{ post.excerpt }}</p>
                    <div class="flex items-center gap-3 mt-2 pt-4 border-t border-gray-100">
                      <div
                        class="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-display font-bold text-sm"
                      >
                        {{ post.author.charAt(0) }}
                      </div>
                      <div class="flex-1">
                        <div class="text-gray-700 font-semibold text-sm">{{ post.author }}</div>
                        <div class="text-gray-400 text-xs">{{ t('blogPage.featured.role') }}</div>
                      </div>
                      <ArrowRight :size="20" class="text-primary" />
                    </div>
                  </div>
                </article>
              </div>
            </div>

            <button
              type="button"
              class="carousel-nav absolute top-1/2 right-3 z-20 hidden -translate-y-1/2 sm:flex"
              :aria-label="t('aria.nextSlide')"
              @click.stop="goNextFeaturedPage"
            >
              <ChevronRight :size="22" stroke-width="2.5" />
            </button>
          </div>

          <div v-if="featuredPosts.length > 1" class="flex justify-center gap-2.5">
            <button
              v-for="(_, index) in featuredPosts"
              :key="index"
              type="button"
              class="h-2 rounded-full transition-all duration-300"
              :class="
                index === currentFeaturedPage ? 'w-6 bg-primary' : 'w-2 bg-dark/20 hover:bg-dark/35'
              "
              :aria-label="t('aria.goToSlide', { index: index + 1 })"
              @click="goToFeaturedPage(index)"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ── ARTICLES GRID ── -->
    <section
      id="blog-articles"
      ref="articlesSection"
      class="py-20 sm:py-24 lg:py-28 bg-mid w-full flex items-center justify-center scroll-mt-[72px]"
    >
      <div class="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div class="flex flex-col items-center text-center gap-5 mb-10">
          <span class="eyebrow eyebrow--light">
            {{ t('blogPage.articles.badge') }}
          </span>
          <h2 class="display-2 text-black">
            {{ t('blogPage.articles.title') }}
          </h2>
        </div>

        <!-- Search + Categories filter -->
        <div class="pb-5 flex flex-col items-center gap-5">
          <div class="relative w-full max-w-md">
            <Search
              :size="16"
              class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              v-model="searchQuery"
              type="search"
              :placeholder="t('blogPage.hero.searchPlaceholder')"
              class="w-full rounded-full border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-dark outline-none placeholder:text-gray-400 shadow-sm transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
            />
          </div>
          <div class="flex flex-wrap items-center justify-center gap-2">
            <button
              v-for="c in categories"
              :key="c.id"
              type="button"
              @click="setCategory(c.id as CategoryId)"
              :class="[
                'px-4 py-2 rounded-full text-[12px] font-display font-semibold transition-all',
                activeCategory === c.id
                  ? 'bg-primary text-dark border border-primary shadow-[0_8px_24px_rgba(17,211,211,0.25)]'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-primary/40 hover:text-primary',
              ]"
            >
              {{ c.label }}
            </button>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredArticles.length === 0" class="text-center py-10 text-gray-400 text-sm">
          {{ t('blogPage.articles.empty') }}
        </div>

        <!-- Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <article
            v-for="(a, i) in filteredArticles"
            :key="a.id"
            @click="goToArticle(a.id)"
            class="article-card group relative rounded-2xl border border-gray-200/80 bg-white overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_24px_60px_-20px_rgba(17,211,211,0.35)] cursor-pointer"
          >
            <div class="relative overflow-hidden aspect-16/10">
              <div :class="`absolute inset-0 bg-linear-to-br ${a.gradient}`" />
              <div
                class="absolute inset-0 bg-linear-to-t from-[#0a1218]/85 via-[#0a1218]/30 to-transparent"
              />
              <div class="hero-grid absolute inset-0 pointer-events-none opacity-50" />
              <span
                class="absolute top-4 right-4 font-mono text-[10px] tracking-[3px] text-white/80 bg-white/5 backdrop-blur-sm border border-white/15 rounded-full px-2.5 py-1"
              >
                0{{ i + 1 }}
              </span>
              <span
                class="absolute bottom-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-wider"
              >
                <Tag :size="10" />
                {{ a.catLabel }}
              </span>
            </div>
            <div class="p-6 flex flex-col gap-3">
              <h3
                class="font-display font-bold text-black text-[17px] leading-tight group-hover:text-primary transition-colors"
              >
                {{ a.title }}
              </h3>
              <p class="text-gray-500 text-[13px] leading-relaxed">{{ a.excerpt }}</p>
              <div
                class="flex items-center gap-4 pt-3 border-t border-gray-100 text-gray-400 text-xs"
              >
                <span class="flex items-center gap-1.5">
                  <Calendar :size="12" />
                  {{ a.date }}
                </span>
                <span class="flex items-center gap-1.5">
                  <Clock :size="12" />
                  {{ a.readTime }}
                </span>
                <ArrowRight
                  :size="16"
                  class="ml-auto text-primary group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ── PRÉ-VISUALIZAÇÃO (após a grelha, antes do newsletter) ── -->
    <section
      ref="previewSection"
      class="relative border-t border-gray-200/80 bg-linear-to-b from-white to-mid py-20 sm:py-24 lg:py-28 w-full flex items-center justify-center"
    >
      <div
        class="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/25 to-transparent"
        aria-hidden="true"
      />
      <div class="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div
          class="pb-5 flex flex-col gap-5 text-center sm:mb-20 md:mb-24 md:flex-row md:items-end md:justify-between md:text-left"
        >
          <div class="flex max-w-2xl flex-col items-center gap-4 md:items-start">
            <span
              class="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white px-3 py-1 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-primary shadow-sm"
            >
              <BookOpen :size="12" class="shrink-0" stroke-width="2.5" aria-hidden="true" />
              {{ t('blogPage.preview.badge') }}
            </span>
            <h2
              class="font-display text-[clamp(1.25rem,2.8vw,1.75rem)] font-extrabold leading-tight tracking-tight text-black"
            >
              {{ t('blogPage.preview.title') }}
            </h2>
            <p class="text-[13px] leading-relaxed text-gray-500 sm:text-[14px]">
              {{ t('blogPage.preview.subtitle') }}
            </p>
          </div>
          <a
            href="#blog-articles"
            class="hidden shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 font-display text-[12px] font-bold text-gray-700 no-underline shadow-sm md:inline-flex md:hover:border-primary/40 md:hover:text-primary"
          >
            {{ t('blogPage.preview.ctaScroll') }}
            <ArrowRight :size="14" class="text-primary" aria-hidden="true" />
          </a>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-7">
          <a
            v-for="(p, idx) in previewPosts"
            :key="p.id"
            :href="`/blog/${p.id}`"
            class="preview-card group flex flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white text-inherit no-underline shadow-[0_8px_32px_rgba(15,23,42,0.06)] outline-none ring-primary/0 focus-visible:ring-2 focus-visible:ring-primary md:hover:border-primary/35 md:hover:shadow-[0_20px_50px_-18px_rgba(17,211,211,0.28)]"
            @click.prevent="goToArticle(p.id)"
          >
            <div
              class="relative flex h-24 shrink-0 items-center justify-center overflow-hidden sm:h-28"
            >
              <div :class="`absolute inset-0 bg-linear-to-br ${p.gradient}`" />
              <div class="absolute inset-0 bg-dark/55" />
              <div class="hero-grid absolute inset-0 opacity-30" />
              <BookOpen
                :size="32"
                stroke-width="2"
                class="relative z-10 text-primary"
                aria-hidden="true"
              />
              <span
                class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 font-display text-[9px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm"
              >
                <Tag :size="10" class="shrink-0" aria-hidden="true" />
                {{ p.catLabel }}
              </span>
              <span
                class="absolute right-3 top-3 font-mono text-[10px] tracking-widest text-white/50"
                >0{{ idx + 1 }}</span
              >
            </div>
            <div class="flex flex-1 flex-col gap-3 p-5 sm:p-6">
              <h3
                class="font-display text-[16px] font-bold leading-snug tracking-tight text-black group-hover:text-primary sm:text-[17px]"
              >
                {{ p.title }}
              </h3>
              <p class="line-clamp-2 flex-1 text-[13px] leading-relaxed text-gray-500">
                {{ p.excerpt }}
              </p>
              <div
                class="mt-1 flex items-center justify-between border-t border-gray-100 pt-3 text-[11px] text-gray-400"
              >
                <span class="flex items-center gap-1.5">
                  <Calendar :size="12" />
                  {{ p.date }}
                </span>
                <span
                  class="flex items-center gap-1 font-display text-[11px] font-semibold text-primary"
                >
                  {{ t('blogPage.preview.readArticle') }}
                  <ArrowRight :size="14" class="shrink-0" aria-hidden="true" />
                </span>
              </div>
            </div>
          </a>
        </div>

        <div class="mt-10 flex justify-center md:hidden">
          <a
            href="#blog-articles"
            class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 font-display text-[12px] font-bold text-gray-700 no-underline shadow-sm"
          >
            {{ t('blogPage.preview.ctaScroll') }}
            <ArrowRight :size="14" class="text-primary" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>

    <!-- ── NEWSLETTER CTA ── -->
    <section
      ref="newsletterSection"
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
        class="w-full max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10 flex flex-col gap-5 animate-in items-center justify-center"
      >
        <span class="eyebrow eyebrow--dark">
          {{ t('blogPage.cta.badge') }}
        </span>
        <h2 class="display-2 mt-2 mb-2 text-white">
          {{ t('blogPage.cta.title') }}
        </h2>
        <p class="text-white/45 text-[14px] sm:text-[16px] leading-relaxed mb-6 max-w-2xl mx-auto">
          {{ t('blogPage.cta.subtitle') }}
        </p>
        <form class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto w-full">
          <input
            type="email"
            :placeholder="t('blogPage.cta.placeholder')"
            class="flex-1 bg-white/5 border border-white/15 rounded-full px-5 py-3 text-white text-sm outline-none focus:border-primary/50 placeholder:text-white/40"
          />
          <Button
            :label="t('blogPage.cta.button')"
            unstyled
            class="btn-primary font-display font-bold rounded-full!"
          />
        </form>
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
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
  transition:
    border-color 0.25s,
    color 0.25s,
    background 0.25s,
    box-shadow 0.25s;
}
.carousel-nav:hover {
  border-color: #11d3d3;
  color: #11d3d3;
  box-shadow: 0 8px 24px rgba(17, 211, 211, 0.22);
}
</style>
