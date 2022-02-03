const onMdPageNode = require('./helpers/onMdPageNode');
const onMdPostNode = require('./helpers/onMdPostNode');
const onDataNode = require('./helpers/onDataNode');
const withOptions = require('./plugin-options');

module.exports = async (params, pluginOptions) => {
  const options = withOptions(pluginOptions);
  const { node, getNode } = params;

  if (node.internal.type === 'Yaml') {
    onDataNode(params, options);
    return;
  }

  if (node.internal.type === 'MarkdownRemark') {
    const { pageDirs, postDirs } = options;
    const fileNode = getNode(node.parent);
    const type = fileNode.sourceInstanceName;
    if (pageDirs[type]) {
      onMdPageNode(params, options, type);
      return;
    }
    if (postDirs[type]) {
      onMdPostNode(params, options, type);
    }
  }
};
