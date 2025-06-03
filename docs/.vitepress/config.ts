import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  title: "Tweak UI",
  description: "A lightweight js library for building tweak controls with data binding",
  themeConfig: {

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Components', link: '/components' }
    ],

    // https://vitepress-sidebar.cdget.com/guide/getting-started
    sidebar: generateSidebar({
      documentRootPath: '/docs',

      useTitleFromFileHeading: true,
      collapsed: true,
      collapseDepth: 2,
      debugPrint: false,
      sortMenusByFrontmatterOrder: true,
      frontmatterOrderDefaultValue: 1000,

      // includeRootIndexFile: true,
      // includeFolderIndexFile: true,
      includeEmptyFolder: false,
      useFolderLinkFromIndexFile: true,
      useFolderTitleFromIndexFile: true,
      useTitleFromFrontmatter: true,
      frontmatterTitleFieldName: 'title',
      excludePattern: ['api/'],
    }),


    socialLinks: [
      { icon: 'github', link: 'https://github.com/giniedp/tweak-ui' }
    ]
  },
  markdown: {

  },
  vite: {
    resolve: {
      alias: {
        'tweak-ui': fileURLToPath(new URL('./../../dist/lib', import.meta.url)),
      },
    },
  },
})
