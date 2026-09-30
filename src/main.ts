import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import i18n from './i18n'
import { EmMotion } from './lib/motion'

const app = createApp(App)

app.use(router)
app.use(PrimeVue, { unstyled: true })
app.use(i18n)
app.use(EmMotion)

app.mount('#app')
