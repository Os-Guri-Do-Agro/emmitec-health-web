<script setup lang="ts">
/**
 * Blog — Design System Emmitec.health, com o conteúdo de sempre (pt/en/es).
 * Destaques num carrossel com barras de progresso, uma lista editorial para
 * começar, a grade com busca e categorias (?category=) e a newsletter.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight, Calendar, Clock, Search, Tag, X } from 'lucide-vue-next'

import EmPageHero from '@/components/em/EmPageHero.vue'
import EmButton from '@/components/em/EmButton.vue'
import EmSplit from '@/components/em/EmSplit.vue'
import EmCta from '@/components/em/EmCta.vue'
import { RM, scrollToEl } from '@/lib/motion'
import { afterPageEnter } from '@/lib/pageTransition'
import {
  CATEGORY_IDS,
  featuredImg,
  resolveCategory,
  useArticles,
  type CategoryId,
} from '@/lib/blog'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { articles } = useArticles()

const pad = (n: number) => String(n).padStart(2, '0')
const initial = (name: string) => name.replace(/^(Dra?|Profa?|Psic)\.\s*/i, '').charAt(0)

function toSection(id: string) {
  const el = document.getElementById(id)
  if (el) scrollToEl(el, 24)
}

/* ════════ (01) Destaques: carrossel ════════ */
const featured = computed(() => [
  {
    id: 0,
    img: featuredImg,
    catLabel: t('blogPage.categories.rpm'),
    title: t('blogPage.featured.title'),
    excerpt: t('blogPage.featured.excerpt'),
    date: t('blogPage.featured.date'),
    readTime: '8 min',
    tone: 'var(--cyan-100)',
    author: t('blogPage.featured.author'),
    role: t('blogPage.featured.role'),
  },
  ...articles.value.slice(0, 4),
])

/** Tempo de cada destaque (a barra enche nesse ritmo). */
const AUTOPLAY_MS = 6000
const cur = ref(0)
const featEl = ref<HTMLElement | null>(null)
const hovering = ref(false)
const inView = ref(false)
const docVisible = ref(true)
const playing = computed(() => !RM && inView.value && docVisible.value && !hovering.value)

function go(i: number) {
  const n = featured.value.length
  cur.value = (i + n) % n
}
/** A barra ativa terminou de encher: próximo destaque. */
function onBarEnd(i: number) {
  if (i === cur.value) go(cur.value + 1)
}
function onFeatKey(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') go(cur.value + 1)
  else if (e.key === 'ArrowLeft') go(cur.value - 1)
}

let touchX = 0
function onTouchStart(e: TouchEvent) {
  touchX = e.changedTouches[0]?.clientX ?? 0
}
function onTouchEnd(e: TouchEvent) {
  const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX
  if (Math.abs(dx) > 50) go(cur.value + (dx < 0 ? 1 : -1))
}

let io: IntersectionObserver | null = null
const onVisibility = () => (docVisible.value = !document.hidden)

/* ════════ (02) Para começar: lista editorial ════════ */
const previewPosts = computed(() => articles.value.slice(0, 3))
const hoverRead = ref(-1)

/* ════════ (03) Todas as publicações: busca + categorias ════════ */
const activeCategory = ref<CategoryId>(resolveCategory(route.query.category))
const searchQuery = ref('')

const categories = computed(() =>
  CATEGORY_IDS.map((id) => ({
    id,
    label: t(`blogPage.categories.${id}`),
    count: id === 'all' ? articles.value.length : articles.value.filter((a) => a.cat === id).length,
  })),
)

const filtered = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return articles.value.filter(
    (a) =>
      (activeCategory.value === 'all' || a.cat === activeCategory.value) &&
      (!q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)),
  )
})

function setCategory(id: CategoryId) {
  activeCategory.value = id
  const query = { ...route.query }
  if (id === 'all') delete query.category
  else query.category = id
  router.replace({ path: '/blog', query })
}
function clearFilters() {
  searchQuery.value = ''
  setCategory('all')
}

/* indicador que desliza até a categoria ativa */
const tabsEl = ref<HTMLElement | null>(null)
const ind = ref({ x: 0, w: 0, on: false })
function placeIndicator() {
  const btn = tabsEl.value?.querySelector<HTMLElement>('.em-tabs__btn.is-active')
  if (!btn) return
  ind.value = { x: btn.offsetLeft, w: btn.offsetWidth, on: true }
}
watch([activeCategory, categories], () => nextTick(placeIndicator))

// chegou (ou trocou) com ?category=…: vai direto para a grade
watch(
  () => route.query.category,
  (c) => {
    activeCategory.value = resolveCategory(c)
    if (activeCategory.value !== 'all') toSection('artigos')
  },
)

/* ════════ Newsletter ════════ */
const email = ref('')
function subscribe() {
  // TODO: integrar com o serviço de newsletter (o formulário original ainda não enviava).
}

onMounted(() => {
  if (featEl.value && 'IntersectionObserver' in window) {
    io = new IntersectionObserver(([e]) => (inView.value = !!e?.isIntersecting), {
      threshold: 0.35,
    })
    io.observe(featEl.value)
  }
  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('resize', placeIndicator)
  // fontes podem mudar a largura das pílulas depois da montagem
  document.fonts?.ready.then(placeIndicator)
  placeIndicator()
  if (activeCategory.value !== 'all') afterPageEnter(() => toSection('artigos'))
})
onBeforeUnmount(() => {
  io?.disconnect()
  document.removeEventListener('visibilitychange', onVisibility)
  window.removeEventListener('resize', placeIndicator)
})
</script>

<template>
  <div class="em-blog-page">
    <!-- ════════ HERO ════════ -->
    <EmPageHero
      :eyebrow="t('blogPage.hero.badge')"
      :title="t('blogPage.hero.title')"
      :em="t('blogPage.hero.titleEm')"
      :subtitle="t('blogPage.hero.subtitle')"
    >
      <template #actions>
        <EmButton :label="t('blogPage.preview.ctaScroll')" @click="toSection('artigos')" />
        <EmButton
          variant="ghost"
          :label="t('blogPage.cta.badge')"
          @click="toSection('newsletter')"
        />
      </template>
    </EmPageHero>

    <!-- ════════ (01) EM DESTAQUE ════════ -->
    <section id="destaque" class="em-section">
      <div class="em-wrap">
        <div class="em-feat__head">
          <span v-reveal class="em-eyebrow">{{ t('blogPage.featured.badge') }}</span>
          <div v-reveal="120" class="em-feat__ctrl">
            <span class="em-feat__count" aria-hidden="true"
              ><b>{{ pad(cur + 1) }}</b> / {{ pad(featured.length) }}</span
            >
            <button
              type="button"
              class="em-round"
              :aria-label="t('aria.prevSlide')"
              @click="go(cur - 1)"
            >
              <ArrowLeft :stroke-width="1.8" aria-hidden="true" />
            </button>
            <button
              type="button"
              class="em-round"
              :aria-label="t('aria.nextSlide')"
              @click="go(cur + 1)"
            >
              <ArrowRight :stroke-width="1.8" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref="featEl"
          v-reveal:scale="100"
          class="em-feat"
          :class="{ 'is-paused': !playing }"
          role="region"
          aria-roledescription="carousel"
          :aria-label="t('blogPage.featured.badge')"
          @pointerenter="hovering = true"
          @pointerleave="hovering = false"
          @focusin="hovering = true"
          @focusout="hovering = false"
          @keydown="onFeatKey"
          @touchstart.passive="onTouchStart"
          @touchend="onTouchEnd"
        >
          <div class="em-feat__viewport">
            <div class="em-feat__track" :style="{ '--cur': cur }">
              <article
                v-for="(p, i) in featured"
                :key="p.id"
                class="em-feat__slide"
                :class="{ 'is-on': i === cur }"
                aria-roledescription="slide"
                :aria-label="`${i + 1} / ${featured.length}`"
                :aria-hidden="i === cur ? undefined : 'true'"
                :inert="i === cur ? undefined : true"
              >
                <RouterLink :to="`/blog/${p.id}`" class="em-feat__card em-card">
                  <div class="em-feat__art">
                    <img
                      class="em-feat__photo"
                      :src="p.img"
                      alt=""
                      :loading="i === 0 ? 'eager' : 'lazy'"
                      width="1400"
                      height="1089"
                    />
                    <span class="em-feat__shade" aria-hidden="true" />
                    <span class="em-chip em-chip--glass"
                      ><Tag :stroke-width="1.8" aria-hidden="true" />{{ p.catLabel }}</span
                    >
                    <span class="em-feat__meta">
                      <span class="em-chip em-chip--glass"
                        ><Calendar :stroke-width="1.8" aria-hidden="true" />{{ p.date }}</span
                      >
                      <span class="em-chip em-chip--glass"
                        ><Clock :stroke-width="1.8" aria-hidden="true" />{{ p.readTime }}</span
                      >
                    </span>
                  </div>
                  <div class="em-feat__body">
                    <h3>{{ p.title }}</h3>
                    <p>{{ p.excerpt }}</p>
                    <div class="em-feat__author">
                      <span class="em-avatar" aria-hidden="true">{{ initial(p.author) }}</span>
                      <span>
                        <b>{{ p.author }}</b>
                        <small>{{ p.role }}</small>
                      </span>
                      <span class="em-corner" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M7 17L17 7M8 7h9v9" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </RouterLink>
              </article>
            </div>
          </div>

          <!-- uma barra por destaque: a ativa enche e passa para o próximo -->
          <div class="em-feat__bars">
            <button
              v-for="(p, i) in featured"
              :key="p.id"
              type="button"
              class="em-feat__bar"
              :class="{ 'is-on': i === cur, 'is-done': i < cur }"
              :style="{ '--ms': `${AUTOPLAY_MS}ms` }"
              :aria-label="t('aria.goToSlide', { index: i + 1 })"
              :aria-current="i === cur ? 'true' : undefined"
              @click="go(i)"
            >
              <i @animationend="onBarEnd(i)" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ (02) PARA COMEÇAR ════════ -->
    <section id="comece" class="em-section em-section--tint">
      <div class="em-wrap">
        <div class="em-head">
          <div>
            <span v-reveal class="em-eyebrow">{{ t('blogPage.preview.badge') }}</span>
            <EmSplit :text="t('blogPage.preview.title')" :em="t('blogPage.preview.titleEm')" />
          </div>
          <div v-reveal="150" class="em-head__side">
            <p>{{ t('blogPage.preview.subtitle') }}</p>
            <EmButton
              variant="ghost"
              :label="t('blogPage.preview.ctaScroll')"
              @click="toSection('artigos')"
            />
          </div>
        </div>

        <ol class="em-reads" :class="{ 'is-hover': hoverRead >= 0 }">
          <li v-for="(p, i) in previewPosts" :key="p.id" v-reveal="i * 90">
            <RouterLink
              :to="`/blog/${p.id}`"
              class="em-read"
              :class="{ 'is-active': hoverRead === i }"
              @pointerenter="hoverRead = i"
              @pointerleave="hoverRead = -1"
              @focus="hoverRead = i"
              @blur="hoverRead = -1"
            >
              <span class="em-read__n">({{ pad(i + 1) }})</span>
              <span class="em-read__thumb" :style="{ '--tone': p.tone }" aria-hidden="true">{{
                pad(p.id)
              }}</span>
              <span class="em-read__main">
                <small>{{ p.catLabel }} · {{ p.readTime }}</small>
                <strong>{{ p.title }}</strong>
                <span class="em-read__ex">{{ p.excerpt }}</span>
              </span>
              <time class="em-read__date">{{ p.date }}</time>
              <span class="em-read__go">
                <span class="sr-only">{{ t('blogPage.preview.readArticle') }}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 17L17 7M8 7h9v9" />
                </svg>
              </span>
            </RouterLink>
          </li>
        </ol>
      </div>
    </section>

    <!-- ════════ (03) TODAS AS PUBLICAÇÕES ════════ -->
    <section id="artigos" class="em-section">
      <div class="em-wrap">
        <div class="em-head">
          <div>
            <span v-reveal class="em-eyebrow">{{ t('blogPage.articles.badge') }}</span>
            <EmSplit :text="t('blogPage.articles.title')" :em="t('blogPage.articles.titleEm')" />
          </div>
          <div v-reveal="150" class="em-head__side em-head__side--wide">
            <label class="em-search">
              <Search :stroke-width="1.8" aria-hidden="true" />
              <span class="sr-only">{{ t('blogPage.hero.searchPlaceholder') }}</span>
              <input
                v-model="searchQuery"
                type="search"
                autocomplete="off"
                :placeholder="t('blogPage.hero.searchPlaceholder')"
              />
              <button
                v-if="searchQuery"
                type="button"
                class="em-search__clear"
                :aria-label="t('blogPage.articles.clear')"
                @click="searchQuery = ''"
              >
                <X :stroke-width="2" aria-hidden="true" />
              </button>
            </label>
          </div>
        </div>

        <div v-reveal class="em-filterbar">
          <div ref="tabsEl" class="em-tabs" role="group" :aria-label="t('blogPage.articles.badge')">
            <span
              class="em-tabs__ind"
              :class="{ 'is-on': ind.on }"
              :style="{ '--x': `${ind.x}px`, '--w': `${ind.w}px` }"
              aria-hidden="true"
            />
            <button
              v-for="c in categories"
              :key="c.id"
              type="button"
              class="em-tabs__btn"
              :class="{ 'is-active': activeCategory === c.id }"
              :aria-pressed="activeCategory === c.id ? 'true' : 'false'"
              @click="setCategory(c.id)"
            >
              {{ c.label }}<small>{{ c.count }}</small>
            </button>
          </div>
          <span class="em-filterbar__count" aria-live="polite">{{
            t('blogPage.articles.count', filtered.length)
          }}</span>
        </div>

        <!-- trocar de categoria refaz a grade, e os cards entram de novo em sequência -->
        <div v-if="filtered.length" :key="activeCategory" class="em-posts em-posts--grid">
          <RouterLink
            v-for="(a, i) in filtered"
            :key="a.id"
            v-reveal="(i % 3) * 90"
            v-spot
            :to="`/blog/${a.id}`"
            class="em-post em-card em-card--lift"
          >
            <div class="em-post__cover" :style="{ '--tone': a.tone }">
              <span class="em-post__n" aria-hidden="true">{{ pad(a.id) }}</span>
              <span class="em-chip em-chip--glass"
                ><Tag :stroke-width="1.8" aria-hidden="true" />{{ a.catLabel }}</span
              >
              <span class="em-corner" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M7 17L17 7M8 7h9v9" />
                </svg>
              </span>
            </div>
            <div class="em-post__body">
              <span class="em-post__date"
                ><time>{{ a.date }}</time> · {{ a.readTime }}</span
              >
              <h3>{{ a.title }}</h3>
              <p>{{ a.excerpt }}</p>
              <span class="em-post__more">{{ t('blogPage.preview.readArticle') }}</span>
            </div>
          </RouterLink>
        </div>

        <div v-else class="em-empty em-card">
          <span class="em-ico" aria-hidden="true"><Search :stroke-width="1.7" /></span>
          <p>{{ t('blogPage.articles.empty') }}</p>
          <EmButton
            variant="ghost"
            size="sm"
            :label="t('blogPage.articles.clear')"
            @click="clearFilters"
          />
        </div>
      </div>
    </section>

    <!-- ════════ NEWSLETTER ════════ -->
    <EmCta
      id="newsletter"
      :badge="t('blogPage.cta.badge')"
      :title="t('blogPage.cta.title')"
      :em="t('blogPage.cta.titleEm')"
      :subtitle="t('blogPage.cta.subtitle')"
    >
      <form class="em-news em-news--cta" @submit.prevent="subscribe">
        <label class="em-news__field">
          <span class="sr-only">{{ t('blogPage.cta.placeholder') }}</span>
          <input
            v-model="email"
            type="email"
            required
            autocomplete="email"
            :placeholder="t('blogPage.cta.placeholder')"
          />
          <EmButton type="submit" variant="dark" :label="t('blogPage.cta.button')" />
        </label>
        <p class="em-footer__note">
          <span class="em-news__check" aria-hidden="true" />
          {{ t('footer.newsletter.privacy') }}
        </p>
      </form>
    </EmCta>
  </div>
</template>
