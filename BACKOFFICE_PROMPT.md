# PROMPT PARA A CRIAÇÃO DO BACKOFFICE — EMMITEC HEALTH

## 1. Contexto

**Empresa:** Emmitec Health
**Produto:** plataforma de RPM (Remote Patient Monitoring / Monitoramento Remoto de Pacientes) para clínicas e hospitais.

Já existe um **site institucional público** (Vue 3 + TypeScript + Vite + Tailwind CSS v4 + PrimeVue + GSAP + Vue I18n) que hoje consome **dados mockados hardcoded** dentro dos componentes `.vue` e dos arquivos de tradução (`pt.json`, `en.json`, `es.json`).

O objetivo deste projeto é criar o **BackOffice administrativo** que substituirá esses mocks: os administradores irão cadastrar e gerenciar o conteúdo, e o site público passará a consumir esse conteúdo via API.

**Importante:** o BackOffice precisa produzir exatamente a estrutura de dados que o site já espera (detalhada nas seções 4 e 5), para que a integração seja apenas trocar o array mockado por um `fetch`.

---

## 2. Escopo do MVP

Nesta primeira fase o sistema precisa ter **apenas**:

1. **Autenticação / Login** — tela de login, sessão persistida (JWT), logout, proteção de rotas, recuperação de senha (opcional nesta fase).
2. **Dashboard / Início** — visão geral com contadores e atalhos.
3. **Área de Blogs**
   - Gerenciamento de **posts** (listar, visualizar, criar, editar, excluir).
   - Gerenciamento de **categorias do blog** (listar, visualizar, criar, editar, excluir).
4. **Área de Equipamentos** — CRUD completo de equipamentos.
   > ⚠️ Equipamentos **não são produtos de marketing / e-commerce**. São os **dispositivos médicos com os quais a Emmitec Health tem integração técnica** (monitores de pressão, ECG portátil, glicosímetro, oxímetro, wearables etc.). Não há preço, estoque, carrinho ou checkout — é um **catálogo técnico de compatibilidade**.
   - Gerenciamento de **categorias de equipamento** (mesmo padrão das categorias de blog).

Fora de escopo por enquanto: gestão de usuários/permissões avançadas, newsletter, leads, analytics.

---

## 3. Stack sugerida

Para manter consistência com o site público:

| Camada | Tecnologia |
|---|---|
| Framework | **Vue 3** com `<script setup lang="ts">` |
| Build | **Vite** |
| Roteamento | **Vue Router** (`createWebHistory`) |
| Estado | **Pinia** (auth, blogs, equipamentos) |
| Estilo | **Tailwind CSS v4** (tokens via `@theme` no `main.css`) |
| Componentes UI | **PrimeVue 4** (DataTable, Dialog, Toast, Dropdown, FileUpload, ConfirmDialog) |
| Ícones | **lucide-vue-next** |
| Editor de conteúdo | Editor **WYSIWYG que gere HTML** (ex.: TipTap ou PrimeVue Editor) — o site renderiza o conteúdo com `v-html` |
| HTTP | Axios com interceptor de token e refresh |
| Validação | Vee-Validate + Zod (ou equivalente) |

Layout do BackOffice: **sidebar fixa à esquerda + topbar + área de conteúdo**, tema claro por padrão usando a paleta da seção 6.

---

## 4. ESTRUTURA DOS BLOGS

### 4.1 Como o site público funciona hoje

**Rotas do site:**
- `/blog` — listagem
- `/blog/:id` — detalhe do artigo
- `/blog?category=<slug>` — listagem já filtrada por categoria (o **rodapé do site linka direto** para `/blog?category=rpm`, `?category=tech`, `?category=cases`, `?category=laws`)

**Seções da página `/blog`, na ordem em que aparecem:**

1. **Hero** — badge, título e subtítulo (texto institucional fixo, vem do i18n).
2. **Em destaque (carrossel)** — carrossel com **no máximo 5 posts**, autoplay de **3000 ms**, navegação por setas, bullets e swipe em mobile. O primeiro slide é o **post destaque principal** (`featured`), os demais são os posts mais recentes. Cada slide mostra: categoria, data, tempo de leitura, título, resumo, **autor (avatar gerado pela inicial do nome) e cargo do autor**.
3. **Grid de artigos** (`#blog-articles`) — busca por texto + filtro por categoria em "pills". A busca filtra por **título e resumo**. Cada card mostra: imagem/gradiente, índice, categoria, título, resumo, data, tempo de leitura.
4. **Pré-visualização** — mostra os **3 primeiros posts** como convite à leitura.
5. **Newsletter CTA** — formulário de e-mail (ainda sem backend).

**Página `/blog/:id` (detalhe):**
- Hero com gradiente da categoria, badge de categoria, título, **autor + cargo + avatar**, data, tempo de leitura e **tags** (`#Tecnologia`, `#Dispositivos`…).
- Corpo do artigo renderizado em **HTML puro** via `v-html`, estilizado com classes `prose` (usa `<p>`, `<h3>`, `<ul>`, `<li>`, `<strong>`).
- Botão de compartilhar.
- **Artigos relacionados** — 3 cards.

### 4.2 Modelo de dados: Post

Estrutura exata que o site consome hoje (`BlogView.vue` / `BlogDetailView.vue`):

```ts
interface BlogPost {
  id: number                  // usado na rota /blog/:id
  slug: string                // NOVO — recomendado para SEO (/blog/como-o-rpm-...)
  categoryId: number          // FK -> BlogCategory
  cat: string                 // slug da categoria (ex.: 'rpm') — usado no filtro
  catLabel: string            // rótulo exibido (ex.: 'RPM')
  title: string
  excerpt: string             // resumo curto (cards, carrossel, meta description)
  content: string             // corpo do artigo em HTML (<p>, <h3>, <ul>, <li>, <strong>)
  date: string                // data de publicação exibida (ex.: "12 Abr 2026")
  publishedAt: string         // ISO 8601 — para ordenação e agendamento
  readTime: string            // ex.: "5 min" (pode ser calculado ou manual)
  author: string              // ex.: "Dr. Ricardo Mendes"
  authorRole: string          // ex.: "Diretora médica"
  gradient: string            // classe Tailwind do visual do card (ver 6.3)
  coverImage?: string         // URL da imagem de capa (substitui/complementa o gradiente)
  tags: string[]              // ex.: ["Tecnologia", "Dispositivos", "Inovação"]
  featured: boolean           // marca o post principal do carrossel "Em destaque"
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
}
```

### 4.3 Modelo de dados: Categoria do blog

Hoje as categorias são uma lista fixa no código: `all`, `rpm`, `tech`, `cases`, `laws`
(rótulos em PT: **Todos, RPM, Tecnologia, Cases, Regulação**).

```ts
interface BlogCategory {
  id: number
  slug: string        // 'rpm' | 'tech' | 'cases' | 'laws' | ... — usado na URL ?category=
  name: string        // rótulo exibido: "RPM", "Tecnologia", "Cases", "Regulação"
  description?: string
  color?: string      // cor/gradiente associado (ver 6.3)
  order: number       // ordem de exibição nas pills de filtro
  active: boolean
  postsCount?: number // read-only, calculado
  createdAt: string
  updatedAt: string
}
```

**Regras importantes das categorias:**
- A categoria **`all` ("Todos") é virtual** — não deve ser cadastrável no BackOffice; ela existe só como filtro na UI do site.
- O `slug` é usado na URL (`/blog?category=rpm`) e nos links do rodapé → **deve ser único, imutável após criação** (ou, se editável, exigir confirmação e avisar sobre quebra de links).
- **Não permitir excluir categoria que possua posts vinculados** — oferecer reatribuição para outra categoria antes.

### 4.4 Regras de negócio — Blogs

- Apenas **1 post** pode ter `featured = true` por vez (ao marcar um novo, desmarcar o anterior).
- O carrossel "Em destaque" mostra o featured + os 4 posts mais recentes (máx. 5 no total).
- `excerpt`: limitar a ~180 caracteres (é usado em card com `line-clamp-2`).
- `readTime`: sugerir cálculo automático (~200 palavras/min) com opção de sobrescrever manualmente.
- Posts com `status = 'draft'` **não** devem ser retornados pela API pública.
- Preview do artigo no BackOffice deve renderizar o HTML com o mesmo estilo `prose` do site.
- Validar/sanitizar o HTML de `content` (o site usa `v-html`).

---

## 5. ESTRUTURA DOS EQUIPAMENTOS

### 5.1 Como o site público funciona hoje

**Rotas do site:**
- `/equipment` — catálogo
- `/equipment/:id` — ficha técnica do dispositivo

**Seções da página `/equipment`:**

1. **Hero** — badge, título ("Mais de 200 dispositivos médicos conectados à plataforma"), subtítulo, CTA de agendamento (Calendly) + visual animado de "ecossistema conectado".
2. **Categorias** — filtro em pills, **cada categoria tem um ícone** (lucide).
3. **Grid de dispositivos** — grid de 4 colunas; cada card mostra ícone do dispositivo sobre um gradiente da categoria, índice, nome, descrição curta e **badges de conectividade** (Bluetooth / Wi-Fi / NFC).
4. **Compatibilidade** — bloco institucional fixo (Bluetooth 5.0 LE, Wi-Fi 2.4/5 GHz, HL7/FHIR, +200 dispositivos, APIs REST e webhooks).
5. **Certificações** — ANVISA (Brasil), FDA (Estados Unidos), CE (União Europeia), ISO 13485 (Qualidade médica).
6. **CTA final.**

**Página `/equipment/:id` (detalhe):**
- Hero escuro em 2 colunas: à esquerda o visual do dispositivo (ícone grande sobre gradiente) + **badges de certificação**; à direita: categoria, nome, descrição curta, **badges de conectividade**, **as 3 primeiras features** em lista com check, e CTAs.
- Descrição completa em **HTML** (`<p>`, `<h3>`, `<ul>`, `<li>`).
- **Outros equipamentos** — grid de até **4 relacionados**, com campo de **busca** que filtra por nome, descrição curta e categoria.

### 5.2 Modelo de dados: Equipamento

Estrutura exata que o site consome hoje (`EquipmentView.vue` / `EquipmentDetailView.vue`):

```ts
interface Equipment {
  id: number                  // usado na rota /equipment/:id
  slug: string                // NOVO — recomendado para SEO
  categoryId: number          // FK -> EquipmentCategory
  cat: string                 // slug da categoria (ex.: 'cardio') — usado no filtro
  catLabel: string            // rótulo exibido (ex.: 'Cardiovascular')
  name: string                // ex.: "Monitor de Pressão Arterial"
  shortDesc: string           // descrição curta usada nos cards
  fullDesc: string            // ficha técnica completa em HTML
  icon: string                // nome do ícone lucide (ver 5.4)
  image?: string              // URL de foto real do dispositivo (opcional)
  connectivity: string[]      // ['Bluetooth', 'Wi-Fi', 'NFC']
  color: string               // gradiente Tailwind do card (ver 6.3)
  features: string[]          // ex.: ['Medição automática', 'Alertas inteligentes', ...]
  certifications: string[]    // ['ANVISA', 'FDA', 'CE', 'ISO 13485']
  manufacturer?: string       // NOVO — fabricante
  order: number               // ordem no catálogo
  active: boolean             // visível ou não no site
  createdAt: string
  updatedAt: string
}
```

### 5.3 Modelo de dados: Categoria de equipamento

Hoje fixas no código: `all`, `cardio`, `metabolic`, `respiratory`, `wearables`
(rótulos PT: **Todos, Cardiovascular, Metabólico, Respiratório, Wearables**).

```ts
interface EquipmentCategory {
  id: number
  slug: string        // 'cardio' | 'metabolic' | 'respiratory' | 'wearables'
  name: string        // "Cardiovascular", "Metabólico", ...
  icon: string        // nome do ícone lucide (a categoria TEM ícone no filtro)
  description?: string
  gradient?: string   // gradiente padrão aplicado aos cards da categoria
  order: number
  active: boolean
  equipmentCount?: number
  createdAt: string
  updatedAt: string
}
```

Mesmas regras da categoria de blog: `all` é virtual, slug único, não excluir com dispositivos vinculados.

### 5.4 Campos de seleção controlada (usar dropdown, não texto livre)

**Ícones (lucide-vue-next) usados hoje** — o BackOffice deve oferecer um **seletor visual de ícones** (mostrando o ícone renderizado, não só o nome):

| Ícone | Uso atual |
|---|---|
| `HeartPulse` | Cardiovascular / pressão arterial / holter |
| `Activity` | ECG / geral |
| `Droplet` | Metabólico / glicosímetro |
| `Scale` | Balança de bioimpedância |
| `Wind` | Respiratório / oxímetro |
| `Watch` | Wearables / smartwatch |
| `Thermometer` | Termômetro |

**Conectividade** (multi-select): `Bluetooth`, `Wi-Fi`, `NFC` — extensível (`Zigbee`, `LTE`, `USB`).
Obs.: no site, `Wi-Fi` renderiza o ícone `Wifi` e qualquer outro valor renderiza `Bluetooth` — manter os valores exatamente com essa grafia.

**Certificações** (multi-select): `ANVISA`, `FDA`, `CE`, `ISO 13485` — extensível.

### 5.5 Exemplo real do catálogo atual (8 dispositivos)

| # | Categoria | Nome | Conectividade | Certificações |
|---|---|---|---|---|
| 1 | cardio | Monitor de Pressão Arterial | Bluetooth, Wi-Fi | ANVISA, FDA, CE |
| 2 | cardio | Eletrocardiógrafo Portátil | Bluetooth | ANVISA, CE |
| 3 | metabolic | Glicosímetro Conectado | Bluetooth, NFC | ANVISA, FDA |
| 4 | metabolic | Balança de Bioimpedância | Bluetooth, Wi-Fi | ANVISA, CE |
| 5 | respiratory | Oxímetro de Pulso | Bluetooth | ANVISA, FDA, CE |
| 6 | wearables | Smartwatch Clínico | Bluetooth, Wi-Fi | ANVISA, FDA, CE |
| 7 | wearables | Termômetro Inteligente | Bluetooth | ANVISA, CE |
| 8 | cardio | Holter 24h | Bluetooth | ANVISA, FDA, CE |

---

## 6. PALETA DE CORES E DESIGN TOKENS

Estas são as cores **oficiais do projeto**, extraídas do `src/assets/main.css` (bloco `@theme` do Tailwind v4). O BackOffice deve usar exatamente estes tokens.

### 6.1 Paleta principal

| Token | HEX | Uso |
|---|---|---|
| `--color-primary` | `#11d3d3` | **Ciano/turquesa — cor da marca.** CTAs, links, estados ativos, ícones de destaque, foco de inputs |
| `--color-secondary` | `#4c666d` | Elementos secundários, textos de apoio |
| `--color-dark` | `#0e1117` | Fundo escuro principal (sidebar, hero, CTA), texto sobre botão primário |
| `--color-dark-2` | `#161c26` | Fundo escuro alternativo (cards sobre fundo escuro) |
| `--color-mid` | `#f4f6f7` | Cinza claro — fundo de seções, fundo do conteúdo do BackOffice |
| `--color-black` | `#202220` | Texto principal |
| `--color-muted` | `#7a9099` | Texto secundário, descrições, placeholders |
| `--color-background` | `#ffffff` | Branco — fundo de cards, tabelas, modais |

```css
@theme {
  --font-display: 'Plus Jakarta Sans', sans-serif;
  --font-body: 'Plus Jakarta Sans', sans-serif;

  --color-primary: #11d3d3;
  --color-secondary: #4c666d;
  --color-background: #ffffff;
  --color-black: #202220;
  --color-dark: #0e1117;
  --color-dark-2: #161c26;
  --color-mid: #f4f6f7;
  --color-muted: #7a9099;
}
```

### 6.2 Cores derivadas e efeitos (usadas no site)

| Efeito | Valor |
|---|---|
| Glow do botão primário (hover) | `box-shadow: 0 8px 32px rgba(17, 211, 211, 0.35)` |
| Sombra de card no hover | `box-shadow: 0 24px 60px -20px rgba(17, 211, 211, 0.35)` |
| Borda de card no hover | `border-color: rgba(17, 211, 211, 0.30)` |
| Badge / pill de destaque | `bg-primary/15` + `border-primary/30` + `text-primary` |
| Grid de fundo (hero) | `rgba(17, 211, 211, 0.04)`, `background-size: 64px 64px` |
| Glow radial de CTA | `radial-gradient(circle, rgba(17,211,211,0.08) 0%, transparent 70%)` |
| Borda neutra de card | `border-gray-200/80` |
| Overlay escuro sobre imagem | `from-[#0a1218]/85 via-[#0a1218]/30 to-transparent` |

### 6.3 Cores de acento por categoria (gradientes)

O site pinta cada card com um gradiente. O BackOffice deve permitir escolher esse gradiente em um **seletor visual com preview**, e não em campo de texto livre.

**Blog** (`gradient`, padrão `from-{cor}/30 via-{cor}/10 to-transparent`):

| Acento | Classe | Uso atual |
|---|---|---|
| Primary (ciano) | `from-primary/30 via-primary/10 to-transparent` | RPM / destaque |
| Azul | `from-blue-500/30 via-blue-400/10 to-transparent` | Tecnologia |
| Esmeralda | `from-emerald-500/30 via-emerald-400/10 to-transparent` | Cases |
| Âmbar | `from-amber-500/30 via-amber-400/10 to-transparent` | Regulação |
| Rosa | `from-rose-500/30 via-rose-400/10 to-transparent` | Tecnologia (variação) |
| Roxo | `from-purple-500/30 via-purple-400/10 to-transparent` | RPM (variação) |

**Equipamentos** (`color`, padrão `from-{cor}/20 to-{cor}/5` no card e `/30 → /10` no detalhe):

| Acento | Classe (card) | Uso atual |
|---|---|---|
| Rosa | `from-rose-500/20 to-rose-400/5` | Monitor de pressão |
| Primary | `from-primary/20 to-primary/5` | ECG portátil |
| Azul | `from-blue-500/20 to-blue-400/5` | Glicosímetro |
| Esmeralda | `from-emerald-500/20 to-emerald-400/5` | Balança |
| Ciano | `from-cyan-500/20 to-cyan-400/5` | Oxímetro |
| Roxo | `from-purple-500/20 to-purple-400/5` | Smartwatch |
| Âmbar | `from-amber-500/20 to-amber-400/5` | Termômetro |
| Pink | `from-pink-500/20 to-pink-400/5` | Holter |

Cores sólidas dos acentos, caso precise usá-las fora do Tailwind:
`rose #fb7185` · `blue #60a5fa` · `emerald #34d399` · `purple #c084fc` · `cyan #22d3ee` · `amber #fbbf24` · `pink #ec4899`

### 6.4 Cores semânticas do BackOffice (novas — não existem no site, mas são necessárias)

| Estado | HEX sugerido | Uso |
|---|---|---|
| Sucesso | `#10b981` | Toasts de salvo, status "Publicado" |
| Aviso | `#f59e0b` | Status "Rascunho" |
| Erro / destrutivo | `#ef4444` | Excluir, validação |
| Info | `#3b82f6` | Mensagens neutras |
| Neutro / inativo | `#7a9099` (`--color-muted`) | Status "Arquivado", desabilitado |

### 6.5 Tipografia e componentes base

- **Fonte única:** `Plus Jakarta Sans` — `font-display` (títulos, botões, navegação) e `font-body` (corpo).
- **Pesos:** 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold).
- **Body base:** 15px. Cards: 13–17px. Labels/badges: 10–12px uppercase com `tracking-[2px]`.
- **Border radius:** `8px` (botões/inputs), `12px` (`rounded-xl`), `16px` (`rounded-2xl` — cards).

**Botão primário** (padrão do projeto):
```css
.btn-primary {
  background: #11d3d3;
  color: #0e1117;
  font-size: 13px;
  font-weight: 700;
  padding: 10px 24px;
  border-radius: 8px;
  transition: box-shadow .25s, transform .25s;
}
.btn-primary:hover {
  box-shadow: 0 8px 32px rgba(17, 211, 211, .35);
  transform: translateY(-2px);
}
```

**Botão ghost claro** (secundário sobre fundo branco):
```css
.btn-ghost-light {
  background: transparent;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  font-weight: 600;
  font-size: 13px;
  padding: 8px 16px;
  border-radius: 8px;
}
.btn-ghost-light:hover { border-color: #11d3d3; color: #11d3d3; }
```

---

## 7. INTERNACIONALIZAÇÃO (requisito crítico)

O site público é **trilíngue: Português (padrão), Inglês e Espanhol** (`vue-i18n`, arquivos `pt.json`, `en.json`, `es.json`).

Hoje **todo o conteúdo de blogs e equipamentos vive dentro desses arquivos de tradução**. Portanto, o BackOffice precisa suportar **conteúdo multilíngue**:

- Nos formulários de post, equipamento e categoria, os campos textuais devem ter **abas de idioma (PT / EN / ES)**.
- Campos que precisam de tradução:
  - **Post:** `title`, `excerpt`, `content`, `tags`, `authorRole`
  - **Equipamento:** `name`, `shortDesc`, `fullDesc`, `features`
  - **Categorias:** `name`, `description`
- Campos que **não** traduzem: `slug`, `icon`, `gradient`/`color`, `connectivity`, `certifications`, datas, `id`.
- PT é obrigatório; EN e ES podem ficar pendentes → mostrar **indicador de "tradução faltando"** na listagem.

Sugestão de modelagem:
```ts
type Translated<T> = { pt: T; en?: T; es?: T }
```

---

## 8. API — endpoints esperados

```
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
GET    /auth/me

GET    /admin/dashboard/stats

GET    /admin/blog/posts?page&perPage&search&categoryId&status
GET    /admin/blog/posts/:id
POST   /admin/blog/posts
PUT    /admin/blog/posts/:id
DELETE /admin/blog/posts/:id
PATCH  /admin/blog/posts/:id/featured
PATCH  /admin/blog/posts/:id/status

GET    /admin/blog/categories
POST   /admin/blog/categories
PUT    /admin/blog/categories/:id
DELETE /admin/blog/categories/:id

GET    /admin/equipment?page&perPage&search&categoryId&active
GET    /admin/equipment/:id
POST   /admin/equipment
PUT    /admin/equipment/:id
DELETE /admin/equipment/:id
PATCH  /admin/equipment/reorder

GET    /admin/equipment/categories
POST   /admin/equipment/categories
PUT    /admin/equipment/categories/:id
DELETE /admin/equipment/categories/:id

POST   /admin/uploads            # imagens de capa / fotos de dispositivo
```

**Endpoints públicos consumidos pelo site** (só conteúdo publicado/ativo):
```
GET /api/blog/posts?category=<slug>&search=&lang=pt
GET /api/blog/posts/:idOrSlug?lang=pt
GET /api/blog/categories?lang=pt
GET /api/equipment?category=<slug>&search=&lang=pt
GET /api/equipment/:idOrSlug?lang=pt
GET /api/equipment/categories?lang=pt
```

---

## 9. TELAS DO BACKOFFICE — comportamento esperado

### 9.1 Login
Fundo escuro `#0e1117` com o padrão de grid ciano do site, card branco centralizado com a logo, e-mail + senha, "lembrar-me", tratamento de erro, botão primário ciano.

### 9.2 Dashboard
- Cards de KPI: total de posts (publicados / rascunhos), total de categorias de blog, total de equipamentos (ativos / inativos), categorias de equipamento.
- Lista dos **5 últimos posts** editados com atalho para editar.
- Alerta de **traduções pendentes** (itens sem EN/ES).
- Atalhos: "Novo post", "Novo equipamento".

### 9.3 Blog → Posts
- **Listagem:** DataTable paginada com colunas — miniatura/gradiente, título, categoria (badge colorido), autor, data de publicação, status (badge), destaque (⭐), idiomas preenchidos, ações.
- Filtros: busca por texto, categoria, status. Ordenação por data.
- **Formulário (criar/editar):** abas de idioma; campos título, slug (auto-gerado do título, editável), categoria, resumo, editor WYSIWYG para o conteúdo, tags (chips), autor, cargo do autor, data de publicação, tempo de leitura (auto + override), imagem de capa (upload) ou seletor de gradiente, toggle de destaque, status.
- **Preview** lado a lado renderizando exatamente como o site.
- **Excluir:** modal de confirmação com o título do post.

### 9.4 Blog → Categorias
Listagem simples com nome, slug, cor/gradiente, nº de posts, ordem (drag & drop), ativo. Modal para criar/editar. Bloquear exclusão quando houver posts vinculados.

### 9.5 Equipamentos
- **Listagem:** DataTable com ícone, nome, categoria, conectividade (badges), certificações (badges), ordem, ativo, ações. Filtro por categoria e busca.
- **Formulário:** abas de idioma; nome, slug, categoria, descrição curta, ficha técnica (WYSIWYG), seletor visual de ícone lucide, seletor de gradiente com preview, conectividade (multi-select), certificações (multi-select), features (lista dinâmica de chips — lembrar que **as 3 primeiras aparecem no hero do detalhe**), fabricante, imagem opcional, ordem, ativo.
- **Preview** do card e da ficha completa.

### 9.6 Equipamentos → Categorias
Igual às categorias de blog, porém com **seletor de ícone lucide** obrigatório (a categoria exibe ícone no filtro do site).

---

## 10. Requisitos gerais

- Responsivo (uso principal em desktop, mas funcional em tablet).
- Feedback consistente: toasts de sucesso/erro, skeletons de carregamento, estados vazios ilustrados.
- Confirmação obrigatória em toda exclusão.
- Auto-geração de slug a partir do título/nome, com aviso ao alterar slug de item já publicado.
- Contador de caracteres nos campos com limite (`excerpt`, `shortDesc`).
- Sanitização do HTML vindo do editor.
- Rotas protegidas por guard de autenticação; redirecionar para `/login` em 401.
- Código em TypeScript com tipagem estrita, componentes reutilizáveis (`DataTableBase`, `FormDrawer`, `IconPicker`, `GradientPicker`, `LangTabs`, `ConfirmDelete`).
- Estrutura de pastas espelhando o site: `src/views`, `src/components`, `src/stores`, `src/services`, `src/types`, `src/router`, `src/i18n`.
