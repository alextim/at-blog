module.exports = (pluginOptions) => ({
  cardsPerPage: pluginOptions.cardsPerPage || 12,
  blogPath: pluginOptions.blogPath || '/blog/',
  categoryPath: pluginOptions.categoryPath || '/category/',
  tagsPath: pluginOptions.tagsPath || '/tags/',
  yearsPath: pluginOptions.yearsPath || '/years/',
  postsDir: pluginOptions.postsDir || 'blog/posts',
  pagesDir: pluginOptions.pagesDir || 'blog/pages',
  templatesDir: pluginOptions.templatesDir,
  CREATE_TAG_PAGES: !!pluginOptions.CREATE_TAG_PAGES,
  CREATE_CATEGORY_PAGES: !!pluginOptions.CREATE_CATEGORY_PAGES,
  CREATE_YEAR_PAGES: !!pluginOptions.CREATE_YEAR_PAGES,
  i18n: pluginOptions.i18n,
});
