import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Knowledge System',
  description: 'A clickable, expandable, and continuously organized knowledge network.',
  lang: 'en-US',
  cleanUrls: true,

  themeConfig: {
  siteTitle: 'Knowledge System',

  nav: [
    { text: 'Home', link: '/' },
    { text: 'Computer', link: '/repositories/computer-technical-systems' },
    { text: 'Marxism', link: '/repositories/marxist-political-economy-scientific-socialism' },
    { text: 'Mainstream Economics', link: '/repositories/mainstream-economics' },
    { text: 'Capitalists', link: '/repositories/capitalists-capital-circulation-machine' },
    { text: 'State Power', link: '/repositories/state-power-figures' }
  ],

  outline: false,

  docFooter: {
    prev: '',
    next: ''
  },

  search: {
    provider: 'local'
  }
}
})