<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from 'primevue/button'
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag, User, Share2 } from 'lucide-vue-next'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const articleId = computed(() => Number(route.params.id))

const calendlyUrl = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `https://calendly.com/emilio-machado-emmitec-health/vamos-nos-reunir-agende-sua-reuniao-online?month=${year}-${month}`
})

// Dados mockados dos artigos (mesma estrutura do BlogView)
const allArticles = computed(() => [
  {
    id: 1,
    cat: 'tech',
    catLabel: t('blogPage.categories.tech'),
    title: t('blogPage.articles.a1.title'),
    excerpt: t('blogPage.articles.a1.excerpt'),
    content: `
      <p>O monitoramento remoto de pacientes (RPM) passou por uma revolução tecnológica nos últimos anos. Dispositivos que antes eram restritos a hospitais de ponta agora estão acessíveis para clínicas de todos os portes.</p>

      <h3>1. Monitores de Pressão Arterial Conectados</h3>
      <p>Os novos monitores de pressão arterial não apenas medem, mas analisam padrões ao longo do tempo. Eles detectam variações sutis que podem indicar problemas cardíacos iminentes, enviando alertas automáticas para a equipe médica.</p>

      <h3>2. ECG Portáteis de 12 Derivações</h3>
      <p>Dispositivos que cabem na palma da mão agora conseguem capturar ECGs de qualidade hospitalar. A integração com plataformas de IA permite diagnósticos preliminares em segundos.</p>

      <h3>3. Glicosímetros com Predição de Hipoglicemia</h3>
      <p>Além de medir a glicose atual, esses dispositivos usam algoritmos de machine learning para prever quedas ou picos de açúcar no sangue, permitindo intervenções preventivas.</p>

      <h3>4. Wearables Multiparamétricos</h3>
      <p>Relógios e pulseiras que monitoram frequência cardíaca, oximetria, sono, atividade física e até ECG em um único dispositivo. A precisão clínica desses aparelhos impressiona especialistas.</p>

      <h3>5. Câmeras Termográficas para Triagem</h3>
      <p>Usadas principalmente em cenários pós-operatórios, detectam inflamações e infecções antes mesmo dos sintomas serem perceptíveis pelo paciente.</p>

      <p>A integração desses dispositivos com plataformas como a Emmitec permite que clínicas ofereçam cuidado de alta tecnologia sem investimentos milionários em infraestrutura.</p>
    `,
    date: t('blogPage.articles.a1.date'),
    readTime: '5 min',
    author: 'Dr. Ricardo Mendes',
    authorRole: t('blogPage.featured.role'),
    gradient: 'from-blue-500/30 via-blue-400/10 to-transparent',
    tags: ['Tecnologia', 'Dispositivos', 'Inovação'],
  },
  {
    id: 2,
    cat: 'rpm',
    catLabel: t('blogPage.categories.rpm'),
    title: t('blogPage.articles.a2.title'),
    excerpt: t('blogPage.articles.a2.excerpt'),
    content: `
      <p>A implementação de RPM em hospitais públicos apresenta desafios únicos, mas também oportunidades extraordinárias de impactar positivamente milhares de vidas.</p>

      <h3>Desafios Específicos do Setor Público</h3>
      <p>Hospitais públicos enfrentam limitações orçamentárias, alta rotatividade de pacientes e infraestrutura variável. No entanto, o RPM pode ser uma solução de alto impacto e custo relativamente baixo quando comparado a internações evitadas.</p>

      <h3>Lições de Projetos Piloto Bem-Sucedidos</h3>
      <p>Hospital das Clínicas de São Paulo, HU de Brasília e outros grandes centros públicos já demonstraram que o RPM é viável e altamente benéfico quando implementado corretamente.</p>

      <p>As melhores práticas incluem: parcerias público-privadas para tecnologia, treinamento focado na equipe de enfermagem, e integração com sistemas de prontuário já existentes.</p>
    `,
    date: t('blogPage.articles.a2.date'),
    readTime: '6 min',
    author: 'Profa. Carla Santos',
    authorRole: 'Gestora de Saúde Pública',
    gradient: 'from-primary/30 via-primary/10 to-transparent',
    tags: ['RPM', 'Hospitais Públicos', 'Gestão'],
  },
  {
    id: 3,
    cat: 'cases',
    catLabel: t('blogPage.categories.cases'),
    title: t('blogPage.articles.a3.title'),
    excerpt: t('blogPage.articles.a3.excerpt'),
    content: `
      <p>Em apenas seis meses, a Rede CardioBrasil transformou seus resultados clínicos com uma abordagem inovadora de monitoramento remoto.</p>

      <h3>O Desafio</h3>
      <p>Com 12 unidades espalhadas por três estados, a rede enfrentava taxas de readmissão de 22% em pacientes pós-cirúrgicos cardíacos — bem acima da média nacional.</p>

      <h3>A Solução</h3>
      <p>Implantação do RPM Emmitec em parceria com o programa de reabilitação cardíaca. 450 pacientes receberam kits de monitoramento para uso domiciliar nos primeiros 90 dias pós-alta.</p>

      <h3>Resultados Surpreendentes</h3>
      <ul>
        <li>Redução de 40% nas readmissões de emergência</li>
        <li>Detecção precoce de 23 arritmias assintomáticas</li>
        <li>Adesão de 91% ao protocolo de reabilitação</li>
        <li>Economia projetada de R$ 2.3 milhões em internações evitadas</li>
      </ul>

      <p>"O RPM nos permitiu estar presentes na recuperação do paciente mesmo quando ele estava em casa. Isso mudou completamente nossa relação com os pós-operatórios." — Dr. Marcos Lima, Diretor Clínico</p>
    `,
    date: t('blogPage.articles.a3.date'),
    readTime: '4 min',
    author: 'Mariana Costa',
    authorRole: 'Jornalista de Saúde',
    gradient: 'from-emerald-500/30 via-emerald-400/10 to-transparent',
    tags: ['Case', 'Cardiologia', 'Resultados'],
  },
  {
    id: 4,
    cat: 'laws',
    catLabel: t('blogPage.categories.laws'),
    title: t('blogPage.articles.a4.title'),
    excerpt: t('blogPage.articles.a4.excerpt'),
    content: `
      <p>A Lei Geral de Proteção de Dados (LGPD) completou cinco anos em 2026, e a ANPD publicou novas diretrizes específicas para dados de saúde. Clínicas que operam com RPM precisam estar atentas.</p>

      <h3>O Que Mudou em 2026</h3>
      <p>Novas regras sobre consentimento para uso de dados em algoritmos de IA, obrigatoriedade de relatórios de impacto à proteção de dados para plataformas de monitoramento, e diretrizes claras sobre retention e anonimização.</p>

      <h3>Checklist de Adequação</h3>
      <ul>
        <li>Revisar termos de consentimento com foco em IA e análise preditiva</li>
        <li>Implementar logs de auditoria de acesso a dados de pacientes</li>
        <li>Garantir criptografia end-to-end na transmissão de dados</li>
        <li>Estabelecer DPO com expertise em dados de saúde</li>
        <li>Realizar DPIA (Data Protection Impact Assessment) anual</li>
      </ul>

      <p>Plataformas como a Emmitec já incorporam esses requisitos por padrão, mas cada clínica deve garantir compliance em seus processos internos.</p>
    `,
    date: t('blogPage.articles.a4.date'),
    readTime: '7 min',
    author: 'Dr. Roberto Almeida',
    authorRole: 'Advogado e Compliance Officer',
    gradient: 'from-amber-500/30 via-amber-400/10 to-transparent',
    tags: ['LGPD', 'Regulação', 'Compliance'],
  },
  {
    id: 5,
    cat: 'tech',
    catLabel: t('blogPage.categories.tech'),
    title: t('blogPage.articles.a5.title'),
    excerpt: t('blogPage.articles.a5.excerpt'),
    content: `
      <p>A inteligência artificial promete revolucionar a medicina, mas onde ela realmente entrega valor no monitoramento remoto de pacientes?</p>

      <h3>Hype vs. Realidade</h3>
      <p>Muitas soluções prometem "prever doenças antes que elas aconteçam", mas a realidade é mais nuanced. IA preditiva clínica é diferente de IA preditiva de marketing.</p>

      <h3>Onde a IA Agrega Valor Real</h3>
      <ul>
        <li><strong>Detecção de padrões sutis:</strong> Algoritmos identificam correlações entre múltiplos parâmetros que médicos humanos podem não perceber imediatamente</li>
        <li><strong>Triage inteligente:</strong> Priorização automática de alertas baseada em risco real, reduzindo alarm fatigue</li>
        <li><strong>Tendências temporais:</strong> Análise de mudanças graduais em métricas ao longo de semanas ou meses</li>
        <li><strong>Personalização:</strong> Baselines individuais que ajustam alertas conforme o histórico específico de cada paciente</li>
      </ul>

      <h3>Limitações Importantes</h3>
      <p>A IA é uma ferramenta de suporte à decisão, não um substituto para julgamento clínico. Falsos positivos e negativos ainda ocorrem, e a transparência sobre como os algoritmos chegam a conclusões é fundamental para confiança médica.</p>
    `,
    date: t('blogPage.articles.a5.date'),
    readTime: '5 min',
    author: 'Dra. Fernanda Lima',
    authorRole: 'Data Scientist em Saúde',
    gradient: 'from-rose-500/30 via-rose-400/10 to-transparent',
    tags: ['IA', 'Tecnologia', 'Inovação'],
  },
  {
    id: 6,
    cat: 'rpm',
    catLabel: t('blogPage.categories.rpm'),
    title: t('blogPage.articles.a6.title'),
    excerpt: t('blogPage.articles.a6.excerpt'),
    content: `
      <p>A tecnologia por trás do RPM é impressionante, mas o fator humano — engajamento do paciente — frequentemente determina o sucesso ou fracasso do programa.</p>

      <h3>Por Que Pacientes Desistem</h3>
      <p>Estudos mostram que 30-40% dos pacientes abandonam programas de monitoramento remoto nos primeiros 3 meses. As razões principais incluem: complexidade dos dispositivos, falta de percepção de valor imediato, e sensação de "estar sendo vigiado".</p>

      <h3>Estratégias Comprovadas de Engajamento</h3>
      <ul>
        <li><strong>Gamificação suave:</strong> Metas diárias simples e feedback positivo</li>
        <li><strong>Comunicação personalizada:</strong> Mensagens adaptadas ao perfil motivacional de cada paciente</li>
        <li><strong>Envolvimento do cuidador:</strong> Familiares na jornada de monitoramento</li>
        <li><strong>Respostas rápidas:</strong> Tempo de resposta da equipe clínica ao primeiro alerta</li>
        <li><strong>Educação contínua:</strong> Conteúdo sobre por que cada métrica importa</li>
      </ul>

      <h3>O Resultado do Engajamento</h3>
      <p>Programas com alta adesão (acima de 85%) mostram resultados clínicos significativamente melhores: redução de 50% em eventos adversos e satisfação do paciente de 94%.</p>
    `,
    date: t('blogPage.articles.a6.date'),
    readTime: '6 min',
    author: 'Psic. Amanda Rocha',
    authorRole: 'Especialista em Saúde Digital',
    gradient: 'from-purple-500/30 via-purple-400/10 to-transparent',
    tags: ['Engajamento', 'Pacientes', 'Psicologia'],
  },
])

// Artigo atual
const article = computed(() => {
  return allArticles.value.find((a) => a.id === articleId.value) || allArticles.value[0]
})

// Artigos relacionados (mesma categoria ou outros, excluindo o atual)
const relatedArticles = computed(() => {
  const related = allArticles.value.filter((a) => a.id !== article.value?.id).slice(0, 3)
  return related
})

// Voltar para lista de blogs
const goBack = () => {
  router.push('/blog')
}

// Ir para artigo relacionado
const goToArticle = (id: number) => {
  router.push(`/blog/${id}`)
}

// Refs para animações
const heroSection = ref<HTMLElement | null>(null)
const contentSection = ref<HTMLElement | null>(null)
const relatedSection = ref<HTMLElement | null>(null)

gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  // Scroll to top
  window.scrollTo(0, 0)

  // Animações
  const animate = (el: HTMLElement | null, selector: string, opts: gsap.TweenVars = {}) => {
    if (!el) return
    gsap.from(el.querySelectorAll(selector), {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.7,
      ease: 'power3.out',
      clearProps: 'opacity,transform',
      scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      ...opts,
    })
  }

  animate(heroSection.value, '.animate-in')
  animate(contentSection.value, '.animate-in')
  animate(relatedSection.value, '.related-card', { stagger: 0.1 })
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((t) => t.kill())
})
</script>

<template>
  <div class="font-body text-black overflow-x-hidden w-full">
    <!-- ── HERO ── -->
    <section
      v-if="article"
      ref="heroSection"
      class="min-h-[60vh] sm:min-h-[55vh] relative overflow-hidden w-full flex items-center justify-center"
    >
      <!-- Background Image/Gradient -->
      <div :class="`absolute inset-0 bg-linear-to-br ${article.gradient}`" />
      <!-- Dark Overlay -->
      <div class="absolute inset-0 bg-dark/85" />
      <!-- Grid Pattern -->
      <div class="hero-grid absolute inset-0 pointer-events-none opacity-30" />

      <!-- Content -->
      <div
        class="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 flex flex-col items-center text-center gap-6 z-10 relative"
      >
        <!-- Voltar -->
        <button
          @click="goBack"
          class="animate-in flex items-center gap-2 text-white/60 hover:text-primary transition-colors text-sm w-fit cursor-pointer absolute top-8 left-4 sm:left-8"
        >
          <ArrowLeft :size="16" />
          <span>{{ t('blogPage.detail.backToBlog') || 'Voltar para o Blog' }}</span>
        </button>

        <!-- Badge -->
        <span
          class="animate-in inline-block w-fit px-4 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-primary text-[11px] font-bold uppercase tracking-wider"
        >
          {{ article.catLabel }}
        </span>

        <!-- Título -->
        <h1
          class="animate-in font-display font-extrabold text-white leading-[1.15] tracking-tight text-2xl sm:text-4xl lg:text-[48px] max-w-3xl"
        >
          {{ article.title }}
        </h1>

        <!-- Meta -->
        <div
          class="animate-in flex flex-wrap items-center justify-center gap-4 text-white/70 text-sm"
        >
          <div class="flex items-center gap-2">
            <div
              class="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-display font-bold text-sm"
            >
              {{ article.author?.charAt(0) }}
            </div>
            <div class="text-left">
              <div class="text-white font-semibold text-sm">{{ article.author }}</div>
              <div class="text-white/50 text-xs">{{ article.authorRole }}</div>
            </div>
          </div>
          <span class="text-white/30">|</span>
          <span class="flex items-center gap-1.5">
            <Calendar :size="14" />
            {{ article.date }}
          </span>
          <span class="flex items-center gap-1.5">
            <Clock :size="14" />
            {{ article.readTime }}
          </span>
        </div>

        <!-- Tags -->
        <div class="animate-in flex flex-wrap justify-center gap-2 mt-2">
          <span
            v-for="tag in article.tags"
            :key="tag"
            class="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/70 text-[11px]"
          >
            #{{ tag }}
          </span>
        </div>
      </div>
    </section>

    <!-- ── CONTENT ── -->
    <section
      ref="contentSection"
      class="py-12 sm:py-16 bg-white w-full flex items-center justify-center"
    >
      <div class="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Article Content -->
        <article
          v-if="article"
          class="animate-in prose prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-black prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-black prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-p:mb-4 prose-ul:mb-6 prose-li:mb-2"
          v-html="article.content"
        />

        <!-- Actions -->
        <div
          class="animate-in mt-12 pt-8 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4"
        >
          <Button
            :label="t('blogPage.detail.share') || 'Compartilhar'"
            unstyled
            class="btn-ghost-light font-display text-sm flex items-center gap-2 px-4 py-2"
          >
            <template #default>
              <Share2 :size="16" />
              <span>{{ t('blogPage.detail.share') || 'Compartilhar' }}</span>
            </template>
          </Button>
        </div>
      </div>
    </section>

    <!-- ── RELATED ARTICLES ── -->
    <section
      ref="relatedSection"
      class="py-16 sm:py-20 bg-mid w-full flex items-center justify-center"
    >
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center text-center gap-5 pb-12">
          <span
            class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary"
          >
            {{ t('blogPage.detail.relatedBadge') || 'Continue Lendo' }}
          </span>
          <h2
            class="font-display font-extrabold text-black text-[clamp(24px,3vw,36px)] tracking-tight"
          >
            {{ t('blogPage.detail.relatedTitle') || 'Artigos Relacionados' }}
          </h2>
        </div>

        <!-- Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <article
            v-for="(a, i) in relatedArticles"
            :key="a.id"
            @click="goToArticle(a.id)"
            class="related-card group relative rounded-2xl border border-gray-200/80 bg-white overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_24px_60px_-20px_rgba(17,211,211,0.35)] cursor-pointer"
          >
            <div class="relative overflow-hidden aspect-16/10">
              <div :class="`absolute inset-0 bg-linear-to-br ${a.gradient}`" />
              <div
                class="absolute inset-0 bg-linear-to-t from-[#0a1218]/85 via-[#0a1218]/30 to-transparent"
              />
              <div class="hero-grid absolute inset-0 pointer-events-none opacity-50" />
              <span
                class="absolute bottom-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-wider"
              >
                <Tag :size="10" />
                {{ a.catLabel }}
              </span>
            </div>
            <div class="p-6 flex flex-col gap-3">
              <h3
                class="font-display font-bold text-black text-[16px] leading-tight group-hover:text-primary transition-colors line-clamp-2"
              >
                {{ a.title }}
              </h3>
              <p class="text-gray-500 text-[13px] leading-relaxed line-clamp-2">{{ a.excerpt }}</p>
              <div
                class="flex items-center justify-between pt-3 border-t border-gray-100 text-gray-400 text-xs"
              >
                <span class="flex items-center gap-1.5">
                  <Calendar :size="12" />
                  {{ a.date }}
                </span>
                <span
                  class="flex items-center gap-1 text-primary font-display font-semibold group-hover:gap-2 transition-all"
                >
                  Ler artigo
                  <ArrowRight :size="14" />
                </span>
              </div>
            </div>
          </article>
        </div>

        <!-- Back to Blog -->
        <div class="mt-12 text-center pt-10">
          <button
            @click="goBack"
            class="inline-flex items-center gap-2 text-primary font-display font-semibold text-sm hover:gap-3 transition-all cursor-pointer"
          >
            <ArrowLeft :size="16" />
            {{ t('blogPage.detail.backToBlog') || 'Ver todos os artigos' }}
          </button>
        </div>
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  box-orient: vertical;
  overflow: hidden;
}

:deep(.btn-primary),
.btn-primary {
  background: #11d3d3;
  color: #0e1117;
  font-size: 13px;
  font-weight: 700 !important;
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: inline-block;
  transition:
    box-shadow 0.25s,
    transform 0.25s;
}
:deep(.btn-primary:hover),
.btn-primary:hover {
  box-shadow: 0 8px 32px rgba(17, 211, 211, 0.35);
  transform: translateY(-2px);
}

:deep(.btn-ghost-light),
.btn-ghost-light {
  background: transparent;
  color: #6b7280;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 600 !important;
  font-size: 13px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.25s;
}
:deep(.btn-ghost-light:hover),
.btn-ghost-light:hover {
  border-color: #11d3d3;
  color: #11d3d3;
}
</style>
