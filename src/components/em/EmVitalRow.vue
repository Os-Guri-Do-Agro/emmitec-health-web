<script setup lang="ts">
/** Linha de sinal vital: ícone, valor que oscila de leve e sparkline contínua. */
import { onMounted, onBeforeUnmount, ref, type Component } from 'vue'
import { RM, damp } from '@/lib/motion'

const props = withDefaults(
  defineProps<{
    icon: Component
    label: string
    status: string
    base: number
    amp?: number
    dec?: number
    suffix?: string
    unit: string
    warn?: boolean
    seed?: number
  }>(),
  { amp: 3, dec: 0, suffix: '', warn: false, seed: 0 },
)

const W = 116
const H = 44
const N = 30
const line = ref('')
const area = ref('')
const shown = ref(props.base.toFixed(props.dec))
const root = ref<HTMLElement | null>(null)

let raf = 0
let visible = true
let io: IntersectionObserver | null = null

function f(x: number) {
  return (
    props.base +
    props.amp *
      (Math.sin(x * 0.9) * 0.55 + Math.sin(x * 2.3 + 1.3) * 0.3 + Math.sin(x * 5.1 + 0.4) * 0.15)
  )
}

let t = 0
let val = props.base
let target = props.base
let lastT = 0
let prev = 0

function render() {
  const lo = props.base - props.amp
  const hi = props.base + props.amp
  const pts: [number, number][] = []
  for (let i = 0; i < N; i++) {
    const v = f(t + i * 0.18)
    pts.push([(i / (N - 1)) * W, H - 4 - ((v - lo) / (hi - lo)) * (H - 8)])
  }
  let d = `M${pts[0]![0].toFixed(1)} ${pts[0]![1].toFixed(1)}`
  for (let j = 1; j < N; j++) {
    const p0 = pts[j - 1]!
    const p1 = pts[j]!
    const mx = (p0[0] + p1[0]) / 2
    d += ` Q${p0[0].toFixed(1)} ${p0[1].toFixed(1)} ${mx.toFixed(1)} ${((p0[1] + p1[1]) / 2).toFixed(1)}`
  }
  d += ` L${W} ${pts[N - 1]![1].toFixed(1)}`
  line.value = d
  area.value = `${d} L${W} ${H} L0 ${H} Z`
}

function frame(now: number) {
  const dt = Math.min(0.05, (now - (prev || now)) / 1000)
  prev = now
  t += dt * 0.6
  render()
  if (now - lastT > 1600) {
    target = f(t + (N - 1) * 0.18)
    lastT = now
  }
  val = damp(val, target, 2.5, dt)
  shown.value = val.toFixed(props.dec).replace('.', ',')
  raf = visible ? requestAnimationFrame(frame) : 0
}

onMounted(() => {
  t = props.seed * 40
  render()
  if (RM) return
  if (typeof IntersectionObserver === 'function' && root.value) {
    io = new IntersectionObserver((en) => {
      visible = !!en[0]?.isIntersecting
      if (visible && !raf) {
        prev = 0
        raf = requestAnimationFrame(frame)
      }
    })
    io.observe(root.value)
  } else raf = requestAnimationFrame(frame)
})
onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
  io?.disconnect()
})
</script>

<template>
  <div ref="root" class="em-vital" :class="{ 'em-vital--warn': warn }">
    <span class="em-ico"><component :is="icon" :stroke-width="1.7" aria-hidden="true" /></span>
    <div>
      <div class="em-vital__k">
        {{ label }}
        <span class="em-status" :class="{ 'em-status--warn': warn }"
          ><span class="em-dot" />{{ status }}</span
        >
      </div>
      <div class="em-vital__v">
        <span>{{ shown }}</span
        >{{ suffix }}<small>{{ unit }}</small>
      </div>
    </div>
    <svg :viewBox="`0 0 ${W} ${H}`" aria-hidden="true">
      <path class="a" :d="area" />
      <path class="l" :d="line" />
    </svg>
  </div>
</template>
