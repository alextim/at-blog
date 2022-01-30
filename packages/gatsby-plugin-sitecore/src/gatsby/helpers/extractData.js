const path = require('path');
const i18n = require('@alextim/i18n-utils');

const isValidLocale = require('./isValidLocale');

const isHome = (s) => s === 'home';

const getSlug = (slug, slugFileName, dir, prefix) => {
  if (isHome(slugFileName)) {
    return '/';
  }
  if (slug) {
    return `/${slug}/`;
  }
  return `/${prefix ? `${prefix}/` : ''}${slugFileName === 'index' ? dir : slugFileName}/`;
};

const extractData = ({ node, getNode }, { prefix, defaultLang, locales }) => {
  const { frontmatter } = node;
  if (!frontmatter) {
    throw new Error('Frontmatter is absent!');
  }
  // skip draft docs
  if (frontmatter.state === 'draft') {
    return false;
  }

  const fileNode = getNode(node.parent);
  const { name, dir } = path.parse(fileNode.relativePath);

  const [slugFileName, locale] = name.split('.');

  const slug = getSlug(frontmatter.slug, slugFileName, dir, prefix);

  if (process.env.ONLY && !process.env.ONLY.split(' ').some((p) => p === slug)) {
    if (process.env.WARNINGS) {
      console.warn(`Path "${slug}" is excluded from build. process.env.ONLY=${process.env.ONLY}`);
    }
    return false;
  }

  if (!isValidLocale(locale, fileNode, locales)) {
    return false;
  }

  const localizedSlug = i18n.localizePath(slug, locale, defaultLang);

  return { slug: localizedSlug, locale, frontmatter };
};

module.exports = extractData;
