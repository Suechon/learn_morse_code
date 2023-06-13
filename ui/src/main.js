import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import VWave from 'v-wave'

loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  .use(VWave, {
    color: '#00b3ff',
    initialOpacity: 0.5,
    easing: 'ease-in',
  })
  .mount('#app')
