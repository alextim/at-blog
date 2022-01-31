const isValidLang = (x, locales) => x && typeof x === 'string' && locales[x];

const isDefaultLang = (lang, defaultLang) => lang === defaultLang;

/**
 *
 * @param {string} path - '/', '/posts'
 * @param {string} lang - 'ru', 'en' etc
 * @param {string} defaultLang - 'ru', 'en' etc
 *
 * if lang is default
 *   return path
 *
 * if path == /
 *   return `/${lang}/`
 *
 * else
 *   return `/${lang}${path}/`
 */
const localizePath = (path, lang, defaultLang) => {
  if (isDefaultLang(lang, defaultLang)) {
    return path;
  }
  if (path === '/') {
    return `/${lang}/`;
  }
  return `/${lang}${path}`;
};

const pureSlug = (slug, locales) => {
  if (slug === '/') {
    return '/';
  }
  const a = slug.split('/');
  const locale = a[1];
  const isLocalized = Object.keys(locales).some((el) => locale === el);
  if (isLocalized) {
    return a
      .slice(0, a.length - 1)
      .slice(2)
      .join('/');
  }
  a.shift();
  a.pop();
  return a.join('/');
};

module.exports = {
  isValidLang,
  isDefaultLang,
  localizePath,
  pureSlug,
};
