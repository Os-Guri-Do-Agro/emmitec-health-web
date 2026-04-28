<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from 'primevue/button'
import {
  HeartPulse,
  Activity,
  Thermometer,
  Scale,
  Wind,
  Droplet,
  Watch,
  Bluetooth,
  Wifi,
  ShieldCheck,
  Check,
  ArrowLeft,
  ArrowRight,
  Share2,
  Search,
} from 'lucide-vue-next'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const deviceId = computed(() => Number(route.params.id))

const calendlyUrl = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `https://calendly.com/emilio-machado-emmitec-health/vamos-nos-reunir-agende-sua-reuniao-online?month=${year}-${month}`
})

// Dados mockados dos equipamentos
const allDevices = computed(() => [
  {
    id: 1,
    cat: 'cardio',
    catLabel: t('equipmentPage.categories.cardio'),
    name: t('equipmentPage.devices.d1.name'),
    shortDesc: t('equipmentPage.devices.d1.desc'),
    fullDesc: `
      <p>O Monitor de Pressão Arterial Conectado representa a nova geração de dispositivos cardiovasculares para monitoramento remoto. Com precisão clínica validada, este equipamento oferece:</p>

      <h3>Recursos Principais</h3>
      <ul>
        <li>Aferição automática com tecnologia oscilométrica de precisão</li>
        <li>Transmissão Bluetooth 5.0 com criptografia de dados</li>
        <li>Memória interna para até 100 medições</li>
        <li>Bateria de longa duração (6+ meses)</li>
        <li>Alertas automáticos para valores anormais</li>
      </ul>

      <h3>Integração com Plataforma</h3>
      <p>Os dados são sincronizados automaticamente com a plataforma Emmitec, onde algoritmos de IA analisam tendências ao longo do tempo e geram alertas para a equipe clínica quando necessário.</p>

      <h3>Especificações Técnicas</h3>
      <ul>
        <li>Faixa de medição: 0-300 mmHg</li>
        <li>Precisão: ±3 mmHg</li>
        <li>Certificações: ANVISA, FDA, CE</li>
        <li>Compatível com iOS e Android</li>
      </ul>
    `,
    icon: HeartPulse,
    connectivity: ['Bluetooth', 'Wi-Fi'],
    color: 'from-rose-500/30 to-rose-400/10',
    features: [
      'Medição automática',
      'Alertas inteligentes',
      'Histórico ilimitado',
      'Relatórios PDF',
    ],
    certifications: ['ANVISA', 'FDA', 'CE'],
  },
  {
    id: 2,
    cat: 'cardio',
    catLabel: t('equipmentPage.categories.cardio'),
    name: t('equipmentPage.devices.d2.name'),
    shortDesc: t('equipmentPage.devices.d2.desc'),
    fullDesc: `
      <p>O Eletrocardiógrafo Portátil permite a realização de ECGs de 12 derivações com qualidade hospitalar em qualquer lugar. Ideal para acompanhamento de pacientes cardíacos em casa.</p>

      <h3>Diferenciais</h3>
      <ul>
        <li>ECG de 12 derivações em 30 segundos</li>
        <li>Análise automática com IA integrada</li>
        <li>Envio direto para análise clínica em tempo real</li>
        <li>Design compacto e portátil</li>
      </ul>

      <h3>Para Pacientes Cardíacos</h3>
      <p>Permite detecção precoce de arritmias, isquemias e outras alterações cardíacas sem necessidade de deslocamento até o hospital. O médico recebe o exame instantaneamente na plataforma.</p>
    `,
    icon: Activity,
    connectivity: ['Bluetooth'],
    color: 'from-primary/30 to-primary/10',
    features: ['ECG 12 derivações', 'Análise por IA', 'Laudo instantâneo', 'Histórico completo'],
    certifications: ['ANVISA', 'CE'],
  },
  {
    id: 3,
    cat: 'metabolic',
    catLabel: t('equipmentPage.categories.metabolic'),
    name: t('equipmentPage.devices.d3.name'),
    shortDesc: t('equipmentPage.devices.d3.desc'),
    fullDesc: `
      <p>O Glicosímetro Conectado revoluciona o manejo do diabetes com monitoramento contínuo e alertas inteligentes que ajudam a manter a glicemia sob controle.</p>

      <h3>Benefícios para Diabéticos</h3>
      <ul>
        <li>Medição rápida em 5 segundos</li>
        <li>Sincronização automática com a plataforma</li>
        <li>Alertas para hipoglicemia e hiperglicemia</li>
        <li>Relatórios de tendências para consultas</li>
        <li>Integração com bomba de insulina (opcional)</li>
      </ul>

      <h3>Controle Total</h3>
      <p>Através do aplicativo, o paciente visualiza gráficos de evolução, compartilha dados com a equipe médica e recebe lembretes personalizados para medições.</p>
    `,
    icon: Droplet,
    connectivity: ['Bluetooth', 'NFC'],
    color: 'from-blue-500/30 to-blue-400/10',
    features: [
      'Medição 5s',
      'Alertas glicêmicos',
      'Relatórios detalhados',
      'Lembretes inteligentes',
    ],
    certifications: ['ANVISA', 'FDA'],
  },
  {
    id: 4,
    cat: 'metabolic',
    catLabel: t('equipmentPage.categories.metabolic'),
    name: t('equipmentPage.devices.d4.name'),
    shortDesc: t('equipmentPage.devices.d4.desc'),
    fullDesc: `
      <p>A Balança de Bioimpedância Conectada vai além do peso, oferecendo uma análise completa da composição corporal com precisão profissional.</p>

      <h3>Métricas Analisadas</h3>
      <ul>
        <li>Peso corporal e variações</li>
        <li>Percentual de gordura e massa magra</li>
        <li>Água corporal total</li>
        <li>Massa óssea e muscular</li>
        <li>Taxa metabólica basal</li>
      </ul>

      <h3>Monitoramento Longitudinal</h3>
      <p>Relatórios comparativos mostram a evolução das métricas ao longo do tempo, essencial para pacientes em programas de reabilitação cardíaca ou controle de peso.</p>
    `,
    icon: Scale,
    connectivity: ['Bluetooth', 'Wi-Fi'],
    color: 'from-emerald-500/30 to-emerald-400/10',
    features: [
      '13 métricas',
      'Relatórios comparativos',
      'Múltiplos usuários',
      'Meta personalizada',
    ],
    certifications: ['ANVISA', 'CE'],
  },
  {
    id: 5,
    cat: 'respiratory',
    catLabel: t('equipmentPage.categories.respiratory'),
    name: t('equipmentPage.devices.d5.name'),
    shortDesc: t('equipmentPage.devices.d5.desc'),
    fullDesc: `
      <p>O Oxímetro de Pulso é essencial para pacientes com condições respiratórias, cardíacas ou pós-COVID, oferecendo monitoramento contínuo de SpO₂ e frequência cardíaca.</p>

      <h3>Indicações</h3>
      <ul>
        <li>Pacientes com doenças respiratórias crônicas (DPOC, asma)</li>
        <li>Monitoramento pós-COVID</li>
        <li>Pacientes em oxigenoterapia domiciliar</li>
        <li>Avaliação de função pulmonar</li>
      </ul>

      <h3>Alertas Críticos</h3>
      <p>O sistema alerta automaticamente quando a saturação de oxigênio cai abaixo dos limites configurados, permitindo intervenção rápida da equipe médica.</p>
    `,
    icon: Wind,
    connectivity: ['Bluetooth'],
    color: 'from-cyan-500/30 to-cyan-400/10',
    features: ['SpO₂ e FC contínuo', 'Alertas críticos', 'Modo noturno', 'Histórico 24h'],
    certifications: ['ANVISA', 'FDA', 'CE'],
  },
  {
    id: 6,
    cat: 'wearables',
    catLabel: t('equipmentPage.categories.wearables'),
    name: t('equipmentPage.devices.d6.name'),
    shortDesc: t('equipmentPage.devices.d6.desc'),
    fullDesc: `
      <p>O Smartwatch Clínico combina funcionalidades de wearable consumer com precisão médica, sendo o dispositivo mais completo para monitoramento contínuo de saúde.</p>

      <h3>Funções de Monitoramento</h3>
      <ul>
        <li>ECG de 1 derivação a qualquer momento</li>
        <li>Oximetria de pulso (SpO₂)</li>
        <li>Monitoramento de sono (fases leve, profundo, REM)</li>
        <li>Frequência cardíaca 24/7</li>
        <li>Atividade física e passos</li>
        <li>Notificações de quedas</li>
      </ul>

      <h3>Bateria e Conectividade</h3>
      <p>Até 7 dias de autonomia com uma carga. Transmissão via Bluetooth 5.0 e Wi-Fi para sincronização com a plataforma Emmitec.</p>
    `,
    icon: Watch,
    connectivity: ['Bluetooth', 'Wi-Fi'],
    color: 'from-purple-500/30 to-purple-400/10',
    features: ['ECG instantâneo', 'SpO₂ contínuo', 'Sono completo', 'Alertas de queda'],
    certifications: ['ANVISA', 'FDA', 'CE'],
  },
  {
    id: 7,
    cat: 'wearables',
    catLabel: t('equipmentPage.categories.wearables'),
    name: t('equipmentPage.devices.d7.name'),
    shortDesc: t('equipmentPage.devices.d7.desc'),
    fullDesc: `
      <p>O Termômetro Inteligente oferece medição de temperatura sem contato com precisão clínica, ideal para triagem contínua de pacientes.</p>

      <h3>Recursos</h3>
      <ul>
        <li>Medição em 1 segundo sem contato</li>
        <li>Histórico de temperatura na plataforma</li>
        <li>Alertas para febre</li>
        <li>Modo multiusuário para famílias</li>
        <li>Memória interna de 50 medições</li>
      </ul>

      <h3>Ideal Para</h3>
      <p>Triagem pós-operatória, monitoramento de pacientes com risco de infecção, e controle de sintomas em tratamentos oncológicos.</p>
    `,
    icon: Thermometer,
    connectivity: ['Bluetooth'],
    color: 'from-amber-500/30 to-amber-400/10',
    features: ['Medição 1s', 'Sem contato', 'Alerta febre', 'Multiusuário'],
    certifications: ['ANVISA', 'CE'],
  },
  {
    id: 8,
    cat: 'cardio',
    catLabel: t('equipmentPage.categories.cardio'),
    name: t('equipmentPage.devices.d8.name'),
    shortDesc: t('equipmentPage.devices.d8.desc'),
    fullDesc: `
      <p>Monitor Cardíaco Contínuo para detecção de eventos arrítmicos e monitoramento prolongado do ritmo cardíaco em pacientes de risco.</p>

      <h3>Aplicações Clínicas</h3>
      <ul>
        <li>Detecção de fibrilação atrial</li>
        <li>Monitoramento pós-AVC</li>
        <li>Avaliação de síncope</li>
        <li>Pós-ablação de arritmias</li>
      </ul>

      <h3>Registro Contínuo</h3>
      <p>Dispositivo leve e confortável que registra o ritmo cardíaco 24 horas por dia por até 14 dias, com análise automatizada na plataforma.</p>
    `,
    icon: HeartPulse,
    connectivity: ['Bluetooth'],
    color: 'from-pink-500/30 to-pink-400/10',
    features: ['Monitoramento 14 dias', 'Detecção FA', 'Análise automática', 'Relatório médico'],
    certifications: ['ANVISA', 'FDA', 'CE'],
  },
])

// Equipamento atual
const device = computed(() => {
  return allDevices.value.find((d) => d.id === deviceId.value) || allDevices.value[0]
})

// Busca de equipamentos
const searchQuery = ref('')

// Equipamentos relacionados filtrados (máximo 4)
const relatedDevices = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  let related = allDevices.value.filter((d) => d.id !== device.value?.id)

  if (query) {
    related = related.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.shortDesc.toLowerCase().includes(query) ||
        d.catLabel.toLowerCase().includes(query),
    )
  }

  return related.slice(0, 4)
})

// Voltar para lista de equipamentos
const goBack = () => {
  router.push('/equipment')
}

// Ir para equipamento relacionado
const goToDevice = (id: number) => {
  router.push(`/equipment/${id}`)
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
    <!-- ── PRODUCT HERO ── -->
    <section
      v-if="device"
      ref="heroSection"
      class="bg-dark w-full pt-20 pb-12 flex items-center justify-center relative overflow-hidden"
    >
      <!-- Grid Pattern -->
      <div class="hero-grid absolute inset-0 pointer-events-none opacity-40" />
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-5">
        <!-- Voltar -->
        <button
          @click="goBack"
          class="animate-in flex items-center gap-2 text-white/60 hover:text-primary transition-colors text-sm mb-8 cursor-pointer"
        >
          <ArrowLeft :size="16" />
          <span>{{ t('equipmentPage.detail.backToEquipment') || 'Voltar para Equipamentos' }}</span>
        </button>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <!-- Product Image (Visual) -->
          <div class="animate-in relative">
            <div
              :class="`relative aspect-square mx-auto rounded-[40px] bg-linear-to-br ${device.color} p-12 flex items-center justify-center shadow-2xl`"
            >
              <!-- Device Frame -->
              <div
                class="relative w-full h-full rounded-3xl bg-white shadow-xl flex items-center justify-center overflow-hidden"
              >
                <!-- Grid Pattern -->
                <div class="hero-grid absolute inset-0 opacity-20" />

                <!-- Icon -->
                <div class="relative z-10">
                  <component
                    :is="device.icon"
                    :size="120"
                    class="text-primary"
                    stroke-width="1.5"
                  />
                </div>

                <!-- Glow Effect -->
                <div class="absolute inset-0 bg-linear-to-t from-primary/5 to-transparent" />
              </div>
            </div>

            <!-- Certifications below image -->
            <div class="flex flex-wrap justify-center items-center gap-2 pt-6">
              <span
                v-for="cert in device.certifications"
                :key="cert"
                class="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold"
              >
                <ShieldCheck :size="12" class="inline mr-1 text-primary" />
                {{ cert }}
              </span>
            </div>
          </div>

          <!-- Product Details -->
          <div class="animate-in flex flex-col gap-5">
            <span class="text-primary font-display font-semibold text-sm uppercase tracking-wider">
              {{ device.catLabel }}
            </span>

            <h1
              class="font-display font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight mt-3 mb-4"
            >
              {{ device.name }}
            </h1>

            <p class="text-white/70 text-lg leading-relaxed mb-6">
              {{ device.shortDesc }}
            </p>

            <!-- Connectivity Tags -->
            <div class="flex flex-wrap gap-2 mb-8">
              <span
                v-for="conn in device.connectivity"
                :key="conn"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm"
              >
                <Wifi v-if="conn === 'Wi-Fi'" :size="14" class="text-primary" />
                <Bluetooth v-else :size="14" class="text-primary" />
                {{ conn }}
              </span>
            </div>

            <!-- Key Features List -->
            <div class="space-y-3 mb-8 flex flex-col gap-2">
              <div
                v-for="feature in device.features.slice(0, 3)"
                :key="feature"
                class="flex items-center gap-3 text-white/80"
              >
                <span
                  class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
                >
                  <Check :size="14" class="text-primary" stroke-width="3" />
                </span>
                <span class="text-[15px]">{{ feature }}</span>
              </div>
            </div>

            <!-- CTA Buttons -->
            <div class="flex flex-wrap gap-4">
              <a :href="calendlyUrl" target="_blank" rel="noopener noreferrer">
                <Button
                  :label="t('equipmentPage.detail.contactButton') || 'Entrar em Contato'"
                  unstyled
                  class="btn-primary font-display font-bold px-8 py-3"
                />
              </a>
              <Button
                :label="t('equipmentPage.detail.share') || 'Compartilhar'"
                unstyled
                class="btn-ghost-light font-display font-bold px-6 py-3 flex items-center gap-2"
              >
                <template #default>
                  <Share2 :size="18" />
                  <span>{{ t('equipmentPage.detail.share') || 'Compartilhar' }}</span>
                </template>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── RELATED DEVICES ── -->
    <section
      ref="relatedSection"
      class="py-16 sm:py-20 bg-mid w-full flex items-center justify-center"
    >
      <div
        class="w-full max-w-7xl flex flex-col items-center justify-center mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div class="flex flex-col items-center text-center gap-5 pb-12">
          <span
            class="inline-block font-display text-[11px] font-bold tracking-[2px] uppercase text-primary"
          >
            {{ t('equipmentPage.detail.relatedBadge') || 'Continue Explorando' }}
          </span>
          <h2
            class="font-display font-extrabold text-black text-[clamp(24px,3vw,36px)] tracking-tight"
          >
            {{ t('equipmentPage.detail.relatedTitle') || 'Outros Equipamentos' }}
          </h2>
        </div>

        <!-- Search -->
        <div class="w-full max-w-md mx-auto pb-8">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('equipmentPage.detail.searchPlaceholder') || 'Buscar equipamentos...'"
              class="w-full px-4 py-3 pl-11 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" :size="18" />
          </div>
        </div>

        <!-- Cards Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <article
            v-for="d in relatedDevices"
            :key="d.id"
            @click="goToDevice(d.id)"
            class="related-card group relative rounded-xl border border-gray-200/80 bg-white overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_24px_60px_-20px_rgba(17,211,211,0.35)] cursor-pointer"
          >
            <div class="relative aspect-square overflow-hidden">
              <div :class="`absolute inset-0 bg-linear-to-br ${d.color}`" />
              <div class="hero-grid absolute inset-0 opacity-30 pointer-events-none" />
              <div class="absolute inset-0 flex items-center justify-center">
                <div
                  class="w-12 h-12 rounded-xl bg-white/90 shadow-lg flex items-center justify-center text-primary transition-transform duration-500 group-hover:scale-110"
                >
                  <component :is="d.icon" :size="22" />
                </div>
              </div>
              <span
                class="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-[9px] font-bold uppercase tracking-wider"
              >
                {{ d.catLabel }}
              </span>
            </div>
            <div class="p-3 flex flex-col gap-1">
              <h3
                class="font-display font-bold text-black text-[13px] leading-tight group-hover:text-primary transition-colors line-clamp-1"
              >
                {{ d.name }}
              </h3>
              <p class="text-gray-500 text-[11px] leading-relaxed line-clamp-2">
                {{ d.shortDesc }}
              </p>
            </div>
          </article>
        </div>

        <!-- Back to Equipment -->
        <div class="mt-12 text-center pt-10">
          <button
            @click="goBack"
            class="inline-flex items-center gap-2 text-primary font-display font-semibold text-sm hover:gap-3 transition-all cursor-pointer"
          >
            <ArrowLeft :size="16" />
            {{ t('equipmentPage.detail.backToEquipment') || 'Ver todos os equipamentos' }}
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

:deep(.btn-ghost-dark),
.btn-ghost-dark {
  background: transparent;
  color: #0e1117;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 700 !important;
  font-size: 13px;
  padding: 10px 24px;
  border-radius: 8px;
  border: 1px solid #0e1117;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.25s;
}
:deep(.btn-ghost-dark:hover),
.btn-ghost-dark:hover {
  border-color: #11d3d3;
  background: #11d3d3;
  color: #0e1117;
}
</style>
