import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import i18n from './i18n'

const app = createApp(App)

app.use(router)
app.use(PrimeVue, { unstyled: true })
app.use(i18n)

app.mount('#app')
