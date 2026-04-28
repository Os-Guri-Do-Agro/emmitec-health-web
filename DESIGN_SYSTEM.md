# Emmitec Health - Design System & Estrutura do Projeto

Guia completo para manter consistência visual e arquitetural ao criar novas telas no projeto.

---

## 1. Tecnologias & Stack

| Tecnologia | Uso |
|------------|-----|
| **Vue 3** | Framework principal com `<script setup lang="ts">` |
| **Vue Router** | Navegação SPA (`createWebHistory`) |
| **Vue I18n** | Internacionalização (PT/EN/ES) |
| **Tailwind CSS v4** | Estilização utility-first |
| **PrimeVue** | Componentes UI (Button) |
| **GSAP + ScrollTrigger** | Animações de scroll e entrada |
| **Lucide Vue** | Ícones (`lucide-vue-next`) |

---

## 2. Design Tokens

### 2.1 Cores (definidas em `@theme` no `main.css`)

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-primary` | `#11d3d3` (ciano/turquesa) | CTAs, destaques, hover states |
| `--color-secondary` | `#4c666d` | Elementos secundários |
| `--color-dark` | `#0e1117` | Background escuro (Hero, CTA) |
| `--color-dark-2` | `#161c26` | Background escuro alternativo |
| `--color-mid` | `#f4f6f7` | Background cinza claro |
| `--color-black` | `#202220` | Texto principal |
| `--color-muted` | `#7a9099` | Texto secundário/descrições |
| `--color-background` | `#ffffff` | Background branco |

### 2.2 Tipografia

| Classe | Fonte | Uso |
|--------|-------|-----|
| `font-display` | Plus Jakarta Sans | Títulos, botões, navegação |
| `font-body` | Plus Jakarta Sans | Corpo de texto |

**Pesos disponíveis:** `font-medium` (500), `font-semibold` (600), `font-bold` (700), `font-extrabold` (800)

**Tamanhos de títulos:**
- Hero: `text-[clamp(20px,2vw,30px)]` ou `text-xl sm:text-2xl lg:text-3xl`
- Seções: `text-[clamp(22px,4vw,28px)]`
- Cards: `text-[17px]`
- Body: `text-[13px]` a `text-[16px]`

### 2.3 Espaçamento & Layout

- **Container máximo:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Padding de seção:** `py-12 sm:py-16` ou `py-16 sm:py-20`
- **Gap padrão:** `gap-4 sm:gap-6` para grids
- **Hero min-height:** `min-h-[50vh] sm:min-h-[65vh] lg:min-h-[70vh]`

---

## 3. Estrutura de Pastas

```
src/
├── assets/
│   ├── main.css          # Configuração Tailwind + tokens CSS
│   ├── base.css          # Estilos base
│   └── home/             # Imagens específicas da Home
├── components/
│   ├── AppHeader.vue     # Navegação fixa com scroll effect
│   ├── AppFooter.vue     # Footer 4 colunas
│   └── [componentes específicos]
├── i18n/
│   ├── index.ts          # Configuração Vue I18n
│   └── locales/
│       ├── pt.json       # Português (default)
│       ├── en.json       # Inglês
│       └── es.json       # Espanhol
├── router/
│   └── index.ts          # Rotas da aplicação
├── views/                # Páginas completas
│   ├── HomeView.vue
│   └── AboutView.vue
└── App.vue               # Layout root (Header + RouterView + Footer)
```

---

## 4. Padrão de Views

### 4.1 Estrutura Base de uma View

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from 'primevue/button'
import { IconName } from 'lucide-vue-next'

const { t } = useI18n()
gsap.registerPlugin(ScrollTrigger)

// Refs para animações
const sectionRef = ref<HTMLElement | null>(null)

onMounted(() => {
  // Animações de scroll
  if (sectionRef.value) {
    gsap.from(sectionRef.value.querySelectorAll('.animate-in'), {
      opacity: 0,
      y: 30,
      stagger: 0.12,
      duration: 0.72,
      ease: 'power3.out',
      scrollTrigger: { 
        trigger: sectionRef.value, 
        start: 'top 80%', 
        once: true 
      },
    })
  }
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((t) => t.kill())
})
</script>

<template>
  <div class="font-body text-black overflow-x-hidden w-full">
    <!-- Seções aqui -->
  </div>
</template>

<style scoped>
/* Estilos específicos do componente */
</style>
```

### 4.2 Seções Comuns

#### Hero Section (Escura)
```vue
<section class="min-h-[60vh] bg-dark relative overflow-hidden w-full">
  <!-- Grid background pattern -->
  <div class="hero-grid absolute inset-0 pointer-events-none" />
  
  <!-- Layout grid 2 colunas -->
  <div class="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh] w-full">
    <!-- Conteúdo -->
    <div class="flex flex-col justify-center px-4 sm:px-6 lg:px-12 py-20 lg:py-0 z-10">
      <span class="text-[11px] font-bold uppercase text-primary tracking-[2px]">
        {{ t('section.badge') }}
      </span>
      <h1 class="font-display font-extrabold text-white text-xl sm:text-2xl lg:text-[34px]">
        {{ t('section.title') }}
      </h1>
      <p class="text-white/50 text-[12px] sm:text-[14px]">
        {{ t('section.subtitle') }}
      </p>
      <div class="flex gap-4 flex-wrap">
        <Button :label="t('button.primary')" unstyled class="btn-primary" />
        <Button :label="t('button.secondary')" unstyled class="btn-ghost" />
      </div>
    </div>
    
    <!-- Imagem/Visual (hidden em mobile) -->
    <div class="hidden lg:block relative h-full">
      <img :src="imageSrc" class="absolute inset-0 w-full h-full object-cover" />
    </div>
  </div>
</section>
```

#### Content Section (Clara)
```vue
<section class="py-16 sm:py-20 bg-white w-full">
  <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header da seção -->
    <div class="text-center mb-12">
      <span class="text-[11px] font-bold uppercase text-primary tracking-[2px]">
        {{ t('section.badge') }}
      </span>
      <h2 class="font-display font-extrabold text-black text-[clamp(26px,3vw,40px)]">
        {{ t('section.title') }}
      </h2>
      <p class="text-gray-500 text-[14px] max-w-2xl mx-auto">
        {{ t('section.subtitle') }}
      </p>
    </div>
    
    <!-- Grid de cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- Cards aqui -->
    </div>
  </div>
</section>
```

#### Split Section (Imagem + Texto)
```vue
<section class="py-12 sm:py-16 bg-mid w-full" :class="dark ? 'bg-dark-2' : 'bg-mid'">
  <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 
              grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-center">
    <!-- Texto -->
    <div class="flex flex-col gap-5">
      <span class="text-[11px] font-bold uppercase text-primary tracking-[2px]">
        {{ t('tag') }}
      </span>
      <h2 :class="dark ? 'text-white' : 'text-black'" 
          class="font-display font-extrabold text-[clamp(22px,4vw,28px)]">
        {{ t('title') }}
      </h2>
      <p class="text-muted text-[14px]">{{ t('body') }}</p>
      <ul class="flex flex-col gap-2.5">
        <li v-for="item in items" :key="item" 
            class="flex items-start gap-2.5 text-[13px]
                   :class="dark ? 'text-white/55' : 'text-sec'">
          <span class="icon-box w-5 h-5 rounded-full bg-primary/10 
                       border border-primary/25 flex items-center justify-center text-primary">
            <Check :size="12" stroke-width="3" />
          </span>
          {{ item }}
        </li>
      </ul>
      <Button :label="t('button')" unstyled class="btn-primary" />
    </div>
    
    <!-- Imagem -->
    <div class="rounded-2xl overflow-hidden aspect-video shadow-[0_28px_72px_rgba(0,0,0,.22)]">
      <img :src="image" class="w-full h-full object-cover" />
    </div>
  </div>
</section>
```

#### CTA Section (Final)
```vue
<section class="bg-dark py-16 sm:py-[80px] relative overflow-hidden w-full">
  <!-- Glow effect -->
  <div class="absolute -top-48 left-1/2 -translate-x-1/2 
              w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] lg:w-[680px] lg:h-[680px] 
              rounded-full cta-glow" />
  
  <!-- Ghost text background -->
  <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
    <span class="cta-ghost font-display font-extrabold">
      EMMITEC&nbsp;HEALTH
    </span>
  </div>
  
  <!-- Content -->
  <div class="w-full max-w-4xl mx-auto px-4 text-center relative z-10">
    <span class="text-[11px] font-bold uppercase text-primary tracking-[2px]">
      {{ t('cta.badge') }}
    </span>
    <h2 class="font-display font-extrabold text-white text-[clamp(24px,2.5vw,40px)]">
      {{ t('cta.title') }}
    </h2>
    <p class="text-white/45 text-[14px]">{{ t('cta.subtitle') }}</p>
    <div class="flex gap-4 justify-center">
      <Button :label="t('cta.primary')" unstyled class="btn-primary" />
      <Button :label="t('cta.secondary')" unstyled class="btn-ghost" />
    </div>
  </div>
</section>
```

---

## 5. Componentes UI

### 5.1 Botões

**Primary Button:**
```vue
<Button :label="t('button.text')" unstyled class="btn-primary font-display font-bold" />
```
```css
.btn-primary {
  background: #11d3d3;
  color: #0e1117;
  font-size: 13px;
  font-weight: 700;
  padding: 10px 24px;
  border-radius: 8px;
  transition: box-shadow 0.25s, transform 0.25s;
}
.btn-primary:hover {
  box-shadow: 0 8px 32px rgba(17, 211, 211, 0.35);
  transform: translateY(-2px);
}
```

**Ghost Button (para fundos escuros):**
```vue
<Button :label="t('button.text')" unstyled class="btn-ghost font-display font-bold" />
```
```css
.btn-ghost {
  background: transparent;
  color: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.18);
  /* ... mesmo padding/border-radius do primary */
}
.btn-ghost:hover {
  border-color: #11d3d3;
  color: #11d3d3;
}
```

### 5.2 Cards

**Card de Serviço/Feature:**
```vue
<article class="group relative rounded-2xl border border-gray-200/80 
                bg-white overflow-hidden transition-all duration-500 
                hover:-translate-y-1.5 hover:border-primary/30 
                hover:shadow-[0_24px_60px_-20px_rgba(17,211,211,0.35)]">
  <!-- Imagem com overlay -->
  <div class="relative overflow-hidden aspect-16/10">
    <img :src="image" class="absolute inset-0 w-full h-full object-cover 
                              transition-transform duration-900 group-hover:scale-[1.06]" />
    <div class="absolute inset-0 bg-linear-to-t from-[#0a1218]/90 via-[#0a1218]/35 to-transparent" />
    
    <!-- Chip de índice -->
    <span class="absolute top-4 right-4 font-mono text-[10px] tracking-[3px] 
                 text-white/80 bg-white/5 backdrop-blur-sm border border-white/15 
                 rounded-full px-2.5 py-1">
      0{{ index + 1 }} / 0{{ total }}
    </span>
    
    <!-- Label -->
    <span class="absolute bottom-4 left-4 font-mono text-[10px] text-primary 
                 tracking-[3px] uppercase font-semibold">
      {{ label }}
    </span>
    
    <!-- Icon flutuante -->
    <div class="absolute -bottom-5 right-5 w-12 h-12 rounded-xl bg-primary text-dark 
                flex items-center justify-center shadow-[0_10px_28px_rgba(17,211,211,0.45)] 
                transition-all duration-500 group-hover:-translate-y-1 group-hover:rotate-[-4deg]">
      <component :is="icon" :size="20" stroke-width="2.2" />
    </div>
  </div>
  
  <!-- Corpo -->
  <div class="p-6 pt-8 flex flex-col gap-3">
    <h3 class="font-display font-bold text-gray-900 text-[17px]">{{ title }}</h3>
    <p class="text-gray-500 text-[13px] leading-[1.7]">{{ description }}</p>
  </div>
</article>
```

---

## 6. Animações GSAP

### 6.1 Padrões de Animação

**Reveal on Scroll (elementos aparecendo):**
```typescript
gsap.from(elements, {
  opacity: 0,
  y: 30,        // ou x para horizontal
  stagger: 0.12, // delay entre elementos
  duration: 0.72,
  ease: 'power3.out',
  scrollTrigger: { 
    trigger: container, 
    start: 'top 80%',  // quando 80% da viewport atinge o topo do elemento
    once: true 
  },
})
```

**Hero Entrance (sequência):**
```typescript
gsap.timeline({ defaults: { ease: 'power3.out' } })
  .from(heroBadge, { opacity: 0, y: 20, duration: 0.6 })
  .from(heroTitle, { opacity: 0, y: 34, duration: 0.8 }, '-=0.3')
  .from(heroSub, { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
  .from(heroActions, { opacity: 0, y: 20, duration: 0.6 }, '-=0.35')
```

### 6.2 Stagger Values por Tipo

| Elemento | Stagger | Y offset |
|----------|---------|----------|
| Cards | 0.08 - 0.12 | 32-42px |
| Timeline items | 0.15 | x: -20px |
| Lista de features | 0.09 | 30px |
| Stats | 0.08 | 24px |

---

## 7. Internacionalização (i18n)

### 7.1 Estrutura de Chaves

```json
{
  "sectionName": {
    "badge": "Label pequeno acima do título",
    "title": "Título principal",
    "subtitle": "Descrição",
    "button": {
      "primary": "Texto do botão",
      "secondary": "Texto secundário"
    }
  }
}
```

### 7.2 Uso no Template
```vue
<script setup>
const { t } = useI18n()
</script>

<template>
  <h1>{{ t('sectionName.title') }}</h1>
  <p>{{ t('sectionName.subtitle') }}</p>
</template>
```

---

## 8. Checklist para Novas Telas

- [ ] Usar `<script setup lang="ts">` com imports explícitos
- [ ] Configurar `useI18n()` e adicionar chaves nos 3 arquivos de locale
- [ ] Registrar `ScrollTrigger` no `gsap.registerPlugin(ScrollTrigger)`
- [ ] Criar refs para elementos animáveis
- [ ] Implementar `onMounted` com animações GSAP
- [ ] Implementar `onUnmounted` com `ScrollTrigger.getAll().forEach(t => t.kill())`
- [ ] Usar classes de cor padrão (`bg-dark`, `bg-mid`, `bg-white`)
- [ ] Usar container `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- [ ] Adicionar padding de seção `py-16 sm:py-20`
- [ ] Incluir CTA Section no final
- [ ] Replicar padrões de botões (`btn-primary`, `btn-ghost`)
- [ ] Testar responsividade (mobile: hidden lg:block para imagens)
- [ ] Adicionar rota no `router/index.ts`

---

## 9. Exemplo Completo: Nova View

```vue
<!-- src/views/NewPageView.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from 'primevue/button'
import { SomeIcon } from 'lucide-vue-next'

const { t } = useI18n()
gsap.registerPlugin(ScrollTrigger)

const heroRef = ref<HTMLElement | null>(null)
const featuresRef = ref<HTMLElement | null>(null)

onMounted(() => {
  // Hero animation
  gsap.from(heroRef.value?.querySelectorAll('.hero-animate') || [], {
    opacity: 0, y: 30, stagger: 0.12, duration: 0.72,
    ease: 'power3.out',
    scrollTrigger: { trigger: heroRef.value, start: 'top 80%', once: true },
  })
  
  // Features animation
  gsap.from(featuresRef.value?.querySelectorAll('.feature-card') || [], {
    opacity: 0, y: 32, stagger: 0.1, duration: 0.7,
    ease: 'power3.out',
    scrollTrigger: { trigger: featuresRef.value, start: 'top 85%', once: true },
  })
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((t) => t.kill())
})
</script>

<template>
  <div class="font-body text-black overflow-x-hidden w-full">
    <!-- Hero -->
    <section ref="heroRef" class="min-h-[60vh] bg-dark relative overflow-hidden w-full">
      <div class="hero-grid absolute inset-0 pointer-events-none" />
      <div class="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh] w-full">
        <div class="flex flex-col justify-center px-4 sm:px-6 lg:px-12 py-20 z-10">
          <span class="hero-animate text-[11px] font-bold uppercase text-primary tracking-[2px]">
            {{ t('newPage.hero.badge') }}
          </span>
          <h1 class="hero-animate font-display font-extrabold text-white text-2xl lg:text-[34px]">
            {{ t('newPage.hero.title') }}
          </h1>
          <p class="hero-animate text-white/50 text-[14px]">
            {{ t('newPage.hero.subtitle') }}
          </p>
          <div class="hero-animate flex gap-4 mt-4">
            <Button :label="t('newPage.hero.cta')" unstyled class="btn-primary" />
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section ref="featuresRef" class="py-16 sm:py-20 bg-white w-full">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <span class="text-[11px] font-bold uppercase text-primary tracking-[2px]">
            {{ t('newPage.features.badge') }}
          </span>
          <h2 class="font-display font-extrabold text-black text-[clamp(26px,3vw,40px)]">
            {{ t('newPage.features.title') }}
          </h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="i in 3" :key="i" class="feature-card p-6 rounded-2xl border border-gray-200">
            <SomeIcon class="text-primary mb-4" />
            <h3 class="font-display font-bold text-black">Feature {{ i }}</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-dark py-16 sm:py-[80px] relative overflow-hidden w-full">
      <div class="absolute -top-48 left-1/2 -translate-x-1/2 w-[500px] h-[500px] cta-glow" />
      <div class="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 class="font-display font-extrabold text-white text-[clamp(24px,2.5vw,40px)]">
          {{ t('newPage.cta.title') }}
        </h2>
        <Button :label="t('newPage.cta.button')" unstyled class="btn-primary mt-6" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero-grid {
  background-image:
    linear-gradient(rgba(17, 211, 211, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(17, 211, 211, 0.04) 1px, transparent 1px);
  background-size: 64px 64px;
}
.cta-glow {
  background: radial-gradient(circle, rgba(17, 211, 211, 0.08) 0%, transparent 70%);
}
</style>
```

---

## 10. Padrões Específicos

### Background Grid (Hero)
```css
.hero-grid {
  background-image:
    linear-gradient(rgba(17, 211, 211, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(17, 211, 211, 0.04) 1px, transparent 1px);
  background-size: 64px 64px;
}
```

### Marquee/Scroll infinito
```vue
<div ref="marquee" class="marquee bg-dark border-t border-white/10 py-4 overflow-hidden">
  <div class="marquee-track flex whitespace-nowrap will-change-transform">
    <!-- Items duplicados 2x para loop -->
  </div>
</div>
```

### Timeline visual
- Linha vertical: `absolute left-8 top-0 bottom-0 w-px bg-slate-200`
- Círculos: `w-16 h-16 rounded-full bg-primary/10 border-2 border-primary`
- Conteúdo alinhado com `flex items-start gap-8`

---

Documento mantido por: Dev Team  
Última atualização: Abril 2026
