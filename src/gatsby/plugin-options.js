const supportedLocales = ['uk', 'ru'];
const getTranslitLocale = (x) => {
  if (!x) {
    return 'uk';
  }
  if (!supportedLocales.some((locale) => locale === x)) {
    throw new Error(`AT-BLOG config: Unsupported locale ${x}`);
  }
  return x;
};

module.exports = (o) => ({
  defaultTranslitLocale: getTranslitLocale(o.defaultTranslitLocale),
  supportedLocales,
  cardsPerPage: o.cardsPerPage || 12,
  blogPath: o.blogPath || '/blog/',
  categoryPath: o.categoryPath || '/category/',
  tagsPath: o.tagsPath || '/tags/',
  yearsPath: o.yearsPath || '/years/',
  postDirs: o.postDirs || { post: 'blog/posts' },
  templatesDir: o.templatesDir,
  CREATE_TAG_PAGES: !!o.CREATE_TAG_PAGES,
  CREATE_CATEGORY_PAGES: !!o.CREATE_CATEGORY_PAGES,
  CREATE_YEAR_PAGES: !!o.CREATE_YEAR_PAGES,
  i18n: o.i18n,
});
