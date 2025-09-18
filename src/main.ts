import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { seedData } from './utils/seedData'

const app = createApp(App)

app.use(router)
app.use(vuetify)

// Popular dados de exemplo
seedData()

app.mount('#app')
