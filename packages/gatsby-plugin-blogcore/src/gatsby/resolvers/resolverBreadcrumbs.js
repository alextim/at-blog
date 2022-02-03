const i18n = require('@alextim/i18n-utils');

const isRoot = (s) => s === '/';

const getBreadcrumbs = (slug) => {
  const result = ['/'];
  slug
    .split('/')
    .slice(1, -2)
    .forEach((el) => {
      result.push(`${result[result.length - 1]}${el}/`);
    });
  return result;
};

const getTitle = (to) => (isRoot(to) ? 'Home' : to.split('/').slice(1, -1).pop());

const breadcrumbsResolver = (defaultLang) => ({
  breadcrumbs: {
    type: ['Link'],
    // resolve: async (source, args, context, info) => {
    resolve: async (source, args, context) => {
      const { slug: srcSlug, locale } = source;

      const isDefaultLocale = locale === defaultLang;
      const slug = isDefaultLocale ? srcSlug : `/${srcSlug.split('/').slice(2).join('/')}`;
      if (isRoot(slug)) {
        return null;
      }

      const a = getBreadcrumbs(slug);

      const result = [];

      const n = a.length;

      for (let i = 0; i < n; i++) {
        const to = i18n.localizePath(a[i], locale, defaultLang);
        // eslint-disable-next-line no-await-in-loop
        const node = await context.nodeModel.findOne({
          type: 'MdPage',
          query: {
            filter: { slug: { eq: to } },
          },
        });
        result.push({ to, title: node ? node.title : getTitle(to) });
      }

      // finally add this node
      result.push({ to: source.slug, title: source.title });

      return result;
    },
  },
});

module.exports = breadcrumbsResolver;
