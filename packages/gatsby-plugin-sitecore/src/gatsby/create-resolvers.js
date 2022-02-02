const resolverBreadcrumbs = require('./resolvers/resolverBreadcrumbs');
const resolverAuthor = require('./resolvers/resolverAuthor');
const resolverRelativeFile = require('./resolvers/resolverRelativeFile');

const withOptions = require('./plugin-options');

module.exports = ({ createResolvers }, pluginOptions) => {
  const { defaultLang } = withOptions(pluginOptions);
  const resolvers = {
    Image: {
      sm: {
        resolve: resolverRelativeFile,
      },
      xl: {
        resolve: resolverRelativeFile,
      },
    },
    MdPage: resolverBreadcrumbs(defaultLang),
    MdPost: { ...resolverBreadcrumbs(defaultLang), ...resolverAuthor },
  };
  createResolvers(resolvers);
};
