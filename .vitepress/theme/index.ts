import DefaultTheme from 'vitepress/theme'
import './custom.css'
import ComputerTree from './Components/ComputerTree.vue'
import type { EnhanceAppContext } from 'vitepress'

export default {
  ...DefaultTheme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.component('ComputerTree', ComputerTree)
  }
}