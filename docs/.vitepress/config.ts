import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'

export default defineConfig({
  title: 'Tweak UI',
  description: 'A lightweight js library for building tweak controls with data binding',
  themeConfig: {
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

    socialLinks: [{ icon: 'github', link: 'https://github.com/giniedp/tweak-ui' }],
  },
  markdown: {},
})
