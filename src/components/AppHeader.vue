<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { ChevronDown, Menu, X, CalendarClock } from 'lucide-vue-next'
import 'flag-icons/css/flag-icons.min.css'
import { LOCALE_STORAGE_KEY } from '@/i18n'

const { locale, t } = useI18n()
const route = useRoute()

const navScrolled = ref(false)
const mobileMenuOpen = ref(false)
const sobreDropdownOpen = ref(false)
const langDropdownOpen = ref(false)
const headerRef = ref<HTMLElement | null>(null)

const calendlyUrl = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `https://calendly.com/emilio-machado-emmitec-health/vamos-nos-reunir-agende-sua-reuniao-online?month=${year}-${month}`
})

const languages = [
  { code: 'pt', label: 'PT', flagClass: 'fi-br' },
  { code: 'en', label: 'EN', flagClass: 'fi-gb' },
  { code: 'es', label: 'ES', flagClass: 'fi-es' },
]

const currentLang = computed(() => languages.find((l) => l.code === locale.value) ?? languages[0]!)

function toggleLangDropdown() {
  langDropdownOpen.value = !langDropdownOpen.value
  if (langDropdownOpen.value) sobreDropdownOpen.value = false
}

function closeLangDropdown() {
  langDropdownOpen.value = false
}

function setLanguage(code: string) {
  locale.value = code
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, code)
  } catch {
    // localStorage pode estar bloqueado — apenas a persistência é perdida
  }
  closeLangDropdown()
}

// Estrutura de navegação com suporte a dropdown
const navItems = computed(() => [
  { label: t('header.nav.home'), to: '/', children: null },
  {
    label: t('header.nav.about'),
    to: null,
    children: [
      { label: t('header.nav.ourHistory'), to: '/about' },
      { label: t('header.nav.whatIsRpm'), to: '/what-is-rpm' },
      { label: t('header.nav.benefits'), to: '/benefits' },
      { label: t('header.nav.apps'), to: '/apps' },
    ],
  },
  { label: t('header.nav.blog'), to: '/blog', children: null },
  { label: t('header.nav.equipment'), to: '/equipment', children: null },
])

/** Um item está ativo quando a rota atual é ele ou uma de suas filhas. */
function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(path + '/')
}

const aboutGroupActive = computed(() =>
  ['/about', '/what-is-rpm', '/benefits', '/apps'].some((p) => isActive(p)),
)

function toggleSobreDropdown() {
  sobreDropdownOpen.value = !sobreDropdownOpen.value
  if (sobreDropdownOpen.value) langDropdownOpen.value = false
}

function closeAllMenus() {
  sobreDropdownOpen.value = false
  langDropdownOpen.value = false
  mobileMenuOpen.value = false
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
  if (!mobileMenuOpen.value) sobreDropdownOpen.value = false
}

function handleScroll() {
  navScrolled.value = window.scrollY > 40
}

function handleClickOutside(event: MouseEvent) {
  const el = headerRef.value
  if (el && event.target instanceof Node && !el.contains(event.target)) {
    closeAllMenus()
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeAllMenus()
}

// Fecha tudo ao trocar de página
watch(() => route.fullPath, closeAllMenus)

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <nav
    ref="headerRef"
    :class="[
      'fixed inset-x-0 top-0 z-50 flex items-center transition-all duration-300',
      navScrolled || mobileMenuOpen
        ? 'h-[62px] border-b border-white/8 bg-dark/90 backdrop-blur-xl'
        : 'h-[76px] border-b border-transparent bg-transparent',
    ]"
  >
    <!-- Mesmo container das seções, para o logo alinhar com o conteúdo -->
    <div
      class="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 sm:px-8 lg:px-10"
    >
      <RouterLink to="/" class="flex items-center no-underline" @click="closeAllMenus">
        <img
          src="/Logo Emmitec Horizontal.png"
          alt="Emmitec Health"
          class="h-8 w-auto object-contain transition-all duration-300"
        />
      </RouterLink>

      <!-- Nav desktop -->
      <ul class="m-0 hidden list-none items-center gap-8 p-0 lg:flex">
        <li v-for="item in navItems" :key="item.label" class="relative">
          <!-- Item com dropdown -->
          <div v-if="item.children" class="relative">
            <button
              type="button"
              @click="toggleSobreDropdown"
              :aria-expanded="sobreDropdownOpen"
              :class="[
                'nav-link flex items-center gap-1 text-[13.5px] font-semibold transition-colors',
                aboutGroupActive ? 'nav-link--active text-white' : 'text-white/65 hover:text-white',
              ]"
            >
              {{ item.label }}
              <ChevronDown
                :size="15"
                stroke-width="2.4"
                class="transition-transform duration-300"
                :class="sobreDropdownOpen ? 'rotate-180' : ''"
                aria-hidden="true"
              />
            </button>

            <transition name="dropdown">
              <div
                v-show="sobreDropdownOpen"
                class="absolute left-0 top-full mt-3 w-56 overflow-hidden rounded-xl border border-white/10 bg-dark/95 py-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl"
              >
                <RouterLink
                  v-for="child in item.children"
                  :key="child.label"
                  :to="child.to"
                  :class="[
                    'block px-4 py-2.5 text-[12.5px] font-medium no-underline transition-colors',
                    isActive(child.to)
                      ? 'bg-primary/10 text-primary'
                      : 'text-white/65 hover:bg-white/5 hover:text-white',
                  ]"
                  @click="closeAllMenus"
                >
                  {{ child.label }}
                </RouterLink>
              </div>
            </transition>
          </div>

          <!-- Item simples -->
          <RouterLink
            v-else-if="item.to"
            :to="item.to"
            :class="[
              'nav-link text-[13.5px] font-semibold no-underline transition-colors',
              isActive(item.to) ? 'nav-link--active text-white' : 'text-white/65 hover:text-white',
            ]"
          >
            {{ item.label }}
          </RouterLink>
        </li>

        <!-- Idioma -->
        <li class="relative">
          <button
            type="button"
            @click="toggleLangDropdown"
            :aria-expanded="langDropdownOpen"
            :aria-label="t('header.nav.language')"
            class="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-[12.5px] font-semibold text-white/70 transition-colors hover:border-white/25 hover:text-white"
          >
            <span :class="['fi', currentLang.flagClass]" class="h-4 w-5 rounded-[3px]" />
            <span>{{ currentLang.label }}</span>
            <ChevronDown
              :size="14"
              stroke-width="2.4"
              class="transition-transform duration-300"
              :class="langDropdownOpen ? 'rotate-180' : ''"
              aria-hidden="true"
            />
          </button>

          <transition name="dropdown">
            <div
              v-show="langDropdownOpen"
              class="absolute right-0 top-full mt-3 w-32 overflow-hidden rounded-xl border border-white/10 bg-dark/95 py-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl"
            >
              <button
                v-for="lang in languages"
                :key="lang.code"
                type="button"
                @click="setLanguage(lang.code)"
                :class="[
                  'flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[12.5px] font-medium transition-colors',
                  locale === lang.code
                    ? 'bg-primary/10 text-primary'
                    : 'text-white/65 hover:bg-white/5 hover:text-white',
                ]"
              >
                <span :class="['fi', lang.flagClass]" class="h-4 w-5 rounded-[3px]" />
                {{ lang.label }}
              </button>
            </div>
          </transition>
        </li>

        <li>
          <a
            :href="calendlyUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary btn-primary--sm font-display"
          >
            <CalendarClock :size="15" stroke-width="2.4" aria-hidden="true" />
            {{ t('header.cta') }}
          </a>
        </li>
      </ul>

      <!-- Botão hambúrguer -->
      <button
        type="button"
        @click="toggleMobileMenu"
        class="flex h-10 w-10 items-center justify-center text-white/80 transition-colors hover:text-white lg:hidden"
        :aria-expanded="mobileMenuOpen"
        :aria-label="t('header.menu')"
      >
        <Menu v-if="!mobileMenuOpen" :size="24" stroke-width="2" aria-hidden="true" />
        <X v-else :size="24" stroke-width="2" aria-hidden="true" />
      </button>
    </div>

    <!-- Menu mobile (irmão do container, para ocupar a largura toda) -->
    <transition name="dropdown">
      <div
        v-show="mobileMenuOpen"
        class="absolute inset-x-0 top-full max-h-[calc(100vh-62px)] overflow-y-auto border-b border-white/8 bg-dark/98 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl lg:hidden"
      >
        <ul class="m-0 flex list-none flex-col gap-1.5 p-6">
          <li v-for="item in navItems" :key="item.label">
            <!-- Item com dropdown -->
            <div v-if="item.children" class="flex flex-col">
              <button
                type="button"
                @click="toggleSobreDropdown"
                :aria-expanded="sobreDropdownOpen"
                class="flex w-full items-center justify-between rounded-lg px-3 py-3 text-[15px] font-semibold text-white/75 transition-colors hover:bg-white/5 hover:text-white"
              >
                {{ item.label }}
                <ChevronDown
                  :size="17"
                  stroke-width="2.4"
                  class="transition-transform duration-300"
                  :class="sobreDropdownOpen ? 'rotate-180' : ''"
                  aria-hidden="true"
                />
              </button>
              <div v-show="sobreDropdownOpen" class="flex flex-col border-l border-white/10 pl-3">
                <RouterLink
                  v-for="child in item.children"
                  :key="child.label"
                  :to="child.to"
                  :class="[
                    'rounded-lg px-3 py-2.5 text-[13.5px] font-medium no-underline transition-colors',
                    isActive(child.to) ? 'text-primary' : 'text-white/55 hover:text-white',
                  ]"
                  @click="closeAllMenus"
                >
                  {{ child.label }}
                </RouterLink>
              </div>
            </div>

            <!-- Item simples -->
            <RouterLink
              v-else-if="item.to"
              :to="item.to"
              @click="closeAllMenus"
              :class="[
                'block rounded-lg px-3 py-3 text-[15px] font-semibold no-underline transition-colors',
                isActive(item.to)
                  ? 'text-primary'
                  : 'text-white/75 hover:bg-white/5 hover:text-white',
              ]"
            >
              {{ item.label }}
            </RouterLink>
          </li>

          <li class="mt-3 border-t border-white/10 pt-4">
            <span class="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/35">
              {{ t('header.nav.language') }}
            </span>
            <div class="mt-2.5 flex gap-2 px-3">
              <button
                v-for="lang in languages"
                :key="lang.code"
                type="button"
                @click="setLanguage(lang.code)"
                :class="[
                  'flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-[12.5px] font-semibold transition-colors',
                  locale === lang.code
                    ? 'border-primary/45 bg-primary/10 text-primary'
                    : 'border-white/10 text-white/60 hover:text-white',
                ]"
              >
                <span :class="['fi', lang.flagClass]" class="h-4 w-5 rounded-[3px]" />
                {{ lang.label }}
              </button>
            </div>
          </li>

          <li class="px-3 pb-1 pt-4">
            <a
              :href="calendlyUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary font-display w-full"
              @click="closeAllMenus"
            >
              <CalendarClock :size="16" stroke-width="2.4" aria-hidden="true" />
              {{ t('header.cta') }}
            </a>
          </li>
        </ul>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
/* Sublinhado animado do item ativo/hover */
.nav-link {
  position: relative;
  padding-bottom: 3px;
}
.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, #11d3d3, #5ee8e8);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}
.nav-link:hover::after,
.nav-link--active::after {
  transform: scaleX(1);
}

/* Transição dos dropdowns / menu mobile */
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (prefers-reduced-motion: reduce) {
  .nav-link::after,
  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: none;
  }
}
</style>
