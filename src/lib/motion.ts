/* ============================================================
   Emmitec.health — movimento (porte em TypeScript do bundle.js do DS)

   - Rolagem suave: roda do mouse e teclado com amortecimento
     exponencial por tempo (igual em 60/120/144 Hz). Toque fica nativo.
   - Âncoras e "voltar ao topo" com ease-in-out proporcional à distância.
   - Reveals por IntersectionObserver ([data-em-reveal] / .is-in).
   - Laço de efeitos amortecidos (parallax, navbar, manifesto…), que só
     roda enquanto houver movimento.
   - prefers-reduced-motion: rolagem nativa e tudo aparece no lugar.
   ============================================================ */
import type { Directive } from 'vue'

export const RM =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
/** Aproxima `a` de `b` com taxa `lambda`/s, independente da taxa de quadros. */
export const damp = (a: number, b: number, lambda: number, dt: number) =>
  lerp(a, b, 1 - Math.exp(-lambda * dt))
const easeInOut = (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2)

function cssNum(name: string, fallback: number) {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name))
  return Number.isNaN(v) ? fallback : v
}

/* ---------------------------------------------------------------
   Rolagem suave (janela)
   --------------------------------------------------------------- */
type Tween = { from: number; to: number; t0: number; dur: number }

let smoothReady = false
let cur = 0
let target = 0
let raf = 0
let last = 0
let tween: Tween | null = null
let locked = false
let lambda = 4.2
let anchorMs = 1600

const maxY = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight)

function loop(now: number) {
  const dt = Math.min(0.05, (now - (last || now)) / 1000)
  last = now
  if (tween) {
    const t = clamp((now - tween.t0) / tween.dur, 0, 1)
    cur = lerp(tween.from, tween.to, easeInOut(t))
    target = cur
    if (t >= 1) tween = null
  } else {
    cur = damp(cur, target, lambda, dt)
  }
  if (!tween && Math.abs(target - cur) < 0.25) {
    cur = target
    window.scrollTo(0, cur)
    raf = 0
    last = 0
    kickFx()
    return
  }
  window.scrollTo(0, cur)
  kickFx()
  raf = requestAnimationFrame(loop)
}

function start() {
  if (!raf) {
    last = 0
    raf = requestAnimationFrame(loop)
  }
}

function sync() {
  if (!raf) cur = target = window.scrollY
}

/** Há um elemento rolável entre o alvo e a página que ainda pode rolar nessa direção? */
function innerCanScroll(node: EventTarget | null, dy: number) {
  let el = node instanceof Element ? node : null
  while (el && el !== document.body && el !== document.documentElement) {
    if (el instanceof HTMLElement) {
      if (el.hasAttribute('data-native-scroll')) return true
      const oy = getComputedStyle(el).overflowY
      if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 1) {
        if (dy > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true
        if (dy < 0 && el.scrollTop > 0) return true
      }
    }
    el = el.parentElement
  }
  return false
}

function push(d: number, e?: Event) {
  if (locked) {
    e?.preventDefault()
    return
  }
  sync()
  tween = null
  const nt = clamp(target + d, 0, maxY())
  if (nt === target) return
  e?.preventDefault()
  target = nt
  start()
}

function onWheel(e: WheelEvent) {
  if (e.ctrlKey) return
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return // gesto horizontal (carrosséis)
  const d = e.deltaY * (e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? window.innerHeight : 1)
  if (innerCanScroll(e.target, d)) return
  push(d, e)
}

function onKey(e: KeyboardEvent) {
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return
  const t = e.target as HTMLElement | null
  const tag = t?.tagName ?? ''
  if (/INPUT|TEXTAREA|SELECT/.test(tag) || t?.isContentEditable) return
  const vh = window.innerHeight
  let d = 0
  switch (e.key) {
    case 'ArrowDown':
      d = 140
      break
    case 'ArrowUp':
      d = -140
      break
    case 'PageDown':
      d = vh * 0.88
      break
    case 'PageUp':
      d = -vh * 0.88
      break
    case ' ':
      if (/BUTTON|^A$/.test(tag)) return
      d = (e.shiftKey ? -1 : 1) * vh * 0.88
      break
    case 'Home':
      d = -1e7
      break
    case 'End':
      d = 1e7
      break
    default:
      return
  }
  if (innerCanScroll(t, d)) return
  push(d, e)
}

export function initSmoothScroll() {
  if (smoothReady || typeof window === 'undefined') return
  smoothReady = true
  lambda = cssNum('--scroll-damping', 4.2)
  anchorMs = cssNum('--scroll-anchor', 1600)
  cur = target = window.scrollY
  if (!RM) {
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
  }
  window.addEventListener(
    'scroll',
    () => {
      if (!raf) cur = target = window.scrollY
      kickFx()
    },
    { passive: true },
  )
  window.addEventListener('resize', kickFx)
}

/** Interrompe a rolagem em curso (ex.: troca de rota). */
export function stopSmoothScroll() {
  if (raf) cancelAnimationFrame(raf)
  raf = 0
  last = 0
  tween = null
  cur = target = window.scrollY
}

/** Trava a rolagem (tela de entrada). */
export function setScrollLocked(v: boolean) {
  locked = v
  document.documentElement.classList.toggle('is-loading', v)
}

/** Trava só a roda/teclado, sem esconder nada (troca de página). */
export function lockWheel(v: boolean) {
  locked = v
}

/** Rola até `y` com ease-in-out; a duração cresce com a distância. */
export function scrollToY(y: number) {
  const to = clamp(y, 0, maxY())
  if (RM || !smoothReady) {
    window.scrollTo(0, to)
    cur = target = to
    return
  }
  sync()
  const dist = Math.abs(to - cur)
  tween = {
    from: cur,
    to,
    t0: performance.now(),
    dur: clamp(anchorMs * (0.55 + dist / 4000), 700, 2200),
  }
  start()
}

export function scrollToEl(el: Element, offset = 12) {
  scrollToY(window.scrollY + el.getBoundingClientRect().top - offset)
}

/* ---------------------------------------------------------------
   Laço de efeitos amortecidos
   Cada efeito devolve `true` enquanto ainda estiver se movendo.
   --------------------------------------------------------------- */
export type FxFn = (y: number, dt: number, vh: number) => boolean | void

const fxs = new Set<FxFn>()
let fxRaf = 0
let fxLast = 0
let fxPaused = false

function fx(now: number) {
  if (fxPaused) {
    fxRaf = 0
    fxLast = 0
    return
  }
  const dt = Math.min(0.05, (now - (fxLast || now)) / 1000)
  fxLast = now
  const y = window.scrollY
  const vh = window.innerHeight
  let moving = false
  fxs.forEach((f) => {
    if (f(y, dt, vh)) moving = true
  })
  if (moving) fxRaf = requestAnimationFrame(fx)
  else {
    fxRaf = 0
    fxLast = 0
  }
}

export function kickFx() {
  if (!fxRaf && !fxPaused && typeof window !== 'undefined') fxRaf = requestAnimationFrame(fx)
}

/** Congela os efeitos de rolagem (a página que sai não reage ao reset do scroll). */
export function pauseFx(v: boolean) {
  fxPaused = v
  if (!v) kickFx()
}

/** Registra um efeito ligado à rolagem; devolve a função que o remove. */
export function addFx(f: FxFn) {
  fxs.add(f)
  kickFx()
  return () => {
    fxs.delete(f)
  }
}

/* ---------------------------------------------------------------
   Reveals: .is-in quando o elemento aparece. O que está dentro do
   hero espera a tela de entrada terminar (releaseHero).
   --------------------------------------------------------------- */
const seen = new WeakSet<Element>()
const heroQueue = new Set<Element>()
let heroReleased = false
let io: IntersectionObserver | null = null

function markIn(el: Element) {
  seen.add(el)
  el.classList.add('is-in')
}

function getIO() {
  if (!io && typeof IntersectionObserver === 'function') {
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            markIn(e.target)
            io?.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.08 },
    )
  }
  return io
}

const nextFrame = (fn: () => void) => requestAnimationFrame(() => requestAnimationFrame(fn))

/* Durante a troca de página o hero novo só entra quando a página já chegou. */
let heroHoldUntil = 0
export function holdHero(ms: number) {
  heroHoldUntil = performance.now() + ms
}

export function watchIn(el: Element) {
  if (RM) {
    markIn(el)
    return
  }
  if (el.closest('.em-hero')) {
    if (heroReleased) {
      const wait = heroHoldUntil - performance.now()
      if (wait > 0) window.setTimeout(() => nextFrame(() => markIn(el)), wait)
      else nextFrame(() => markIn(el))
    } else heroQueue.add(el)
    return
  }
  const o = getIO()
  if (o) o.observe(el)
  else markIn(el)
}

export function unwatchIn(el: Element) {
  io?.unobserve(el)
  heroQueue.delete(el)
}

/** Libera as entradas do hero (chamado quando a tela de entrada sobe). */
export function releaseHero() {
  if (heroReleased) return
  heroReleased = true
  heroQueue.forEach((el) => markIn(el))
  heroQueue.clear()
}

/* Se o Vue reescrever a classe do elemento, o estado .is-in volta. */
function keepIn(el: Element) {
  if (seen.has(el) && !el.classList.contains('is-in')) el.classList.add('is-in')
}

/* ---------------------------------------------------------------
   Diretivas
   --------------------------------------------------------------- */

/** v-reveal="atraso(ms)"  |  v-reveal:scale="atraso" — fade + subida + desfoque. */
export const vReveal: Directive<HTMLElement, number | undefined> = {
  beforeMount(el, b) {
    el.setAttribute('data-em-reveal', b.arg === 'scale' ? 'scale' : '')
    if (b.value != null) el.style.setProperty('--d', `${b.value}ms`)
  },
  mounted(el) {
    watchIn(el)
  },
  updated(el) {
    keepIn(el)
  },
  unmounted(el) {
    unwatchIn(el)
  },
}

/** v-in — só marca .is-in ao aparecer (odômetros, medidores, arte). */
export const vIn: Directive<HTMLElement, number | undefined> = {
  beforeMount(el, b) {
    if (b.value != null) el.style.setProperty('--d', `${b.value}ms`)
  },
  mounted(el) {
    watchIn(el)
  },
  updated(el) {
    keepIn(el)
  },
  unmounted(el) {
    unwatchIn(el)
  },
}

/** v-spot — luz ciano que segue o cursor (.em-spot). */
type SpotEl = HTMLElement & { __emSpot?: (e: PointerEvent) => void }
export const vSpot: Directive<SpotEl> = {
  mounted(el) {
    el.classList.add('em-spot')
    el.__emSpot = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${(e.clientX - r.left).toFixed(0)}px`)
      el.style.setProperty('--my', `${(e.clientY - r.top).toFixed(0)}px`)
    }
    el.addEventListener('pointermove', el.__emSpot)
  },
  updated(el) {
    el.classList.add('em-spot')
  },
  unmounted(el) {
    if (el.__emSpot) el.removeEventListener('pointermove', el.__emSpot)
  },
}

/** v-parallax="0.18" — desloca com a rolagem, amortecido. Modificador .fade apaga ao sair. */
type ParaEl = HTMLElement & { __emFx?: () => void }
export const vParallax: Directive<ParaEl, number> = {
  mounted(el, b) {
    if (RM) return
    const k = b.value ?? 0.15
    const fade = !!b.modifiers.fade
    // começa no primeiro quadro do laço (numa troca de página o scroll ainda vai zerar)
    let y = Number.NaN
    el.__emFx = addFx((sy, dt, vh) => {
      const goal = sy * k
      y = Number.isNaN(y) ? goal : damp(y, goal, 10, dt)
      el.style.transform = `translate3d(0,${y.toFixed(2)}px,0)`
      if (fade) el.style.opacity = clamp(1 - sy / (vh * 0.85), 0, 1).toFixed(3)
      return Math.abs(y - goal) > 0.1
    })
  },
  unmounted(el) {
    el.__emFx?.()
  },
}

/**
 * v-scrub="0.9" — escreve `--p` (0 → 1, amortecido) enquanto o elemento entra na tela.
 * O CSS usa `--p` para abrir fotos, escalar imagens etc. O valor é a fração da
 * altura da tela percorrida até chegar a 1.
 */
type ScrubEl = HTMLElement & { __emScrub?: () => void }
export const vScrub: Directive<ScrubEl, number | undefined> = {
  mounted(el, b) {
    if (RM) {
      el.style.setProperty('--p', '1')
      return
    }
    const range = b.value ?? 0.9
    let p = -1
    el.__emScrub = addFx((_y, dt, vh) => {
      const r = el.getBoundingClientRect()
      const goal = clamp((vh - r.top) / (vh * range), 0, 1)
      p = p < 0 ? goal : damp(p, goal, 8, dt)
      el.style.setProperty('--p', p.toFixed(4))
      return Math.abs(p - goal) > 0.001
    })
  },
  unmounted(el) {
    el.__emScrub?.()
  },
}

/** Plugin: registra as diretivas globalmente. */
export const EmMotion = {
  install(app: import('vue').App) {
    app.directive('reveal', vReveal)
    app.directive('in', vIn)
    app.directive('spot', vSpot)
    app.directive('parallax', vParallax)
    app.directive('scrub', vScrub)
  },
}

declare module 'vue' {
  interface GlobalDirectives {
    vReveal: typeof vReveal
    vIn: typeof vIn
    vSpot: typeof vSpot
    vParallax: typeof vParallax
    vScrub: typeof vScrub
  }
}
