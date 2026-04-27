<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
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
} from 'lucide-vue-next'

const { t } = useI18n()

gsap.registerPlugin(ScrollTrigger)

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
const valuesData = [
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
]

const statsData = [
  { num: '2018', label: t('about.stats.founded') },
  { num: '500+', label: t('about.stats.clinics') },
  { num: '50K+', label: t('about.stats.patients') },
  { num: '120+', label: t('about.stats.team') },
]

const milestones = [
  { year: '2018', title: t('about.timeline.2018.title'), desc: t('about.timeline.2018.desc') },
  { year: '2020', title: t('about.timeline.2020.title'), desc: t('about.timeline.2020.desc') },
  { year: '2022', title: t('about.timeline.2022.title'), desc: t('about.timeline.2022.desc') },
  { year: '2024', title: t('about.timeline.2024.title'), desc: t('about.timeline.2024.desc') },
]

onMounted(() => {
  // Hero entrance
  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
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
              <Button
                :label="t('about.hero.button.contact')"
                unstyled
                class="btn-primary font-display font-bold"
              />
              <Button
                :label="t('about.hero.button.careers') + ' →'"
                unstyled
                class="btn-ghost font-display font-bold"
              />
            </div>
          </div>
        </div>

        <!-- Right visual - Timeline pattern (following Story section style) -->
        <div class="hidden lg:flex relative h-full items-center justify-center p-12">
          <div class="relative w-full max-w-xs">
            <!-- Vertical line -->
            <div class="absolute left-8 top-0 bottom-0 w-px bg-white/10" />

            <!-- 2017 - Foundation -->
            <div class="relative flex items-start gap-6 mb-10">
              <div
                class="relative z-10 w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center shrink-0"
              >
                <span class="font-display font-bold text-primary text-sm">17</span>
              </div>
              <div class="pt-3">
                <div class="font-display font-bold text-white">2017</div>
                <div class="text-sm text-white/50">The Beginning</div>
              </div>
            </div>

            <!-- RPM Platform -->
            <div class="relative flex items-start gap-6 mb-10">
              <div
                class="relative z-10 w-16 h-16 rounded-full bg-dark-2 border-2 border-white/20 flex items-center justify-center shrink-0"
              >
                <HeartHandshake :size="20" class="text-white/70" />
              </div>
              <div class="pt-3">
                <div class="font-display font-bold text-white">RPM</div>
                <div class="text-sm text-white/50">Remote Care</div>
              </div>
            </div>

            <!-- Global Reach -->
            <div class="relative flex items-start gap-6">
              <div
                class="relative z-10 w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center shrink-0"
              >
                <Globe :size="20" class="text-emerald-400/70" />
              </div>
              <div class="pt-3">
                <div class="font-display font-bold text-white">Global</div>
                <div class="text-sm text-white/50">BR → USA</div>
              </div>
            </div>

            <!-- Decorative dot pattern -->
            <div class="absolute -right-4 top-10 grid grid-cols-3 gap-1">
              <div class="w-1 h-1 rounded-full bg-white/10" />
              <div class="w-1 h-1 rounded-full bg-white/10" />
              <div class="w-1 h-1 rounded-full bg-white/10" />
              <div class="w-1 h-1 rounded-full bg-white/10" />
              <div class="w-1 h-1 rounded-full bg-primary/40" />
              <div class="w-1 h-1 rounded-full bg-white/10" />
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
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <!-- Minimal timeline visual -->
          <div
            class="story-animate relative h-[400px] sm:h-[500px] flex items-center justify-center"
          >
            <div class="relative w-full max-w-xs">
              <!-- Vertical line -->
              <div class="absolute left-8 top-0 bottom-0 w-px bg-slate-200" />

              <!-- 2006 -->
              <div class="relative flex items-start gap-8 mb-16">
                <div
                  class="relative z-10 w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center shrink-0"
                >
                  <span class="font-display font-bold text-slate-600 text-sm">06</span>
                </div>
                <div class="pt-3">
                  <div class="font-display font-bold text-slate-900">2006</div>
                  <div class="text-sm text-slate-500">Tech + Apple</div>
                </div>
              </div>

              <!-- 2017 -->
              <div class="relative flex items-start gap-8 mb-16">
                <div
                  class="relative z-10 w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center shrink-0"
                >
                  <span class="font-display font-bold text-primary text-sm">17</span>
                </div>
                <div class="pt-3">
                  <div class="font-display font-bold text-slate-900">2017</div>
                  <div class="text-sm text-slate-500">The Pivot</div>
                </div>
              </div>

              <!-- 2018 -->
              <div class="relative flex items-start gap-8">
                <div
                  class="relative z-10 w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center shrink-0"
                >
                  <span class="font-display font-bold text-emerald-600 text-sm">18</span>
                </div>
                <div class="pt-3">
                  <div class="font-display font-bold text-slate-900">2018</div>
                  <div class="text-sm text-slate-500">Health Focus</div>
                </div>
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
            <p class="text-gray-500 text-[14px] sm:text-[15px] leading-relaxed">
              {{ t('about.story.paragraph1') }}
            </p>
            <p class="text-gray-500 text-[14px] sm:text-[15px] leading-relaxed">
              {{ t('about.story.paragraph2') }}
            </p>
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

    <!-- ── MISSÃO (SPLIT) ── -->
    <section
      ref="missionSection"
      class="py-16 sm:py-20 bg-mid w-full flex items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <!-- Visual -->
          <div class="animate-in order-2 lg:order-1">
            <div
              class="relative rounded-2xl overflow-hidden aspect-4/3 shadow-[0_28px_72px_rgba(0,0,0,.18)]"
            >
              <div
                class="absolute inset-0 bg-linear-to-br from-primary/30 via-primary/10 to-transparent"
              />
              <div class="absolute inset-0 flex items-center justify-center">
                <div
                  class="w-32 h-32 rounded-2xl bg-white/90 shadow-xl flex items-center justify-center"
                >
                  <Target :size="56" class="text-primary" />
                </div>
              </div>
              <!-- Decorative circles -->
              <div class="absolute top-4 left-4 w-16 h-16 rounded-full bg-white/20" />
              <div
                class="absolute bottom-8 right-8 w-24 h-24 rounded-full border-2 border-white/30"
              />
            </div>
          </div>

          <!-- Content -->
          <div class="animate-in order-1 lg:order-2 flex flex-col gap-5">
            <span
              class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary"
            >
              {{ t('about.mission.badge') }}
            </span>
            <h2
              class="font-display font-extrabold text-black text-[clamp(24px,3vw,36px)] tracking-tight leading-tight"
            >
              {{ t('about.mission.title') }}
            </h2>
            <p class="text-gray-500 text-[14px] sm:text-[16px] leading-relaxed">
              {{ t('about.mission.description') }}
            </p>
            <ul class="flex flex-col gap-3 mt-2">
              <li
                v-for="(item, i) in [
                  t('about.mission.item1'),
                  t('about.mission.item2'),
                  t('about.mission.item3'),
                ]"
                :key="i"
                class="flex items-start gap-3 text-[14px] text-gray-600"
              >
                <span
                  class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-primary" />
                </span>
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ── RECONHECIMENTOS (AWARDS) ── -->
    <section
      ref="visionSection"
      class="py-16 sm:py-20 bg-white w-full flex items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <!-- Content -->
          <div class="animate-in flex flex-col gap-5">
            <span
              class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary"
            >
              {{ t('about.vision.badge') }}
            </span>
            <h2
              class="font-display font-extrabold text-black text-[clamp(24px,3vw,36px)] tracking-tight leading-tight"
            >
              {{ t('about.vision.title') }}
            </h2>
            <p class="text-gray-500 text-[14px] sm:text-[16px] leading-relaxed">
              {{ t('about.vision.description') }}
            </p>
            <div class="flex flex-wrap items-center gap-4 mt-4">
              <Button
                :label="t('about.vision.button1')"
                unstyled
                class="btn-primary font-display font-bold"
              />
              <Button
                :label="t('about.vision.button2')"
                unstyled
                class="btn-ghost font-display font-bold"
              />
            </div>
          </div>

          <!-- Visual - Awards/Trophies minimal design -->
          <div class="animate-in">
            <div class="relative flex items-center justify-center h-[300px] sm:h-[350px]">
              <!-- Central trophy icon -->
              <div class="relative">
                <div
                  class="w-28 h-28 rounded-2xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center"
                >
                  <Award :size="48" class="text-primary" />
                </div>
                <!-- Year badge -->
                <div
                  class="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-md"
                >
                  2024
                </div>
              </div>

              <!-- Floating testimonial cards -->
              <div
                class="absolute top-0 left-0 bg-white rounded-xl shadow-lg border border-gray-100 p-3 max-w-[140px]"
              >
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users :size="14" class="text-primary" />
                  </div>
                  <div class="text-xs font-semibold text-gray-700">Partner</div>
                </div>
                <p class="text-[10px] text-gray-500 leading-tight">
                  "EmmiTec transformou nosso atendimento"
                </p>
              </div>

              <div
                class="absolute bottom-4 right-0 bg-white rounded-xl shadow-lg border border-gray-100 p-3 max-w-[140px]"
              >
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <HeartHandshake :size="14" class="text-emerald-600" />
                  </div>
                  <div class="text-xs font-semibold text-gray-700">Client</div>
                </div>
                <p class="text-[10px] text-gray-500 leading-tight">"Cuidado remoto de qualidade"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── VALORES (6 CARDS) ── -->
    <section
      ref="valuesSection"
      class="py-16 sm:py-20 bg-mid w-full flex items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12 flex flex-col items-center justify-center gap-5 pb-10">
          <span
            class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary"
          >
            {{ t('about.values.badge') }}
          </span>
          <h2
            class="font-display font-extrabold text-black text-[clamp(26px,3vw,40px)] tracking-tight leading-tight"
          >
            {{ t('about.values.title') }}
          </h2>
          <p class="text-gray-500 text-[14px] sm:text-[16px] leading-relaxed max-w-2xl">
            {{ t('about.values.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div
            v-for="v in valuesData"
            :key="v.title"
            class="value-card group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6"
          >
            <!-- Gradient bg on hover -->
            <div
              :class="`absolute inset-0 bg-linear-to-br ${v.color} opacity-0 group-hover:opacity-100`"
            />
            <div class="relative z-10 flex flex-col gap-2 items-center text-center">
              <div
                class="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 text-primary"
              >
                <component :is="v.icon" :size="28" />
              </div>
              <h4 class="font-display font-bold text-black text-[16px] mb-2 tracking-tight">
                {{ v.title }}
              </h4>
              <p class="text-gray-500 text-[13px] leading-relaxed">{{ v.description }}</p>
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

        <div class="relative">
          <!-- Timeline line -->
          <div
            class="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-primary via-primary/50 to-primary/20 sm:-translate-x-1/2"
          />

          <div class="space-y-8">
            <div
              v-for="(m, i) in milestones"
              :key="m.year"
              class="timeline-item relative flex items-start sm:items-center gap-4 sm:gap-8"
              :class="i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'"
            >
              <!-- Dot -->
              <div
                class="absolute left-4 sm:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-lg sm:-translate-x-1/2 z-10"
              />

              <!-- Content -->
              <div
                class="ml-12 sm:ml-0 sm:w-[45%]"
                :class="i % 2 === 0 ? 'sm:text-right sm:pr-12' : 'sm:text-left sm:pl-12'"
              >
                <div
                  class="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-2"
                >
                  {{ m.year }}
                </div>
                <h3 class="font-display font-bold text-black text-lg mb-1">{{ m.title }}</h3>
                <p class="text-gray-500 text-sm">{{ m.desc }}</p>
              </div>

              <!-- Spacer for alternating layout -->
              <div class="hidden sm:block sm:w-[45%]" />
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
        class="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 flex flex-col gap-5"
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
          <Button
            :label="t('about.cta.button.contact')"
            unstyled
            class="btn-primary font-display px-8 py-3"
          />
          <Button
            :label="t('about.cta.button.learn')"
            unstyled
            class="btn-ghost font-display px-8 py-3"
          />
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
