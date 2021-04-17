const slugify = require('@alextim/slugify');
const translit = require('@alextim/translit');

const { extractData } = require('@alextim/at-site-core');

const compString = require('./compString');

module.exports = ({ node, actions, getNode, createNodeId, createContentDigest }, options, type) => {
  const { categoryPath, tagsPath, i18n, noIndex, defaultTranslitLocale, supportedLocales } = options;

  const result = extractData({ node, getNode }, i18n);
  if (!result) {
    return;
  }

  const getTranslitLocale = (x) =>
    supportedLocales.some((locale) => locale === x) ? x : defaultTranslitLocale;

  const a2oa = (a, prefix, locale) => {
    if (!a) {
      return null;
    }
    return [...new Set(a)].sort(compString).map((title) => ({
      title,
      to: i18n.localizePath(
        `${prefix}${slugify(translit(title, getTranslitLocale(locale)))}/`,
        locale,
      ),
    }));
  };

  const { slug, locale, frontmatter } = result;

  const { createNode, createParentChildLink } = actions;

  const {
    title,
    headline,
    metaTitle,
    metaDescription,
    cover,
    sections,
    template,
    noindex,

    category,
    tags,
    featured,
    datePublished,
    dateModified,
  } = frontmatter;

  const year = datePublished ? new Date(datePublished).getFullYear() : null;
  const fieldData = {
    title,
    headline,
    metaTitle: metaTitle || title,
    metaDescription: metaDescription || headline,
    cover,
    sections,
    template,
    noindex: noIndex || noindex,

    category: a2oa(category, categoryPath, locale),
    tags: a2oa(tags, tagsPath, locale),
    featured,
    datePublished,
    dateModified,

    type,
    locale,
    slug,
    year,
  };

  const mdType = 'MdPost';
  const id = createNodeId(`${node.id} >>> ${mdType}`);

  createNode({
    ...fieldData,
    // Required fields
    id,
    parent: node.id,
    children: [],
    internal: {
      type: mdType,
      contentDigest: createContentDigest(fieldData),
      content: JSON.stringify(fieldData),
      description: 'Md implementation of the Post interface',
    },
  });

  createParentChildLink({ parent: node, child: getNode(id) });

  /*
  const getMetaTitle = (title, metaTitle, slg) => {
    const purePath = i18n.purePath(slg);

    // is Root
    if (purePath === '/') {
      return metaTitle || i18n.locales[locale].siteTitle;
    }
    return `${metaTitle || title} - ${i18n.locales[locale].siteShortName}`;
  };
  */
  //    metaTitle: getMetaTitle(title, metaTitle, slug),
  //    metaDescription: metaDescription || headline || i18n.locales[locale].siteDescription,
};
