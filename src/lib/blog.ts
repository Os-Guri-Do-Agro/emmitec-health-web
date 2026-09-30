/* ============================================================
   Blog — artigos compartilhados entre a listagem e a página do artigo.
   Títulos, resumos e datas vêm do i18n (blogPage.articles.aN);
   o corpo dos artigos continua em português, como no site original.
   ============================================================ */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import img1 from '@/assets/blog/01-dispositivos.jpg'
import img2 from '@/assets/blog/02-hospitais.jpg'
import img3 from '@/assets/blog/03-case.jpg'
import img4 from '@/assets/blog/04-lgpd.jpg'
import img5 from '@/assets/blog/05-ia.jpg'
import img6 from '@/assets/blog/06-engajamento.jpg'

/** Capa do artigo em destaque (sem página própria, como no site original). */
export { default as featuredImg } from '@/assets/blog/00-rpm-cronicos.jpg'

export const CATEGORY_IDS = ['all', 'rpm', 'tech', 'cases', 'laws'] as const
export type CategoryId = (typeof CATEGORY_IDS)[number]
export type ArticleCat = Exclude<CategoryId, 'all'>

const RAW: {
  id: number
  img: string
  cat: ArticleCat
  readTime: string
  /** tom da capa (pastel do DS), herdado da cor de cada artigo no site antigo */
  tone: string
  author: string
  /** sem cargo = o cargo padrão do blog (traduzido) */
  role?: string
  tags: string[]
  content: string
}[] = [
  {
    id: 1,
    img: img1,
    cat: 'tech',
    readTime: '5 min',
    tone: 'var(--pastel-blue)',
    author: 'Dr. Ricardo Mendes',
    tags: ['Tecnologia', 'Dispositivos', 'Inovação'],
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
  },
  {
    id: 2,
    img: img2,
    cat: 'rpm',
    readTime: '6 min',
    tone: 'var(--cyan-100)',
    author: 'Profa. Carla Santos',
    role: 'Gestora de Saúde Pública',
    tags: ['RPM', 'Hospitais Públicos', 'Gestão'],
    content: `
      <p>A implementação de RPM em hospitais públicos apresenta desafios únicos, mas também oportunidades extraordinárias de impactar positivamente milhares de vidas.</p>

      <h3>Desafios Específicos do Setor Público</h3>
      <p>Hospitais públicos enfrentam limitações orçamentárias, alta rotatividade de pacientes e infraestrutura variável. No entanto, o RPM pode ser uma solução de alto impacto e custo relativamente baixo quando comparado a internações evitadas.</p>

      <h3>Lições de Projetos Piloto Bem-Sucedidos</h3>
      <p>Hospital das Clínicas de São Paulo, HU de Brasília e outros grandes centros públicos já demonstraram que o RPM é viável e altamente benéfico quando implementado corretamente.</p>

      <p>As melhores práticas incluem: parcerias público-privadas para tecnologia, treinamento focado na equipe de enfermagem, e integração com sistemas de prontuário já existentes.</p>
    `,
  },
  {
    id: 3,
    img: img3,
    cat: 'cases',
    readTime: '4 min',
    tone: 'var(--pastel-mint)',
    author: 'Mariana Costa',
    role: 'Jornalista de Saúde',
    tags: ['Case', 'Cardiologia', 'Resultados'],
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
  },
  {
    id: 4,
    img: img4,
    cat: 'laws',
    readTime: '7 min',
    tone: 'var(--pastel-peach)',
    author: 'Dr. Roberto Almeida',
    role: 'Advogado e Compliance Officer',
    tags: ['LGPD', 'Regulação', 'Compliance'],
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
  },
  {
    id: 5,
    img: img5,
    cat: 'tech',
    readTime: '5 min',
    tone: 'var(--pastel-rose)',
    author: 'Dra. Fernanda Lima',
    role: 'Data Scientist em Saúde',
    tags: ['IA', 'Tecnologia', 'Inovação'],
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
  },
  {
    id: 6,
    img: img6,
    cat: 'rpm',
    readTime: '6 min',
    tone: 'var(--pastel-lilac)',
    author: 'Psic. Amanda Rocha',
    role: 'Especialista em Saúde Digital',
    tags: ['Engajamento', 'Pacientes', 'Psicologia'],
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
  },
]

export type Article = {
  id: number
  img: string
  cat: ArticleCat
  catLabel: string
  title: string
  excerpt: string
  date: string
  readTime: string
  tone: string
  author: string
  role: string
  tags: string[]
  content: string
}

export function resolveCategory(raw: unknown): CategoryId {
  const value = Array.isArray(raw) ? raw[0] : raw
  return typeof value === 'string' && (CATEGORY_IDS as readonly string[]).includes(value)
    ? (value as CategoryId)
    : 'all'
}

/** Artigos traduzidos (reagem à troca de idioma). */
export function useArticles() {
  const { t } = useI18n()
  const articles = computed<Article[]>(() =>
    RAW.map((a) => ({
      ...a,
      catLabel: t(`blogPage.categories.${a.cat}`),
      title: t(`blogPage.articles.a${a.id}.title`),
      excerpt: t(`blogPage.articles.a${a.id}.excerpt`),
      date: t(`blogPage.articles.a${a.id}.date`),
      role: a.role ?? t('blogPage.featured.role'),
    })),
  )
  return { articles }
}
