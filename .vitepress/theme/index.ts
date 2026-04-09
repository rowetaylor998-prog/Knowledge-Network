import DefaultTheme from 'vitepress/theme'
import './custom.css'
import ComputerTree from './components/ComputerTree.vue'
import type { EnhanceAppContext } from 'vitepress'

export default {
  ...DefaultTheme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.component('ComputerTree', ComputerTree)
  }
}