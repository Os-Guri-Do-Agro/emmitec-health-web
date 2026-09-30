<script setup lang="ts">
/**
 * Artigo do blog — Design System Emmitec.health.
 * Hero com o gradiente vivo, texto com tipografia editorial, sumário lateral
 * que acompanha a leitura, compartilhar e artigos relacionados.
 */
import { computed, onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Calendar, Clock, Share2, Tag } from 'lucide-vue-next'

import EmPageHero from '@/components/em/EmPageHero.vue'
import EmButton from '@/components/em/EmButton.vue'
import EmSplit from '@/components/em/EmSplit.vue'
import { useToc } from '@/lib/useToc'
import { calendlyUrl } from '@/lib/site'
import { useArticles } from '@/lib/blog'

const { t } = useI18n()
const route = useRoute()
const { articles } = useArticles()

const pad = (n: number) => String(n).padStart(2, '0')
const initial = (name: string) => name.replace(/^(Dra?|Profa?|Psic)\.\s*/i, '').charAt(0)

/** Artigo da rota (sem correspondência, o primeiro — como no site original). */
const article = computed(
  () => articles.value.find((a) => a.id === Number(route.params.id)) ?? articles.value[0]!,
)

/** Relacionados: primeiro os da mesma categoria, depois os demais. */
const related = computed(() => {
  const others = articles.value.filter((a) => a.id !== article.value.id)
  return [
    ...others.filter((a) => a.cat === article.value.cat),
    ...others.filter((a) => a.cat !== article.value.cat),
  ].slice(0, 3)
})

/* ── corpo: âncoras nos intertítulos e citações como <blockquote> ── */
const body = computed(() => {
  const toc: { id: string; text: string }[] = []
  const html = article.value.content
    .replace(/<h3>(.*?)<\/h3>/g, (_m, inner: string) => {
      const id = `secao-${toc.length + 1}`
      toc.push({ id, text: inner.replace(/<[^>]+>/g, '').replace(/^\d+\.\s*/, '') })
      return `<h3 id="${id}">${inner}</h3>`
    })
    .replace(/<p>"(.+?)"\s*—\s*(.+?)<\/p>/g, '<blockquote><p>“$1”</p><cite>$2</cite></blockquote>')
  return { html, toc }
})

/* ── sumário acompanha a leitura ── */
const prose = ref<HTMLElement | null>(null)
const tocEl = ref<HTMLElement | null>(null)
const { active: activeH, goTo } = useToc(prose, tocEl)

/* ── compartilhar ── */
const copied = ref(false)
let copiedT = 0
async function share() {
  const url = window.location.href
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: article.value.title, url })
    } catch {
      // cancelado pelo usuário
    }
    return
  }
  try {
    await navigator.clipboard.writeText(url)
    copied.value = true
    window.clearTimeout(copiedT)
    copiedT = window.setTimeout(() => (copied.value = false), 2200)
  } catch {
    // sem permissão de área de transferência
  }
}

onBeforeUnmount(() => window.clearTimeout(copiedT))
</script>

<template>
  <div class="em-article-page">
    <!-- ════════ HERO ════════ -->
    <EmPageHero
      class="em-hero--article"
      :eyebrow="article.catLabel"
      :trail="[{ label: t('header.nav.blog'), to: '/blog' }]"
      :title="article.title"
      :subtitle="article.excerpt"
    >
      <template #lead>
        <div class="em-byline">
          <span class="em-avatar" aria-hidden="true">{{ initial(article.author) }}</span>
          <span>
            <b>{{ article.author }}</b>
            <small>{{ article.role }}</small>
          </span>
        </div>
      </template>
      <template #actions>
        <EmButton to="/blog" variant="ghost" :label="t('blogPage.detail.backToBlog')" />
        <EmButton
          variant="dark"
          :label="copied ? t('blogPage.detail.copied') : t('blogPage.detail.share')"
          @click="share"
        />
      </template>
    </EmPageHero>

    <!-- ════════ ARTIGO ════════ -->
    <section class="em-section em-article">
      <div class="em-wrap em-article__grid">
        <aside class="em-article__aside">
          <div class="em-article__sticky">
            <dl v-reveal class="em-article__facts em-card">
              <div>
                <dt><Calendar :stroke-width="1.7" aria-hidden="true" /></dt>
                <dd>
                  <time>{{ article.date }}</time>
                </dd>
              </div>
              <div>
                <dt><Clock :stroke-width="1.7" aria-hidden="true" /></dt>
                <dd>{{ article.readTime }} {{ t('blogPage.detail.readTime') }}</dd>
              </div>
              <div>
                <dt><Tag :stroke-width="1.7" aria-hidden="true" /></dt>
                <dd>
                  <RouterLink :to="`/blog?category=${article.cat}`">{{
                    article.catLabel
                  }}</RouterLink>
                </dd>
              </div>
              <div class="em-article__tags">
                <span v-for="tag in article.tags" :key="tag" class="em-chip">#{{ tag }}</span>
              </div>
            </dl>

            <nav
              v-if="body.toc.length"
              ref="tocEl"
              v-reveal="120"
              class="em-toc"
              :aria-label="t('blogPage.detail.toc')"
            >
              <span class="em-eyebrow">{{ t('blogPage.detail.toc') }}</span>
              <ol>
                <li v-for="(h, i) in body.toc" :key="h.id">
                  <a
                    :href="`#${h.id}`"
                    :class="{ 'is-active': activeH === i }"
                    @click.prevent="goTo(h.id)"
                    ><span>{{ pad(i + 1) }}</span
                    >{{ h.text }}</a
                  >
                </li>
              </ol>
              <i class="em-toc__rail" aria-hidden="true"><i /></i>
            </nav>

            <div v-reveal="200" class="em-article__actions">
              <EmButton :href="calendlyUrl" :label="t('blogPage.detail.requestDemo')" block />
              <button type="button" class="em-share" @click="share">
                <Share2 :stroke-width="1.7" aria-hidden="true" />
                <span aria-live="polite">{{
                  copied ? t('blogPage.detail.copied') : t('blogPage.detail.share')
                }}</span>
              </button>
            </div>
          </div>
        </aside>

        <div class="em-article__main">
          <figure v-reveal:scale class="em-article__cover">
            <img :src="article.img" :alt="article.title" width="1400" height="1089" />
          </figure>
          <!-- eslint-disable-next-line vue/no-v-html -- conteúdo fixo do próprio site -->
          <article ref="prose" v-reveal class="em-prose" v-html="body.html" />
        </div>
      </div>
    </section>

    <!-- ════════ RELACIONADOS ════════ -->
    <section id="relacionados" class="em-section em-section--tint">
      <div class="em-wrap">
        <div class="em-head">
          <div>
            <span v-reveal class="em-eyebrow">{{ t('blogPage.detail.relatedBadge') }}</span>
            <EmSplit
              :text="t('blogPage.detail.relatedTitle')"
              :em="t('blogPage.detail.relatedTitleEm')"
            />
          </div>
          <div v-reveal="150" class="em-head__side">
            <EmButton to="/blog" variant="ghost" :label="t('blogPage.detail.backToBlog')" />
          </div>
        </div>

        <div class="em-posts">
          <RouterLink
            v-for="(a, i) in related"
            :key="a.id"
            v-reveal="i * 120"
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
      </div>
    </section>
  </div>
</template>
