<script setup lang="ts">
/**
 * Dois celulares do hero de Aplicativos, vivos:
 * - entram em sequência (o de trás pela esquerda, o da frente pela direita);
 * - flutuam em ritmos diferentes e reagem ao cursor em profundidade (3D leve);
 * - com a rolagem, o da frente sobe mais rápido e se endireita, o de trás se
 *   afasta, e os selos flutuantes saem na frente (camadas de profundidade);
 * - nas telas: notificação de leitura que desce do topo, toques percorrendo o
 *   menu e ondas saindo do botão "Escaneando".
 * Com movimento reduzido fica tudo parado, só com a composição.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Bluetooth, Check, HeartPulse } from 'lucide-vue-next'
import { RM, addFx, clamp, damp, kickFx } from '@/lib/motion'
import phoneMenuImg from '@/assets/apps/tela-01.jpeg'
import phoneScanImg from '@/assets/apps/tela-02.jpeg'
import appIcon from '@/assets/apps/app-icon.png'

const { t } = useI18n()

const root = ref<HTMLElement | null>(null)
const bpm = ref(78)

/** Toques no menu: Minha saúde → Sincronizar dados → Acessórios (posições na captura). */
const taps = [
  { x: 49.8, y: 42 },
  { x: 49.8, y: 57.5 },
  { x: 83.4, y: 57.5 },
]

let off: (() => void) | null = null
let timer = 0
let p = 0
let mx = 0
let my = 0
let tmx = 0
let tmy = 0

function onPointer(e: PointerEvent) {
  if (e.pointerType === 'touch') return
  tmx = (e.clientX / window.innerWidth - 0.5) * 2
  tmy = (e.clientY / window.innerHeight - 0.5) * 2
  kickFx()
}

onMounted(() => {
  if (RM) return
  const el = root.value
  if (!el) return
  off = addFx((y, dt, vh) => {
    const goal = clamp(y / (vh * 0.85), 0, 1)
    p = damp(p, goal, 7, dt)
    mx = damp(mx, tmx, 4, dt)
    my = damp(my, tmy, 4, dt)
    el.style.setProperty('--p', p.toFixed(4))
    el.style.setProperty('--mx', mx.toFixed(4))
    el.style.setProperty('--my', my.toFixed(4))
    return Math.abs(p - goal) > 0.0005 || Math.abs(mx - tmx) > 0.001 || Math.abs(my - tmy) > 0.001
  })
  window.addEventListener('pointermove', onPointer, { passive: true })
  // batimento do selo varia de leve
  timer = window.setInterval(() => {
    if (p < 0.95) bpm.value = 74 + Math.round(Math.random() * 8)
  }, 1600)
})
onBeforeUnmount(() => {
  off?.()
  window.clearInterval(timer)
  window.removeEventListener('pointermove', onPointer)
})
</script>

<template>
  <div ref="root" class="em-phones3" aria-hidden="true">
    <span class="em-phones3__floor" />

    <!-- celular de trás: escaneando -->
    <div class="em-phone3 em-phone3--back">
      <div class="em-phone3__body">
        <span class="em-phone3__btn em-phone3__btn--l1" />
        <span class="em-phone3__btn em-phone3__btn--l2" />
        <span class="em-phone3__btn em-phone3__btn--r" />
        <div class="em-phone3__screen">
          <img :src="phoneScanImg" alt="" width="739" height="1600" />
          <span class="em-phone3__scan"><i /><i /><i /></span>
          <span class="em-phone3__island" />
          <span class="em-phone3__glare" />
        </div>
      </div>
    </div>

    <!-- celular da frente: menu -->
    <div class="em-phone3 em-phone3--front">
      <div class="em-phone3__body">
        <span class="em-phone3__btn em-phone3__btn--l1" />
        <span class="em-phone3__btn em-phone3__btn--l2" />
        <span class="em-phone3__btn em-phone3__btn--r" />
        <div class="em-phone3__screen">
          <img :src="phoneMenuImg" alt="" width="739" height="1600" />
          <span
            v-for="(tp, i) in taps"
            :key="i"
            class="em-phone3__tap"
            :style="{ left: `${tp.x}%`, top: `${tp.y}%`, '--i': i }"
          />
          <span class="em-phone3__notif">
            <span class="em-phone3__appico"
              ><img :src="appIcon" alt="" width="96" height="96"
            /></span>
            <span class="em-phone3__notif-txt">
              <b>Emmitec Health</b>
              <small>{{ t('hero.live.patient') }}</small>
            </span>
          </span>
          <span class="em-phone3__island" />
          <span class="em-phone3__glare" />
        </div>
      </div>
    </div>

    <!-- selos flutuantes (camada mais próxima) -->
    <span class="em-phones3__chip em-phones3__chip--hr">
      <span class="em-phones3__ico"><HeartPulse :stroke-width="1.8" /></span>
      <b>{{ bpm }}</b
      ><small>bpm</small>
      <svg class="em-phones3__ecg" viewBox="0 0 60 20">
        <path d="M0 12h14l4-8 5 14 4-10 3 4h30" pathLength="1" />
      </svg>
    </span>
    <span class="em-phones3__chip em-phones3__chip--sync">
      <span class="em-phones3__ico em-phones3__ico--dark"><Bluetooth :stroke-width="1.8" /></span>
      <span class="em-phones3__dots"><i /><i /><i /></span>
      <span class="em-phones3__ok"><Check :stroke-width="2.6" /></span>
    </span>
  </div>
</template>
