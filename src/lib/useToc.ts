/* ============================================================
   Sumário que acompanha a leitura: marca o intertítulo atual e
   escreve o progresso (0→1) em --p no elemento do sumário.
   ============================================================ */
import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { addFx, scrollToEl } from './motion'

export function useToc(
  content: Ref<HTMLElement | null>,
  toc: Ref<HTMLElement | null>,
  selector = 'h3[id]',
) {
  const active = ref(0)
  let off: (() => void) | null = null

  onMounted(() => {
    off = addFx((_y, _dt, vh) => {
      const el = content.value
      if (!el) return
      const line = vh * 0.3
      const r = el.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, (line - r.top) / Math.max(1, r.height - vh * 0.4)))
      toc.value?.style.setProperty('--p', p.toFixed(4))
      let a = 0
      el.querySelectorAll<HTMLElement>(selector).forEach((h, i) => {
        if (h.getBoundingClientRect().top < line) a = i
      })
      if (a !== active.value) active.value = a
    })
  })
  onBeforeUnmount(() => off?.())

  /** Rola até o intertítulo (desconta o menu fixo). */
  function goTo(id: string) {
    const el = document.getElementById(id)
    if (el) scrollToEl(el, 110)
  }

  return { active, goTo }
}
