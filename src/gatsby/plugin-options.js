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
  defaultTranslitLocale: getTranslitLocale(pluginOptions.defaultTranslitLocale),
  supportedTranslitLocales,
  cardsPerPage: pluginOptions.cardsPerPage || 12,
  blogPath: pluginOptions.blogPath || '/blog/',
  categoryPath: pluginOptions.categoryPath || '/category/',
  tagsPath: pluginOptions.tagsPath || '/tags/',
  yearsPath: pluginOptions.yearsPath || '/years/',
  postDirs: pluginOptions.postDirs || { post: 'blog/posts' },
  templatesDir: pluginOptions.templatesDir,
  CREATE_TAG_PAGES: !!pluginOptions.CREATE_TAG_PAGES,
  CREATE_CATEGORY_PAGES: !!pluginOptions.CREATE_CATEGORY_PAGES,
  CREATE_YEAR_PAGES: !!pluginOptions.CREATE_YEAR_PAGES,
  i18n: pluginOptions.i18n,
  noIndex: !!pluginOptions.noIndex,
});
