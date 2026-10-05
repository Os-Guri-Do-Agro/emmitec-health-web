<script setup lang="ts">
/**
 * Nossa história — Design System Emmitec.health, com o conteúdo de sempre (pt/en/es).
 * Retrato que fica preso enquanto a história é lida, manifesto que acende com a
 * rolagem, números em odômetro, acordeão de aplicações clínicas e a linha do tempo
 * horizontal presa na tela.
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Building2, HeartPulse, Bandage, Droplet, Ribbon } from 'lucide-vue-next'

import emilioImg from '@/assets/about/emillio.jpg'
import missaoImg from '@/assets/about/missao-1200.jpg'

import EmPageHero from '@/components/em/EmPageHero.vue'
import EmButton from '@/components/em/EmButton.vue'
import EmSplit from '@/components/em/EmSplit.vue'
import EmStatement from '@/components/em/EmStatement.vue'
import EmOdometer from '@/components/em/EmOdometer.vue'
import EmAccordion from '@/components/em/EmAccordion.vue'
import EmTimeline from '@/components/em/EmTimeline.vue'
import EmCta from '@/components/em/EmCta.vue'
import { calendlyUrl } from '@/lib/site'

const { t } = useI18n()

const pad = (n: number) => String(n).padStart(2, '0')

/* ── Números ── */
const figures = computed(() => [
  { num: '2006', suffix: '', label: t('about.stats.founded') },
  { num: '500', suffix: '+', label: t('about.stats.clinics') },
  { num: '50', suffix: 'K+', label: t('about.stats.patients') },
  { num: '120', suffix: '+', label: t('about.stats.team') },
])

/* ── Missão: a primeira frase vira manifesto, o resto segue como texto ── */
const mission = computed(() => {
  const desc = t('about.mission.description')
  const m = /^(.+?[.!?])\s+([\s\S]*)$/.exec(desc)
  return { lead: m?.[1] ?? desc, rest: m?.[2] ?? '' }
})
const pillars = computed(() => [
  t('about.mission.item1'),
  t('about.mission.item2'),
  t('about.mission.item3'),
])

/* ── Aplicações clínicas ── */
const applications = computed(() => [
  {
    icon: HeartPulse,
    title: t('about.values.card1.title'),
    body: t('about.values.card1.description'),
  },
  {
    icon: Bandage,
    title: t('about.values.card2.title'),
    body: t('about.values.card2.description'),
  },
  {
    icon: Droplet,
    title: t('about.values.card3.title'),
    body: t('about.values.card3.description'),
  },
  { icon: Ribbon, title: t('about.values.card4.title'), body: t('about.values.card4.description') },
])

/* ── Linha do tempo ── */
const milestones = computed(() =>
  ['2006', '2018', '2020', '2022', '2024'].map((year) => ({
    year,
    title: t(`about.timeline.${year}.title`),
    desc: t(`about.timeline.${year}.desc`),
  })),
)
</script>

<template>
  <div class="em-about-page">
    <!-- ════════ HERO ════════ -->
    <EmPageHero
      :eyebrow="t('about.hero.badge')"
      :trail="[{ label: t('header.nav.about') }]"
      :title="t('about.hero.title')"
      :em="t('about.hero.titleEm')"
      :subtitle="t('about.hero.subtitle')"
    >
      <template #actions>
        <EmButton :href="calendlyUrl" :label="t('about.hero.button.demo')" />
        <EmButton to="#historia" variant="ghost" :label="t('about.story.badge')" />
      </template>
    </EmPageHero>

    <!-- ════════ (01) NOSSA HISTÓRIA ════════ -->
    <section id="historia" class="em-section">
      <div class="em-wrap">
        <span v-reveal class="em-eyebrow">{{ t('about.story.badge') }}</span>
        <EmSplit class="em-h2" :text="t('about.story.title')" :em="t('about.story.titleEm')" />

        <div class="em-journey">
          <aside class="em-journey__aside">
            <figure v-in class="em-story__art em-journey__photo">
              <img
                class="em-story__photo"
                :src="emilioImg"
                alt="Emílio Machado"
                loading="lazy"
                width="1427"
                height="864"
              />
              <span class="em-story__shade" />
              <figcaption class="em-chip em-chip--glass">
                <span class="em-dot em-dot--live" />Emílio Machado · {{ t('about.stats.founder') }}
              </figcaption>
            </figure>
          </aside>

          <div class="em-journey__txt">
            <EmStatement class="em-statement--md" :text="t('about.story.intro')" />
            <p v-reveal class="em-journey__p em-journey__p--drop">
              {{ t('about.story.paragraph1') }}
            </p>
            <p v-reveal class="em-journey__p">{{ t('about.story.paragraph2') }}</p>

            <figure v-reveal class="em-quote">
              <span class="em-quote__mark" aria-hidden="true">“</span>
              <blockquote>
                <EmSplit
                  tag="p"
                  class="em-quote__text"
                  :text="t('about.story.quote')"
                  :em="t('about.story.quoteEm')"
                />
              </blockquote>
              <figcaption class="em-story__who">
                <span class="em-photo-av"><img :src="emilioImg" alt="" loading="lazy" /></span>
                <span>
                  <strong>Emílio Machado</strong>
                  <small>{{ t('about.stats.founder') }}</small>
                </span>
              </figcaption>
            </figure>
          </div>
        </div>

        <!-- números -->
        <div v-reveal v-spot class="em-figures em-card">
          <div v-for="f in figures" :key="f.label" class="em-figure">
            <b
              ><EmOdometer :value="f.num" /><i v-if="f.suffix">{{ f.suffix }}</i></b
            >
            <span>{{ f.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ (02) MISSÃO E VISÃO ════════ -->
    <section id="missao" class="em-section em-section--tint">
      <div class="em-wrap">
        <span v-reveal class="em-eyebrow">{{ t('about.mission.badge') }}</span>
        <EmSplit class="em-h2" :text="t('about.mission.title')" :em="t('about.mission.titleEm')" />
        <EmStatement
          class="em-mission__lead"
          :text="mission.lead"
          :em="t('about.mission.leadEm')"
        />

        <div class="em-mission">
          <figure v-scrub="0.9" class="em-mission__photo">
            <img
              :src="missaoImg"
              :alt="t('about.mission.badge')"
              loading="lazy"
              width="1200"
              height="1200"
            />
            <span class="em-story__shade" />
            <span class="em-mission__float">
              <span class="em-ico em-ico--sm"><Building2 :stroke-width="1.7" /></span>
              <span>
                <b>500+</b>
                <small>{{ t('about.stats.clinics') }}</small>
              </span>
            </span>
          </figure>

          <div class="em-mission__txt">
            <p v-reveal class="em-mission__body">{{ mission.rest }}</p>
            <ol class="em-pillars">
              <li v-for="(p, i) in pillars" :key="p" v-reveal="i * 100">
                <span class="em-pillars__n">({{ pad(i + 1) }})</span>
                <span class="em-pillars__t">{{ p }}</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ (03) APLICAÇÕES CLÍNICAS ════════ -->
    <section id="aplicacoes" class="em-section">
      <div class="em-wrap">
        <div class="em-head">
          <div>
            <span v-reveal class="em-eyebrow">{{ t('about.values.badge') }}</span>
            <EmSplit :text="t('about.values.title')" :em="t('about.values.titleEm')" />
          </div>
          <p v-reveal="150">{{ t('about.values.subtitle') }}</p>
        </div>
        <div v-reveal>
          <EmAccordion :items="applications" />
        </div>
      </div>
    </section>

    <!-- ════════ (04) LINHA DO TEMPO ════════ -->
    <EmTimeline id="jornada" class="em-section--tint" :items="milestones">
      <template #head>
        <span v-reveal class="em-eyebrow">{{ t('about.timeline.badge') }}</span>
        <EmSplit
          class="em-h2"
          :text="t('about.timeline.title')"
          :em="t('about.timeline.titleEm')"
        />
      </template>
    </EmTimeline>

    <!-- ════════ CTA ════════ -->
    <EmCta
      :badge="t('about.cta.badge')"
      :title="t('about.cta.title')"
      :em="t('about.cta.titleEm')"
      :subtitle="t('about.cta.subtitle')"
      :primary="{ label: t('about.cta.button.primary'), href: calendlyUrl }"
      :secondary="{ label: t('about.cta.button.secondary'), to: '/what-is-rpm' }"
    />
  </div>
</template>
