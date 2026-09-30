/* ============================================================
   Emmitec.health — troca de página em dois tempos
   1) a página atual sobe e sai da tela, seguida de uma cortina
      clara (com os cantos de cima arredondados que se abrem);
   2) logo depois a página nova sobe por baixo, por cima da
      cortina, e toma o lugar. Mesma curva suave nas duas etapas.

   Uso (App.vue):
   <div class="em-curtain" />   ← a cortina clara
   <RouterView v-slot="{ Component, route }">
     <Transition :css="false" v-bind="pageTransition">
       <div :key="route.path" class="em-view">…</div>
     </Transition>
   </RouterView>
   ============================================================ */
import { RM, holdHero, lockWheel, pauseFx } from './motion'

/** Duração da saída (página atual + cortina). */
const LEAVE = 780
/** A página nova começa a subir um pouco antes de a cortina terminar. */
const DELAY = 660
/** Duração da entrada da página nova. */
const ENTER = 900
const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)'

type ViewEl = HTMLElement & { __emAnim?: Animation }

const canAnimate = (el: Element): el is ViewEl =>
  !RM && typeof (el as HTMLElement).animate === 'function'

/** Páginas entrando agora (cliques rápidos podem sobrepor trocas). */
let entering = 0

/* ---------- depois que a página nova assenta ---------- */
let queued: (() => void)[] = []

/**
 * Roda `cb` quando a troca de página terminar (ou já, se não houver troca em curso).
 * Útil para rolar até uma seção logo ao chegar (ex.: /blog?category=cases).
 */
export function afterPageEnter(cb: () => void) {
  // o onMounted da página roda antes do onEnter: espera um quadro para saber se há troca
  requestAnimationFrame(() => {
    if (entering > 0) queued.push(cb)
    else cb()
  })
}

/* ---------- cortina clara ---------- */
let curtainAnim: Animation | null = null

function curtainIn() {
  const c = document.querySelector<HTMLElement>('.em-curtain')
  if (!c) return
  // já cobrindo a tela (clique durante a troca): continua onde está
  if (c.classList.contains('is-on')) return
  c.classList.add('is-on')
  curtainAnim = c.animate(
    [
      { transform: 'translate3d(0,100%,0)', borderRadius: '48px 48px 0 0' },
      { transform: 'translate3d(0,0,0)', borderRadius: '0px 0px 0 0' },
    ],
    { duration: LEAVE, easing: EASE, fill: 'forwards' },
  )
}

function curtainOut() {
  const c = document.querySelector<HTMLElement>('.em-curtain')
  curtainAnim?.cancel()
  curtainAnim = null
  c?.classList.remove('is-on')
}

/* ---------- página nova ---------- */
function onBeforeEnter(el: Element) {
  if (!canAnimate(el)) return
  // nasce fora da tela, sem piscar no lugar final
  el.style.transform = 'translate3d(0,100vh,0)'
}

function onEnter(el: Element, done: () => void) {
  if (!canAnimate(el)) {
    curtainOut()
    done()
    return
  }
  entering++
  holdHero(DELAY + ENTER * 0.5)
  pauseFx(true)
  lockWheel(true)
  el.classList.add('is-entering')
  const anim = el.animate(
    [
      { transform: 'translate3d(0,100vh,0)', clipPath: 'inset(0 0 0 0 round 48px 48px 0 0)' },
      { transform: 'translate3d(0,0,0)', clipPath: 'inset(0 0 0 0 round 0px 0px 0 0)' },
    ],
    { duration: ENTER, delay: DELAY, easing: EASE, fill: 'backwards' },
  )
  el.__emAnim = anim
  let ended = false
  const finish = () => {
    if (ended) return
    ended = true
    el.style.transform = ''
    el.classList.remove('is-entering')
    el.__emAnim = undefined
    entering = Math.max(0, entering - 1)
    if (entering === 0) {
      curtainOut()
      lockWheel(false)
      pauseFx(false)
      // bibliotecas que medem na montagem (ex.: ScrollTrigger) recalculam sem o deslocamento
      window.dispatchEvent(new Event('resize'))
      const cbs = queued
      queued = []
      cbs.forEach((cb) => cb())
    }
    done()
  }
  anim.onfinish = finish
  anim.oncancel = finish
}

/* ---------- página atual ---------- */
function onLeave(el: Element, done: () => void) {
  if (!canAnimate(el)) {
    done()
    return
  }
  // se ainda estava entrando (clique durante a troca), sai de onde está
  let fromY = 0
  if (el.__emAnim) {
    const tf = getComputedStyle(el).transform
    fromY = tf && tf !== 'none' ? new DOMMatrixReadOnly(tf).m42 : 0
    el.__emAnim.cancel()
  }
  const y = window.scrollY
  // congela a página onde ela está: sai do fluxo e não acompanha o scroll que vai zerar
  Object.assign(el.style, {
    position: 'fixed',
    top: `${-y}px`,
    left: '0',
    width: '100%',
    zIndex: '1',
    pointerEvents: 'none',
  })
  el.classList.add('is-leaving')
  curtainIn()
  const anim = el.animate(
    [{ transform: `translate3d(0,${fromY}px,0)` }, { transform: 'translate3d(0,-100vh,0)' }],
    { duration: LEAVE, easing: EASE, fill: 'forwards' },
  )
  anim.onfinish = () => done()
  anim.oncancel = () => done()
}

export const pageTransition = { onBeforeEnter, onEnter, onLeave }
