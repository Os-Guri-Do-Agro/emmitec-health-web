<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from 'primevue/button'

import {
  ArrowRight,
  HeartPulse,
  Activity,
  Thermometer,
  Scale,
  Wind,
  Droplet,
  Watch,
  Bluetooth,
  Wifi,
  ShieldCheck,
  Check,
} from 'lucide-vue-next'

import HeroLogoMark from '@/components/HeroLogoMark.vue'

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
const equipVisual = ref<HTMLElement | null>(null)

const categoriesSection = ref<HTMLElement | null>(null)
const devicesSection = ref<HTMLElement | null>(null)
const compatibilitySection = ref<HTMLElement | null>(null)
const certSection = ref<HTMLElement | null>(null)
const certifSection = ref<HTMLElement | null>(null)

const activeCategory = ref('all')

const categories = computed(() => [
  { id: 'all', label: t('equipmentPage.categories.all'), icon: Activity },
  { id: 'cardio', label: t('equipmentPage.categories.cardio'), icon: HeartPulse },
  { id: 'metabolic', label: t('equipmentPage.categories.metabolic'), icon: Droplet },
  { id: 'respiratory', label: t('equipmentPage.categories.respiratory'), icon: Wind },
  { id: 'wearables', label: t('equipmentPage.categories.wearables'), icon: Watch },
])

const devices = computed(() => [
  {
    id: 1,
    cat: 'cardio',
    name: t('equipmentPage.devices.d1.name'),
    desc: t('equipmentPage.devices.d1.desc'),
    icon: HeartPulse,
    connectivity: ['Bluetooth', 'Wi-Fi'],
    color: 'from-rose-500/20 to-rose-400/5',
  },
  {
    id: 2,
    cat: 'cardio',
    name: t('equipmentPage.devices.d2.name'),
    desc: t('equipmentPage.devices.d2.desc'),
    icon: Activity,
    connectivity: ['Bluetooth'],
    color: 'from-primary/20 to-primary/5',
  },
  {
    id: 3,
    cat: 'metabolic',
    name: t('equipmentPage.devices.d3.name'),
    desc: t('equipmentPage.devices.d3.desc'),
    icon: Droplet,
    connectivity: ['Bluetooth', 'NFC'],
    color: 'from-blue-500/20 to-blue-400/5',
  },
  {
    id: 4,
    cat: 'metabolic',
    name: t('equipmentPage.devices.d4.name'),
    desc: t('equipmentPage.devices.d4.desc'),
    icon: Scale,
    connectivity: ['Bluetooth', 'Wi-Fi'],
    color: 'from-emerald-500/20 to-emerald-400/5',
  },
  {
    id: 5,
    cat: 'respiratory',
    name: t('equipmentPage.devices.d5.name'),
    desc: t('equipmentPage.devices.d5.desc'),
    icon: Wind,
    connectivity: ['Bluetooth'],
    color: 'from-cyan-500/20 to-cyan-400/5',
  },
  {
    id: 6,
    cat: 'wearables',
    name: t('equipmentPage.devices.d6.name'),
    desc: t('equipmentPage.devices.d6.desc'),
    icon: Watch,
    connectivity: ['Bluetooth', 'Wi-Fi'],
    color: 'from-purple-500/20 to-purple-400/5',
  },
  {
    id: 7,
    cat: 'wearables',
    name: t('equipmentPage.devices.d7.name'),
    desc: t('equipmentPage.devices.d7.desc'),
    icon: Thermometer,
    connectivity: ['Bluetooth'],
    color: 'from-amber-500/20 to-amber-400/5',
  },
  {
    id: 8,
    cat: 'cardio',
    name: t('equipmentPage.devices.d8.name'),
    desc: t('equipmentPage.devices.d8.desc'),
    icon: HeartPulse,
    connectivity: ['Bluetooth'],
    color: 'from-pink-500/20 to-pink-400/5',
  },
])

const filteredDevices = computed(() =>
  activeCategory.value === 'all'
    ? devices.value
    : devices.value.filter((d) => d.cat === activeCategory.value),
)

const compatibilityItems = computed(() => [
  t('equipmentPage.compatibility.item1'),
  t('equipmentPage.compatibility.item2'),
  t('equipmentPage.compatibility.item3'),
  t('equipmentPage.compatibility.item4'),
])

const certifications = computed(() => [
  { code: 'ANVISA', label: t('equipmentPage.cert.c1') },
  { code: 'FDA', label: t('equipmentPage.cert.c2') },
  { code: 'CE', label: t('equipmentPage.cert.c3') },
  { code: 'ISO 13485', label: t('equipmentPage.cert.c4') },
])

onMounted(() => {
  gsap
    .timeline({ defaults: { ease: 'power3.out', clearProps: 'opacity,transform' } })
    .from(heroTitle.value, { opacity: 0, y: 34, duration: 0.8 })
    .from(heroSub.value, { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
    .from(heroActions.value, { opacity: 0, y: 20, duration: 0.6 }, '-=0.35')

  if (equipVisual.value) {
    const root = equipVisual.value
    const hub = root.querySelector('.equip-hub')
    const glow = root.querySelector('.equip-glow')
    const sweep = root.querySelector('.equip-sweep')
    const ringOuter = root.querySelector('.equip-ring--outer')
    const ringInner = root.querySelector('.equip-ring--inner')
    const orbit = root.querySelector('.equip-orbit')
    const faces = root.querySelectorAll('.equip-face')
    const beadWraps = root.querySelectorAll('.equip-bead-wrap')
    const arcs = root.querySelectorAll('.equip-arc')

    gsap
      .timeline({ defaults: { ease: 'power3.out' } })
      .from(root, { opacity: 0, scale: 0.9, duration: 0.85 }, 0.15)
      .from(glow, { opacity: 0, scale: 0.6, duration: 0.8 }, 0.2)
      .from(hub, { scale: 0.55, opacity: 0, duration: 0.75, ease: 'back.out(1.55)' }, 0.28)
      .from(
        [ringOuter, ringInner, sweep],
        { opacity: 0, scale: 0.8, stagger: 0.08, duration: 0.65 },
        0.35,
      )
      .from(
        faces,
        { scale: 0.4, opacity: 0, stagger: 0.1, duration: 0.55, ease: 'back.out(1.4)' },
        0.5,
      )

    // Radar sweep
    gsap.to(sweep, { rotation: 360, duration: 6, ease: 'none', repeat: -1, delay: 1 })

    // Devices orbit; faces stay upright
    gsap.to(orbit, { rotation: 360, duration: 36, ease: 'none', repeat: -1, delay: 1.1 })
    gsap.to(faces, { rotation: -360, duration: 36, ease: 'none', repeat: -1, delay: 1.1 })

    // Rings drift
    gsap.to(ringOuter, { rotation: -360, duration: 55, ease: 'none', repeat: -1 })
    gsap.to(ringInner, { rotation: 360, duration: 40, ease: 'none', repeat: -1 })

    // Beads traveling on the outer ring
    beadWraps.forEach((wrap, i) => {
      gsap.set(wrap, { rotation: i * 120 })
      gsap.to(wrap, {
        rotation: `+=360`,
        duration: 9 + i * 2,
        ease: 'none',
        repeat: -1,
        delay: 1.2,
      })
    })

    // Signal arcs from hub
    arcs.forEach((arc, i) => {
      gsap.fromTo(
        arc,
        { opacity: 0, scale: 0.65 },
        {
          opacity: 0,
          scale: 1.2,
          duration: 1.8,
          ease: 'power1.out',
          repeat: -1,
          delay: 1.4 + i * 0.6,
          keyframes: [
            { opacity: 0.45, scale: 0.75, duration: 0.25 },
            { opacity: 0.25, scale: 1.05, duration: 0.8 },
            { opacity: 0, scale: 1.22, duration: 0.75 },
          ],
        },
      )
    })

    gsap.to(glow, {
      opacity: 0.65,
      scale: 1.12,
      duration: 2.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.2,
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

  animate(categoriesSection.value, '.cat-card', { stagger: 0.06, y: 24 })
  animate(devicesSection.value, '.device-card', { stagger: 0.07 })
  animate(compatibilitySection.value, '.animate-in')
  animate(certSection.value, '.cert-item', { stagger: 0.07, y: 22 })
  animate(certifSection.value, '.cert-badge', { stagger: 0.08, y: 16 })
})

const goToDevice = (id: number) => {
  router.push(`/equipment/${id}`)
}

onUnmounted(() => {
  if (equipVisual.value) gsap.killTweensOf(equipVisual.value.querySelectorAll('*'))
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

      <div class="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh] sm:min-h-[70vh] w-full">
        <div
          class="z-10 flex flex-col justify-center px-6 pb-16 pt-28 sm:px-8 sm:pt-32 lg:items-end lg:px-12 lg:pb-20 lg:pt-32 xl:px-20"
        >
          <div class="w-full max-w-xl flex flex-col gap-5">
            <span class="eyebrow eyebrow--dark">
              {{ t('equipmentPage.hero.badge') }}
            </span>
            <h1 ref="heroTitle" class="display-2 text-white">
              {{ t('equipmentPage.hero.title') }}
            </h1>
            <p ref="heroSub" class="lead max-w-xl text-white/55">
              {{ t('equipmentPage.hero.subtitle') }}
            </p>
            <div ref="heroActions" class="flex gap-4 flex-wrap mt-4">
              <a :href="calendlyUrl" target="_blank" rel="noopener noreferrer">
                <Button
                  :label="t('equipmentPage.cta.button.primary')"
                  unstyled
                  class="btn-primary font-display font-bold"
                />
              </a>
            </div>
          </div>
        </div>

        <!-- Right visual: connected ecosystem -->
        <div class="hidden lg:flex relative h-full items-center justify-center p-10 xl:p-14">
          <div
            ref="equipVisual"
            class="equip-visual relative z-10 h-[360px] w-[360px] xl:h-[400px] xl:w-[400px]"
            aria-hidden="true"
          >
            <div
              class="equip-glow absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full"
            />

            <!-- Radar sweep -->
            <div class="equip-sweep absolute inset-[4%] rounded-full" />

            <!-- Signal arcs -->
            <div class="equip-arc absolute inset-[22%] rounded-full" />
            <div class="equip-arc absolute inset-[18%] rounded-full" />
            <div class="equip-arc absolute inset-[14%] rounded-full" />

            <div class="equip-ring equip-ring--outer absolute inset-[2%] rounded-full" />
            <div class="equip-ring equip-ring--inner absolute inset-[16%] rounded-full" />

            <!-- Beads on outer ring -->
            <div class="equip-bead-wrap absolute inset-[2%]">
              <div
                class="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_rgba(17,211,211,0.9)]"
              />
            </div>
            <div class="equip-bead-wrap absolute inset-[2%]">
              <div
                class="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/80 shadow-[0_0_8px_rgba(17,211,211,0.7)]"
              />
            </div>
            <div class="equip-bead-wrap absolute inset-[2%]">
              <div
                class="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/70 shadow-[0_0_8px_rgba(17,211,211,0.6)]"
              />
            </div>

            <div class="equip-orbit absolute inset-[2%]">
              <div class="equip-node absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                <div class="equip-face equip-face--rose">
                  <HeartPulse :size="20" stroke-width="2.2" />
                </div>
              </div>
              <div class="equip-node absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
                <div class="equip-face equip-face--blue">
                  <Droplet :size="20" stroke-width="2.2" />
                </div>
              </div>
              <div class="equip-node absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                <div class="equip-face equip-face--emerald">
                  <Scale :size="20" stroke-width="2.2" />
                </div>
              </div>
              <div class="equip-node absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div class="equip-face equip-face--purple">
                  <Watch :size="20" stroke-width="2.2" />
                </div>
              </div>
            </div>

            <div class="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <div class="equip-hub">
                <Bluetooth :size="34" stroke-width="2" class="text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CATEGORIES ── -->
    <section
      ref="categoriesSection"
      class="py-20 sm:py-24 lg:py-28 bg-white w-full flex items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div class="text-center mb-10 flex flex-col items-center gap-5">
          <span class="eyebrow eyebrow--light">
            {{ t('equipmentPage.categories.badge') }}
          </span>
          <h2 class="display-2 text-black">
            {{ t('equipmentPage.categories.title') }}
          </h2>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3 pt-5">
          <button
            v-for="c in categories"
            :key="c.id"
            @click="activeCategory = c.id"
            :class="[
              'cat-card flex items-center gap-2 px-5 py-3 rounded-full text-[13px] font-display font-semibold transition-all',
              activeCategory === c.id
                ? 'bg-primary text-dark border border-primary shadow-[0_8px_24px_rgba(17,211,211,0.25)]'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-primary/40 hover:text-primary',
            ]"
          >
            <component :is="c.icon" :size="16" />
            {{ c.label }}
          </button>
        </div>
      </div>
    </section>

    <!-- ── DEVICES GRID ── -->
    <section
      ref="devicesSection"
      class="pb-16 sm:pb-20 bg-white w-full flex items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <article
            v-for="(d, i) in filteredDevices"
            :key="d.id"
            @click="goToDevice(d.id)"
            class="device-card group relative rounded-2xl border border-gray-200/80 bg-white overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_24px_60px_-20px_rgba(17,211,211,0.35)] cursor-pointer"
          >
            <!-- Visual -->
            <div class="relative aspect-square overflow-hidden">
              <div :class="`absolute inset-0 bg-linear-to-br ${d.color}`" />
              <div class="hero-grid absolute inset-0 opacity-30 pointer-events-none" />
              <div class="absolute inset-0 flex items-center justify-center">
                <div
                  class="w-20 h-20 rounded-2xl bg-white/90 shadow-lg flex items-center justify-center text-primary transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                >
                  <component :is="d.icon" :size="36" />
                </div>
              </div>
              <span
                class="absolute top-3 right-3 font-mono text-[10px] tracking-[2px] text-gray-500 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-2.5 py-1"
              >
                0{{ i + 1 }}
              </span>
            </div>

            <!-- Body -->
            <div class="p-5 flex flex-col gap-3">
              <h3 class="font-display font-bold text-black text-[15px] leading-tight">
                {{ d.name }}
              </h3>
              <p class="text-gray-500 text-[12px] leading-relaxed">{{ d.desc }}</p>
              <div class="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
                <span
                  v-for="conn in d.connectivity"
                  :key="conn"
                  class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider"
                >
                  <Wifi v-if="conn === 'Wi-Fi'" :size="10" />
                  <Bluetooth v-else :size="10" />
                  {{ conn }}
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ── CERTIFICAÇÕES ── -->
    <section ref="certSection" class="w-full border-y border-gray-200/80 bg-white py-16 sm:py-20">
      <div class="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <div class="flex flex-col items-center gap-5 text-center">
          <span class="cert-item eyebrow eyebrow--light">{{ t('equipmentPage.cert.badge') }}</span>
          <h2 class="cert-item display-3 max-w-2xl text-black">
            {{ t('equipmentPage.cert.title') }}
          </h2>
        </div>
        <div class="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-6">
          <div
            v-for="c in certifications"
            :key="c.code"
            class="cert-item flex flex-col items-center gap-1.5 rounded-2xl border border-gray-200/80 bg-white px-5 py-7 text-center"
          >
            <ShieldCheck :size="22" class="mb-2 text-primary" aria-hidden="true" />
            <div class="font-display text-[17px] font-extrabold tracking-tight text-black">
              {{ c.code }}
            </div>
            <div class="text-[12.5px] text-gray-500">{{ c.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── COMPATIBILITY ── -->
    <section
      ref="compatibilitySection"
      class="py-20 sm:py-24 lg:py-28 bg-mid w-full flex items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div class="animate-in flex flex-col items-start gap-6">
            <span class="eyebrow eyebrow--light">
              {{ t('equipmentPage.compatibility.badge') }}
            </span>
            <h2 class="display-2 text-black">
              {{ t('equipmentPage.compatibility.title') }}
            </h2>
            <p class="max-w-[62ch] text-[15.5px] leading-[1.75] text-gray-500">
              {{ t('equipmentPage.compatibility.description') }}
            </p>
            <ul class="m-0 w-full max-w-xl list-none p-0">
              <li
                v-for="item in compatibilityItems"
                :key="item"
                class="compat-row group flex items-start gap-4 border-t border-gray-300/50 py-4"
              >
                <span
                  class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/25 transition-all duration-300 group-hover:bg-primary group-hover:text-dark"
                >
                  <Check :size="13" stroke-width="3" aria-hidden="true" />
                </span>
                <span class="text-[14.5px] leading-relaxed text-gray-700">{{ item }}</span>
              </li>
            </ul>
            <a
              :href="calendlyUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary font-display mt-2"
            >
              {{ t('equipmentPage.cta.button.primary') }}
              <ArrowRight :size="16" stroke-width="2.5" aria-hidden="true" />
            </a>
          </div>

          <div class="animate-in">
            <div
              class="relative rounded-2xl bg-white border border-gray-200/80 p-8 shadow-[0_28px_72px_rgba(0,0,0,.10)]"
            >
              <div class="grid grid-cols-2 gap-4">
                <div
                  class="rounded-xl bg-mid border border-gray-100 p-5 flex flex-col items-center text-center gap-2"
                >
                  <Bluetooth :size="28" class="text-primary" />
                  <div class="font-display font-bold text-black text-sm">Bluetooth 5.0</div>
                  <div class="text-gray-500 text-xs">Low Energy</div>
                </div>
                <div
                  class="rounded-xl bg-mid border border-gray-100 p-5 flex flex-col items-center text-center gap-2"
                >
                  <Wifi :size="28" class="text-primary" />
                  <div class="font-display font-bold text-black text-sm">Wi-Fi</div>
                  <div class="text-gray-500 text-xs">2.4 / 5 GHz</div>
                </div>
                <div
                  class="rounded-xl bg-mid border border-gray-100 p-5 flex flex-col items-center text-center gap-2"
                >
                  <ShieldCheck :size="28" class="text-primary" />
                  <div class="font-display font-bold text-black text-sm">HL7 / FHIR</div>
                  <div class="text-gray-500 text-xs">Standards</div>
                </div>
                <div
                  class="rounded-xl bg-mid border border-gray-100 p-5 flex flex-col items-center text-center gap-2"
                >
                  <Activity :size="28" class="text-primary" />
                  <div class="font-display font-bold text-black text-sm">+200</div>
                  <div class="text-gray-500 text-xs">
                    {{ t('equipmentPage.compatibility.devices') }}
                  </div>
                </div>
              </div>
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
          {{ t('equipmentPage.cta.badge') }}
        </span>
        <h2 class="display-2 mt-2 mb-4 text-white">
          {{ t('equipmentPage.cta.title') }}
        </h2>
        <p class="text-white/45 text-[14px] sm:text-[16px] leading-relaxed mb-8 max-w-2xl mx-auto">
          {{ t('equipmentPage.cta.subtitle') }}
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <a :href="calendlyUrl" target="_blank" rel="noopener noreferrer">
            <Button
              :label="t('equipmentPage.cta.button.primary')"
              unstyled
              class="btn-primary font-display px-8 py-3"
            />
          </a>
          <RouterLink to="/about" class="btn-ghost font-display group">
            {{ t('equipmentPage.cta.button.secondary') }}
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
.compat-row {
  transition: border-color 0.3s ease;
}
@media (hover: hover) {
  .compat-row:hover {
    border-color: rgba(17, 211, 211, 0.5);
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

.cta-glow {
  background: radial-gradient(circle, rgba(17, 211, 211, 0.08) 0%, transparent 70%);
}

.cta-ghost {
  font-size: clamp(120px, 20vw, 340px);
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.07);
  letter-spacing: -0.05em;
}

.equip-glow {
  background: radial-gradient(
    circle,
    rgba(17, 211, 211, 0.34) 0%,
    rgba(17, 211, 211, 0.08) 42%,
    transparent 70%
  );
}

.equip-sweep {
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(17, 211, 211, 0.28) 35deg,
    transparent 85deg
  );
  -webkit-mask: radial-gradient(
    farthest-side,
    transparent 34%,
    #000 35%,
    #000 98%,
    transparent 99%
  );
  mask: radial-gradient(farthest-side, transparent 34%, #000 35%, #000 98%, transparent 99%);
  opacity: 0.85;
}

.equip-arc {
  border: 1.5px solid rgba(17, 211, 211, 0.35);
  opacity: 0;
  pointer-events: none;
}

.equip-ring--outer {
  border: 1px dashed rgba(255, 255, 255, 0.14);
}
.equip-ring--inner {
  border: 1px solid rgba(17, 211, 211, 0.18);
}

.equip-bead-wrap {
  transform-origin: center center;
}

.equip-hub {
  display: flex;
  width: 100px;
  height: 100px;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid rgba(17, 211, 211, 0.5);
  background: linear-gradient(160deg, rgba(17, 211, 211, 0.24), rgba(14, 17, 23, 0.9));
  box-shadow:
    0 0 0 12px rgba(17, 211, 211, 0.06),
    0 18px 48px rgba(17, 211, 211, 0.22);
}

.equip-face {
  display: flex;
  width: 52px;
  height: 52px;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: linear-gradient(160deg, #1a2230, #121820);
  box-shadow:
    0 12px 28px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}
.equip-face--rose {
  color: #fb7185;
  border: 1px solid rgba(251, 113, 133, 0.5);
  box-shadow:
    0 12px 28px rgba(0, 0, 0, 0.35),
    0 0 20px rgba(251, 113, 133, 0.15);
}
.equip-face--blue {
  color: #60a5fa;
  border: 1px solid rgba(96, 165, 250, 0.5);
  box-shadow:
    0 12px 28px rgba(0, 0, 0, 0.35),
    0 0 20px rgba(96, 165, 250, 0.15);
}
.equip-face--emerald {
  color: #34d399;
  border: 1px solid rgba(52, 211, 153, 0.5);
  box-shadow:
    0 12px 28px rgba(0, 0, 0, 0.35),
    0 0 20px rgba(52, 211, 153, 0.15);
}
.equip-face--purple {
  color: #c084fc;
  border: 1px solid rgba(192, 132, 252, 0.5);
  box-shadow:
    0 12px 28px rgba(0, 0, 0, 0.35),
    0 0 20px rgba(192, 132, 252, 0.15);
}
</style>
