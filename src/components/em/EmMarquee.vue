<script setup lang="ts">
/**
 * Faixa contínua; desacelera (15%) no hover em vez de parar. Pausa fora da tela.
 * Repete o conjunto quantas vezes for preciso para cobrir telas largas.
 */
import { onMounted, onBeforeUnmount, ref, type Component } from 'vue'
import { RM, damp } from '@/lib/motion'

const props = withDefaults(
  defineProps<{
    items: { label: string; icon?: Component }[]
    dir?: 'left' | 'right'
    speed?: number
  }>(),
  { dir: 'left', speed: 36 },
)

const root = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const copies = ref(2)

let raf = 0
let io: IntersectionObserver | null = null
let ro: ResizeObserver | null = null
let x = 0
let loopW = 0
let sp = 1
let tsp = 1
let prev = 0

/** Mede um conjunto e decide quantas cópias cobrem a largura da faixa. */
function measure() {
  const tr = track.value
  const first = tr?.firstElementChild as HTMLElement | null
  if (!tr || !first || !root.value) return
  const gap = parseFloat(getComputedStyle(tr).columnGap) || 0
  const w = first.offsetWidth
  if (!w) return
  loopW = w + gap
  const need = Math.max(2, Math.ceil(root.value.offsetWidth / w) + 1)
  if (need !== copies.value) copies.value = need
  if (props.dir === 'right' && x === 0) x = -loopW
}

function frame(now: number) {
  const el = track.value
  if (!el) return
  const dt = Math.min(0.05, (now - (prev || now)) / 1000)
  prev = now
  if (!loopW) measure()
  sp = damp(sp, tsp, 2.2, dt)
  x += (props.dir === 'right' ? 1 : -1) * props.speed * sp * dt
  if (loopW) {
    if (x <= -loopW) x += loopW
    if (x > 0) x -= loopW
  }
  el.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`
  raf = requestAnimationFrame(frame)
}

// no hover a faixa desacelera até 15% (não para)
function slow() {
  tsp = 0.15
}
function normal() {
  tsp = 1
}
function play() {
  if (!raf && !RM) {
    prev = 0
    raf = requestAnimationFrame(frame)
  }
}
function pause() {
  if (raf) cancelAnimationFrame(raf)
  raf = 0
}

onMounted(() => {
  measure()
  if (typeof ResizeObserver === 'function' && root.value && track.value?.firstElementChild) {
    ro = new ResizeObserver(() => measure())
    ro.observe(root.value)
    ro.observe(track.value.firstElementChild)
  }
  if (RM) return
  if (typeof IntersectionObserver === 'function' && root.value) {
    io = new IntersectionObserver((en) => (en[0]?.isIntersecting ? play() : pause()))
    io.observe(root.value)
  } else play()
})
onBeforeUnmount(() => {
  pause()
  io?.disconnect()
  ro?.disconnect()
})
</script>

<template>
  <div ref="root" class="em-marquee" @pointerenter="slow" @pointerleave="normal">
    <div ref="track" class="em-marquee__track">
      <div
        v-for="c in copies"
        :key="c"
        class="em-marquee__set"
        :aria-hidden="c > 1 ? 'true' : undefined"
      >
        <span v-for="(it, i) in items" :key="i" class="em-marquee__item">
          <component :is="it.icon" v-if="it.icon" :stroke-width="1.7" aria-hidden="true" />
          {{ it.label }}
        </span>
      </div>
    </div>
  </div>
</template>
