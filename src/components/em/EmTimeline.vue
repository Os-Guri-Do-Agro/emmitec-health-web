<script setup lang="ts">
/**
 * Linha do tempo horizontal: no desktop a seção "prende" na tela e a rolagem
 * vertical vira deslocamento lateral (amortecido); os anos acendem conforme
 * passam. No celular e com movimento reduzido vira uma lista vertical comum.
 */
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { RM, addFx, clamp, damp } from '@/lib/motion'

const props = defineProps<{ items: { year: string; title: string; desc: string }[] }>()

const sec = ref<HTMLElement | null>(null)
const viewport = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const horizontal = ref(false)
const pinned = ref(false)
const height = ref(0)
const lit = ref(0)
const progress = ref(0)

let dist = 0
let x = 0
let offFx: (() => void) | null = null
let ro: ResizeObserver | null = null
let mq: MediaQueryList | null = null

async function measure() {
  // primeiro monta a fileira horizontal, depois mede quanto ela passa da tela
  horizontal.value = !RM && !!mq?.matches
  await nextTick()
  const tr = track.value
  const vp = viewport.value
  if (!tr || !vp) return
  dist = horizontal.value ? Math.max(0, tr.scrollWidth - vp.clientWidth) : 0
  pinned.value = horizontal.value && dist > 0
  height.value = pinned.value ? window.innerHeight + dist : 0
  if (!pinned.value) {
    x = 0
    tr.style.transform = ''
    lit.value = props.items.length
    progress.value = 1
  }
}

onMounted(() => {
  mq = window.matchMedia('(min-width: 901px)')
  mq.addEventListener('change', measure)
  measure()
  if (typeof ResizeObserver === 'function' && track.value) {
    ro = new ResizeObserver(measure)
    ro.observe(track.value)
  }
  window.addEventListener('resize', measure)

  offFx = addFx((_y, dt, vh) => {
    if (!pinned.value || !sec.value || !track.value) return
    const r = sec.value.getBoundingClientRect()
    const goal = clamp(-r.top / Math.max(1, r.height - vh), 0, 1) * dist
    x = damp(x, goal, 9, dt)
    track.value.style.transform = `translate3d(${(-x).toFixed(2)}px,0,0)`
    progress.value = dist ? x / dist : 1
    // um marco acende quando entra nos 65% da largura visível
    const items = track.value.children
    let n = 0
    for (let i = 0; i < items.length; i++) {
      const el = items[i] as HTMLElement
      if (el.offsetLeft - x < window.innerWidth * 0.65) n = i + 1
    }
    lit.value = n
    return Math.abs(x - goal) > 0.2
  })
})

onBeforeUnmount(() => {
  offFx?.()
  ro?.disconnect()
  mq?.removeEventListener('change', measure)
  window.removeEventListener('resize', measure)
})
</script>

<template>
  <section
    ref="sec"
    class="em-tlh"
    :class="{ 'is-h': horizontal, 'is-pinned': pinned }"
    :style="pinned ? { height: `${height}px` } : undefined"
  >
    <div class="em-tlh__sticky">
      <div class="em-wrap em-tlh__head">
        <slot name="head" />
      </div>
      <div ref="viewport" class="em-tlh__viewport">
        <ol ref="track" class="em-tlh__track">
          <li
            v-for="(it, i) in items"
            :key="it.year"
            v-reveal="pinned ? 0 : i * 80"
            class="em-tlh__item"
            :class="{ 'is-lit': i < lit, 'is-now': pinned && i === lit - 1 }"
          >
            <span class="em-tlh__dot" aria-hidden="true" />
            <b class="em-tlh__year">{{ it.year }}</b>
            <h3>{{ it.title }}</h3>
            <p>{{ it.desc }}</p>
          </li>
        </ol>
        <div class="em-wrap">
          <div class="em-tlh__rail" aria-hidden="true">
            <i :style="{ transform: `scaleX(${progress.toFixed(4)})` }" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
