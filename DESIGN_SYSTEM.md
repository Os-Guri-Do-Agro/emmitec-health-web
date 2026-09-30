# Emmitec Health — Design System & Estrutura do Projeto

Guia para manter a consistência ao criar ou alterar telas. Visual claro, tipografia
grande, muito respiro, cards com borda em degradê e movimento suave (inspiração:
estúdios como midu.design), com a paleta ciano da Emmitec.

---

## 1. Stack

| Tecnologia | Uso |
| --- | --- |
| Vue 3.5 (`<script setup lang="ts">`) | Framework |
| Vue Router | SPA (`createWebHistory`), troca de página animada |
| Vue I18n 9 | PT / EN / ES (`src/i18n/locales/*.json`) |
| Tailwind CSS v4 | Base e utilities (o visual vive nas classes `em-*`) |
| Lucide (`lucide-vue-next`) | Ícones, sempre com `:stroke-width="1.7"` |
| WebGL próprio (`src/lib/gradient.ts`) | Gradiente líquido do hero e do rodapé |

Sem GSAP e sem PrimeVue: todo o movimento está em `src/lib/motion.ts` (diretivas) e em CSS.

---

## 2. Onde está cada coisa

```
src/
├── assets/
│   ├── tokens.css      ← tokens do DS (cores, espaço, raios, sombras, durações, curvas)
│   ├── emmitec.css     ← todas as classes em-* (componentes, seções, páginas, responsivo)
│   ├── main.css        ← Tailwind + @theme + imports (emmitec.css entra em layer(components))
│   ├── home/ about/ apps/ blog/   ← imagens
├── components/
│   ├── AppHeader.vue   ← navbar: logo + botão "Menu" (abre no hover/toque/foco)
│   ├── AppFooter.vue   ← rodapé com newsletter (prop `newsletter`), links e marca gigante
│   └── em/             ← componentes do DS (ver seção 5)
├── lib/
│   ├── motion.ts       ← rolagem amortecida, laço de efeitos, reveals e diretivas
│   ├── pageTransition.ts ← troca de página em dois tempos + afterPageEnter()
│   ├── gradient.ts     ← shaders (glGradient, softShader) e fallback (blobsField)
│   ├── site.ts         ← calendlyUrl, idiomas, redes sociais, logo
│   ├── blog.ts         ← artigos (useArticles) e categorias
│   ├── equipment.ts    ← dispositivos (useDevices) e categorias
│   └── useToc.ts       ← sumário que acompanha a leitura (artigo, privacidade)
└── views/              ← uma view por rota
```

---

## 3. Tokens (`tokens.css`)

**Cores**

| Token | Valor | Uso |
| --- | --- | --- |
| `--surface-000` | `#ffffff` | cards |
| `--surface-100` | `#f4f6f7` | fundo da página |
| `--surface-200` / `--cyan-50` | `#eafbfb` | chips, seções `--tint` |
| `--line` | `#eaecef` | divisórias, bordas |
| `--cyan-100` | `#d8f8f8` | fundos suaves de marca |
| `--cyan-300` | `#67ddef` | ícones sobre escuro, foco |
| `--cyan-500` | `#11d3d3` | botão primário, destaques |
| `--cyan-600` | `#0db7ba` | traçados, sparklines |
| `--cyan-700` | `#08777b` | texto de marca sobre claro (palavra em serif) |
| `--ink` / `--ink-muted` | `#202220` / `#4a5565` | texto |
| `--night-900` | `#0e1117` | botão escuro, avatar, ícones fortes |
| `--pastel-mint/blue/peach/rose/lilac` | — | capas e telas (um tom por item) |

**Tipografia** — `Instrument Sans` (tudo) + `Instrument Serif` itálico (a palavra de destaque
do título, em `--cyan-700`). Títulos 500, `letter-spacing: -0.045em`, `line-height: 1`.

**Forma** — `--em-radius-sm/md/lg` (10/18/32px), `--radius-pill`. Cards grandes usam 26–30px.

**Movimento** — `--em-ease-out: cubic-bezier(0.19, 1, 0.22, 1)` (entradas),
`--em-ease-in-out: cubic-bezier(0.76, 0, 0.24, 1)` (troca de página, bob).
Durações `--dur-fast/base/slow/enter` = 320/640/1000/1400ms.

---

## 4. Anatomia de uma página

```vue
<template>
  <div class="em-xxx-page">
    <EmPageHero :eyebrow :title :em :subtitle>          <!-- gradiente vivo -->
      <template #actions>…EmButton…</template>
      <template #visual>…arte opcional à direita…</template>
    </EmPageHero>

    <section id="secao" class="em-section">               <!-- alterne com em-section--tint -->
      <div class="em-wrap">
        <div class="em-head">
          <div>
            <span v-reveal class="em-eyebrow">(01) {{ t('x.badge') }}</span>
            <EmSplit :text="t('x.title')" :em="t('x.titleEm')" />
          </div>
          <p v-reveal="150">{{ t('x.subtitle') }}</p>
        </div>
        …cards em-card…
      </div>
    </section>

    <EmCta :badge :title :em :subtitle :primary="{ label, href: calendlyUrl }" :secondary />
  </div>
</template>
```

Regras:

- Seções numeradas no eyebrow: `(01)`, `(02)`… na ordem da página.
- Todo título tem uma palavra/trecho em serif itálico: chave `titleEm` no i18n,
  **contida no `title`** (a busca ignora maiúsculas).
- Seções alternam `em-section` e `em-section--tint`; toda página fecha com `EmCta`
  (o Blog usa o slot do `EmCta` para o formulário da newsletter e esconde a do rodapé
  via `meta: { footerNewsletter: false }` na rota).
- O rodapé já vem dentro de cada página (App.vue) — não inclua nas views.

**Classes de layout mais usadas:** `em-wrap`, `em-head` (+ `em-head__side`), `em-h2`,
`em-card` (+ `em-card--lift`), `em-chip` (+ `--glass`), `em-pill`, `em-ico` (+ `--brand`),
`em-feats` (lista com check), `em-def` (texto + painel), `em-posts`/`em-post`,
`em-devices`, `em-tabs` (filtro com indicador), `em-search`, `em-empty`, `em-prose`
(texto longo), `em-toc` (sumário), `em-corner` (seta no canto do card).

---

## 5. Componentes (`src/components/em/`)

| Componente | O que faz |
| --- | --- |
| `EmButton` | Pílula com rótulo que rola e seta. `to` → RouterLink, `href` → `<a>` (externo em nova aba), senão `<button>`. `variant: primary \| dark \| ghost`, `size`, `block`. |
| `EmSplit` | Título palavra a palavra; `em` = trecho em serif. `tag` (h2 padrão), `delay`. |
| `EmPageHero` | Hero das páginas internas. Slots `actions`, `lead`, `visual` (arte à direita, some < 1100px). Modificadores: `em-hero--article` (título menor), `em-hero--short`, `em-hero--orbit`. |
| `EmCta` | Card final. `primary`/`secondary` `{ label, to \| href }`, `trust[]`, `note`, `id`; slot padrão substitui os botões. |
| `EmHeroGradient` / `EmShader` | Gradiente WebGL do hero / gradiente 2D do rodapé e CTA. |
| `EmStatement` | Manifesto que acende palavra a palavra com a rolagem. |
| `EmOdometer` | Número em odômetro; gira quando um ancestral ganha `.is-in`. |
| `EmMarquee` | Faixa contínua (`items`, `dir`, `speed`). |
| `EmHoverLines` | Lista grande com foto que segue o cursor. |
| `EmAccordion` | Acordeão (`items { title, body, icon? }`, `faq`). |
| `EmTimeline` | Linha do tempo horizontal presa na tela. |
| `EmSteps` | Etapas em scrollytelling com painel preso. |
| `EmEcgMonitor` / `EmVitalRow` | Monitor com ECG ao vivo / linha de sinal vital com sparkline. |
| `EmDeviceScreen` / `EmDeviceCard` | "Tela" do dispositivo (leitura + traçado) e o card do catálogo. |
| `EmLoader` | Tela de entrada (uma vez por sessão). |

---

## 6. Movimento

Diretivas globais (plugin `EmMotion`):

| Diretiva | Uso |
| --- | --- |
| `v-reveal="ms"` | Sobe e aparece quando entra na tela (atraso em ms). `v-reveal:scale` para cards grandes. |
| `v-in` | Só marca `.is-in` (para animações em CSS dos filhos). |
| `v-spot` | Brilho que segue o cursor no card. |
| `v-parallax="0.14"` | Deslocamento com a rolagem (`.fade` também esmaece). |
| `v-scrub` | Escreve `--p` (0→1) conforme o elemento atravessa a tela. |

- Escalone grades com `v-reveal="(i % 3) * 90"`.
- Efeitos ligados à rolagem: `addFx((y, dt, vh) => …)` — nunca `scroll` listeners próprios.
- Rolar até algo: `scrollToEl(el, offset)` / `scrollToY(y)` (respeita a rolagem amortecida).
- Depois da troca de página: `afterPageEnter(cb)` (ex.: `/blog?category=cases` rola até a grade).
- Tudo respeita `prefers-reduced-motion` (`RM` em `motion.ts` e blocos `@media` no CSS).

**Troca de página:** a atual sobe, uma cortina clara vem atrás e a nova entra por baixo
(`pageTransition.ts`, 780ms + 900ms, `--em-ease-in-out`). Os gradientes WebGL continuam
animando até a página sair do DOM.

---

## 7. i18n

- Chaves por página: `about.*`, `whatIsRpm.*`, `benefitsPage.*`, `appsPage.*`, `blogPage.*`,
  `equipmentPage.*`, `privacyPage.*`. Sempre nos três arquivos.
- `titleEm` ao lado de cada `title` que ganha serif.
- Plural: `"Nenhum dispositivo | 1 dispositivo | {n} dispositivos"` com `t(chave, n)`.
- Caracteres especiais do vue-i18n precisam de literal: `@` → `{'@'}` (ex.: e-mails),
  `{` `}` `|` também.
- Listas (`tm(...)`) chegam como texto cru — use direto no template.
- JSON salvo com 2 espaços e acentos reais (não rodar o Prettier nos `.json`).

---

## 8. Checklist para uma nova tela

- [ ] Rota em `src/router/index.ts` (lazy import).
- [ ] `EmPageHero` → seções `(01)…` alternando `--tint` → `EmCta`.
- [ ] Títulos com `EmSplit` + `titleEm` nos três idiomas.
- [ ] Cards com `em-card`, `v-reveal` escalonado e `v-spot`.
- [ ] Links externos (Calendly, lojas) via `EmButton href` / `rel="noopener noreferrer"`.
- [ ] Conferir em 1440px e 390px, em PT/EN/ES.
- [ ] `npm run type-check`, `npx eslint src`, `npm run build-only`.
