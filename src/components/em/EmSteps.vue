<script setup lang="ts">
/**
 * Etapas em "scrollytelling": à esquerda um painel preso mostra o fluxo (nós ligados
 * por uma linha) e um pulso de dados que viaja até a etapa ativa; à direita as
 * etapas passam com a rolagem e a do meio da tela acende.
 * No celular vira uma lista de cards.
 */
import { onBeforeUnmount, onMounted, ref, type Component } from 'vue'
import { addFx } from '@/lib/motion'

defineProps<{ items: { icon: Component; title: string; desc: string }[] }>()

const list = ref<HTMLElement | null>(null)
const active = ref(0)
const pad = (n: number) => String(n).padStart(2, '0')

let off: (() => void) | null = null
onMounted(() => {
  off = addFx((_y, _dt, vh) => {
    const els = list.value?.children
    if (!els) return
    let n = 0
    for (let i = 0; i < els.length; i++) {
      if ((els[i] as HTMLElement).getBoundingClientRect().top < vh * 0.55) n = i
    }
    active.value = n
  })
})
onBeforeUnmount(() => off?.())
</script>

<template>
  <div class="em-steps" :style="{ '--n': items.length, '--a': active }">
    <aside class="em-steps__aside" aria-hidden="true">
      <div class="em-steps__panel em-card">
        <div class="em-steps__head">
          <span class="em-pill">{{ items[active]?.title }}</span>
          <span class="em-steps__count">({{ pad(active + 1) }}) / {{ pad(items.length) }}</span>
        </div>
        <div class="em-steps__flow">
          <span class="em-steps__rail"><i /></span>
          <span class="em-steps__packet" />
          <div
            v-for="(it, i) in items"
            :key="i"
            class="em-steps__node"
            :class="{ 'is-done': i < active, 'is-now': i === active }"
          >
            <span class="em-ico"><component :is="it.icon" :stroke-width="1.7" /></span>
            <span class="em-steps__label">
              <small>({{ pad(i + 1) }})</small>
              <strong>{{ it.title }}</strong>
            </span>
          </div>
        </div>
      </div>
    </aside>

    <ol ref="list" class="em-steps__list">
      <li
        v-for="(it, i) in items"
        :key="i"
        class="em-steps__step"
        :class="{ 'is-active': i === active }"
      >
        <span class="em-steps__n">({{ pad(i + 1) }})</span>
        <span class="em-ico em-steps__ico"
          ><component :is="it.icon" :stroke-width="1.7" aria-hidden="true"
        /></span>
        <h3>{{ it.title }}</h3>
        <p>{{ it.desc }}</p>
      </li>
    </ol>
  </div>
</template>
