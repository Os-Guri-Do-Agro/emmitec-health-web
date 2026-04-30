<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from 'primevue/button'

import {
  Target,
  Eye,
  HeartHandshake,
  Award,
  Users,
  Lightbulb,
  Globe,
  Shield,
  ArrowRight,
  Quote,
  Crown,
} from 'lucide-vue-next'

import emilioImg from '@/assets/about/emillio.png'
import missaoImg from '@/assets/about/nossaMissão-img.jpg'

const { t } = useI18n()

const calendlyUrl = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `https://calendly.com/emilio-machado-emmitec-health/vamos-nos-reunir-agende-sua-reuniao-online?month=${year}-${month}`
})

gsap.registerPlugin(ScrollTrigger)

const bioExpanded = ref(false)

// Refs para animações
const heroTitle = ref<HTMLElement | null>(null)
const heroSub = ref<HTMLElement | null>(null)
const heroActions = ref<HTMLElement | null>(null)

const storySection = ref<HTMLElement | null>(null)
const missionSection = ref<HTMLElement | null>(null)
const visionSection = ref<HTMLElement | null>(null)
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

  // Vision section
  if (visionSection.value) {
    gsap.from(visionSection.value.querySelectorAll('.animate-in'), {
      opacity: 0,
      y: 30,
      stagger: 0.12,
      duration: 0.72,
      ease: 'power3.out',
      clearProps: 'opacity,transform',
      scrollTrigger: { trigger: visionSection.value, start: 'top 80%', once: true },
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
  ScrollTrigger.getAll().forEach((t) => t.kill())
})
</script>

<template>
  <div class="font-body text-black overflow-x-hidden w-full">
    <!-- ── HERO ── -->
    <section class="min-h-[60vh] sm:min-h-[70vh] bg-dark relative overflow-hidden w-full">
      <div class="hero-grid absolute inset-0 pointer-events-none" />
      <!-- Abstract visual elements -->

      <div class="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh] sm:min-h-[70vh] w-full">
        <!-- Left content -->
        <div
          class="flex flex-col justify-center items-end px-4 sm:px-6 lg:px-12 xl:px-20 py-20 lg:py-0 z-10"
        >
          <div class="w-full max-w-xl flex flex-col gap-5">
            <span
              class="inline-block text-[11px] font-bold uppercase text-primary font-display tracking-[2px]"
            >
              {{ t('about.hero.badge') }}
            </span>

            <h1
              ref="heroTitle"
              class="font-display font-extrabold text-white leading-[1.08] tracking-tight text-xl sm:text-2xl lg:text-[34px]"
            >
              {{ t('about.hero.title') }}
            </h1>

            <p
              ref="heroSub"
              class="text-white/50 text-[12px] sm:text-[14px] leading-relaxed max-w-md font-light"
            >
              {{ t('about.hero.subtitle') }}
            </p>

            <div ref="heroActions" class="flex gap-4 flex-wrap mt-4">
              <a :href="calendlyUrl" target="_blank" rel="noopener noreferrer">
                <Button
                  label="Solicitar Demonstração"
                  unstyled
                  class="btn-primary font-display font-bold"
                />
              </a>
              <Button
                :label="t('about.hero.button.careers') + ' →'"
                unstyled
                class="btn-ghost font-display font-bold"
              />
            </div>
          </div>
        </div>

        <!-- Right visual - Stats grid -->
        <div class="hidden lg:flex relative h-full items-center justify-center p-12">
          <div class="grid grid-cols-2 gap-4 w-full max-w-sm">
            <!-- Founded -->
            <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div class="font-display font-extrabold text-primary text-3xl">2006</div>
              <div class="text-white/60 text-sm mt-1">{{ t('about.stats.founded') }}</div>
            </div>
            <!-- Clinics -->
            <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div class="font-display font-extrabold text-primary text-3xl">500+</div>
              <div class="text-white/60 text-sm mt-1">{{ t('about.stats.clinics') }}</div>
            </div>
            <!-- Patients -->
            <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div class="font-display font-extrabold text-primary text-3xl">50K+</div>
              <div class="text-white/60 text-sm mt-1">{{ t('about.stats.patients') }}</div>
            </div>
            <!-- Team -->
            <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div class="font-display font-extrabold text-primary text-3xl">120+</div>
              <div class="text-white/60 text-sm mt-1">{{ t('about.stats.team') }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── NOSSA HISTÓRIA (GALERIA) ── -->
    <section
      ref="storySection"
      class="py-16 sm:py-20 bg-white w-full flex items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          <!-- Imagem Emílio -->
          <div class="story-animate relative">
            <div
              class="relative rounded-2xl overflow-hidden aspect-4/3 shadow-[0_24px_64px_rgba(0,0,0,.12)]"
            >
              <img :src="emilioImg" alt="Emílio - Fundador" class="w-full h-full object-cover" />
            </div>
            <div
              class="absolute -bottom-4 -right-4 bg-primary text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3"
            >
              <div
                class="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0"
              >
                <Crown :size="20" class="text-white" />
              </div>
              <div>
                <div class="font-display font-bold text-sm">Emílio</div>
                <div class="text-xs text-white/80">{{ t('about.stats.founder') }}</div>
              </div>
            </div>
          </div>

          <!-- Text content -->
          <div class="story-animate flex flex-col gap-5">
            <span
              class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary"
            >
              {{ t('about.story.badge') }}
            </span>
            <h2
              class="font-display font-extrabold text-black text-[clamp(24px,3vw,36px)] tracking-tight leading-tight"
            >
              {{ t('about.story.title') }}
            </h2>
            <div class="flex flex-col gap-2">
              <div
                class="relative overflow-hidden transition-[max-height] duration-500 ease-in-out"
                :style="{ maxHeight: bioExpanded ? '900px' : '190px' }"
              >
                <p class="text-gray-500 text-[14px] sm:text-[15px] leading-relaxed">
                  {{ t('about.story.intro') }}
                </p>
                <p class="text-gray-500 text-[14px] sm:text-[15px] leading-relaxed mt-3">
                  {{ t('about.story.paragraph1') }}
                </p>
                <p class="text-gray-500 text-[14px] sm:text-[15px] leading-relaxed mt-3">
                  {{ t('about.story.paragraph2') }}
                </p>
                <div
                  v-if="!bioExpanded"
                  class="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-white to-transparent pointer-events-none"
                />
              </div>
              <button
                @click="bioExpanded = !bioExpanded"
                class="text-primary text-[11px] font-semibold self-start hover:opacity-70 transition-opacity flex items-center gap-1.5 mt-1 cursor-pointer"
              >
                {{ bioExpanded ? t('about.hero.bio.less') : t('about.hero.bio.more') }}
                <ArrowRight
                  :size="11"
                  class="transition-transform duration-300"
                  :class="bioExpanded ? '-rotate-90' : 'rotate-90'"
                />
              </button>
            </div>
            <div class="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
              <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Quote :size="20" class="text-primary" />
              </div>
              <p class="text-gray-600 text-sm italic">"{{ t('about.story.quote') }}"</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── MISSÃO ── -->
    <section
      ref="missionSection"
      class="py-16 sm:py-20 bg-mid w-full flex items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <!-- Conteúdo — esquerda -->
          <div class="animate-in flex flex-col gap-6">
            <span
              class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary"
            >
              {{ t('about.mission.badge') }}
            </span>
            <h2
              class="font-display font-extrabold text-black text-[clamp(26px,3vw,40px)] tracking-tight leading-tight"
            >
              {{ t('about.mission.title') }}
            </h2>
            <p class="text-gray-500 text-[14px] sm:text-[15px] leading-relaxed">
              {{ t('about.mission.description') }}
            </p>
            <div class="flex flex-col gap-4 mt-1">
              <div
                v-for="(item, i) in [
                  t('about.mission.item1'),
                  t('about.mission.item2'),
                  t('about.mission.item3'),
                ]"
                :key="i"
                class="flex items-start gap-3 pl-4 border-l-2 border-primary"
              >
                <p class="text-gray-600 text-[14px] leading-relaxed">{{ item }}</p>
              </div>
            </div>
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

    <!-- ── TIMELINE ── -->
    <section
      ref="teamSection"
      class="py-16 sm:py-20 bg-white w-full flex items-center justify-center"
    >
      <div class="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <span
            class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary mb-4"
          >
            {{ t('about.timeline.badge') }}
          </span>
          <h2
            class="font-display font-extrabold text-black text-[clamp(26px,3vw,40px)] tracking-tight"
          >
            {{ t('about.timeline.title') }}
          </h2>
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
              <div
                class="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-2"
              >
                {{ m.year }}
              </div>
              <h3 class="font-display font-bold text-black text-lg mb-1">{{ m.title }}</h3>
              <p class="text-gray-500 text-sm leading-relaxed">{{ m.desc }}</p>
            </div>
          </div>
        </div>

        <!-- Desktop: timeline alternado -->
        <div class="hidden sm:block relative">
          <div
            class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-primary via-primary/50 to-primary/20 -translate-x-1/2"
          />
          <div class="space-y-8">
            <div
              v-for="(m, i) in milestones"
              :key="m.year"
              class="timeline-item relative flex items-center gap-8"
              :class="i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'"
            >
              <div
                class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-lg z-10"
              />
              <div class="w-[45%]" :class="i % 2 === 0 ? 'text-right pr-12' : 'text-left pl-12'">
                <div
                  class="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-2"
                >
                  {{ m.year }}
                </div>
                <h3 class="font-display font-bold text-black text-lg mb-1">{{ m.title }}</h3>
                <p class="text-gray-500 text-sm leading-relaxed">{{ m.desc }}</p>
              </div>
              <div class="w-[45%]" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── RECONHECIMENTOS ── -->
    <section
      ref="visionSection"
      class="py-16 sm:py-20 bg-white w-full flex items-center justify-center gap-5"
    >
      <div class="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-5">
        <!-- Header centrado -->
        <div class="text-center mb-12 flex flex-col items-center gap-4">
          <div class="animate-in relative">
            <div
              class="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center"
            >
              <Award :size="28" class="text-primary" />
            </div>
            <div
              class="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md"
            >
              2024
            </div>
          </div>
          <span
            class="animate-in inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary"
          >
            {{ t('about.vision.badge') }}
          </span>
          <h2
            class="animate-in font-display font-extrabold text-black text-[clamp(24px,3vw,38px)] tracking-tight leading-tight max-w-2xl"
          >
            {{ t('about.vision.title') }}
          </h2>
          <p class="animate-in text-gray-500 text-[14px] sm:text-[15px] leading-relaxed max-w-2xl">
            {{ t('about.vision.description') }}
          </p>
        </div>

        <!-- Cards de depoimento -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div
            class="animate-in rounded-2xl border border-gray-100 bg-gray-50 p-8 flex flex-col gap-4"
          >
            <Quote :size="20" class="text-primary" />
            <p class="text-gray-700 text-[15px] leading-relaxed flex-1 italic">
              "EmmiTec transformou nosso atendimento"
            </p>
            <div class="flex items-center gap-3 pt-4 border-t border-gray-200">
              <div
                class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
              >
                <Users :size="14" class="text-primary" />
              </div>
              <div>
                <div class="font-display font-bold text-black text-sm">Partner</div>
                <div class="text-gray-400 text-[11px]">Clínica parceira</div>
              </div>
            </div>
          </div>

          <div
            class="animate-in rounded-2xl border border-gray-100 bg-gray-50 p-8 flex flex-col gap-4"
          >
            <Quote :size="20" class="text-emerald-500" />
            <p class="text-gray-700 text-[15px] leading-relaxed flex-1 italic">
              "Cuidado remoto de qualidade"
            </p>
            <div class="flex items-center gap-3 pt-4 border-t border-gray-200">
              <div
                class="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0"
              >
                <HeartHandshake :size="14" class="text-emerald-600" />
              </div>
              <div>
                <div class="font-display font-bold text-black text-sm">Client</div>
                <div class="text-gray-400 text-[11px]">Paciente</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA ── -->
    <section
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
        class="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 flex flex-col gap-5 items-center justify-center"
      >
        <span
          class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary"
        >
          {{ t('about.cta.badge') }}
        </span>
        <h2
          class="font-display font-extrabold text-white mt-2 mb-4 text-[clamp(24px,2.5vw,40px)] leading-tight tracking-tight"
        >
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
          <a href="/what-is-rpm">
            <Button :label="t('about.cta.button.secondary')" unstyled class="btn-ghost font-display px-8 py-3" />
          </a>
        </div>
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
