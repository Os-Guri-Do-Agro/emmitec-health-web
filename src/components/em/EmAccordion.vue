<script setup lang="ts">
/**
 * Acordeão do DS: número, ícone, título grande e o "+" que gira. Abre um por vez
 * (a altura anima com grid-template-rows, sem medir nada em JS).
 */
import { ref, type Component } from 'vue'

const props = withDefaults(
  defineProps<{
    items: { title: string; body: string; icon?: Component }[]
    faq?: boolean
    initial?: number
  }>(),
  { faq: false, initial: 0 },
)

const open = ref(props.initial)
const uid = Math.random().toString(36).slice(2, 8)

function toggle(i: number) {
  open.value = open.value === i ? -1 : i
}
</script>

<template>
  <div class="em-acc" :class="{ 'em-acc--faq': faq }">
    <div v-for="(it, i) in items" :key="i" class="em-acc__item" :class="{ 'is-open': open === i }">
      <button
        :id="`acc-${uid}-b${i}`"
        type="button"
        class="em-acc__btn"
        :aria-expanded="open === i ? 'true' : 'false'"
        :aria-controls="`acc-${uid}-p${i}`"
        @click="toggle(i)"
      >
        <span v-if="!faq" class="em-acc__n">({{ String(i + 1).padStart(2, '0') }})</span>
        <span v-if="!faq && it.icon" class="em-ico"
          ><component :is="it.icon" :stroke-width="1.7" aria-hidden="true"
        /></span>
        <span class="em-acc__t">{{ it.title }}</span>
        <span class="em-acc__ic" aria-hidden="true" />
      </button>
      <div
        :id="`acc-${uid}-p${i}`"
        class="em-acc__panel"
        role="region"
        :aria-labelledby="`acc-${uid}-b${i}`"
      >
        <div>
          <div class="em-acc__body em-acc__body--single">
            <p>{{ it.body }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
