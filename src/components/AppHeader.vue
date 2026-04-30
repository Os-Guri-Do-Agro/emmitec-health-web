<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import 'flag-icons/css/flag-icons.min.css'
import { LOCALE_STORAGE_KEY } from '@/i18n'

const { locale, t } = useI18n()

const navScrolled = ref(false)
const mobileMenuOpen = ref(false)
const sobreDropdownOpen = ref(false)
const langDropdownOpen = ref(false)

const languages = [
  { code: 'pt', label: 'PT', flagClass: 'fi-br' },
  { code: 'en', label: 'EN', flagClass: 'fi-gb' },
  { code: 'es', label: 'ES', flagClass: 'fi-es' },
]

const currentLangLabel = ref(languages.find((l) => l.code === locale.value)?.label || 'PT')

function toggleLangDropdown() {
  langDropdownOpen.value = !langDropdownOpen.value
}

function closeLangDropdown() {
  langDropdownOpen.value = false
}

function setLanguage(code: string) {
  locale.value = code
  currentLangLabel.value = languages.find((l) => l.code === code)?.label || code.toUpperCase()
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, code)
  } catch {
    // localStorage pode estar bloqueado — apenas a persistência é perdida
  }
  closeLangDropdown()
}

// Estrutura de navegação com suporte a dropdown
const navItems = computed(() => [
  {
    label: t('header.nav.about'),
    href: '#',
    children: [
      { label: t('header.nav.ourHistory'), href: '/about' },
      { label: t('header.nav.whatIsRpm'), href: '/what-is-rpm' },
      { label: t('header.nav.benefits'), href: '/benefits' },
      { label: t('header.nav.apps'), href: '/apps' },
    ],
  },
  { label: t('header.nav.blog'), href: '/blog', children: null },
  { label: t('header.nav.equipment'), href: '/equipment', children: null },
])

function toggleSobreDropdown() {
  sobreDropdownOpen.value = !sobreDropdownOpen.value
}

function closeSobreDropdown() {
  sobreDropdownOpen.value = false
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function handleScroll() {
  navScrolled.value = window.scrollY > 40
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav
    :class="[
      'fixed top-0 inset-x-0 z-50 flex items-center justify-between px-12 transition-all duration-300',
      navScrolled
        ? 'h-[58px] bg-dark/95 border-b border-primary/15 backdrop-blur-md'
        : 'h-16 bg-transparent',
    ]"
  >
    <a href="/" class="flex items-center no-underline">
      <img
        src="/Logo Emmitec Horizontal.png"
        alt="Emmitec Health"
        class="h-8 w-auto object-contain"
      />
    </a>
    <!-- Desktop nav -->
    <ul class="hidden lg:flex items-center gap-8 list-none m-0 p-0">
      <li v-for="item in navItems" :key="item.label" class="relative">
        <!-- Item com dropdown -->
        <div v-if="item.children" class="relative">
          <button
            @click="toggleSobreDropdown"
            class="text-white/55 hover:text-white text-[13px] font-medium no-underline transition-colors flex items-center gap-1"
          >
            {{ item.label }}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 transition-transform"
              :class="sobreDropdownOpen ? 'rotate-180' : ''"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <!-- Dropdown menu -->
          <div
            v-show="sobreDropdownOpen"
            class="absolute top-full left-0 mt-2 w-48 bg-dark/95 backdrop-blur-md border border-primary/15 rounded-lg shadow-lg py-2"
          >
            <a
              v-for="child in item.children"
              :key="child.label"
              :href="child.href"
              class="block px-4 py-2 text-white/70 hover:text-white hover:bg-primary/10 text-[12px] font-medium no-underline transition-colors"
              @click="closeSobreDropdown"
            >
              {{ child.label }}
            </a>
          </div>
        </div>
        <!-- Item simples -->
        <a
          v-else
          :href="item.href"
          class="text-white/55 hover:text-white text-[13px] font-medium no-underline transition-colors"
          >{{ item.label }}</a
        >
      </li>
      <li class="relative">
        <button
          @click="toggleLangDropdown"
          class="text-white/55 hover:text-white text-[13px] font-medium no-underline transition-colors flex items-center gap-1"
        >
          <span
            :class="['fi', languages.find((l) => l.code === locale)?.flagClass]"
            class="w-7 h-7 rounded-sm"
          />
          <span>{{ currentLangLabel }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 transition-transform"
            :class="langDropdownOpen ? 'rotate-180' : ''"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div
          v-show="langDropdownOpen"
          class="absolute top-full right-0 mt-2 w-16 bg-dark/95 backdrop-blur-md border border-primary/15 rounded-lg shadow-lg py-2"
        >
          <button
            v-for="lang in languages"
            :key="lang.code"
            @click="setLanguage(lang.code)"
            class="flex items-center gap-2 w-full text-left px-4 py-2 text-white/70 hover:text-white hover:bg-primary/10 text-[12px] font-medium no-underline transition-colors"
            :class="{ 'text-primary': locale === lang.code }"
          >
            <span :class="['fi', lang.flagClass]" class="w-7 h-7 rounded-sm" />
            {{ lang.label }}
          </button>
        </div>
      </li>
    </ul>

    <!-- Mobile hamburger button -->
    <button
      @click="toggleMobileMenu"
      class="lg:hidden flex items-center justify-center w-10 h-10 text-white/80 hover:text-white transition-colors"
      aria-label="Menu"
    >
      <svg
        v-if="!mobileMenuOpen"
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Mobile menu -->
    <div
      v-show="mobileMenuOpen"
      class="lg:hidden absolute top-full left-0 right-0 bg-dark/98 backdrop-blur-md border-b border-primary/15 shadow-lg"
    >
      <ul class="flex flex-col items-center gap-4 py-8 list-none m-0 p-0">
        <li v-for="item in navItems" :key="item.label" class="w-full">
          <!-- Item com dropdown no mobile -->
          <div v-if="item.children" class="flex flex-col items-center">
            <button
              @click="toggleSobreDropdown"
              class="text-white/70 hover:text-white text-[15px] font-medium no-underline transition-colors flex items-center gap-1"
            >
              {{ item.label }}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 transition-transform"
                :class="sobreDropdownOpen ? 'rotate-180' : ''"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <!-- Submenu mobile -->
            <div v-show="sobreDropdownOpen" class="flex flex-col items-center gap-2 mt-2">
              <a
                v-for="child in item.children"
                :key="child.label"
                :href="child.href"
                class="text-white/50 hover:text-white text-[13px] font-medium no-underline transition-colors py-1"
                @click="closeMobileMenu"
              >
                {{ child.label }}
              </a>
            </div>
          </div>
          <!-- Item simples -->
          <div v-else class="flex flex-col items-center">
            <a
              :href="item.href"
              @click="closeMobileMenu"
              class="text-white/70 hover:text-white text-[15px] font-medium no-underline transition-colors"
              >{{ item.label }}</a
            >
          </div>
        </li>
        <li class="w-full border-t border-white/10 pt-4 mt-2">
          <div class="flex flex-col items-center gap-2">
            <span class="text-white/40 text-[11px] font-medium uppercase tracking-wide">{{
              t('header.nav.language')
            }}</span>
            <div class="relative">
              <button
                @click="toggleLangDropdown"
                class="text-white/70 hover:text-white text-[13px] font-medium transition-colors flex items-center gap-2"
              >
                <span
                  :class="['fi', languages.find((l) => l.code === locale)?.flagClass]"
                  class="w-7 h-7 rounded-sm"
                />
                <span>{{ currentLangLabel }}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 transition-transform"
                  :class="langDropdownOpen ? 'rotate-180' : ''"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                v-show="langDropdownOpen"
                class="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-24 bg-dark/95 backdrop-blur-md border border-primary/15 rounded-lg shadow-lg py-2 z-10"
              >
                <button
                  v-for="lang in languages"
                  :key="lang.code"
                  @click="setLanguage(lang.code)"
                  class="flex items-center gap-2 w-full text-left px-4 py-2 text-white/70 hover:text-white hover:bg-primary/10 text-[12px] font-medium transition-colors"
                  :class="{ 'text-primary': locale === lang.code }"
                >
                  <span :class="['fi', lang.flagClass]" class="w-7 h-7 rounded-sm" />
                  {{ lang.label }}
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.btn-primary {
  background: #11d3d3;
  color: #0e1117;
  font-size: 13px;
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: inline-block;
  transition:
    box-shadow 0.25s,
    transform 0.25s;
}
.btn-primary:hover {
  box-shadow: 0 8px 32px rgba(17, 211, 211, 0.35);
  transform: translateY(-2px);
}
</style>
