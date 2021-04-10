const onMdPostNode = require('./helpers/onMdPostNode');

const withOptions = require('./plugin-options');

module.exports = async (params, pluginOptions) => {
  const options = withOptions(pluginOptions);
  const { postDirs } = options;

  const { node, getNode } = params;
  if (node.internal.type === 'MarkdownRemark') {
    const fileNode = getNode(node.parent);
    const type = fileNode.sourceInstanceName;
    if (postDirs[type]) {
      onMdPostNode(params, options, type);
    }
  }
};
