const i18n = require('@alextim/i18n-utils');

const isValidLocale = (locale, fileNode, locales) => {
  if (!locale) {
    if (process.env.WARNINGS) {
      console.warn(`The file "${fileNode.relativePath}" does not contain locale in it's name'.'`);
    }
    return false;
  }
  if (!i18n.isValidLang(locale, locales)) {
    if (process.env.WARNINGS) {
      console.warn(`The file "${fileNode.relativePath}" has unsupported locale "${locale}" in it's name`);
    }
    return false;
  }
  return true;
};

module.exports = isValidLocale;
