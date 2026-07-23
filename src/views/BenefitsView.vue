<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from 'primevue/button'

import {
  HeartHandshake,
  Home,
  Clock,
  Smile,
  TrendingDown,
  Users,
  Activity,
  Check,
  Building2,
  DollarSign,
  Sparkles,
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
const benefitsVisual = ref<HTMLElement | null>(null)

const patientSection = ref<HTMLElement | null>(null)
const clinicSection = ref<HTMLElement | null>(null)
const statsSection = ref<HTMLElement | null>(null)
const comparisonSection = ref<HTMLElement | null>(null)

const patientBenefits = computed(() => [
  {
    icon: Home,
    title: t('benefitsPage.patient.card1.title'),
    desc: t('benefitsPage.patient.card1.desc'),
  },
  {
    icon: Clock,
    title: t('benefitsPage.patient.card2.title'),
    desc: t('benefitsPage.patient.card2.desc'),
  },
  {
    icon: Smile,
    title: t('benefitsPage.patient.card3.title'),
    desc: t('benefitsPage.patient.card3.desc'),
  },
  {
    icon: HeartHandshake,
    title: t('benefitsPage.patient.card4.title'),
    desc: t('benefitsPage.patient.card4.desc'),
  },
])

const clinicItems = computed(() => [
  t('benefitsPage.clinic.item1'),
  t('benefitsPage.clinic.item2'),
  t('benefitsPage.clinic.item3'),
  t('benefitsPage.clinic.item4'),
  t('benefitsPage.clinic.item5'),
])

const stats = computed(() => [
  { num: '-38%', label: t('benefitsPage.stats.readmissions'), icon: TrendingDown },
  { num: '+62%', label: t('benefitsPage.stats.adherence'), icon: Activity },
  { num: '4.8/5', label: t('benefitsPage.stats.satisfaction'), icon: Smile },
  { num: '24/7', label: t('benefitsPage.stats.monitoring'), icon: Clock },
])

const comparison = computed(() => [
  { label: t('benefitsPage.comparison.row1'), traditional: false, rpm: true },
  { label: t('benefitsPage.comparison.row2'), traditional: false, rpm: true },
  { label: t('benefitsPage.comparison.row3'), traditional: false, rpm: true },
  { label: t('benefitsPage.comparison.row4'), traditional: true, rpm: true },
  { label: t('benefitsPage.comparison.row5'), traditional: false, rpm: true },
])

onMounted(() => {
  gsap
    .timeline({ defaults: { ease: 'power3.out', clearProps: 'opacity,transform' } })
    .from(heroTitle.value, { opacity: 0, y: 34, duration: 0.8 })
    .from(heroSub.value, { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
    .from(heroActions.value, { opacity: 0, y: 20, duration: 0.6 }, '-=0.35')

  if (benefitsVisual.value) {
    const root = benefitsVisual.value
    const hub = root.querySelector('.benefit-hub')
    const orbit = root.querySelector('.benefit-orbit')
    const glow = root.querySelector('.benefit-glow')
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.benefit-chip'))
    const nums = root.querySelectorAll<HTMLElement>('.benefit-num')

    gsap.set([hub, glow, orbit, ...cards], { opacity: 0 })
    gsap.set(hub, { scale: 0.7 })
    gsap.set(cards, { y: 18, scale: 0.94 })

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.to(glow, { opacity: 1, duration: 0.7 }, 0.2)
      .to(orbit, { opacity: 1, duration: 0.6 }, 0.25)
      .to(hub, { opacity: 1, scale: 1, duration: 0.75, ease: 'back.out(1.6)' }, 0.3)
      .to(
        cards,
        { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.14 },
        0.5,
      )

    nums.forEach((el) => {
      const target = Number(el.dataset.value)
      const prefix = el.dataset.prefix ?? ''
      const suffix = el.dataset.suffix ?? ''
      const decimals = Number(el.dataset.decimals ?? 0)
      if (Number.isNaN(target)) return
      const state = { value: 0 }
      tl.to(
        state,
        {
          value: target,
          duration: 1.15,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${prefix}${state.value.toFixed(decimals)}${suffix}`
          },
        },
        0.75,
      )
    })

    // Idle: soft float
    cards.forEach((card, i) => {
      gsap.to(card, {
        y: i % 2 === 0 ? -6 : 6,
        duration: 3 + i * 0.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2 + i * 0.2,
      })
    })

    // Idle: orbit drift
    gsap.to(orbit, {
      rotation: 360,
      duration: 40,
      ease: 'none',
      repeat: -1,
    })

    // Idle: glow breathe
    gsap.to(glow, {
      scale: 1.12,
      opacity: 0.55,
      duration: 2.6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.8,
    })

    // Idle: highlight each benefit in turn
    const spotlight = gsap.timeline({ repeat: -1, delay: 2.6 })
    cards.forEach((card) => {
      spotlight
        .to(card, {
          boxShadow: '0 16px 40px rgba(17,211,211,0.22)',
          filter: 'brightness(1.12)',
          duration: 0.4,
        })
        .to(card, {
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          filter: 'brightness(1)',
          duration: 0.4,
          delay: 1.15,
        })
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

  animate(patientSection.value, '.patient-card', { stagger: 0.08 })
  animate(clinicSection.value, '.animate-in')
  animate(statsSection.value, '.stat-item', { stagger: 0.08, y: 24 })
  animate(comparisonSection.value, '.comparison-row', { stagger: 0.06, y: 16 })
})

onUnmounted(() => {
  if (benefitsVisual.value) gsap.killTweensOf(benefitsVisual.value.querySelectorAll('*'))
  ScrollTrigger.getAll().forEach((t) => t.kill())
})
</script>

<template>
  <div class="font-body text-black overflow-x-hidden w-full">
    <!-- ── HERO ── -->
    <section class="min-h-[60vh] sm:min-h-[70vh] bg-dark relative overflow-hidden w-full">
      <div class="hero-grid absolute inset-0 pointer-events-none" />

      <div class="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh] sm:min-h-[70vh] w-full">
        <div
          class="flex flex-col justify-center items-end px-4 sm:px-6 lg:px-12 xl:px-20 py-20 lg:py-0 z-10"
        >
          <div class="w-full max-w-xl flex flex-col gap-5">
            <span
              class="inline-block text-[11px] font-bold uppercase text-primary font-display tracking-[2px]"
            >
              {{ t('benefitsPage.hero.badge') }}
            </span>
            <h1
              ref="heroTitle"
              class="font-display font-extrabold text-white leading-[1.08] tracking-tight text-xl sm:text-2xl lg:text-[34px]"
            >
              {{ t('benefitsPage.hero.title') }}
            </h1>
            <p
              ref="heroSub"
              class="text-white/50 text-[12px] sm:text-[14px] leading-relaxed max-w-md font-light"
            >
              {{ t('benefitsPage.hero.subtitle') }}
            </p>
            <div ref="heroActions" class="flex gap-4 flex-wrap mt-4">
              <a :href="calendlyUrl" target="_blank" rel="noopener noreferrer">
                <Button
                  :label="t('benefitsPage.hero.button.primary')"
                  unstyled
                  class="btn-primary font-display font-bold"
                />
              </a>
              <Button
                :label="t('benefitsPage.hero.button.secondary') + ' →'"
                unstyled
                class="btn-ghost font-display font-bold"
              />
            </div>
          </div>
        </div>

        <!-- Right visual: floating benefit chips -->
        <div class="hidden lg:flex relative h-full items-center justify-center p-10 xl:p-14">
          <div ref="benefitsVisual" class="benefit-visual relative h-[360px] w-full max-w-[420px]">
            <div
              class="benefit-glow absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full"
            />
            <div
              class="benefit-orbit absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              aria-hidden="true"
            />

            <div class="benefit-chip benefit-chip--tl">
              <div class="benefit-chip-icon benefit-chip-icon--teal">
                <TrendingDown :size="18" stroke-width="2.2" />
              </div>
              <div>
                <div
                  class="benefit-num font-display text-[17px] font-extrabold leading-none text-white"
                  data-prefix="-"
                  data-suffix="%"
                  data-value="38"
                  data-decimals="0"
                >
                  -0%
                </div>
                <div class="mt-1 text-[11px] text-white/45">Readmissions</div>
              </div>
            </div>

            <div class="benefit-chip benefit-chip--tr">
              <div class="benefit-chip-icon benefit-chip-icon--emerald">
                <Smile :size="18" stroke-width="2.2" />
              </div>
              <div>
                <div
                  class="benefit-num font-display text-[17px] font-extrabold leading-none text-white"
                  data-suffix="/5"
                  data-value="4.8"
                  data-decimals="1"
                >
                  0/5
                </div>
                <div class="mt-1 text-[11px] text-white/45">Satisfaction</div>
              </div>
            </div>

            <div class="benefit-chip benefit-chip--bl">
              <div class="benefit-chip-icon benefit-chip-icon--blue">
                <Clock :size="18" stroke-width="2.2" />
              </div>
              <div>
                <div class="font-display text-[17px] font-extrabold leading-none text-white">24/7</div>
                <div class="mt-1 text-[11px] text-white/45">Monitoring</div>
              </div>
            </div>

            <div class="benefit-chip benefit-chip--br">
              <div class="benefit-chip-icon benefit-chip-icon--rose">
                <Activity :size="18" stroke-width="2.2" />
              </div>
              <div>
                <div
                  class="benefit-num font-display text-[17px] font-extrabold leading-none text-white"
                  data-prefix="+"
                  data-suffix="%"
                  data-value="62"
                  data-decimals="0"
                >
                  +0%
                </div>
                <div class="mt-1 text-[11px] text-white/45">Adherence</div>
              </div>
            </div>

            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div class="benefit-hub">
                <Sparkles :size="34" class="text-primary" stroke-width="2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── PATIENT BENEFITS ── -->
    <section
      ref="patientSection"
      class="py-16 sm:py-20 bg-white w-full flex items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12 flex flex-col items-center gap-5 pb-10">
          <span
            class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary"
          >
            {{ t('benefitsPage.patient.badge') }}
          </span>
          <h2
            class="font-display font-extrabold text-black text-[clamp(26px,3vw,40px)] tracking-tight"
          >
            {{ t('benefitsPage.patient.title') }}
          </h2>
          <p class="text-gray-500 text-[14px] sm:text-[16px] leading-relaxed max-w-2xl">
            {{ t('benefitsPage.patient.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <article
            v-for="b in patientBenefits"
            :key="b.title"
            class="patient-card group relative rounded-2xl border border-gray-200/80 bg-white p-6 flex flex-col gap-3 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_24px_60px_-20px_rgba(17,211,211,0.35)]"
          >
            <div
              class="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-2"
            >
              <component :is="b.icon" :size="22" />
            </div>
            <h3 class="font-display font-bold text-black text-[16px]">{{ b.title }}</h3>
            <p class="text-gray-500 text-[13px] leading-relaxed">{{ b.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ── CLINIC BENEFITS (split) ── -->
    <section
      ref="clinicSection"
      class="py-16 sm:py-20 bg-mid w-full flex items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div class="animate-in flex flex-col gap-5">
            <span
              class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary"
            >
              {{ t('benefitsPage.clinic.badge') }}
            </span>
            <h2
              class="font-display font-extrabold text-black text-[clamp(24px,3vw,36px)] tracking-tight leading-tight"
            >
              {{ t('benefitsPage.clinic.title') }}
            </h2>
            <p class="text-gray-500 text-[14px] sm:text-[16px] leading-relaxed">
              {{ t('benefitsPage.clinic.description') }}
            </p>
            <ul class="flex flex-col gap-3 mt-2">
              <li
                v-for="item in clinicItems"
                :key="item"
                class="flex items-start gap-3 text-[14px] text-gray-600"
              >
                <span
                  class="w-5 h-5 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0 mt-0.5 text-primary"
                >
                  <Check :size="12" stroke-width="3" />
                </span>
                {{ item }}
              </li>
            </ul>
            <div class="flex gap-4 flex-wrap mt-4">
              <a :href="calendlyUrl" target="_blank" rel="noopener noreferrer">
                <Button
                  :label="t('benefitsPage.hero.button.primary')"
                  unstyled
                  class="btn-primary font-display font-bold"
                />
              </a>
            </div>
          </div>

          <div class="animate-in">
            <div
              class="relative rounded-2xl overflow-hidden bg-linear-to-br from-dark to-dark-2 p-8 shadow-[0_28px_72px_rgba(0,0,0,.18)]"
            >
              <div class="hero-grid absolute inset-0 pointer-events-none opacity-50" />
              <div class="relative z-10 flex flex-col gap-5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center"
                    >
                      <Building2 :size="18" class="text-primary" />
                    </div>
                    <div>
                      <div class="text-white font-display font-bold text-sm">Hospital ABC</div>
                      <div class="text-white/40 text-xs">RPM Dashboard</div>
                    </div>
                  </div>
                  <span
                    class="px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider"
                    >Live</span
                  >
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div class="rounded-xl bg-white/5 border border-white/10 p-4">
                    <div class="flex items-center gap-2 mb-2">
                      <Users :size="14" class="text-primary" />
                      <span class="text-white/60 text-[11px] uppercase tracking-wider">Active</span>
                    </div>
                    <div class="text-white font-display font-extrabold text-2xl">1,284</div>
                    <div class="text-emerald-400 text-xs mt-1">+12% this week</div>
                  </div>
                  <div class="rounded-xl bg-white/5 border border-white/10 p-4">
                    <div class="flex items-center gap-2 mb-2">
                      <DollarSign :size="14" class="text-primary" />
                      <span class="text-white/60 text-[11px] uppercase tracking-wider">Saved</span>
                    </div>
                    <div class="text-white font-display font-extrabold text-2xl">$420K</div>
                    <div class="text-emerald-400 text-xs mt-1">YTD</div>
                  </div>
                </div>

                <div class="rounded-xl bg-white/5 border border-white/10 p-4 flex flex-col gap-3">
                  <div class="flex items-center justify-between">
                    <span class="text-white/60 text-[11px] uppercase tracking-wider"
                      >Adherence</span
                    >
                    <span class="text-white font-display font-bold text-sm">87%</span>
                  </div>
                  <div class="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div class="h-full w-[87%] rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── STATS ── -->
    <section
      ref="statsSection"
      class="py-16 sm:py-20 bg-white w-full flex items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12 pb-10">
          <span
            class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary mb-4"
          >
            {{ t('benefitsPage.stats.badge') }}
          </span>
          <h2
            class="font-display font-extrabold text-black text-[clamp(26px,3vw,40px)] tracking-tight"
          >
            {{ t('benefitsPage.stats.title') }}
          </h2>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div
            v-for="s in stats"
            :key="s.label"
            class="stat-item rounded-2xl border border-gray-200/80 bg-white p-6 flex flex-col items-center text-center gap-2"
          >
            <div
              class="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-2"
            >
              <component :is="s.icon" :size="22" />
            </div>
            <div class="font-display font-extrabold text-black text-3xl sm:text-4xl">
              {{ s.num }}
            </div>
            <div class="text-gray-500 text-[12px] uppercase tracking-wider font-semibold">
              {{ s.label }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── COMPARISON ── -->
    <section
      ref="comparisonSection"
      class="py-16 sm:py-20 bg-mid w-full flex items-center justify-center"
    >
      <div class="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12 pb-5">
          <span
            class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary mb-4"
          >
            {{ t('benefitsPage.comparison.badge') }}
          </span>
          <h2
            class="font-display font-extrabold text-black text-[clamp(26px,3vw,40px)] tracking-tight"
          >
            {{ t('benefitsPage.comparison.title') }}
          </h2>
        </div>

        <div
          class="rounded-2xl border border-gray-200/80 bg-white overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,.06)]"
        >
          <div
            class="grid grid-cols-3 px-6 py-4 border-b border-gray-100 bg-gray-50 font-display font-bold text-[12px] uppercase tracking-wider text-gray-500"
          >
            <div>{{ t('benefitsPage.comparison.feature') }}</div>
            <div class="text-center">{{ t('benefitsPage.comparison.traditional') }}</div>
            <div class="text-center">RPM</div>
          </div>
          <div
            v-for="(row, i) in comparison"
            :key="i"
            class="comparison-row grid grid-cols-3 px-6 py-4 border-b border-gray-100 last:border-b-0 items-center"
          >
            <div class="text-gray-700 text-[14px] font-medium">{{ row.label }}</div>
            <div class="flex justify-center">
              <span
                v-if="row.traditional"
                class="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <Check :size="14" stroke-width="3" />
              </span>
              <span v-else class="text-gray-300 text-xl font-bold">—</span>
            </div>
            <div class="flex justify-center">
              <span
                v-if="row.rpm"
                class="w-7 h-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary"
              >
                <Check :size="14" stroke-width="3" />
              </span>
              <span v-else class="text-gray-300 text-xl font-bold">—</span>
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
          {{ t('benefitsPage.cta.badge') }}
        </span>
        <h2
          class="font-display font-extrabold text-white mt-2 mb-4 text-[clamp(24px,2.5vw,40px)] leading-tight tracking-tight"
        >
          {{ t('benefitsPage.cta.title') }}
        </h2>
        <p class="text-white/45 text-[14px] sm:text-[16px] leading-relaxed mb-8 max-w-2xl mx-auto">
          {{ t('benefitsPage.cta.subtitle') }}
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <a :href="calendlyUrl" target="_blank" rel="noopener noreferrer">
            <Button
              :label="t('benefitsPage.cta.button.primary')"
              unstyled
              class="btn-primary font-display px-8 py-3"
            />
          </a>
          <a href="/about">
            <Button :label="t('benefitsPage.cta.button.secondary')" unstyled class="btn-ghost font-display px-8 py-3" />
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

.benefit-glow {
  background: radial-gradient(
    circle,
    rgba(17, 211, 211, 0.3) 0%,
    rgba(17, 211, 211, 0.08) 42%,
    transparent 70%
  );
  filter: blur(2px);
}

.benefit-orbit {
  border: 1px dashed rgba(17, 211, 211, 0.18);
  box-shadow: inset 0 0 40px rgba(17, 211, 211, 0.04);
}

.benefit-hub {
  display: flex;
  width: 96px;
  height: 96px;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid rgba(17, 211, 211, 0.45);
  background: linear-gradient(160deg, rgba(17, 211, 211, 0.22), rgba(17, 211, 211, 0.06));
  box-shadow:
    0 0 0 10px rgba(17, 211, 211, 0.05),
    0 16px 40px rgba(17, 211, 211, 0.15);
}

.benefit-chip {
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 158px;
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(22, 28, 38, 0.72);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(10px);
}

.benefit-chip--tl {
  top: 8%;
  left: 0;
  border-color: rgba(17, 211, 211, 0.28);
}
.benefit-chip--tr {
  top: 18%;
  right: 0;
  border-color: rgba(52, 211, 153, 0.28);
}
.benefit-chip--bl {
  bottom: 18%;
  left: 2%;
  border-color: rgba(96, 165, 250, 0.28);
}
.benefit-chip--br {
  bottom: 4%;
  right: 4%;
  border-color: rgba(251, 113, 133, 0.28);
}

.benefit-chip-icon {
  display: flex;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}
.benefit-chip-icon--teal {
  color: #11d3d3;
  background: rgba(17, 211, 211, 0.12);
}
.benefit-chip-icon--emerald {
  color: #34d399;
  background: rgba(52, 211, 153, 0.12);
}
.benefit-chip-icon--blue {
  color: #60a5fa;
  background: rgba(96, 165, 250, 0.12);
}
.benefit-chip-icon--rose {
  color: #fb7185;
  background: rgba(251, 113, 133, 0.12);
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
