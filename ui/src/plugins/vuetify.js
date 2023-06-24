// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'


export default createVuetify({
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  theme: {
    defaultTheme: "customTheme",
    themes: {
      customTheme: {
        dark: true,
        colors: {
          background: "#252523",
          primary: "#90805C",
          secondary: "#3D3E34"
        }

      }
    }
  },
  icons: {
    defaultSet: 'mdi',

  },
}
)
