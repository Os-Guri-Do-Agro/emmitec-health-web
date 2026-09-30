/* ============================================================
   Equipamentos — catálogo compartilhado entre a listagem e a página
   de cada dispositivo. Nome e resumo vêm do i18n (equipmentPage.devices.dN);
   recursos e descrição completa seguem em português, como no site original.
   ============================================================ */
import { computed, type Component } from 'vue'
import { useI18n } from 'vue-i18n'
import { Activity, Droplet, Gauge, Scale, Thermometer, Timer, Watch, Wind } from 'lucide-vue-next'

export const DEVICE_CATEGORIES = ['all', 'cardio', 'metabolic', 'respiratory', 'wearables'] as const
export type DeviceCategory = (typeof DEVICE_CATEGORIES)[number]

/** Leitura de exemplo mostrada na "tela" do dispositivo (ilustrativa). */
export type Reading = { value: number; dec?: number; suffix?: string; unit: string; ecg?: boolean }

const RAW: {
  id: number
  cat: Exclude<DeviceCategory, 'all'>
  icon: Component
  /** tom pastel do DS, herdado da cor de cada card no site antigo */
  tone: string
  reading: Reading
  connectivity: string[]
  certifications: string[]
  features: string[]
  content: string
}[] = [
  {
    id: 1,
    cat: 'cardio',
    icon: Gauge,
    tone: 'var(--pastel-rose)',
    reading: { value: 118, suffix: '/76', unit: 'mmHg' },
    connectivity: ['Bluetooth', 'Wi-Fi'],
    certifications: ['ANVISA', 'FDA', 'CE'],
    features: [
      'Medição automática',
      'Alertas inteligentes',
      'Histórico ilimitado',
      'Relatórios PDF',
    ],
    content: `
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
  },
  {
    id: 2,
    cat: 'cardio',
    icon: Activity,
    tone: 'var(--cyan-100)',
    reading: { value: 72, unit: 'bpm', ecg: true },
    connectivity: ['Bluetooth'],
    certifications: ['ANVISA', 'CE'],
    features: ['ECG 12 derivações', 'Análise por IA', 'Laudo instantâneo', 'Histórico completo'],
    content: `
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
  },
  {
    id: 3,
    cat: 'metabolic',
    icon: Droplet,
    tone: 'var(--pastel-blue)',
    reading: { value: 98, unit: 'mg/dL' },
    connectivity: ['Bluetooth', 'NFC'],
    certifications: ['ANVISA', 'FDA'],
    features: [
      'Medição 5s',
      'Alertas glicêmicos',
      'Relatórios detalhados',
      'Lembretes inteligentes',
    ],
    content: `
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
  },
  {
    id: 4,
    cat: 'metabolic',
    icon: Scale,
    tone: 'var(--pastel-mint)',
    reading: { value: 72.4, dec: 1, unit: 'kg' },
    connectivity: ['Bluetooth', 'Wi-Fi'],
    certifications: ['ANVISA', 'CE'],
    features: [
      '13 métricas',
      'Relatórios comparativos',
      'Múltiplos usuários',
      'Meta personalizada',
    ],
    content: `
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
  },
  {
    id: 5,
    cat: 'respiratory',
    icon: Wind,
    tone: 'var(--cyan-50)',
    reading: { value: 98, unit: '% SpO₂' },
    connectivity: ['Bluetooth'],
    certifications: ['ANVISA', 'FDA', 'CE'],
    features: ['SpO₂ e FC contínuo', 'Alertas críticos', 'Modo noturno', 'Histórico 24h'],
    content: `
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
  },
  {
    id: 6,
    cat: 'wearables',
    icon: Watch,
    tone: 'var(--pastel-lilac)',
    reading: { value: 76, unit: 'bpm' },
    connectivity: ['Bluetooth', 'Wi-Fi'],
    certifications: ['ANVISA', 'FDA', 'CE'],
    features: ['ECG instantâneo', 'SpO₂ contínuo', 'Sono completo', 'Alertas de queda'],
    content: `
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
  },
  {
    id: 7,
    cat: 'wearables',
    icon: Thermometer,
    tone: 'var(--pastel-peach)',
    reading: { value: 36.6, dec: 1, unit: '°C' },
    connectivity: ['Bluetooth'],
    certifications: ['ANVISA', 'CE'],
    features: ['Medição 1s', 'Sem contato', 'Alerta febre', 'Multiusuário'],
    content: `
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
  },
  {
    id: 8,
    cat: 'cardio',
    icon: Timer,
    tone: 'var(--pastel-rose)',
    reading: { value: 24, unit: 'h', ecg: true },
    connectivity: ['Bluetooth'],
    certifications: ['ANVISA', 'FDA', 'CE'],
    features: ['Monitoramento 14 dias', 'Detecção FA', 'Análise automática', 'Relatório médico'],
    content: `
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
  },
]

export type Device = (typeof RAW)[number] & { name: string; desc: string; catLabel: string }

/** Dispositivos traduzidos (reagem à troca de idioma). */
export function useDevices() {
  const { t } = useI18n()
  const devices = computed<Device[]>(() =>
    RAW.map((d) => ({
      ...d,
      name: t(`equipmentPage.devices.d${d.id}.name`),
      desc: t(`equipmentPage.devices.d${d.id}.desc`),
      catLabel: t(`equipmentPage.categories.${d.cat}`),
    })),
  )
  return { devices }
}
