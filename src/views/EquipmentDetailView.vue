<script setup lang="ts">
/**
 * Página do dispositivo — Design System Emmitec.health.
 * Hero com o gradiente vivo, recursos em cards, a descrição completa e um
 * painel lateral fixo com a tela do dispositivo, conectividade e certificações.
 */
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Bluetooth, Check, Nfc, Search, Share2, ShieldCheck, Wifi, X } from 'lucide-vue-next'

import EmPageHero from '@/components/em/EmPageHero.vue'
import EmButton from '@/components/em/EmButton.vue'
import EmSplit from '@/components/em/EmSplit.vue'
import EmDeviceScreen from '@/components/em/EmDeviceScreen.vue'
import EmDeviceCard from '@/components/em/EmDeviceCard.vue'
import { calendlyUrl } from '@/lib/site'
import { useDevices } from '@/lib/equipment'

const { t } = useI18n()
const route = useRoute()
const { devices } = useDevices()

const pad = (n: number) => String(n).padStart(2, '0')
const connIcon = (c: string) => (c === 'Wi-Fi' ? Wifi : c === 'NFC' ? Nfc : Bluetooth)

/** Dispositivo da rota (sem correspondência, o primeiro — como no site original). */
const device = computed(
  () => devices.value.find((d) => d.id === Number(route.params.id)) ?? devices.value[0]!,
)

/* ── outros equipamentos, com busca ── */
const searchQuery = ref('')
const related = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const others = devices.value.filter((d) => d.id !== device.value.id)
  const list = q
    ? others.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.desc.toLowerCase().includes(q) ||
          d.catLabel.toLowerCase().includes(q),
      )
    : [
        ...others.filter((d) => d.cat === device.value.cat),
        ...others.filter((d) => d.cat !== device.value.cat),
      ]
  return list.slice(0, 4)
})

/* ── compartilhar ── */
const copied = ref(false)
let copiedT = 0
async function share() {
  const url = window.location.href
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: device.value.name, url })
    } catch {
      // cancelado pelo usuário
    }
    return
  }
  try {
    await navigator.clipboard.writeText(url)
    copied.value = true
    window.clearTimeout(copiedT)
    copiedT = window.setTimeout(() => (copied.value = false), 2200)
  } catch {
    // sem permissão de área de transferência
  }
}
</script>

<template>
  <div class="em-device-page">
    <!-- ════════ HERO ════════ -->
    <EmPageHero
      class="em-hero--article"
      :eyebrow="device.catLabel"
      :trail="[{ label: t('header.nav.equipment'), to: '/equipment' }]"
      :title="device.name"
      :subtitle="device.desc"
    >
      <template #lead>
        <ul class="em-hero__specs">
          <li v-for="c in device.connectivity" :key="c">
            <component :is="connIcon(c)" :stroke-width="1.8" aria-hidden="true" />{{ c }}
          </li>
          <li v-for="c in device.certifications" :key="c">
            <ShieldCheck :stroke-width="1.8" aria-hidden="true" />{{ c }}
          </li>
        </ul>
      </template>
      <template #visual>
        <div class="em-devhero em-card">
          <EmDeviceScreen :device="device" size="lg" />
        </div>
      </template>
      <template #actions>
        <EmButton
          to="/equipment"
          variant="ghost"
          :label="t('equipmentPage.detail.viewAllEquipment')"
        />
        <EmButton :href="calendlyUrl" :label="t('equipmentPage.cta.button.primary')" />
      </template>
    </EmPageHero>

    <!-- ════════ DISPOSITIVO ════════ -->
    <section class="em-section em-product">
      <div class="em-wrap em-product__grid">
        <div class="em-product__main">
          <span v-reveal class="em-eyebrow">{{ t('equipmentPage.detail.features') }}</span>
          <ul class="em-product__feats">
            <li v-for="(f, i) in device.features" :key="f" v-reveal="i * 80" v-spot class="em-card">
              <span class="em-ico em-ico--brand"
                ><Check :stroke-width="2" aria-hidden="true"
              /></span>
              <small>{{ pad(i + 1) }}</small>
              <b>{{ f }}</b>
            </li>
          </ul>

          <div class="em-product__about">
            <span v-reveal class="em-eyebrow">{{ t('equipmentPage.detail.allFeatures') }}</span>
            <EmSplit
              class="em-h2"
              :text="t('equipmentPage.detail.about')"
              :em="t('equipmentPage.detail.aboutEm')"
            />
            <!-- eslint-disable-next-line vue/no-v-html -- conteúdo fixo do próprio site -->
            <article v-reveal class="em-prose em-prose--plain" v-html="device.content" />
          </div>
        </div>

        <aside class="em-product__aside">
          <div v-reveal:scale class="em-product__panel em-card">
            <EmDeviceScreen :device="device" size="lg" />
            <dl class="em-product__specs">
              <div>
                <dt>{{ t('equipmentPage.categories.badge') }}</dt>
                <dd>{{ device.catLabel }}</dd>
              </div>
              <div>
                <dt>{{ t('equipmentPage.compatibility.badge') }}</dt>
                <dd>
                  <span v-for="c in device.connectivity" :key="c" class="em-conn"
                    ><component :is="connIcon(c)" :stroke-width="1.8" aria-hidden="true" />{{
                      c
                    }}</span
                  >
                </dd>
              </div>
              <div>
                <dt>{{ t('equipmentPage.cert.badge') }}</dt>
                <dd>
                  <span v-for="c in device.certifications" :key="c" class="em-chip">{{ c }}</span>
                </dd>
              </div>
            </dl>
          </div>

          <div v-reveal="120" class="em-product__cta em-card">
            <EmSplit
              tag="h3"
              :text="t('equipmentPage.detail.ctaTitle')"
              :em="t('equipmentPage.detail.ctaTitleEm')"
            />
            <p>{{ t('equipmentPage.detail.ctaDesc') }}</p>
            <EmButton
              :href="calendlyUrl"
              variant="dark"
              block
              :label="t('equipmentPage.detail.contactButton')"
            />
            <button type="button" class="em-share" @click="share">
              <Share2 :stroke-width="1.7" aria-hidden="true" />
              <span aria-live="polite">{{
                copied ? t('blogPage.detail.copied') : t('equipmentPage.detail.share')
              }}</span>
            </button>
          </div>
        </aside>
      </div>
    </section>

    <!-- ════════ OUTROS EQUIPAMENTOS ════════ -->
    <section id="outros" class="em-section em-section--tint">
      <div class="em-wrap">
        <div class="em-head">
          <div>
            <span v-reveal class="em-eyebrow">{{ t('equipmentPage.detail.relatedBadge') }}</span>
            <EmSplit
              :text="t('equipmentPage.detail.relatedTitle')"
              :em="t('equipmentPage.detail.relatedTitleEm')"
            />
          </div>
          <div v-reveal="150" class="em-head__side em-head__side--wide">
            <label class="em-search">
              <Search :stroke-width="1.8" aria-hidden="true" />
              <span class="sr-only">{{ t('equipmentPage.detail.searchPlaceholder') }}</span>
              <input
                v-model="searchQuery"
                type="search"
                autocomplete="off"
                :placeholder="t('equipmentPage.detail.searchPlaceholder')"
              />
              <button
                v-if="searchQuery"
                type="button"
                class="em-search__clear"
                :aria-label="t('blogPage.articles.clear')"
                @click="searchQuery = ''"
              >
                <X :stroke-width="2" aria-hidden="true" />
              </button>
            </label>
          </div>
        </div>

        <div v-if="related.length" class="em-devices">
          <EmDeviceCard
            v-for="(d, i) in related"
            :key="d.id"
            v-reveal="i * 80"
            v-spot
            :device="d"
          />
        </div>
        <div v-else class="em-empty em-card">
          <span class="em-ico" aria-hidden="true"><Search :stroke-width="1.7" /></span>
          <p>{{ t('equipmentPage.detail.empty') }}</p>
        </div>

        <div v-reveal class="em-center">
          <EmButton
            to="/equipment"
            variant="ghost"
            :label="t('equipmentPage.detail.viewAllEquipment')"
          />
        </div>
      </div>
    </section>
  </div>
</template>
