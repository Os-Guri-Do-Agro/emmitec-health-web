<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from 'primevue/button'

import {
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

const { t } = useI18n()

gsap.registerPlugin(ScrollTrigger)

const heroTitle = ref<HTMLElement | null>(null)
const heroSub = ref<HTMLElement | null>(null)
const heroActions = ref<HTMLElement | null>(null)

const categoriesSection = ref<HTMLElement | null>(null)
const devicesSection = ref<HTMLElement | null>(null)
const compatibilitySection = ref<HTMLElement | null>(null)
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

const compatibilityItems = [
  t('equipmentPage.compatibility.item1'),
  t('equipmentPage.compatibility.item2'),
  t('equipmentPage.compatibility.item3'),
  t('equipmentPage.compatibility.item4'),
]

const certifications = [
  { code: 'ANVISA', label: t('equipmentPage.cert.c1') },
  { code: 'FDA', label: t('equipmentPage.cert.c2') },
  { code: 'CE', label: t('equipmentPage.cert.c3') },
  { code: 'ISO 13485', label: t('equipmentPage.cert.c4') },
]

onMounted(() => {
  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
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
      scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      ...opts,
    })
  }

  animate(categoriesSection.value, '.cat-card', { stagger: 0.06, y: 24 })
  animate(devicesSection.value, '.device-card', { stagger: 0.07 })
  animate(compatibilitySection.value, '.animate-in')
  animate(certifSection.value, '.cert-badge', { stagger: 0.08, y: 16 })
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
              {{ t('equipmentPage.hero.badge') }}
            </span>
            <h1
              ref="heroTitle"
              class="font-display font-extrabold text-white leading-[1.08] tracking-tight text-xl sm:text-2xl lg:text-[34px]"
            >
              {{ t('equipmentPage.hero.title') }}
            </h1>
            <p
              ref="heroSub"
              class="text-white/50 text-[12px] sm:text-[14px] leading-relaxed max-w-md font-light"
            >
              {{ t('equipmentPage.hero.subtitle') }}
            </p>
            <div ref="heroActions" class="flex gap-4 flex-wrap mt-4">
              <Button
                :label="t('equipmentPage.hero.button.primary')"
                unstyled
                class="btn-primary font-display font-bold"
              />
              <Button
                :label="t('equipmentPage.hero.button.secondary') + ' →'"
                unstyled
                class="btn-ghost font-display font-bold"
              />
            </div>
          </div>
        </div>

        <!-- Right visual: orbit of icons -->
        <div class="hidden lg:flex relative h-full items-center justify-center p-12">
          <div class="relative w-80 h-80">
            <div
              class="absolute inset-0 rounded-full border border-white/10 border-dashed slow-spin"
            />
            <div
              class="absolute inset-8 rounded-full border border-primary/20 border-dashed slow-spin-reverse"
            />
            <!-- Orbital icons -->
            <div
              class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-dark-2 border border-rose-400/40 flex items-center justify-center"
            >
              <HeartPulse :size="20" class="text-rose-400" />
            </div>
            <div
              class="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-dark-2 border border-blue-400/40 flex items-center justify-center"
            >
              <Droplet :size="20" class="text-blue-400" />
            </div>
            <div
              class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-12 rounded-xl bg-dark-2 border border-emerald-400/40 flex items-center justify-center"
            >
              <Scale :size="20" class="text-emerald-400" />
            </div>
            <div
              class="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-dark-2 border border-purple-400/40 flex items-center justify-center"
            >
              <Watch :size="20" class="text-purple-400" />
            </div>
            <!-- Center -->
            <div
              class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center"
            >
              <Bluetooth :size="36" class="text-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CATEGORIES ── -->
    <section
      ref="categoriesSection"
      class="py-16 sm:py-20 bg-white w-full flex items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10 flex flex-col items-center gap-5">
          <span
            class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary"
          >
            {{ t('equipmentPage.categories.badge') }}
          </span>
          <h2
            class="font-display font-extrabold text-black text-[clamp(26px,3vw,40px)] tracking-tight"
          >
            {{ t('equipmentPage.categories.title') }}
          </h2>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3">
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
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <article
            v-for="(d, i) in filteredDevices"
            :key="d.id"
            class="device-card group relative rounded-2xl border border-gray-200/80 bg-white overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_24px_60px_-20px_rgba(17,211,211,0.35)]"
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

    <!-- ── COMPATIBILITY ── -->
    <section
      ref="compatibilitySection"
      class="py-16 sm:py-20 bg-mid w-full flex items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div class="animate-in flex flex-col gap-5">
            <span
              class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary"
            >
              {{ t('equipmentPage.compatibility.badge') }}
            </span>
            <h2
              class="font-display font-extrabold text-black text-[clamp(24px,3vw,36px)] tracking-tight leading-tight"
            >
              {{ t('equipmentPage.compatibility.title') }}
            </h2>
            <p class="text-gray-500 text-[14px] sm:text-[16px] leading-relaxed">
              {{ t('equipmentPage.compatibility.description') }}
            </p>
            <ul class="flex flex-col gap-3 mt-2">
              <li
                v-for="item in compatibilityItems"
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
            <Button
              :label="t('equipmentPage.compatibility.button')"
              unstyled
              class="btn-primary font-display font-bold mt-4 self-start"
            />
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

    <!-- ── CERTIFICATIONS ── -->
    <section
      ref="certifSection"
      class="py-16 sm:py-20 bg-white w-full flex items-center justify-center"
    >
      <div class="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span
          class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary"
        >
          {{ t('equipmentPage.cert.badge') }}
        </span>
        <h2
          class="font-display font-extrabold text-black text-[clamp(26px,3vw,40px)] tracking-tight mt-3 mb-10"
        >
          {{ t('equipmentPage.cert.title') }}
        </h2>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="c in certifications"
            :key="c.code"
            class="cert-badge rounded-2xl bg-mid border border-gray-200 p-6 flex flex-col items-center gap-2"
          >
            <ShieldCheck :size="24" class="text-primary mb-2" />
            <div class="font-display font-extrabold text-black text-lg">{{ c.code }}</div>
            <div class="text-gray-500 text-[12px]">{{ c.label }}</div>
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
          {{ t('equipmentPage.cta.badge') }}
        </span>
        <h2
          class="font-display font-extrabold text-white mt-2 mb-4 text-[clamp(24px,2.5vw,40px)] leading-tight tracking-tight"
        >
          {{ t('equipmentPage.cta.title') }}
        </h2>
        <p class="text-white/45 text-[14px] sm:text-[16px] leading-relaxed mb-8 max-w-2xl mx-auto">
          {{ t('equipmentPage.cta.subtitle') }}
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <Button
            :label="t('equipmentPage.cta.button.primary')"
            unstyled
            class="btn-primary font-display px-8 py-3"
          />
          <Button
            :label="t('equipmentPage.cta.button.secondary')"
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

.slow-spin {
  animation: spin 60s linear infinite;
}
.slow-spin-reverse {
  animation: spin 80s linear infinite reverse;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
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
