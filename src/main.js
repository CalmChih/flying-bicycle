import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pinia from '@/stores/index.js'
import 'vant/lib/index.css'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
