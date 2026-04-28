<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from 'primevue/button'

import {
  Activity,
  Wifi,
  Brain,
  BellRing,
  Stethoscope,
  Smartphone,
  ShieldCheck,
  HeartPulse,
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

const definitionSection = ref<HTMLElement | null>(null)
const processSection = ref<HTMLElement | null>(null)
const whoSection = ref<HTMLElement | null>(null)

const processSteps = computed(() => [
  {
    icon: Activity,
    title: t('whatIsRpm.process.step1.title'),
    desc: t('whatIsRpm.process.step1.desc'),
  },
  {
    icon: Wifi,
    title: t('whatIsRpm.process.step2.title'),
    desc: t('whatIsRpm.process.step2.desc'),
  },
  {
    icon: Brain,
    title: t('whatIsRpm.process.step3.title'),
    desc: t('whatIsRpm.process.step3.desc'),
  },
  {
    icon: BellRing,
    title: t('whatIsRpm.process.step4.title'),
    desc: t('whatIsRpm.process.step4.desc'),
  },
])

const whoData = computed(() => [
  { icon: HeartPulse, label: t('whatIsRpm.who.item1') },
  { icon: Stethoscope, label: t('whatIsRpm.who.item2') },
  { icon: ShieldCheck, label: t('whatIsRpm.who.item3') },
  { icon: Activity, label: t('whatIsRpm.who.item4') },
])

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

  animate(definitionSection.value, '.animate-in')
  animate(processSection.value, '.process-step', { stagger: 0.15 })
  animate(whoSection.value, '.who-item', { stagger: 0.1, y: 20 })
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

      <div class="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh] sm:min-h-[70vh] w-full">
        <div
          class="flex flex-col justify-center items-end px-4 sm:px-6 lg:px-12 xl:px-20 py-20 lg:py-0 z-10"
        >
          <div class="w-full max-w-xl flex flex-col gap-5">
            <span
              class="inline-block text-[11px] font-bold uppercase text-primary font-display tracking-[2px]"
            >
              {{ t('whatIsRpm.hero.badge') }}
            </span>
            <h1
              ref="heroTitle"
              class="font-display font-extrabold text-white leading-[1.08] tracking-tight text-xl sm:text-2xl lg:text-[34px]"
            >
              {{ t('whatIsRpm.hero.title') }}
            </h1>
            <p
              ref="heroSub"
              class="text-white/50 text-[12px] sm:text-[14px] leading-relaxed max-w-md font-light"
            >
              {{ t('whatIsRpm.hero.subtitle') }}
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
                :label="t('whatIsRpm.hero.button.secondary') + ' →'"
                unstyled
                class="btn-ghost font-display font-bold"
              />
            </div>
          </div>
        </div>

        <!-- Right visual: pulse rings -->
        <div class="hidden lg:flex relative h-full items-center justify-center p-12">
          <div class="relative w-72 h-72 flex items-center justify-center">
            <div class="absolute inset-0 rounded-full border border-primary/20 pulse-ring" />
            <div
              class="absolute inset-6 rounded-full border border-primary/30 pulse-ring delay-500"
            />
            <div
              class="absolute inset-12 rounded-full border border-primary/40 pulse-ring delay-1000"
            />
            <div
              class="relative z-10 w-32 h-32 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center"
            >
              <HeartPulse :size="56" class="text-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── DEFINITION ── -->
    <section
      ref="definitionSection"
      class="py-16 sm:py-20 bg-white w-full flex items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div class="animate-in flex flex-col gap-5">
            <span
              class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary"
            >
              {{ t('whatIsRpm.definition.badge') }}
            </span>
            <h2
              class="font-display font-extrabold text-black text-[clamp(24px,3vw,36px)] tracking-tight leading-tight"
            >
              {{ t('whatIsRpm.definition.title') }}
            </h2>
            <p class="text-gray-500 text-[14px] sm:text-[15px] leading-relaxed">
              {{ t('whatIsRpm.definition.paragraph1') }}
            </p>
            <p class="text-gray-500 text-[14px] sm:text-[15px] leading-relaxed">
              {{ t('whatIsRpm.definition.paragraph2') }}
            </p>
          </div>

          <div class="animate-in">
            <div
              class="relative rounded-2xl overflow-hidden aspect-4/3 bg-linear-to-br from-dark to-dark-2 shadow-[0_28px_72px_rgba(0,0,0,.18)] p-8 flex flex-col justify-between"
            >
              <div class="hero-grid absolute inset-0 pointer-events-none opacity-50" />
              <div class="relative z-10">
                <span class="text-[11px] font-bold uppercase text-primary tracking-[2px]">
                  RPM · Live
                </span>
                <div class="mt-4 flex items-baseline gap-2">
                  <span class="font-display font-extrabold text-white text-5xl">72</span>
                  <span class="text-white/50 text-sm">bpm</span>
                </div>
                <p class="text-white/50 text-xs mt-1">{{ t('whatIsRpm.definition.cardLabel') }}</p>
              </div>
              <!-- Mock chart -->
              <svg
                class="relative z-10 w-full h-24"
                viewBox="0 0 200 60"
                preserveAspectRatio="none"
              >
                <polyline
                  points="0,40 20,38 40,42 55,15 65,50 80,30 100,32 120,30 135,10 145,55 160,28 180,30 200,30"
                  fill="none"
                  stroke="#11d3d3"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                />
              </svg>
              <div class="relative z-10 grid grid-cols-3 gap-3">
                <div class="rounded-lg bg-white/5 border border-white/10 p-3">
                  <div class="text-white font-display font-bold">120/80</div>
                  <div class="text-white/40 text-[10px] uppercase tracking-wider">BP</div>
                </div>
                <div class="rounded-lg bg-white/5 border border-white/10 p-3">
                  <div class="text-white font-display font-bold">98%</div>
                  <div class="text-white/40 text-[10px] uppercase tracking-wider">SpO₂</div>
                </div>
                <div class="rounded-lg bg-white/5 border border-white/10 p-3">
                  <div class="text-white font-display font-bold">36.6°</div>
                  <div class="text-white/40 text-[10px] uppercase tracking-wider">Temp</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── PROCESS ── -->
    <section
      ref="processSection"
      class="py-16 sm:py-24 bg-mid w-full flex items-center justify-center"
    >
      <div class="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16 flex flex-col items-center gap-5">
          <span
            class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary"
          >
            {{ t('whatIsRpm.process.badge') }}
          </span>
          <h2
            class="font-display font-extrabold text-black text-[clamp(26px,3vw,40px)] tracking-tight leading-tight"
          >
            {{ t('whatIsRpm.process.title') }}
          </h2>
          <p class="text-gray-500 text-[14px] sm:text-[16px] leading-relaxed max-w-2xl">
            {{ t('whatIsRpm.process.subtitle') }}
          </p>
        </div>

        <!-- Timeline horizontal -->
        <div class="relative">
          <!-- Linha conectora -->
          <div
            class="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-linear-to-r from-primary/30 via-primary to-primary/30"
          />

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 pt-5">
            <div
              v-for="(step, i) in processSteps"
              :key="step.title"
              class="process-step relative flex flex-col items-center text-center gap-5"
            >
              <!-- Número com ícone -->
              <div class="relative z-10 mb-6">
                <div
                  class="w-24 h-24 rounded-full bg-white border-2 border-primary/20 shadow-[0_8px_32px_rgba(17,211,211,0.15)] flex items-center justify-center relative"
                >
                  <component :is="step.icon" :size="28" class="text-primary" />
                  <!-- Badge número -->
                  <div
                    class="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-primary text-dark font-display font-bold text-sm flex items-center justify-center shadow-lg"
                  >
                    {{ i + 1 }}
                  </div>
                </div>
              </div>

              <!-- Conteúdo -->
              <div class="bg-white rounded-2xl border border-gray-200/80 p-5 flex-1 w-full">
                <h3 class="font-display font-bold text-black text-[15px] mb-2">
                  {{ step.title }}
                </h3>
                <p class="text-gray-500 text-[12px] leading-relaxed">{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── COMO USAR ── -->
    <section
      ref="whoSection"
      class="py-16 sm:py-20 bg-white w-full flex items-center justify-center"
    >
      <div class="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Esquerda: texto -->
          <div class="text-left">
            <span
              class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary mb-4"
            >
              {{ t('whatIsRpm.who.badge') }}
            </span>
            <h2
              class="font-display font-extrabold text-black text-[clamp(26px,3vw,36px)] tracking-tight leading-tight mb-4"
            >
              {{ t('whatIsRpm.who.title') }}
            </h2>
            <p class="text-gray-500 text-[14px] sm:text-[15px] leading-relaxed">
              {{
                t('whatIsRpm.who.subtitle') || 'Solução adaptável para diferentes perfis de saúde.'
              }}
            </p>
          </div>

          <!-- Direita: lista horizontal tipo 'pills' -->
          <div class="flex flex-col gap-3">
            <div
              v-for="(w, i) in whoData"
              :key="w.label"
              class="who-item group flex items-center gap-4 p-4 rounded-xl bg-mid border border-transparent hover:border-primary/30 hover:shadow-[0_4px_20px_rgba(17,211,211,0.15)] transition-all duration-300"
              :style="{ animationDelay: `${i * 100}ms` }"
            >
              <!-- Ícone com fundo gradiente -->
              <div
                class="w-14 h-14 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform duration-300"
              >
                <component :is="w.icon" :size="24" stroke-width="2" />
              </div>
              <!-- Label com highlight -->
              <div class="flex-1">
                <span class="font-display font-bold text-gray-900 text-[15px] block">
                  {{ w.label }}
                </span>
                <span class="text-gray-400 text-[12px]">Perfil apto para RPM</span>
              </div>
              <!-- Setinha -->
              <div
                class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-300 group-hover:text-primary group-hover:bg-primary/10 transition-all duration-300"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  class="transform group-hover:translate-x-0.5 transition-transform"
                >
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
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
        class="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center items-center justify-center relative z-10 flex flex-col gap-5"
      >
        <span
          class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary"
        >
          {{ t('whatIsRpm.cta.badge') }}
        </span>
        <h2
          class="font-display font-extrabold text-white mt-2 mb-4 text-[clamp(24px,2.5vw,40px)] leading-tight tracking-tight"
        >
          {{ t('whatIsRpm.cta.title') }}
        </h2>
        <p
          class="text-white/45 text-[14px] sm:text-[16px] leading-relaxed mb-8 max-w-2xl mx-auto text-center"
        >
          {{ t('whatIsRpm.cta.subtitle') }}
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <Button
            :label="t('whatIsRpm.cta.button.primary')"
            unstyled
            class="btn-primary font-display px-8 py-3"
          />
          <Button
            :label="t('whatIsRpm.cta.button.secondary')"
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

.pulse-ring {
  animation: pulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
.pulse-ring.delay-500 {
  animation-delay: 0.6s;
}
.pulse-ring.delay-1000 {
  animation-delay: 1.2s;
}
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.06);
    opacity: 0.3;
  }
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
