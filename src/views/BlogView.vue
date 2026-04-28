<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from 'primevue/button'

import { Calendar, Clock, ArrowRight, Search, Tag } from 'lucide-vue-next'

const { t } = useI18n()
const router = useRouter()

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

const featuredSection = ref<HTMLElement | null>(null)
const articlesSection = ref<HTMLElement | null>(null)
const newsletterSection = ref<HTMLElement | null>(null)

const activeCategory = ref('all')
const searchQuery = ref('')

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

const goToArticle = (id: number) => {
  router.push(`/blog/${id}`)
}

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

  animate(featuredSection.value, '.animate-in')
  animate(articlesSection.value, '.article-card', { stagger: 0.08 })
  animate(newsletterSection.value, '.animate-in')
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((t) => t.kill())
})
</script>

<template>
  <div class="font-body text-black overflow-x-hidden w-full">
    <!-- ── HERO ── -->
    <section
      class="min-h-[50vh] sm:min-h-[55vh] bg-dark relative overflow-hidden w-full flex items-center justify-center"
    >
      <div class="hero-grid absolute inset-0 pointer-events-none" />

      <div
        class="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center gap-5 z-10 relative justify-center"
      >
        <span
          class="inline-block text-[11px] font-bold uppercase text-primary font-display tracking-[2px]"
        >
          {{ t('blogPage.hero.badge') }}
        </span>
        <h1
          ref="heroTitle"
          class="font-display font-extrabold text-white leading-[1.08] tracking-tight text-2xl sm:text-3xl lg:text-[44px]"
        >
          {{ t('blogPage.hero.title') }}
        </h1>
        <p
          ref="heroSub"
          class="text-white/55 text-[14px] sm:text-[16px] leading-relaxed max-w-2xl font-light"
        >
          {{ t('blogPage.hero.subtitle') }}
        </p>

        <!-- Search bar -->
        <div ref="heroActions" class="w-full max-w-xl mt-4">
          <div
            class="relative flex items-center bg-white/5 border border-white/15 rounded-full backdrop-blur-md focus-within:border-primary/50 transition-colors"
          >
            <Search :size="18" class="absolute left-5 text-white/40" />
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('blogPage.hero.searchPlaceholder')"
              class="w-full bg-transparent text-white text-sm pl-12 pr-5 py-4 outline-none placeholder:text-white/40"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ── FEATURED ARTICLE ── -->
    <section
      ref="featuredSection"
      class="py-16 sm:py-20 bg-white w-full flex items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8 animate-in">
          <span
            class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary"
          >
            {{ t('blogPage.featured.badge') }}
          </span>
        </div>

        <article
          @click="goToArticle(0)"
          class="animate-in group grid grid-cols-1 lg:grid-cols-5 gap-8 rounded-2xl border border-gray-200/80 overflow-hidden bg-white transition-all duration-500 hover:border-primary/30 hover:shadow-[0_24px_60px_-20px_rgba(17,211,211,0.35)] cursor-pointer"
        >
          <div class="lg:col-span-3 relative aspect-16/10 lg:aspect-auto overflow-hidden">
            <div :class="`absolute inset-0 bg-linear-to-br ${featuredArticle.gradient}`" />
            <div
              class="absolute inset-0 bg-linear-to-t from-[#0a1218]/85 via-[#0a1218]/30 to-transparent"
            />
            <div class="hero-grid absolute inset-0 pointer-events-none opacity-50" />
            <div class="absolute top-5 left-5 flex items-center gap-2">
              <span
                class="px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-[10px] font-bold uppercase tracking-wider"
              >
                {{ featuredArticle.category }}
              </span>
            </div>
            <div
              class="absolute bottom-5 left-5 right-5 flex items-center gap-4 text-white/70 text-xs"
            >
              <span class="flex items-center gap-1.5">
                <Calendar :size="12" />
                {{ featuredArticle.date }}
              </span>
              <span class="flex items-center gap-1.5">
                <Clock :size="12" />
                {{ featuredArticle.readTime }}
              </span>
            </div>
          </div>
          <div class="lg:col-span-2 p-6 lg:p-10 flex flex-col gap-4 justify-center">
            <h2
              class="font-display font-extrabold text-black text-[clamp(20px,2.5vw,30px)] tracking-tight leading-tight"
            >
              {{ featuredArticle.title }}
            </h2>
            <p class="text-gray-500 text-[14px] leading-relaxed">{{ featuredArticle.excerpt }}</p>
            <div class="flex items-center gap-3 mt-2 pt-4 border-t border-gray-100">
              <div
                class="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-display font-bold text-sm"
              >
                {{ featuredArticle.author.charAt(0) }}
              </div>
              <div class="flex-1">
                <div class="text-gray-700 font-semibold text-sm">{{ featuredArticle.author }}</div>
                <div class="text-gray-400 text-xs">{{ t('blogPage.featured.role') }}</div>
              </div>
              <ArrowRight
                :size="20"
                class="text-primary group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- ── ARTICLES GRID ── -->
    <section
      ref="articlesSection"
      class="py-16 sm:py-20 bg-mid w-full flex items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center text-center gap-5 mb-10">
          <span
            class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary"
          >
            {{ t('blogPage.articles.badge') }}
          </span>
          <h2
            class="font-display font-extrabold text-black text-[clamp(26px,3vw,40px)] tracking-tight"
          >
            {{ t('blogPage.articles.title') }}
          </h2>
        </div>

        <!-- Categories filter -->
        <div class="flex flex-wrap items-center justify-center gap-2 mb-10 py-5">
          <button
            v-for="c in categories"
            :key="c.id"
            @click="activeCategory = c.id"
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

    <!-- ── NEWSLETTER CTA ── -->
    <section
      ref="newsletterSection"
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
        class="w-full max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10 flex flex-col gap-5 animate-in items-center justify-center"
      >
        <span
          class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary"
        >
          {{ t('blogPage.cta.badge') }}
        </span>
        <h2
          class="font-display font-extrabold text-white mt-2 mb-2 text-[clamp(24px,2.5vw,40px)] leading-tight tracking-tight"
        >
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
</style>
