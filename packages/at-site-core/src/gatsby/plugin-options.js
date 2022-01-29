const supportedTranslitLocales = ['uk', 'ru'];
const getTranslitLocale = (x) => {
  if (!x) {
    return 'uk';
  }
  if (!supportedTranslitLocales.some((locale) => locale === x)) {
    throw new Error(`AT-BLOG config: Unsupported Translit locale ${x}`);
  }
  return x;
};

module.exports = (pluginOptions) => ({
  // pages
  pageDirs: pluginOptions.pageDirs || { page: { folder: 'pages' } },

  // blog
  defaultTranslitLocale: getTranslitLocale(pluginOptions.defaultTranslitLocale),
  supportedTranslitLocales,

  cardsPerPage: pluginOptions.cardsPerPage || 12,
  blogPath: pluginOptions.blogPath || '/blog/',
  categoryPath: pluginOptions.categoryPath || '/category/',
  tagsPath: pluginOptions.tagsPath || '/tags/',
  yearsPath: pluginOptions.yearsPath || '/years/',

  authorDirs: pluginOptions.authorsDir || { author: { folder: 'blog/authors', prefix: 'authors' } },
  postDirs: pluginOptions.postDirs || { post: { folder: 'blog/posts' } },
  templatesDir: pluginOptions.templatesDir,

  CREATE_TAG_PAGES: !!pluginOptions.CREATE_TAG_PAGES,
  CREATE_CATEGORY_PAGES: !!pluginOptions.CREATE_CATEGORY_PAGES,
  CREATE_YEAR_PAGES: !!pluginOptions.CREATE_YEAR_PAGES,

  // common
  defaultLang: pluginOptions.defaultLang,
  locales: pluginOptions.locales,
  noIndex: !!pluginOptions.noIndex,
});
