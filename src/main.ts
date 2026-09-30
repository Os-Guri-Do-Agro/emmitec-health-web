import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { EmMotion } from './lib/motion'

const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(EmMotion)

// Monta só com a rota inicial resolvida: senão a primeira página "entra" com a
// animação de troca, saindo de uma view vazia (só com o rodapé).
router.isReady().then(() => app.mount('#app'))
