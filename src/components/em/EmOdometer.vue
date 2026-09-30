<script setup lang="ts">
/**
 * Número que rola como odômetro: cada dígito é uma coluna 0–9 (duas voltas)
 * que gira até o valor quando um ancestral recebe `.is-in`.
 */
import { computed } from 'vue'

const props = defineProps<{ value: string | number }>()

const chars = computed(() => {
  let k = 0
  return String(props.value)
    .split('')
    .map((c) =>
      /\d/.test(c) ? { c, digit: true, n: Number(c), k: k++ } : { c, digit: false, n: 0, k: 0 },
    )
})
</script>

<template>
  <span class="em-odo" role="img" :aria-label="String(value)">
    <template v-for="(ch, i) in chars" :key="i">
      <span v-if="ch.digit" class="em-odo__d" aria-hidden="true">
        <span class="em-odo__s" :style="{ '--to': 10 + ch.n, '--k': ch.k }">
          <span v-for="n in 20" :key="n">{{ (n - 1) % 10 }}</span>
        </span>
      </span>
      <span v-else class="em-odo__d em-odo__sep" aria-hidden="true">{{ ch.c }}</span>
    </template>
  </span>
</template>
