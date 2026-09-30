<script setup lang="ts">
/**
 * Botão do DS: pílula com rótulo que rola e seta que atravessa o círculo.
 * `to` → RouterLink · `href` → <a> (externo abre em nova aba) · senão <button>.
 */
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = withDefaults(
  defineProps<{
    label: string
    to?: string
    href?: string
    variant?: 'primary' | 'dark' | 'ghost'
    size?: 'md' | 'sm'
    block?: boolean
    type?: 'button' | 'submit'
  }>(),
  { variant: 'primary', size: 'md', block: false, type: 'button', to: undefined, href: undefined },
)

const cls = computed(() => [
  'em-btn',
  props.variant !== 'primary' && `em-btn--${props.variant}`,
  props.size === 'sm' && 'em-btn--sm',
  props.block && 'em-btn--block',
])

const external = computed(() => !!props.href && /^https?:\/\//.test(props.href))

const tag = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'button'))
const attrs = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href)
    return external.value
      ? { href: props.href, target: '_blank', rel: 'noopener noreferrer' }
      : { href: props.href }
  return { type: props.type }
})
</script>

<template>
  <component :is="tag" v-bind="attrs" :class="cls">
    <span class="em-btn__label">
      <span>{{ label }}</span>
      <span aria-hidden="true">{{ label }}</span>
    </span>
    <span class="em-btn__icon" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </span>
  </component>
</template>
