<script setup lang="ts">
/**
 * Arte viva dos cards "Para o paciente" (Benefícios). Só números, ícones e
 * símbolos universais — nenhum texto novo para traduzir.
 * - home:  a casa envia a leitura (pressão) e ela chega confirmada;
 * - clock: mostrador de 24 h com ponteiro, rastro e alertas atendidos;
 * - week:  a semana em casa, com uma única visita presencial;
 * - bond:  paciente e equipe ligados por um fluxo contínuo, com coração batendo.
 * As animações de entrada rodam quando o card ganha `.is-in`.
 */
import { computed } from 'vue'
import { Bell, Check, Gauge, House, Stethoscope, User } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{ kind: 'home' | 'clock' | 'week' | 'bond'; days?: string }>(),
  { days: 'DSTQQSS' },
)

const week = computed(() =>
  props.days
    .split('')
    .slice(0, 7)
    .map((d, i) => ({ d, visit: i === 3 })),
)

/* mostrador: 24 marcas, as de 6 em 6 h mais longas */
const ticks = Array.from({ length: 24 }, (_, i) => {
  const a = (i / 24) * Math.PI * 2
  const r1 = i % 6 === 0 ? 38 : 41
  return {
    x1: 50 + Math.sin(a) * r1,
    y1: 50 - Math.cos(a) * r1,
    x2: 50 + Math.sin(a) * 45,
    y2: 50 - Math.cos(a) * 45,
    major: i % 6 === 0,
  }
})
/** Alertas da madrugada à noite (posições no mostrador de 24 h). */
const alerts = [2.2, 9.5, 19].map((h, i) => {
  const a = (h / 24) * Math.PI * 2
  return { x: 50 + Math.sin(a) * 45, y: 50 - Math.cos(a) * 45, i }
})
</script>

<template>
  <!-- conforto do lar -->
  <div v-if="kind === 'home'" class="em-perk em-perk--home" aria-hidden="true">
    <span class="em-perk__house"><House :stroke-width="1.6" /></span>
    <span class="em-perk__wire"><i /><i /><i /></span>
    <span class="em-perk__reading">
      <small><Gauge :stroke-width="1.8" />mmHg</small>
      <b>118<i>/76</i></b>
      <svg viewBox="0 0 90 22">
        <path pathLength="1" d="M0 15 C10 15 12 8 22 9 S34 17 45 13 S58 5 68 8 S82 12 90 6" />
      </svg>
      <span class="em-perk__ok"><Check :stroke-width="2.6" /></span>
    </span>
  </div>

  <!-- acesso 24/7 -->
  <div v-else-if="kind === 'clock'" class="em-perk em-perk--clock" aria-hidden="true">
    <svg class="em-perk__dial" viewBox="0 0 100 100">
      <circle class="trk" cx="50" cy="50" r="45" />
      <circle class="arc" cx="50" cy="50" r="45" pathLength="1" />
      <line
        v-for="(k, i) in ticks"
        :key="i"
        :class="{ mj: k.major }"
        :x1="k.x1"
        :y1="k.y1"
        :x2="k.x2"
        :y2="k.y2"
      />
      <g class="hand">
        <path class="trail" d="M50 50 L50 8 A42 42 0 0 0 20.3 20.3 Z" />
        <line x1="50" y1="50" x2="50" y2="12" />
      </g>
      <circle class="hub" cx="50" cy="50" r="3.5" />
      <g v-for="a in alerts" :key="a.i" class="alrt" :style="{ '--i': a.i }">
        <circle class="ping" :cx="a.x" :cy="a.y" r="4" />
        <circle :cx="a.x" :cy="a.y" r="3" />
      </g>
    </svg>
    <span class="em-perk__center">24<i>/</i>7</span>
    <span class="em-perk__alerts">
      <span v-for="(tm, i) in ['02:14', '09:31', '19:02']" :key="tm" :style="{ '--i': i }"
        ><Bell :stroke-width="1.8" />{{ tm }}<Check class="ok" :stroke-width="2.6"
      /></span>
    </span>
  </div>

  <!-- mais qualidade de vida -->
  <div v-else-if="kind === 'week'" class="em-perk em-perk--week" aria-hidden="true">
    <span
      v-for="(d, i) in week"
      :key="i"
      class="em-perk__day"
      :class="{ 'is-visit': d.visit }"
      :style="{ '--i': i }"
    >
      <small>{{ d.d }}</small>
      <component :is="d.visit ? Stethoscope : House" :stroke-width="1.7" />
    </span>
    <span class="em-perk__ratio">6<i>/</i>7</span>
  </div>

  <!-- cuidado humanizado -->
  <div v-else class="em-perk em-perk--bond" aria-hidden="true">
    <svg class="em-perk__link" viewBox="0 0 200 70" preserveAspectRatio="none">
      <path class="base" d="M22 50 C60 -6 140 -6 178 50" />
      <path class="flow" d="M22 50 C60 -6 140 -6 178 50" />
    </svg>
    <span class="em-perk__who"><User :stroke-width="1.7" /></span>
    <span class="em-perk__heart">
      <svg viewBox="0 0 24 24">
        <path
          d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"
        />
      </svg>
    </span>
    <span class="em-perk__who em-perk__who--team"><Stethoscope :stroke-width="1.7" /></span>
    <span class="em-perk__typing"><i /><i /><i /></span>
  </div>
</template>
