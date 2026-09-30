<script setup lang="ts">
/**
 * Título que entra palavra a palavra (65ms entre elas).
 * `em` = trecho do texto que vai em Instrument Serif itálico (ciano-700).
 * O texto vem do i18n, então a divisão é feita na renderização (troca de idioma funciona).
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{ text: string; em?: string; tag?: string; delay?: number }>(),
  { em: '', tag: 'h2', delay: 0 },
)

type Token = { w: string; serif: boolean; space: boolean; i: number }

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const tokens = computed<Token[]>(() => {
  const text = props.text ?? ''
  const segs: { s: string; serif: boolean }[] = []
  const em = props.em?.trim()
  let m: RegExpExecArray | null = null
  if (em) {
    // casa o trecho inteiro, sem cortar palavras ao meio
    m = new RegExp(`(^|[^\\p{L}])(${escapeRe(em)})(?![\\p{L}])`, 'iu').exec(text)
  }
  if (m) {
    const start = m.index + (m[1]?.length ?? 0)
    const end = start + (m[2]?.length ?? 0)
    segs.push({ s: text.slice(0, start), serif: false })
    segs.push({ s: text.slice(start, end), serif: true })
    segs.push({ s: text.slice(end), serif: false })
  } else segs.push({ s: text, serif: false })

  const out: Token[] = []
  let i = 0
  segs.forEach((seg) => {
    seg.s.split(/(\s+)/).forEach((p) => {
      if (!p) return
      if (/^\s+$/.test(p)) out.push({ w: ' ', serif: false, space: true, i: -1 })
      else out.push({ w: p, serif: seg.serif, space: false, i: i++ })
    })
  })
  return out
})
</script>

<template>
  <component :is="tag" v-in class="em-split" :style="delay ? { '--d': `${delay}ms` } : undefined">
    <template v-for="(tk, k) in tokens" :key="k">
      <template v-if="tk.space">{{ ' ' }}</template>
      <span v-else class="em-w" :class="{ 'em-serif': tk.serif }" :style="{ '--i': tk.i }"
        ><span>{{ tk.w }}</span></span
      >
    </template>
  </component>
</template>
