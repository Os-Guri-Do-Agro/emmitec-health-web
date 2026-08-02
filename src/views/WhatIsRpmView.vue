<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import {
  Activity,
  ArrowRight,
  CalendarClock,
  Wifi,
  Brain,
  BellRing,
  Stethoscope,
  ShieldCheck,
  HeartPulse,
  Heart,
  Home,
} from 'lucide-vue-next'

import HeroLogoMark from '@/components/HeroLogoMark.vue'

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
const rpmVisual = ref<HTMLElement | null>(null)

const definitionSection = ref<HTMLElement | null>(null)
const whoSection = ref<HTMLElement | null>(null)

/** Card RPM · Live — monitor clínico */
const liveBpm = ref(72)
const liveSpo2 = ref(98)
const liveTemp = ref(36.6)
const liveSys = ref(120)
const liveDia = ref(80)
const liveBp = computed(() => `${liveSys.value}/${liveDia.value}`)
const beatPulse = ref(false)
const ecgCanvas = ref<HTMLCanvasElement | null>(null)

let vitalsTimer: ReturnType<typeof setInterval> | null = null
let bpmTimer: ReturnType<typeof setInterval> | null = null
let beatTimer: ReturnType<typeof setTimeout> | null = null
let ecgRaf = 0
let ecgX = 0
let ecgPrevY = 0
let ecgPhase = 0
let ecgReady = false
let ecgLastTs = 0
let ecgReducedMotion = false
let ecgNoiseSeed = 0

function gauss(x: number, mu: number, sigma: number, amp: number) {
  const d = x - mu
  return amp * Math.exp(-(d * d) / (2 * sigma * sigma))
}

/** Síntese ECG (P–QRS–T) por ciclo cardíaco */
function ecgSample(t: number): number {
  const p = ((t % 1) + 1) % 1
  const signal =
    gauss(p, 0.11, 0.02, 0.14) + // P
    gauss(p, 0.235, 0.008, -0.12) + // Q
    gauss(p, 0.26, 0.011, 0.92) + // R
    gauss(p, 0.288, 0.013, -0.28) + // S
    gauss(p, 0.47, 0.042, 0.26) // T

  const n =
    Math.sin(ecgNoiseSeed * 0.5 + p * 28) * 0.005 + Math.sin(ecgNoiseSeed * 1.1 + p * 13) * 0.003
  return signal + n
}

function triggerBeatFlash() {
  beatPulse.value = true
  if (beatTimer) clearTimeout(beatTimer)
  beatTimer = setTimeout(() => {
    beatPulse.value = false
  }, 280)
}

function sizeEcgCanvas() {
  const canvas = ecgCanvas.value
  if (!canvas) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const rect = canvas.getBoundingClientRect()
  const w = Math.max(1, Math.floor(rect.width * dpr))
  const h = Math.max(1, Math.floor(rect.height * dpr))
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx?.clearRect(0, 0, w, h)
    ecgX = 0
    ecgPrevY = h * 0.58
    ecgReady = true
  }
}

function strokeEcgSegment(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  w: number,
) {
  const lw = Math.max(1.2, w * 0.002)

  ctx.strokeStyle = 'rgba(17, 211, 211, 0.16)'
  ctx.lineWidth = lw * 2.4
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1, y1)
  ctx.stroke()

  ctx.strokeStyle = '#11d3d3'
  ctx.lineWidth = lw
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1, y1)
  ctx.stroke()
}

function drawEcgFrame(now: number) {
  const canvas = ecgCanvas.value
  if (!canvas || ecgReducedMotion) return

  sizeEcgCanvas()
  const ctx = canvas.getContext('2d')
  if (!ctx || !ecgReady) {
    ecgRaf = requestAnimationFrame(drawEcgFrame)
    return
  }

  const w = canvas.width
  const h = canvas.height
  const baseline = h * 0.58
  const amp = h * 0.32
  const pxPerSec = w * 0.13
  const beatsPerSec = liveBpm.value / 60
  const gap = Math.max(14, w * 0.045)

  if (!ecgLastTs) ecgLastTs = now
  const dt = Math.min(0.05, (now - ecgLastTs) / 1000)
  ecgLastTs = now
  ecgNoiseSeed += dt

  const distance = Math.max(1.2, pxPerSec * dt)
  const samples = Math.max(2, Math.ceil(distance / 1.2))
  const dx = distance / samples
  const dPhase = (beatsPerSec * dt) / samples

  for (let i = 0; i < samples; i++) {
    const prevFrac = ((ecgPhase % 1) + 1) % 1
    ecgPhase += dPhase
    const nextFrac = ((ecgPhase % 1) + 1) % 1
    if (prevFrac < 0.26 && nextFrac >= 0.26) triggerBeatFlash()

    const y = baseline - ecgSample(ecgPhase) * amp
    const x1 = ecgX + dx

    ctx.clearRect(ecgX - 0.5, 0, gap + dx + 1, h)

    if (x1 <= w) {
      strokeEcgSegment(ctx, ecgX, ecgPrevY, x1, y, w)
      ecgX = x1
    } else {
      strokeEcgSegment(ctx, ecgX, ecgPrevY, w, y, w)
      ecgX = x1 - w
      ctx.clearRect(0, 0, ecgX + gap, h)
      strokeEcgSegment(ctx, 0, y, ecgX, y, w)
    }
    ecgPrevY = y
  }

  const tipX = ecgX
  const tipGrad = ctx.createLinearGradient(tipX, 0, tipX + gap * 0.7, 0)
  tipGrad.addColorStop(0, 'rgba(17, 211, 211, 0.18)')
  tipGrad.addColorStop(1, 'rgba(17, 211, 211, 0)')
  ctx.fillStyle = tipGrad
  ctx.fillRect(tipX, 0, gap * 0.7, h)

  ctx.fillStyle = 'rgba(17, 211, 211, 0.85)'
  ctx.shadowColor = 'rgba(17, 211, 211, 0.35)'
  ctx.shadowBlur = 4
  ctx.beginPath()
  ctx.arc(tipX, ecgPrevY, Math.max(1.2, w * 0.0024), 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0

  ecgRaf = requestAnimationFrame(drawEcgFrame)
}

function drawStaticEcg() {
  const canvas = ecgCanvas.value
  if (!canvas) return
  sizeEcgCanvas()
  const ctx = canvas.getContext('2d')
  if (!ctx || !ecgReady) return
  const w = canvas.width
  const h = canvas.height
  const baseline = h * 0.58
  const amp = h * 0.36
  ctx.clearRect(0, 0, w, h)
  let prevY = baseline
  for (let x = 0; x < w; x += 2) {
    const phase = (x / w) * 2.4
    const y = baseline - ecgSample(phase) * amp
    strokeEcgSegment(ctx, x - 2, prevY, x, y, w)
    prevY = y
  }
}

function tickBpm() {
  // Varia com frequência, mas não a cada frame — e volta perto de ~72
  const step = Math.random() > 0.3 ? 1 : 2
  const drift = Math.random() > 0.5 ? step : -step
  const towardCenter = liveBpm.value > 74 ? -1 : liveBpm.value < 70 ? 1 : 0
  const delta = towardCenter !== 0 && Math.random() > 0.45 ? towardCenter : drift
  liveBpm.value = Math.min(82, Math.max(64, liveBpm.value + delta))
}

function tickVitals() {
  if (Math.random() > 0.55) {
    liveSpo2.value = Math.min(99, Math.max(96, liveSpo2.value + (Math.random() > 0.5 ? 1 : -1)))
  }
  if (Math.random() > 0.6) {
    const next = Math.round((liveTemp.value + (Math.random() > 0.5 ? 0.1 : -0.1)) * 10) / 10
    liveTemp.value = Math.min(37.0, Math.max(36.3, next))
  }
  if (Math.random() > 0.55) {
    liveSys.value = Math.min(128, Math.max(112, liveSys.value + (Math.random() > 0.5 ? 2 : -2)))
    liveDia.value = Math.min(86, Math.max(74, liveDia.value + (Math.random() > 0.5 ? 1 : -1)))
  }
}

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
  { icon: HeartPulse, label: t('whatIsRpm.who.item1'), desc: t('whatIsRpm.who.item1desc') },
  { icon: Stethoscope, label: t('whatIsRpm.who.item2'), desc: t('whatIsRpm.who.item2desc') },
  { icon: ShieldCheck, label: t('whatIsRpm.who.item3'), desc: t('whatIsRpm.who.item3desc') },
  { icon: Activity, label: t('whatIsRpm.who.item4'), desc: t('whatIsRpm.who.item4desc') },
])

onMounted(() => {
  gsap
    .timeline({ defaults: { ease: 'power3.out', clearProps: 'opacity,transform' } })
    .from(heroTitle.value, { opacity: 0, y: 34, duration: 0.8 })
    .from(heroSub.value, { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
    .from(heroActions.value, { opacity: 0, y: 20, duration: 0.6 }, '-=0.35')

  if (rpmVisual.value) {
    const root = rpmVisual.value
    const home = root.querySelector('.rpm-home')
    const clinic = root.querySelector('.rpm-clinic')
    const signal = root.querySelector('.rpm-signal')
    const path = root.querySelector('.rpm-path')
    const sparks = root.querySelectorAll('.rpm-spark')
    const icons = root.querySelectorAll('.rpm-float')

    gsap
      .timeline({ defaults: { ease: 'power3.out' } })
      .from(root, { opacity: 0, y: 20, duration: 0.85 }, 0.15)
      .from(home, { x: -36, opacity: 0, duration: 0.75 }, 0.25)
      .from(clinic, { x: 36, opacity: 0, duration: 0.75 }, 0.3)
      .from(signal, { scale: 0.6, opacity: 0, duration: 0.7 }, 0.4)
      .from(path, { opacity: 0, duration: 0.8 }, 0.45)
      .from(icons, { y: 14, opacity: 0, stagger: 0.1, duration: 0.5 }, 0.55)

    if (path) {
      gsap.fromTo(
        path,
        { strokeDashoffset: 360 },
        { strokeDashoffset: 0, duration: 2.8, ease: 'power1.inOut', repeat: -1, yoyo: true },
      )
    }

    sparks.forEach((spark, i) => {
      gsap.fromTo(
        spark,
        { offsetDistance: '0%' },
        {
          offsetDistance: '100%',
          duration: 2.6,
          ease: 'power1.inOut',
          repeat: -1,
          delay: i * 0.85,
        },
      )
    })

    icons.forEach((icon, i) => {
      gsap.to(icon, {
        y: i % 2 === 0 ? -8 : 8,
        duration: 2.6 + i * 0.35,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    })

    gsap.to(signal, {
      scale: 1.06,
      duration: 1.8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
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

  animate(definitionSection.value, '.animate-in')
  animate(whoSection.value, '.who-item', { stagger: 0.1, y: 20 })

  bpmTimer = setInterval(tickBpm, 1200)
  vitalsTimer = setInterval(tickVitals, 3200)
  ecgReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  requestAnimationFrame(() => {
    sizeEcgCanvas()
    if (ecgReducedMotion) drawStaticEcg()
    else ecgRaf = requestAnimationFrame(drawEcgFrame)
  })
  window.addEventListener('resize', sizeEcgCanvas)
})

onUnmounted(() => {
  if (bpmTimer) clearInterval(bpmTimer)
  if (vitalsTimer) clearInterval(vitalsTimer)
  if (beatTimer) clearTimeout(beatTimer)
  cancelAnimationFrame(ecgRaf)
  window.removeEventListener('resize', sizeEcgCanvas)
  if (rpmVisual.value) gsap.killTweensOf(rpmVisual.value.querySelectorAll('*'))
  ScrollTrigger.getAll().forEach((t) => t.kill())
})
</script>

<template>
  <div class="font-body text-black overflow-x-hidden w-full">
    <!-- ── HERO ── -->
    <section class="relative min-h-[60vh] w-full overflow-hidden bg-dark sm:min-h-[70vh]">
      <div class="page-hero-aurora pointer-events-none absolute inset-0" aria-hidden="true" />
      <div class="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <HeroLogoMark variant="section" />

      <div
        class="relative z-10 mx-auto grid min-h-[60vh] w-full max-w-7xl grid-cols-1 gap-14 px-6 pb-16 pt-28 sm:min-h-[70vh] sm:px-8 sm:pt-32 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:pb-20"
      >
        <div class="flex flex-col items-start justify-center">
          <span class="eyebrow eyebrow--dark">
            {{ t('whatIsRpm.hero.badge') }}
          </span>
          <h1 ref="heroTitle" class="display-2 mt-7 text-white">
            {{ t('whatIsRpm.hero.title') }}
          </h1>
          <p ref="heroSub" class="lead mt-6 max-w-xl text-white/55">
            {{ t('whatIsRpm.hero.subtitle') }}
          </p>
          <div ref="heroActions" class="mt-9 flex flex-wrap items-center gap-4">
            <a
              :href="calendlyUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary font-display"
            >
              <CalendarClock :size="17" stroke-width="2.3" aria-hidden="true" />
              {{ t('whatIsRpm.hero.button.primary') }}
            </a>
            <a
              :href="calendlyUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-ghost font-display group"
            >
              {{ t('whatIsRpm.hero.button.secondary') }}
              <ArrowRight
                :size="16"
                stroke-width="2.5"
                aria-hidden="true"
                class="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>

        <!-- Right visual: coluna de altura cheia — o HeroLogoMark se dimensiona por ela -->
        <div class="relative hidden h-full items-center justify-center overflow-visible lg:flex">
          <div
            ref="rpmVisual"
            class="rpm-visual relative z-10 h-[340px] w-full max-w-[440px] xl:h-[380px]"
            aria-hidden="true"
          >
            <div class="rpm-glow absolute inset-[10%] rounded-full" />

            <!-- Connection path: home → care -->
            <svg
              class="absolute inset-0 h-full w-full overflow-visible"
              viewBox="0 0 440 380"
              fill="none"
            >
              <path
                class="rpm-path"
                d="M95 190 C 160 120, 220 120, 280 190 C 320 230, 340 210, 355 190"
                stroke="rgba(17,211,211,0.4)"
                stroke-width="2"
                stroke-linecap="round"
                stroke-dasharray="10 10"
              />
              <circle
                class="rpm-spark"
                r="4"
                fill="#11d3d3"
                style="
                  offset-path: path(
                    'M95 190 C 160 120, 220 120, 280 190 C 320 230, 340 210, 355 190'
                  );
                "
              />
              <circle
                class="rpm-spark"
                r="3"
                fill="#11d3d3"
                style="
                  offset-path: path(
                    'M95 190 C 160 120, 220 120, 280 190 C 320 230, 340 210, 355 190'
                  );
                "
              />
            </svg>

            <!-- Home / patient side -->
            <div
              class="rpm-home absolute left-2 top-1/2 flex w-[118px] -translate-y-1/2 flex-col items-center gap-3"
            >
              <div
                class="flex h-24 w-24 items-center justify-center rounded-[28px] border border-primary/30 bg-dark-2/70 shadow-[0_16px_40px_rgba(17,211,211,0.12)] backdrop-blur-sm"
              >
                <Home :size="36" class="text-primary" stroke-width="1.8" />
              </div>
              <div
                class="rpm-float flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-primary"
              >
                <HeartPulse :size="20" stroke-width="2" />
              </div>
            </div>

            <!-- Signal bridge -->
            <div class="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
              <div
                class="rpm-signal flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-primary shadow-[0_0_40px_rgba(17,211,211,0.25)] backdrop-blur-sm"
              >
                <Wifi :size="24" stroke-width="2" />
              </div>
            </div>

            <!-- Clinic / care side -->
            <div
              class="rpm-clinic absolute right-2 top-1/2 flex w-[118px] -translate-y-1/2 flex-col items-center gap-3"
            >
              <div
                class="flex h-24 w-24 items-center justify-center rounded-[28px] border border-primary/30 bg-dark-2/70 shadow-[0_16px_40px_rgba(17,211,211,0.12)] backdrop-blur-sm"
              >
                <Stethoscope :size="36" class="text-primary" stroke-width="1.8" />
              </div>
              <div
                class="rpm-float flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-primary"
              >
                <ShieldCheck :size="20" stroke-width="2" />
              </div>
            </div>

            <!-- Floating concept marks -->
            <div
              class="rpm-float absolute left-[38%] top-[18%] flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-dark-2/80 text-primary/90"
            >
              <Activity :size="18" stroke-width="2" />
            </div>
            <div
              class="rpm-float absolute right-[36%] bottom-[16%] flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-dark-2/80 text-primary/90"
            >
              <BellRing :size="18" stroke-width="2" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── DEFINITION ── -->
    <section
      ref="definitionSection"
      class="py-20 sm:py-24 lg:py-28 bg-white w-full flex items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div class="animate-in flex flex-col gap-5">
            <span class="eyebrow eyebrow--light">
              {{ t('whatIsRpm.definition.badge') }}
            </span>
            <h2 class="display-2 text-black">
              {{ t('whatIsRpm.definition.title') }}
            </h2>
            <p class="text-[15px] leading-relaxed text-gray-500">
              {{ t('whatIsRpm.definition.paragraph1') }}
            </p>
            <p class="text-[15px] leading-relaxed text-gray-500">
              {{ t('whatIsRpm.definition.paragraph2') }}
            </p>
          </div>

          <div class="animate-in">
            <div
              class="monitor-card relative rounded-2xl overflow-hidden aspect-4/3 bg-linear-to-br from-dark to-dark-2 shadow-[0_28px_72px_rgba(0,0,0,.18)] p-6 sm:p-8 flex flex-col justify-between gap-4"
            >
              <div class="hero-grid absolute inset-0 pointer-events-none opacity-40" />
              <div
                class="monitor-vignette absolute inset-0 pointer-events-none"
                aria-hidden="true"
              />

              <div class="relative z-10 flex flex-col gap-3">
                <div class="flex items-center justify-between gap-3">
                  <span
                    class="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase text-primary tracking-[2px]"
                  >
                    <span class="live-dot" aria-hidden="true" />
                    RPM · Live
                  </span>
                  <div
                    class="flex items-center gap-2 text-[9px] sm:text-[10px] uppercase tracking-[1.5px] text-white/35 font-semibold"
                  >
                    <span
                      class="rounded px-1.5 py-0.5 border border-white/10 bg-white/5 text-primary/80"
                      >Lead II</span
                    >
                    <span>25 mm/s</span>
                    <span>10 mm/mV</span>
                  </div>
                </div>

                <div class="flex items-end justify-between gap-4">
                  <div>
                    <div
                      class="text-[10px] font-bold uppercase tracking-[2px] text-primary/70 mb-1"
                    >
                      HR
                    </div>
                    <div class="flex items-baseline gap-2">
                      <span
                        class="monitor-hr font-display font-extrabold text-5xl sm:text-[52px] leading-none tabular-nums tracking-tight"
                        :class="{ 'is-beat': beatPulse }"
                        >{{ liveBpm }}</span
                      >
                      <span class="text-white/45 text-sm font-medium">bpm</span>
                    </div>
                    <p class="text-white/45 text-xs mt-1.5">
                      {{ t('whatIsRpm.definition.cardLabel') }}
                    </p>
                  </div>
                  <div class="flex flex-col items-end gap-1.5 pb-1">
                    <Heart
                      class="monitor-heart"
                      :class="{ 'is-beat': beatPulse }"
                      :size="18"
                      fill="currentColor"
                      aria-hidden="true"
                    />
                    <span
                      class="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary/80"
                    >
                      Sinusal
                    </span>
                  </div>
                </div>
              </div>

              <div
                class="monitor-scope relative z-10 w-full h-[96px] sm:h-[104px] rounded-xl overflow-hidden border border-primary/15"
              >
                <div class="monitor-scope-bg absolute inset-0" aria-hidden="true" />
                <div class="monitor-scope-grid absolute inset-0" aria-hidden="true" />
                <div
                  class="monitor-scope-fade absolute inset-0 pointer-events-none"
                  aria-hidden="true"
                />
                <canvas
                  ref="ecgCanvas"
                  class="relative z-[1] block w-full h-full"
                  aria-hidden="true"
                />
                <div
                  class="absolute left-2 top-1.5 z-[2] text-[8px] font-bold tracking-[1.5px] uppercase text-primary/55"
                >
                  ECG
                </div>
              </div>

              <div class="relative z-10 grid grid-cols-3 gap-2.5 sm:gap-3">
                <div class="monitor-vital">
                  <div class="monitor-vital-label text-primary/80">NIBP</div>
                  <div class="monitor-vital-value text-white">{{ liveBp }}</div>
                  <div class="monitor-vital-unit">mmHg</div>
                </div>
                <div class="monitor-vital">
                  <div class="monitor-vital-label text-primary/80">SpO₂</div>
                  <div class="monitor-vital-value text-white">
                    {{ liveSpo2 }}<span class="text-[0.7em] text-white/50">%</span>
                  </div>
                  <div class="monitor-vital-unit">sat</div>
                </div>
                <div class="monitor-vital">
                  <div class="monitor-vital-label text-primary/80">TEMP</div>
                  <div class="monitor-vital-value text-white">
                    {{ liveTemp.toFixed(1) }}<span class="text-[0.7em] text-white/50">°</span>
                  </div>
                  <div class="monitor-vital-unit">°C</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── PROCESS ── -->
    <section class="py-20 sm:py-24 lg:py-28 bg-mid w-full flex items-center justify-center">
      <div class="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16 flex flex-col items-center gap-5">
          <span class="eyebrow eyebrow--light">
            {{ t('whatIsRpm.process.badge') }}
          </span>
          <h2 class="display-2 text-black">
            {{ t('whatIsRpm.process.title') }}
          </h2>
          <p class="lead max-w-2xl text-gray-500">
            {{ t('whatIsRpm.process.subtitle') }}
          </p>
        </div>

        <!-- Timeline horizontal -->
        <div class="relative">
          <div
            class="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-linear-to-r from-primary/30 via-primary to-primary/30"
          />

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 pt-5">
            <div
              v-for="(step, i) in processSteps"
              :key="step.title"
              class="process-step relative flex flex-col items-center text-center gap-5"
            >
              <div class="relative z-10 mb-6">
                <div
                  class="w-24 h-24 rounded-full bg-white border-2 border-primary/20 shadow-[0_8px_32px_rgba(17,211,211,0.15)] flex items-center justify-center relative"
                >
                  <component :is="step.icon" :size="28" class="text-primary" />
                  <div
                    class="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-primary text-dark font-display font-bold text-sm flex items-center justify-center shadow-lg"
                  >
                    {{ i + 1 }}
                  </div>
                </div>
              </div>

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
      class="py-20 sm:py-24 lg:py-28 bg-white w-full flex items-center justify-center"
    >
      <div class="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
        <div class="flex max-w-3xl flex-col items-start gap-6">
          <span class="eyebrow eyebrow--light">{{ t('whatIsRpm.who.badge') }}</span>
          <h2 class="display-2 text-black">{{ t('whatIsRpm.who.title') }}</h2>
          <p class="lead max-w-[62ch] text-gray-500">{{ t('whatIsRpm.who.subtitle') }}</p>
        </div>

        <!-- Cartões informativos: sem seta e sem hover de botão — não são clicáveis -->
        <div class="mt-14 grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:gap-6">
          <article
            v-for="(w, i) in whoData"
            :key="w.label"
            class="who-item relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-7"
          >
            <span
              class="pointer-events-none absolute right-6 top-5 font-display text-[13px] font-extrabold tracking-[0.12em] text-gray-200"
              aria-hidden="true"
            >
              {{ String(i + 1).padStart(2, '0') }}
            </span>

            <div class="flex items-center gap-4">
              <span
                class="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary"
              >
                <component :is="w.icon" :size="24" stroke-width="2.1" aria-hidden="true" />
              </span>
              <h3 class="font-display text-[17px] font-bold tracking-tight text-black">
                {{ w.label }}
              </h3>
            </div>

            <p class="mt-5 text-[14.5px] leading-relaxed text-muted">{{ w.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ── CTA ── -->
    <section
      class="relative flex w-full items-center justify-center overflow-hidden bg-dark py-20 sm:py-24 lg:py-28"
    >
      <div
        class="cta-glow pointer-events-none absolute -top-48 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full sm:h-[500px] sm:w-[500px] lg:h-[680px] lg:w-[680px]"
        aria-hidden="true"
      />
      <div class="hero-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        class="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <span
          class="cta-ghost font-display font-extrabold tracking-[-0.05em] whitespace-nowrap leading-[0.8]"
        >
          EMMITEC&nbsp;HEALTH
        </span>
      </div>
      <div
        class="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-6 text-center sm:px-8"
      >
        <span class="eyebrow eyebrow--dark">{{ t('whatIsRpm.cta.badge') }}</span>
        <h2 class="display-2 text-white">{{ t('whatIsRpm.cta.title') }}</h2>
        <p class="lead max-w-2xl text-white/50">{{ t('whatIsRpm.cta.subtitle') }}</p>
        <div class="mt-3 flex flex-wrap justify-center gap-4">
          <a
            :href="calendlyUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary font-display"
          >
            <CalendarClock :size="17" stroke-width="2.3" aria-hidden="true" />
            {{ t('whatIsRpm.cta.button.primary') }}
          </a>
          <RouterLink to="/benefits" class="btn-ghost font-display group">
            {{ t('whatIsRpm.cta.button.secondary') }}
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
.hero-grid {
  background-image:
    linear-gradient(rgba(17, 211, 211, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(17, 211, 211, 0.045) 1px, transparent 1px);
  background-size: 64px 64px;
}

/* mesma assinatura de fundo da hero da home */
.page-hero-aurora {
  background:
    radial-gradient(ellipse 70% 55% at 78% 15%, rgba(17, 211, 211, 0.18), transparent 62%),
    radial-gradient(ellipse 55% 45% at 5% 85%, rgba(74, 168, 255, 0.12), transparent 58%);
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

.rpm-glow {
  background: radial-gradient(
    circle,
    rgba(17, 211, 211, 0.16) 0%,
    rgba(17, 211, 211, 0.04) 45%,
    transparent 72%
  );
}

.rpm-spark {
  offset-rotate: 0deg;
  opacity: 0.9;
  filter: drop-shadow(0 0 6px rgba(17, 211, 211, 0.8));
}

.monitor-vignette {
  background:
    radial-gradient(ellipse 80% 70% at 50% 40%, transparent 40%, rgba(0, 0, 0, 0.28) 100%),
    linear-gradient(180deg, rgba(17, 211, 211, 0.04), transparent 35%);
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #11d3d3;
  box-shadow: 0 0 6px rgba(17, 211, 211, 0.35);
  animation: live-dot-blink 2.4s ease-in-out infinite;
}

.monitor-hr {
  color: #11d3d3;
  text-shadow: 0 0 14px rgba(17, 211, 211, 0.18);
  transition:
    opacity 0.35s ease,
    text-shadow 0.35s ease;
}

.monitor-hr.is-beat {
  opacity: 0.85;
  text-shadow: 0 0 16px rgba(17, 211, 211, 0.35);
}

.monitor-heart {
  color: rgba(17, 211, 211, 0.4);
  transition:
    color 0.35s ease,
    transform 0.35s ease,
    filter 0.35s ease;
  transform-origin: center;
}

.monitor-heart.is-beat {
  color: #11d3d3;
  transform: scale(1.08);
  filter: drop-shadow(0 0 5px rgba(17, 211, 211, 0.4));
}

.monitor-scope {
  background: #0e1117;
  box-shadow:
    inset 0 0 0 1px rgba(17, 211, 211, 0.06),
    inset 0 10px 28px rgba(0, 0, 0, 0.35);
}

.monitor-scope-bg {
  background:
    radial-gradient(ellipse 90% 80% at 50% 50%, rgba(17, 211, 211, 0.04), transparent 70%),
    linear-gradient(180deg, #161c26 0%, #0e1117 100%);
}

.monitor-scope-grid {
  background-image:
    linear-gradient(rgba(17, 211, 211, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(17, 211, 211, 0.05) 1px, transparent 1px),
    linear-gradient(rgba(17, 211, 211, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(17, 211, 211, 0.1) 1px, transparent 1px);
  background-size:
    8px 8px,
    8px 8px,
    40px 40px,
    40px 40px;
  background-position: center;
  opacity: 0.75;
}

.monitor-scope-fade {
  background: linear-gradient(
    90deg,
    rgba(14, 17, 23, 0.5) 0%,
    transparent 14%,
    transparent 86%,
    rgba(14, 17, 23, 0.5) 100%
  );
  z-index: 2;
  pointer-events: none;
}

.monitor-vital {
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  padding: 10px 10px 8px;
  min-height: 72px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.monitor-vital-label {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  opacity: 0.85;
}

.monitor-vital-value {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-weight: 800;
  font-size: clamp(18px, 2.2vw, 22px);
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  margin-top: 4px;
}

.monitor-vital-unit {
  margin-top: 2px;
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.28);
  font-weight: 600;
}

@keyframes live-dot-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}

@media (prefers-reduced-motion: reduce) {
  .live-dot,
  .monitor-heart,
  .monitor-hr {
    animation: none;
    transition: none;
  }
}
</style>
