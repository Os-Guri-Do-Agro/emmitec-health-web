<script setup lang="ts">
/**
 * Lista em linhas grandes (estilo estúdio): no hover a linha se destaca, as outras
 * esmaecem e uma foto segue o cursor, trocando com uma cortina suave.
 * Em telas de toque, cada linha mostra a própria miniatura.
 */
import { onBeforeUnmount, ref, type Component } from 'vue'
import { RM, clamp, damp } from '@/lib/motion'

defineProps<{
  items: { text: string; icon: Component; img: string; alt?: string }[]
}>()

const lines = ref<HTMLElement | null>(null)
const preview = ref<HTMLElement | null>(null)
const active = ref(-1)
const hovering = ref(false)

const canHover =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

const W = 340
const H = 255
let tx = 0
let ty = 0
let x = 0
let y = 0
let vx = 0
let raf = 0
let prev = 0

function frame(now: number) {
  const el = preview.value
  if (!el) return
  const dt = Math.min(0.05, (now - (prev || now)) / 1000)
  prev = now
  const nx = RM ? tx : damp(x, tx, 9, dt)
  vx = damp(vx, (nx - x) / Math.max(dt, 0.001), 6, dt)
  x = nx
  y = RM ? ty : damp(y, ty, 9, dt)
  const rot = clamp(vx * 0.006, -7, 7)
  el.style.transform = `translate3d(${(x - W / 2 + 48).toFixed(1)}px,${(y - H / 2).toFixed(1)}px,0) rotate(${rot.toFixed(2)}deg)`
  const settling = Math.abs(x - tx) > 0.5 || Math.abs(y - ty) > 0.5 || Math.abs(rot) > 0.05
  if (hovering.value || settling) raf = requestAnimationFrame(frame)
  else {
    raf = 0
    prev = 0
  }
}

function onMove(e: PointerEvent) {
  if (!canHover || e.pointerType === 'touch' || !lines.value) return
  const r = lines.value.getBoundingClientRect()
  tx = e.clientX - r.left
  ty = e.clientY - r.top
  if (!hovering.value) {
    hovering.value = true
    x = tx
    y = ty
  }
  if (!raf) raf = requestAnimationFrame(frame)
}
function onLeave() {
  hovering.value = false
  active.value = -1
}

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <div
    ref="lines"
    class="em-lines"
    :class="{ 'is-hover': active >= 0 }"
    @pointermove="onMove"
    @pointerleave="onLeave"
  >
    <div
      v-for="(it, i) in items"
      :key="i"
      v-reveal="i * 90"
      class="em-line"
      :class="{ 'is-active': active === i }"
      @pointerenter="active = i"
    >
      <span class="em-line__n">({{ String(i + 1).padStart(2, '0') }})</span>
      <span class="em-ico"><component :is="it.icon" :stroke-width="1.7" aria-hidden="true" /></span>
      <span class="em-line__t">{{ it.text }}</span>
      <span class="em-line__thumb" aria-hidden="true"
        ><img :src="it.img" alt="" loading="lazy"
      /></span>
      <span class="em-line__go" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </div>

    <div
      v-if="canHover"
      ref="preview"
      class="em-lines__preview"
      :class="{ 'is-on': hovering && active >= 0 }"
      aria-hidden="true"
    >
      <img
        v-for="(it, i) in items"
        :key="i"
        :src="it.img"
        :alt="it.alt ?? ''"
        :class="{ 'is-active': active === i }"
        loading="lazy"
      />
    </div>
  </div>
</template>
