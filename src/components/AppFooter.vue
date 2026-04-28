<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mail, ArrowRight, MapPin, Check } from 'lucide-vue-next'

const { t } = useI18n()
gsap.registerPlugin(ScrollTrigger)

// Refs para animações
const footerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const bottomRef = ref<HTMLElement | null>(null)

const linksCol = computed(() => ({
  title: t('footer.links.title'),
  links: [
    { text: t('footer.links.ourHistory'), href: '#history' },
    { text: t('footer.links.whatIsRpm'), href: '#rpm' },
    { text: t('footer.links.benefits'), href: '#benefits' },
    { text: t('footer.links.blog'), href: '#blog' },
    { text: t('footer.links.contact'), href: '#contact' },
    { text: t('footer.links.certificates'), href: '#certificates' },
    { text: t('footer.links.privacyTerms'), href: '#privacy' },
  ],
}))

const blogCol = computed(() => ({
  title: t('footer.blogCol.title'),
  links: [
    { text: t('footer.blogCol.rpmToday'), href: '#rpm-today' },
    { text: t('footer.blogCol.facilities'), href: '#facilities' },
    { text: t('footer.blogCol.challenges'), href: '#challenges' },
    { text: t('footer.blogCol.laws'), href: '#laws' },
    { text: t('footer.blogCol.reviews'), href: '#reviews' },
  ],
}))

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/emmitechealth',
    icon: 'facebook',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/emmitec.health/',
    icon: 'instagram',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/emmitechealth/',
    icon: 'linkedin',
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@emmiTec.Health',
    icon: 'youtube',
  },
]

onMounted(() => {
  // Animação de entrada do conteúdo
  if (contentRef.value) {
    gsap.from(contentRef.value.querySelectorAll('.footer-col'), {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: footerRef.value,
        start: 'top 85%',
        once: true,
      },
    })
  }

  // Animação da parte inferior
  if (bottomRef.value) {
    gsap.from(bottomRef.value, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      delay: 0.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: footerRef.value,
        start: 'top 80%',
        once: true,
      },
    })
  }
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((t) => t.kill())
})
</script>

<template>
  <footer
    ref="footerRef"
    class="relative bg-dark pt-16 sm:pt-20 lg:pt-24 pb-8 overflow-hidden flex w-full items-center justify-center"
  >
    <!-- Grid Background Pattern -->
    <div class="absolute inset-0 pointer-events-none opacity-40">
      <div class="footer-grid absolute inset-0" />
    </div>

    <!-- Content Container -->
    <div
      ref="contentRef"
      class="z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center"
       <!-- Main Grid  -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-5">
        <!-- Coluna 1: Brand + Endereço + Social (ocupa 4 colunas) -->
        <div class="footer-col lg:col-span-4 flex flex-col gap-6">
          <!-- Logo -->
          <a href="#" class="flex items-center no-underline group">
            <div class="relative">
              <img
                src="/Logo Emmitec Horizontal.png"
                alt="Emmitec Health"
                class="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div
                class="absolute -inset-2 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
              />
            </div>
          </a>

          <!-- Tagline -->
          <p class="text-white/60 text-[13px] leading-relaxed max-w-xs">
            {{ t('footer.tagline') }}
          </p>

          <!-- Endereço com ícone -->
          <div class="flex items-start gap-3 text-white/50 text-[13px]">
            <div
              class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0"
            >
              <MapPin class="w-4 h-4 text-primary" />
            </div>
            <div class="leading-relaxed pt-1">
              Rua Primeiro de Maio, 442, Pinhais<br />
              PR 83323-020, Brazil
            </div>
          </div>

          <!-- Social Icons -->
          <div class="flex gap-3 mt-2">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              class="group relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-primary/50 hover:bg-primary/10"
            >
              <!-- Glow effect on hover -->
              <div
                class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"
              />

              <!-- Icon -->
              <svg
                class="relative z-10 w-[18px] h-[18px] text-white/60 group-hover:text-primary transition-colors duration-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  v-if="social.icon === 'facebook'"
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
                <path
                  v-if="social.icon === 'instagram'"
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                />
                <path
                  v-if="social.icon === 'linkedin'"
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227.24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                />
                <path
                  v-if="social.icon === 'youtube'"
                  d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                />
              </svg>
            </a>
          </div>
        </div>

        <!-- Coluna 2: Links (ocupa 2 colunas) -->
        <div class="footer-col lg:col-span-2 flex flex-col gap-5">
          <h5
            class="font-display font-semibold text-white text-[13px] uppercase tracking-wider"
          >
            {{ linksCol.title }}
          </h5>
          <ul class="list-none flex flex-col gap-3">
            <li v-for="(link, idx) in linksCol.links" :key="idx">
              <a
                :href="link.href"
                class="group text-white/50 hover:text-white text-[13px] no-underline transition-all duration-300 flex items-center gap-2"
              >
                <span class="w-0 h-px bg-primary group-hover:w-3 transition-all duration-300" />
                <span class="group-hover:translate-x-1 transition-transform duration-300">
                  {{ link.text }}
                </span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Coluna 3: Blog (ocupa 2 colunas) -->
        <div class="footer-col lg:col-span-2 flex flex-col gap-5">
          <h5
            class="font-display font-semibold text-white text-[13px] uppercase tracking-wider mb-5"
          >
            {{ blogCol.title }}
          </h5>
          <ul class="list-none flex flex-col gap-3">
            <li v-for="(link, idx) in blogCol.links" :key="idx">
              <a
                :href="link.href"
                class="group text-white/50 hover:text-white text-[13px] no-underline transition-all duration-300 flex items-center gap-2"
              >
                <span class="w-0 h-px bg-primary group-hover:w-3 transition-all duration-300" />
                <span class="group-hover:translate-x-1 transition-transform duration-300">
                  {{ link.text }}
                </span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Coluna 4: Newsletter (ocupa 4 colunas) -->
        <div class="footer-col lg:col-span-4 flex flex-col gap-5">
          <h5
            class="font-display font-semibold text-white text-[13px] uppercase tracking-wider mb-5"
          >
            {{ t('footer.newsletter.title') }}
          </h5>

          <p class="text-white/50 text-[13px] leading-relaxed mb-5">
            {{ t('footer.newsletter.description') }}
            <span class="text-primary font-medium">{{ t('footer.newsletter.highlight') }}</span>
          </p>

          <!-- Newsletter Form -->
          <div
            class="relative group rounded-xl bg-white/5 border border-white/10 p-1 transition-all duration-300 focus-within:border-primary/50 focus-within:bg-white/[0.07] focus-within:shadow-[0_0_30px_rgba(17,211,211,0.1)]"
          >
            <div class="flex flex-col sm:flex-row gap-2">
              <div class="relative flex-1">
                <Mail
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 transition-colors duration-300 group-focus-within:text-primary"
                />
                <input
                  type="email"
                  :placeholder="t('footer.newsletter.placeholder')"
                  class="w-full bg-transparent text-white text-[13px] pl-10 pr-4 py-3 rounded-lg outline-none placeholder:text-white/30"
                />
              </div>
              <button
                class="flex items-center justify-center gap-2 bg-primary text-dark font-semibold text-[13px] px-5 py-3 rounded-lg transition-all duration-300 hover:shadow-[0_8px_24px_rgba(17,211,211,0.35)] hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap cursor-pointer"
              >
                {{ t('footer.newsletter.submit') }}
                <ArrowRight class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Trust Badge -->
          <div class="mt-5 flex items-center gap-3 text-white/40 text-[11px]">
            <div class="flex -space-x-2">
              <div
                class="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center"
              >
                <Check class="w-3 h-3 text-primary" />
              </div>
            </div>
            <span>{{ t('footer.newsletter.privacy') }}</span>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="mt-12 sm:mt-16 pt-8 border-t border-white/10">
        <div ref="bottomRef" class="flex flex-col sm:flex-row justify-between items-center gap-4">
          <!-- Copyright -->
          <p class="text-white/40 text-[12px] text-center sm:text-left">
            © 2026
            <span class="text-primary font-medium">Emmitec Health</span>.
            {{ t('footer.copyright') }}
          </p>

          <!-- Back to Top -->
          <a
            href="#"
            class="group flex items-center gap-2 text-white/40 hover:text-primary text-[12px] transition-colors duration-300"
          >
            <span>{{ t('footer.backToTop') }}</span>
            <div
              class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-300"
            >
              <svg
                class="w-4 h-4 transform group-hover:-translate-y-0.5 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-grid {
  background-image:
    linear-gradient(rgba(17, 211, 211, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(17, 211, 211, 0.03) 1px, transparent 1px);
  background-size: 64px 64px;
}

.footer-glow {
  background: radial-gradient(circle, rgba(17, 211, 211, 0.15) 0%, transparent 70%);
  filter: blur(60px);
}
</style>
