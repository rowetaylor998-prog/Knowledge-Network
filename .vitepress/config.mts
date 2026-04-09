import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Knowledge System',
  description:
    'A clickable, expandable, and continuously organized knowledge network.',

  lang: 'en-US',
  cleanUrls: true,

  themeConfig: {
    siteTitle: 'Knowledge System',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Computer', link: '/repositories/computer-technical-systems' }
    ],

    sidebar: [
      {
        text: 'Repositories',
        items: [
          {
            text: 'Computer & Technical Systems',
            link: '/repositories/computer-technical-systems'
          },
          {
            text: 'Marxist Political Economy & Scientific Socialism',
            link: '/repositories/marxist-political-economy-scientific-socialism'
          },
          {
            text: 'Mainstream Economics',
            link: '/repositories/mainstream-economics'
          },
          {
            text: 'Capitalists & Capital Circulation Machine',
            link: '/repositories/capitalists-capital-circulation-machine'
          },
          {
            text: 'State Power Figures',
            link: '/repositories/state-power-figures'
          }
        ]
      }
    ],

    outline: {
      level: [2, 3],
      label: 'On this page'
    },

    docFooter: {
      prev: 'Previous page',
      next: 'Next page'
    },

    search: {
      provider: 'local'
    }
  }
})
