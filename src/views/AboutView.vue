<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from 'primevue/button'

import {
  Target,
  HeartHandshake,
  Users,
  Lightbulb,
  Shield,
  ArrowRight,
  Quote,
  Crown,
} from 'lucide-vue-next'

import emilioImg from '@/assets/about/emillio.jpg'
import missaoImg from '@/assets/about/nossaMissão-img.jpg'
import logoCircleImg from '@/assets/about/logo-emmitec-circle.png'
import HeroLogoMark from '@/components/HeroLogoMark.vue'

const { t } = useI18n()

const calendlyUrl = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `https://calendly.com/emilio-machado-emmitec-health/vamos-nos-reunir-agende-sua-reuniao-online?month=${year}-${month}`
})

gsap.registerPlugin(ScrollTrigger)

// Refs para animações
const heroTitle = ref<HTMLElement | null>(null)
const heroSub = ref<HTMLElement | null>(null)
const heroActions = ref<HTMLElement | null>(null)
const heroLogo = ref<HTMLElement | null>(null)

const storySection = ref<HTMLElement | null>(null)
const missionSection = ref<HTMLElement | null>(null)
const valuesSection = ref<HTMLElement | null>(null)
const teamSection = ref<HTMLElement | null>(null)
const statsSection = ref<HTMLElement | null>(null)

// Dados das seções
const valuesData = computed(() => [
  {
    icon: HeartHandshake,
    title: t('about.values.card1.title'),
    description: t('about.values.card1.description'),
    color: 'from-rose-400/20 to-rose-400/5',
  },
  {
    icon: Shield,
    title: t('about.values.card2.title'),
    description: t('about.values.card2.description'),
    color: 'from-emerald-400/20 to-emerald-400/5',
  },
  {
    icon: Lightbulb,
    title: t('about.values.card3.title'),
    description: t('about.values.card3.description'),
    color: 'from-blue-400/20 to-blue-400/5',
  },
  {
    icon: Users,
    title: t('about.values.card4.title'),
    description: t('about.values.card4.description'),
    color: 'from-purple-400/20 to-purple-400/5',
  },
])

const statsData = computed(() => [
  { num: '2006', label: t('about.stats.founded') },
  { num: '500+', label: t('about.stats.clinics') },
  { num: '50K+', label: t('about.stats.patients') },
  { num: '120+', label: t('about.stats.team') },
])

const milestones = computed(() => [
  { year: '2006', title: t('about.timeline.2006.title'), desc: t('about.timeline.2006.desc') },
  { year: '2018', title: t('about.timeline.2018.title'), desc: t('about.timeline.2018.desc') },
  { year: '2020', title: t('about.timeline.2020.title'), desc: t('about.timeline.2020.desc') },
  { year: '2022', title: t('about.timeline.2022.title'), desc: t('about.timeline.2022.desc') },
  { year: '2024', title: t('about.timeline.2024.title'), desc: t('about.timeline.2024.desc') },
])

onMounted(() => {
  // Hero entrance
  gsap
    .timeline({ defaults: { ease: 'power3.out', clearProps: 'opacity,transform' } })
    .from(heroTitle.value, { opacity: 0, y: 34, duration: 0.8 })
    .from(heroSub.value, { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
    .from(heroActions.value, { opacity: 0, y: 20, duration: 0.6 }, '-=0.35')

  if (heroLogo.value) {
    const logoImg = heroLogo.value.querySelector('.hero-logo-img')
    const logoRing = heroLogo.value.querySelector('.hero-logo-ring')
    const logoGlow = heroLogo.value.querySelector('.hero-logo-glow')
    const pulseRings = heroLogo.value.querySelectorAll('.hero-logo-pulse')

    gsap.set(heroLogo.value, { opacity: 1 })
    gsap
      .timeline({ defaults: { ease: 'power3.out' } })
      .from(logoGlow, { opacity: 0, scale: 0.4, duration: 1 }, 0.2)
      .from(logoRing, { opacity: 0, scale: 0.55, rotation: -24, duration: 1 }, 0.3)
      .from(
        logoImg,
        { opacity: 0, scale: 0.35, rotation: 18, duration: 1.05, ease: 'back.out(1.6)' },
        0.4,
      )
      .from(pulseRings, { opacity: 0, duration: 0.4 }, 0.9)

    gsap.to(logoRing, {
      rotation: 360,
      duration: 28,
      ease: 'none',
      repeat: -1,
    })

    pulseRings.forEach((ring, i) => {
      gsap.set(ring, { scale: 0.72, opacity: 0.55 })
      gsap.to(ring, {
        scale: 1.85,
        opacity: 0,
        duration: 4.2,
        ease: 'power1.out',
        repeat: -1,
        delay: i * 1.4,
      })
    })
  }

  // Story section
  if (storySection.value) {
    gsap.from(storySection.value.querySelectorAll('.story-animate'), {
      opacity: 0,
      y: 30,
      stagger: 0.12,
      duration: 0.72,
      ease: 'power3.out',
      clearProps: 'opacity,transform',
      scrollTrigger: { trigger: storySection.value, start: 'top 80%', once: true },
    })
  }

  // Mission section
  if (missionSection.value) {
    gsap.from(missionSection.value.querySelectorAll('.animate-in'), {
      opacity: 0,
      y: 30,
      stagger: 0.12,
      duration: 0.72,
      ease: 'power3.out',
      clearProps: 'opacity,transform',
      scrollTrigger: { trigger: missionSection.value, start: 'top 80%', once: true },
    })
  }

  // Values section
  if (valuesSection.value) {
    gsap.from(valuesSection.value.querySelectorAll('.value-card'), {
      opacity: 0,
      y: 32,
      stagger: 0.08,
      duration: 0.7,
      ease: 'power3.out',
      clearProps: 'opacity,transform',
      scrollTrigger: { trigger: valuesSection.value, start: 'top 80%', once: true },
    })
  }

  // Timeline
  if (teamSection.value) {
    gsap.from(teamSection.value.querySelectorAll('.timeline-item'), {
      opacity: 0,
      x: -20,
      stagger: 0.15,
      duration: 0.6,
      ease: 'power3.out',
      clearProps: 'opacity,transform',
      scrollTrigger: { trigger: teamSection.value, start: 'top 80%', once: true },
    })
  }

  // Stats section
  if (statsSection.value) {
    gsap.from(statsSection.value.querySelectorAll('.stat-item'), {
      opacity: 0,
      y: 24,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power3.out',
      clearProps: 'opacity,transform',
      scrollTrigger: { trigger: statsSection.value, start: 'top 85%', once: true },
    })
  }
})

onUnmounted(() => {
  if (heroLogo.value) gsap.killTweensOf(heroLogo.value.querySelectorAll('*'))
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
      <!-- Abstract visual elements -->

      <div class="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh] sm:min-h-[70vh] w-full">
        <!-- Left content -->
        <div
          class="z-10 flex flex-col justify-center px-6 pb-16 pt-28 sm:px-8 sm:pt-32 lg:items-end lg:px-12 lg:pb-20 lg:pt-32 xl:px-20"
        >
          <div class="w-full max-w-xl flex flex-col gap-5">
            <span class="eyebrow eyebrow--dark">
              {{ t('about.hero.badge') }}
            </span>

            <h1 ref="heroTitle" class="display-2 text-white">
              {{ t('about.hero.title') }}
            </h1>

            <p ref="heroSub" class="lead max-w-xl text-white/55">
              {{ t('about.hero.subtitle') }}
            </p>

            <div ref="heroActions" class="flex gap-4 flex-wrap mt-4">
              <a :href="calendlyUrl" target="_blank" rel="noopener noreferrer">
                <Button
                  :label="t('about.hero.button.demo')"
                  unstyled
                  class="btn-primary font-display font-bold"
                />
              </a>
            </div>
          </div>
        </div>

        <!-- Right visual - Logo -->
        <div
          class="hidden lg:flex relative h-full items-center justify-center p-12 overflow-visible"
        >
          <div
            ref="heroLogo"
            class="hero-logo-wrap relative z-10 flex items-center justify-center opacity-0"
          >
            <div class="hero-logo-glow absolute rounded-full" aria-hidden="true" />
            <div class="hero-logo-pulse absolute rounded-full" aria-hidden="true" />
            <div class="hero-logo-pulse absolute rounded-full" aria-hidden="true" />
            <div class="hero-logo-pulse absolute rounded-full" aria-hidden="true" />
            <div class="hero-logo-ring absolute rounded-full" aria-hidden="true" />
            <img
              :src="logoCircleImg"
              alt="Emmitec Health"
              class="hero-logo-img relative z-10 h-56 w-56 xl:h-64 xl:w-64 object-contain select-none mix-blend-screen drop-shadow-[0_20px_60px_rgba(17,211,211,0.35)]"
              draggable="false"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ── NOSSA HISTÓRIA (GALERIA) ── -->
    <section
      ref="storySection"
      class="py-20 sm:py-24 lg:py-28 bg-white w-full flex items-center justify-center"
    >
      <div class="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <!-- abertura -->
        <div class="story-animate flex max-w-3xl flex-col items-start gap-6">
          <span class="eyebrow eyebrow--light">{{ t('about.story.badge') }}</span>
          <h2 class="display-2 text-black">{{ t('about.story.title') }}</h2>
        </div>

        <!-- Duas colunas de altura parecida: retrato + citação à esquerda, narrativa à direita -->
        <div class="mt-12 grid grid-cols-1 gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-14 xl:gap-16">
          <!-- coluna esquerda: retrato -->
          <figure class="story-animate m-0 lg:col-span-5">
            <div class="story-portrait relative aspect-4/5 overflow-hidden rounded-2xl">
              <img
                :src="emilioImg"
                alt="Emílio Machado, fundador da Emmitec Health"
                class="h-full w-full object-cover"
              />
              <div
                class="pointer-events-none absolute inset-0 bg-linear-to-t from-dark/55 via-transparent to-transparent"
                aria-hidden="true"
              />
            </div>
          </figure>

          <!-- coluna direita: a narrativa em fluxo contínuo -->
          <div class="story-animate lg:col-span-7">
            <p class="story-body story-body--lead">{{ t('about.story.intro') }}</p>
            <p class="story-body mt-6">{{ t('about.story.paragraph1') }}</p>
            <p class="story-body mt-6">{{ t('about.story.paragraph2') }}</p>
          </div>
        </div>

        <!-- Assinatura + citação: faixa de largura cheia, para não sobrar
             um vazio ao lado quando as duas colunas fecham em alturas diferentes -->
        <div
          class="story-animate mt-12 flex flex-col gap-8 border-t border-gray-200/80 pt-10 md:flex-row md:items-center md:gap-14 lg:mt-14 lg:pt-12"
        >
          <div class="flex shrink-0 items-center gap-3.5">
            <span
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20"
            >
              <Crown :size="20" aria-hidden="true" />
            </span>
            <span class="min-w-0">
              <span class="block font-display text-[15.5px] font-bold text-black">
                Emílio Machado
              </span>
              <span class="block text-[12.5px] text-gray-500">
                {{ t('about.stats.founder') }}
              </span>
            </span>
          </div>

          <blockquote class="story-quote">
            <Quote :size="20" class="story-quote__mark" aria-hidden="true" />
            <p class="story-quote__text">{{ t('about.story.quote') }}</p>
          </blockquote>
        </div>
      </div>
    </section>

    <!-- ── NÚMEROS (quebra de ritmo entre a história e a missão) ── -->
    <section ref="statsSection" class="relative w-full overflow-hidden bg-dark py-14 sm:py-16">
      <div class="hero-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div
        class="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-2 gap-x-8 gap-y-10 px-6 sm:px-8 lg:grid-cols-4 lg:px-10"
      >
        <div
          v-for="s in statsData"
          :key="s.label"
          class="stat-item flex flex-col items-center text-center"
        >
          <div class="about-stat-num">{{ s.num }}</div>
          <div class="mt-2.5 text-[12.5px] font-medium text-white/55">{{ s.label }}</div>
        </div>
      </div>
    </section>

    <!-- ── MISSÃO ── -->
    <section
      ref="missionSection"
      class="py-20 sm:py-24 lg:py-28 bg-mid w-full flex items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <!-- Conteúdo — esquerda -->
          <div class="animate-in flex flex-col gap-6">
            <span class="eyebrow eyebrow--light">
              {{ t('about.mission.badge') }}
            </span>
            <h2 class="display-2 text-black">
              {{ t('about.mission.title') }}
            </h2>
            <p class="story-body max-w-[62ch]">
              {{ t('about.mission.description') }}
            </p>
            <ul class="m-0 mt-2 flex list-none flex-col gap-4 p-0">
              <li
                v-for="(item, i) in [
                  t('about.mission.item1'),
                  t('about.mission.item2'),
                  t('about.mission.item3'),
                ]"
                :key="i"
                class="mission-item flex items-start gap-4 rounded-r-xl border-l-[3px] border-primary bg-white/70 py-3.5 pl-5 pr-4"
              >
                <span class="font-display text-[15px] font-semibold leading-relaxed text-gray-800">
                  {{ item }}
                </span>
              </li>
            </ul>
          </div>

          <!-- Imagem — direita -->
          <div class="animate-in relative">
            <div
              class="relative rounded-2xl overflow-hidden aspect-4/3 shadow-[0_24px_64px_rgba(0,0,0,.12)]"
            >
              <img :src="missaoImg" alt="Nossa Missão" class="w-full h-full object-cover" />
            </div>
            <!-- Card flutuante -->
            <div
              class="absolute -bottom-5 -left-5 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3"
            >
              <div
                class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"
              >
                <Target :size="20" class="text-primary" />
              </div>
              <div>
                <div class="font-display font-bold text-black text-sm">500+</div>
                <div class="text-gray-500 text-[11px]">{{ t('about.stats.clinics') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── APLICAÇÕES CLÍNICAS ── -->
    <section ref="valuesSection" class="w-full bg-white py-20 sm:py-24 lg:py-28">
      <div class="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <div class="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <span class="eyebrow eyebrow--light">{{ t('about.values.badge') }}</span>
          <h2 class="display-2 text-black">{{ t('about.values.title') }}</h2>
          <p class="lead max-w-2xl text-gray-500">{{ t('about.values.subtitle') }}</p>
        </div>

        <!-- 2 colunas: em 4 a medida cai para ~28 caracteres por linha, ruim de ler -->
        <div class="mt-16 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2 lg:gap-6">
          <article
            v-for="(v, i) in valuesData"
            :key="v.title"
            class="value-card group relative flex h-full gap-5 overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 sm:gap-6 sm:p-7"
          >
            <div
              class="pointer-events-none absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              :class="v.color"
              aria-hidden="true"
            />
            <div class="relative flex shrink-0 flex-col items-center gap-3">
              <span
                class="flex h-13 w-13 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary transition-all duration-400 group-hover:bg-primary group-hover:text-dark"
              >
                <component :is="v.icon" :size="24" stroke-width="2.1" aria-hidden="true" />
              </span>
              <span
                class="font-display text-[11px] font-extrabold tracking-[0.12em] text-gray-300 transition-colors duration-400 group-hover:text-primary/60"
                aria-hidden="true"
              >
                {{ String(i + 1).padStart(2, '0') }}
              </span>
            </div>

            <div class="relative min-w-0">
              <h3 class="display-3 text-black">{{ v.title }}</h3>
              <p class="mt-3 text-[14.5px] leading-relaxed text-muted">
                {{ v.description }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ── TIMELINE ── -->
    <section
      ref="teamSection"
      class="timeline-section flex w-full items-center justify-center py-20 sm:py-24 lg:py-28"
    >
      <div class="mx-auto w-full max-w-5xl px-6 sm:px-8 lg:px-10">
        <div class="mb-16 flex flex-col items-center gap-6 text-center">
          <span class="eyebrow eyebrow--light">{{ t('about.timeline.badge') }}</span>
          <h2 class="display-2 text-black">{{ t('about.timeline.title') }}</h2>
        </div>

        <!-- Mobile: cards empilhados com linha lateral -->
        <div class="sm:hidden space-y-0">
          <div
            v-for="(m, i) in milestones"
            :key="m.year"
            class="timeline-item flex gap-4 py-6 border-b border-gray-100 last:border-none"
          >
            <!-- Coluna esquerda: ponto + linha conectora -->
            <div class="flex flex-col items-center shrink-0 pt-1">
              <div
                class="w-3 h-3 rounded-full bg-primary border-2 border-white shadow ring-[3px] ring-primary/20 shrink-0"
              />
              <div v-if="i < milestones.length - 1" class="w-0.5 bg-primary/20 flex-1 mt-2" />
            </div>
            <!-- Conteúdo -->
            <div class="flex-1 min-w-0">
              <div class="timeline-year mb-1.5">{{ m.year }}</div>
              <h3 class="display-3 mb-2 text-black">{{ m.title }}</h3>
              <p class="text-[14.5px] leading-relaxed text-gray-500">{{ m.desc }}</p>
            </div>
          </div>
        </div>

        <!-- Desktop: timeline alternado -->
        <div class="hidden sm:block relative">
          <div
            class="absolute left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-primary/45 to-transparent -translate-x-1/2"
          />
          <div class="space-y-12">
            <div
              v-for="(m, i) in milestones"
              :key="m.year"
              class="timeline-item relative flex items-center gap-8"
              :class="i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'"
            >
              <span
                class="timeline-dot absolute left-1/2 top-1/2 z-10 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-4 ring-white"
                aria-hidden="true"
              />
              <div class="w-[45%]" :class="i % 2 === 0 ? 'text-right pr-14' : 'text-left pl-14'">
                <div class="timeline-year mb-2">{{ m.year }}</div>
                <h3 class="display-3 mb-2.5 text-black">{{ m.title }}</h3>
                <p class="text-[14.5px] leading-relaxed text-gray-500">{{ m.desc }}</p>
              </div>
              <div class="w-[45%]" />
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
          {{ t('about.cta.badge') }}
        </span>
        <h2 class="display-2 mt-2 mb-4 text-white">
          {{ t('about.cta.title') }}
        </h2>
        <p class="text-white/45 text-[14px] sm:text-[16px] leading-relaxed mb-8 max-w-2xl mx-auto">
          {{ t('about.cta.subtitle') }}
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <a :href="calendlyUrl" target="_blank" rel="noopener noreferrer">
            <Button
              :label="t('about.cta.button.primary')"
              unstyled
              class="btn-primary font-display px-8 py-3"
            />
          </a>
          <RouterLink to="/what-is-rpm" class="btn-ghost font-display group">
            {{ t('about.cta.button.secondary') }}
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
/* ─── História: ritmo editorial ───
   Medida de linha curta (~64ch): o texto longo precisa convidar à leitura. */
.story-body {
  max-width: 64ch;
  font-size: 15.5px;
  line-height: 1.8;
  color: #4b5563;
}
/* parágrafo de abertura: um degrau acima do corpo, sem virar outro título */
.story-body--lead {
  font-size: 17px;
  line-height: 1.72;
  color: #374151;
}
/* capitular no parágrafo de abertura — âncora visual de onde a leitura começa.
   Fica aqui e não no seguinte porque "A jornada…" começaria com artigo de uma letra. */
.story-body--lead::first-letter {
  float: left;
  margin: 0.05em 0.08em 0 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 3.2em;
  font-weight: 800;
  line-height: 0.84;
  color: #0aa3a8;
}

.story-portrait {
  box-shadow:
    0 30px 70px -30px rgba(15, 23, 42, 0.42),
    0 0 0 1px rgba(15, 23, 42, 0.06);
}

/* Citação na faixa de assinatura: ocupa a largura restante ao lado do autor */
.story-quote {
  margin: 0;
  flex: 1;
  min-width: 0;
  border-left: 3px solid #11d3d3;
  padding: 0.15rem 0 0.15rem 1.5rem;
}
.story-quote__mark {
  color: rgba(17, 211, 211, 0.5);
  margin-bottom: 0.5rem;
}
.story-quote__text {
  margin: 0;
  max-width: 46ch;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: clamp(1.12rem, 1.9vw, 1.45rem);
  font-weight: 700;
  line-height: 1.42;
  letter-spacing: -0.018em;
  color: #0e1117;
}
.story-quote__text::before {
  content: '\201C';
}
.story-quote__text::after {
  content: '\201D';
}

/* ─── Missão ─── */
.mission-item {
  transition:
    border-color 0.3s ease,
    transform 0.3s ease;
}
@media (hover: hover) {
  .mission-item:hover {
    transform: translateX(4px);
  }
}

/* ─── Números ─── */
.about-stat-num {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: clamp(1.9rem, 3.2vw, 2.6rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
  background-image: linear-gradient(100deg, #11d3d3, #7cc4ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

/* ─── Aplicações clínicas ─── */
.value-card {
  transition:
    transform 0.45s ease,
    border-color 0.45s ease,
    box-shadow 0.45s ease;
}
@media (hover: hover) {
  .value-card:hover {
    transform: translateY(-6px);
    border-color: rgba(17, 211, 211, 0.35);
    box-shadow: 0 26px 58px -28px rgba(17, 211, 211, 0.5);
  }
}

/* ─── Linha do tempo ─── */
.timeline-section {
  background: linear-gradient(180deg, #ffffff 0%, #f7f9fa 50%, #ffffff 100%);
}
.timeline-year {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: clamp(1.6rem, 2.6vw, 2.15rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
  background-image: linear-gradient(100deg, #11d3d3, #7cc4ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}
.timeline-dot {
  box-shadow: 0 0 0 0 rgba(17, 211, 211, 0.5);
  animation: timeline-pulse 2.6s ease-out infinite;
}
@keyframes timeline-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(17, 211, 211, 0.5);
  }
  70%,
  100% {
    box-shadow: 0 0 0 12px rgba(17, 211, 211, 0);
  }
}
@media (prefers-reduced-motion: reduce) {
  .timeline-dot {
    animation: none;
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

.hero-logo-wrap {
  width: 320px;
  height: 320px;
}

.hero-logo-glow {
  inset: 18%;
  background: radial-gradient(
    circle,
    rgba(17, 211, 211, 0.4) 0%,
    rgba(17, 211, 211, 0.08) 45%,
    transparent 70%
  );
  filter: blur(8px);
  opacity: 0.65;
}

.hero-logo-pulse {
  inset: 10%;
  border: 1.5px solid rgba(17, 211, 211, 0.55);
  box-shadow: 0 0 24px rgba(17, 211, 211, 0.18);
  pointer-events: none;
}

.hero-logo-ring {
  inset: 8%;
  border: 1px solid rgba(17, 211, 211, 0.22);
  box-shadow:
    0 0 0 10px rgba(17, 211, 211, 0.03),
    inset 0 0 40px rgba(17, 211, 211, 0.05);
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(17, 211, 211, 0.55) 40deg,
    transparent 90deg,
    transparent 180deg,
    rgba(17, 211, 211, 0.35) 220deg,
    transparent 280deg
  );
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px));
  mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px));
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
