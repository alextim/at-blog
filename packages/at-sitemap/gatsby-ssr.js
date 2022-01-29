const React = require('react');
// eslint-disable-next-line import/no-unresolved
const { withPrefix } = require('gatsby');
const withOptions = require('./src/plugin-options');

exports.onRenderBody = async ({ setHeadComponents }, pluginOptions) => {
  const { sitemapFileName, createLinkInHead } = withOptions(pluginOptions);

  if (!createLinkInHead) {
    return;
  }

  setHeadComponents([
    React.createElement('link', {
      key: 'at-sitemap',
      // eslint-disable-next-line react/no-invalid-html-attribute
      rel: 'sitemap',
      type: 'application/xml',
      href: withPrefix(sitemapFileName),
    }),
  ]);
};
