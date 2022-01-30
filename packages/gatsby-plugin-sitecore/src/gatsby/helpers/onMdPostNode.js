const slugify = require('@alextim/slugify');
const translit = require('@alextim/translit');
const i18n = require('@alextim/i18n-utils');

const extractData = require('./extractData');
const { compString } = require('../../lib/comparators');

module.exports = ({ node, actions, getNode, createNodeId, createContentDigest }, options, type) => {
  const { categoryPath, tagsPath, defaultLang, locales, noIndex, defaultTranslitLocale, supportedTranslitLocales } = options;

  const { prefix } = options.postDirs[type];

  const result = extractData({ node, getNode }, { prefix, defaultLang, locales });
  if (!result) {
    return;
  }

  const getTranslitLocale = (x) => (supportedTranslitLocales.some((locale) => locale === x) ? x : defaultTranslitLocale);

  const a2oa = (a, pref, locale) => {
    if (!a) {
      return null;
    }
    return [...new Set(a)].sort(compString).map((title) => ({
      title,
      to: i18n.localizePath(`${pref}${slugify(translit(title, getTranslitLocale(locale)))}/`, locale, defaultLang),
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
    author,
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
    author,

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
};
