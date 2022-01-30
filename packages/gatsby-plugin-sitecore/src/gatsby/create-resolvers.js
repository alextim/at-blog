const resolverBreadcrumbs = require('./resolvers/resolverBreadcrumbs');
const authorResolver = require('./resolvers/authorResolver');
const withOptions = require('./plugin-options');

module.exports = ({ createResolvers }, pluginOptions) => {
  const { defaultLang } = withOptions(pluginOptions);
  const resolvers = {
    MdPage: resolverBreadcrumbs(defaultLang),
    MdPost: { ...resolverBreadcrumbs(defaultLang), ...authorResolver() },
  };
  createResolvers(resolvers);
};
