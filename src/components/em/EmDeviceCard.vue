<script setup lang="ts">
/** Card de dispositivo: tela com leitura e sinal, nome, resumo e conectividade. */
import { Bluetooth, Nfc, Wifi } from 'lucide-vue-next'
import type { Device } from '@/lib/equipment'
import EmDeviceScreen from './EmDeviceScreen.vue'

defineProps<{ device: Device }>()

const connIcon = (c: string) => (c === 'Wi-Fi' ? Wifi : c === 'NFC' ? Nfc : Bluetooth)
</script>

<template>
  <RouterLink :to="`/equipment/${device.id}`" class="em-device em-card em-card--lift">
    <EmDeviceScreen :device="device" />
    <div class="em-device__body">
      <small class="em-device__cat">{{ device.catLabel }}</small>
      <h3>{{ device.name }}</h3>
      <p>{{ device.desc }}</p>
      <div class="em-device__foot">
        <span class="em-device__conn">
          <span v-for="c in device.connectivity" :key="c" class="em-conn"
            ><component :is="connIcon(c)" :stroke-width="1.8" aria-hidden="true" />{{ c }}</span
          >
        </span>
        <span class="em-corner" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M7 17L17 7M8 7h9v9" />
          </svg>
        </span>
      </div>
    </div>
  </RouterLink>
</template>
