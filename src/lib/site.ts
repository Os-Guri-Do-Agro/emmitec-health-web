/* Dados compartilhados do site (links externos, idiomas, redes). */
import { computed } from 'vue'
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-vue-next'

/** Link do Calendly já aberto no mês atual. */
export const calendlyUrl = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `https://calendly.com/emilio-machado-emmitec-health/vamos-nos-reunir-agende-sua-reuniao-online?month=${year}-${month}`
})

export const languages = [
  { code: 'pt', label: 'PT', flagClass: 'fi-br' },
  { code: 'en', label: 'EN', flagClass: 'fi-gb' },
  { code: 'es', label: 'ES', flagClass: 'fi-es' },
] as const

export const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com/emmitechealth', icon: Facebook },
  { name: 'Instagram', href: 'https://www.instagram.com/emmitec.health/', icon: Instagram },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/emmitechealth/', icon: Linkedin },
  { name: 'YouTube', href: 'https://www.youtube.com/@emmiTec.Health', icon: Youtube },
]

export const LOGO_SRC = '/Logo Emmitec Horizontal.png'
