<script setup lang="ts">
/**
 * Painel RPM "ao vivo" da página de Benefícios.
 * - KPIs em odômetro com minitendência que se desenha ao aparecer;
 * - leituras da semana em barras (últimos 7 dias até hoje): crescem em sequência,
 *   mostram valor e dia no hover/foco, linha de média e a barra de hoje recebendo
 *   leituras ao vivo;
 * - adesão com medidor que enche até 87% e marca a meta;
 * - o card inclina de leve seguindo o cursor.
 * Números ilustrativos (como no site original). Sem animação com movimento reduzido.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { TrendingUp } from 'lucide-vue-next'
import { RM } from '@/lib/motion'
import EmOdometer from './EmOdometer.vue'

const { t, locale } = useI18n()
const NUM_LOCALE: Record<string, string> = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' }
const loc = computed(() => NUM_LOCALE[locale.value] ?? 'pt-BR')
const fmt = (n: number) => Math.round(n).toLocaleString(loc.value)

/* ── KPIs ── */
const active = ref(1284)
/** Pacientes ativos nos últimos 12 meses (a minitendência). */
const ACTIVE_TREND = [1010, 1032, 1050, 1044, 1090, 1118, 1135, 1172, 1190, 1222, 1251, 1284]
/** Economia acumulada no ano, mês a mês (em mil). */
const SAVED_MONTHS = [22, 51, 83, 112, 150, 186, 221, 259, 298, 336, 377, 420]

function sparkPath(values: number[], w: number, h: number) {
  const lo = Math.min(...values)
  const hi = Math.max(...values)
  const pts: [number, number][] = values.map((v, i) => [
    (i / (values.length - 1)) * w,
    h - 3 - ((v - lo) / (hi - lo || 1)) * (h - 8),
  ])
  const f = (n: number) => n.toFixed(1)
  let d = `M${f(pts[0]![0])} ${f(pts[0]![1])}`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]!
    const [x1, y1] = pts[i]!
    const mx = (x0 + x1) / 2
    d += ` C${f(mx)} ${f(y0)} ${f(mx)} ${f(y1)} ${f(x1)} ${f(y1)}`
  }
  const [x, y] = pts[pts.length - 1]!
  return { line: d, area: `${d} L${w} ${h} L0 ${h} Z`, x, y }
}
const SW = 132
const SH = 40
const spark = sparkPath(ACTIVE_TREND, SW, SH)

/* ── leituras da semana ── */
const MAX = 1400
const weekly = ref([532, 868, 630, 1092, 770, 1232, 918])
const total = computed(() => weekly.value.reduce((a, b) => a + b, 0))
const avg = computed(() => total.value / weekly.value.length)

/** Últimos 7 dias terminando hoje, rotulados pelo próprio Intl (sem textos novos no i18n). */
const days = computed(() => {
  const today = new Date()
  const short = new Intl.DateTimeFormat(loc.value, { weekday: 'narrow' })
  const long = new Intl.DateTimeFormat(loc.value, {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  })
  const rel = new Intl.RelativeTimeFormat(loc.value, { numeric: 'auto' })
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    return {
      short: short.format(d),
      long: cap(i === 6 ? rel.format(0, 'day') : long.format(d)),
    }
  })
})

const hover = ref(-1)
const tip = computed(() => {
  const i = hover.value
  if (i < 0) return null
  const n = weekly.value.length
  return {
    style: {
      left: `${((i + 0.5) / n) * 100}%`,
      '--th': weekly.value[i]! / MAX,
      // nas pontas o balão se desloca para dentro do card
      '--tx': `${-(12 + (i / (n - 1)) * 76)}%`,
    },
    value: fmt(weekly.value[i]!),
    label: `${t('benefitsPage.clinic.dashboard.readings')} · ${days.value[i]!.long}`,
  }
})

/* ── adesão ── */
const ADHERENCE = 87
const TARGET = 80

/* ── inclinação que segue o cursor ── */
const root = ref<HTMLElement | null>(null)
const tilt = ref({ x: 0, y: 0 })
function onTilt(e: PointerEvent) {
  if (RM || e.pointerType === 'touch' || !root.value) return
  const r = root.value.getBoundingClientRect()
  const px = (e.clientX - r.left) / r.width - 0.5
  const py = (e.clientY - r.top) / r.height - 0.5
  tilt.value = { x: -py * 5, y: px * 6 }
}
function resetTilt() {
  tilt.value = { x: 0, y: 0 }
  hover.value = -1
}

/* ── ao vivo: a barra de hoje recebe leituras; de vez em quando entra um paciente ── */
const pulse = ref(0)
let timer = 0
let ticks = 0
let visible = false
let io: IntersectionObserver | null = null

function tick() {
  if (!visible || document.hidden) return
  ticks++
  const w = weekly.value.slice()
  w[6] = Math.min(MAX * 0.97, w[6]! + 6 + Math.round(Math.random() * 14))
  weekly.value = w
  if (ticks % 3 === 0) active.value++
  pulse.value++
}

onMounted(() => {
  if (RM || !root.value) return
  io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting), { threshold: 0.3 })
  io.observe(root.value)
  // começa depois que as barras e os odômetros terminam de entrar
  window.setTimeout(() => {
    timer = window.setInterval(tick, 2600)
  }, 3600)
})
onBeforeUnmount(() => {
  window.clearInterval(timer)
  io?.disconnect()
})
</script>

<template>
  <div
    ref="root"
    v-reveal:scale="150"
    v-spot
    class="em-dash em-card"
    :style="{ '--rx': `${tilt.x}deg`, '--ry': `${tilt.y}deg` }"
    @pointermove="onTilt"
    @pointerleave="resetTilt"
  >
    <div class="em-win__bar">
      <span
        ><span class="em-win__dots"><i /><i /><i /></span
        >{{ t('benefitsPage.clinic.dashboard.subtitle') }}</span
      >
      <span :key="pulse" class="em-pill em-dash__live" :class="{ 'is-tick': pulse > 0 }">{{
        t('benefitsPage.clinic.dashboard.live')
      }}</span>
    </div>

    <!-- KPIs -->
    <div class="em-dash__kpis">
      <div class="em-dash__kpi">
        <small>{{ t('benefitsPage.clinic.dashboard.active') }}</small>
        <b :class="{ 'em-odo-live': pulse > 0 }"><EmOdometer :value="fmt(active)" /></b>
        <span class="em-dash__delta"
          ><TrendingUp :stroke-width="2" aria-hidden="true" />{{
            t('benefitsPage.clinic.dashboard.activeDelta')
          }}</span
        >
        <span class="em-dash__spark" aria-hidden="true">
          <svg :viewBox="`0 0 ${SW} ${SH}`" preserveAspectRatio="none">
            <path class="a" :d="spark.area" />
            <path class="l" :d="spark.line" pathLength="1" />
          </svg>
          <i :style="{ top: `${(spark.y / SH) * 100}%` }" />
        </span>
      </div>
      <div class="em-dash__kpi">
        <small>{{ t('benefitsPage.clinic.dashboard.saved') }}</small>
        <b>$<EmOdometer value="420" /><i>K</i></b>
        <span>{{ t('benefitsPage.clinic.dashboard.savedNote') }}</span>
        <span class="em-dash__months" aria-hidden="true">
          <i v-for="(m, k) in SAVED_MONTHS" :key="k" :style="{ '--h': m / 420, '--i': k }" />
        </span>
      </div>
    </div>

    <!-- leituras da semana -->
    <div class="em-dash__block">
      <div class="em-dash__row">
        <small>{{ t('benefitsPage.clinic.dashboard.weekly') }}</small>
        <span class="em-dash__total">{{ fmt(total) }}</span>
      </div>
      <div class="em-chart" :class="{ 'is-hover': hover >= 0 }" @pointerleave="hover = -1">
        <span class="em-chart__avg" :style="{ '--a': avg / MAX }" aria-hidden="true"
          ><em>{{ t('benefitsPage.clinic.dashboard.avg') }}</em></span
        >
        <button
          v-for="(v, i) in weekly"
          :key="i"
          type="button"
          class="em-chart__col"
          :class="{ 'is-on': hover === i, 'is-today': i === weekly.length - 1 }"
          :style="{ '--h': v / MAX, '--i': i }"
          :aria-label="`${days[i]?.long}: ${fmt(v)} ${t('benefitsPage.clinic.dashboard.readings')}`"
          @pointerenter="hover = i"
          @focus="hover = i"
          @blur="hover = -1"
        >
          <i class="em-chart__bar" />
          <span class="em-chart__day" aria-hidden="true">{{ days[i]?.short }}</span>
        </button>
        <div v-if="tip" class="em-chart__tip" :style="tip.style" aria-hidden="true">
          <b>{{ tip.value }}</b>
          <span>{{ tip.label }}</span>
        </div>
      </div>
    </div>

    <!-- adesão -->
    <div class="em-dash__block em-dash__adh">
      <div class="em-dash__row">
        <small>{{ t('benefitsPage.clinic.dashboard.adherence') }}</small>
        <b class="em-dash__pct"><EmOdometer :value="ADHERENCE" />%</b>
      </div>
      <div
        class="em-dash__meter"
        role="meter"
        :aria-valuenow="ADHERENCE"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="t('benefitsPage.clinic.dashboard.adherence')"
      >
        <i :style="{ width: `${ADHERENCE}%` }" />
        <span class="em-dash__target" :style="{ left: `${TARGET}%` }"
          ><em>{{ t('benefitsPage.clinic.dashboard.target') }} {{ TARGET }}%</em></span
        >
      </div>
    </div>
  </div>
</template>
