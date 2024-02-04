import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from './locale/i18n'
import 'virtual:uno.css'

createApp(App).use(i18n).mount('#app')
