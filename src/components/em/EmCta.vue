<script setup lang="ts">
/**
 * Card de "próximo passo" que fecha as páginas, antes do rodapé.
 * O slot padrão substitui os botões (ex.: o formulário da newsletter no Blog).
 */
import EmButton from './EmButton.vue'
import EmSplit from './EmSplit.vue'

type Action = { label: string; to?: string; href?: string }

withDefaults(
  defineProps<{
    badge: string
    title: string
    em?: string
    subtitle?: string
    note?: string
    primary?: Action
    secondary?: Action
    trust?: string[]
    id?: string
  }>(),
  {
    em: '',
    subtitle: '',
    note: '',
    primary: undefined,
    secondary: undefined,
    trust: () => [],
    id: 'contato',
  },
)

/** Rótulos que já trazem "→" ganham a seta do próprio botão. */
const clean = (s: string) => s.replace(/\s*[→›»]+\s*$/, '')
</script>

<template>
  <section :id="id" class="em-section em-section--cta">
    <div class="em-wrap">
      <div v-reveal:scale v-spot class="em-cta em-card">
        <div class="em-cta__glow" aria-hidden="true" />
        <div class="em-cta__inner">
          <span class="em-eyebrow">{{ badge }}</span>
          <EmSplit :text="title" :em="em" />
          <p v-if="subtitle" class="em-cta__lead">{{ subtitle }}</p>
          <slot v-if="$slots.default" />
          <div v-else-if="primary" class="em-row">
            <EmButton
              :to="primary.to"
              :href="primary.href"
              variant="dark"
              :label="clean(primary.label)"
            />
            <EmButton
              v-if="secondary"
              :to="secondary.to"
              :href="secondary.href"
              variant="ghost"
              :label="clean(secondary.label)"
            />
          </div>
          <p v-if="note" class="em-cta__note">{{ note }}</p>
        </div>
        <ul v-if="trust.length" class="em-cta__trust">
          <li v-for="item in trust" :key="item" class="em-chip em-chip--glass">
            <span class="em-dot" />{{ item }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
