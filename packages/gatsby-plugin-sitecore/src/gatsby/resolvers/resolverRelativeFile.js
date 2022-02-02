const path = require('path');

const normalize = (s) => s.split('\\').join('/');

// eslint-disable-next-line no-unused-vars
module.exports = async (source, args, context, info) => {
  const fieldValue = await context.defaultFieldResolver(source, args, context, info);

  if (!fieldValue) {
    return null;
  }

  let parentNode = await context.nodeModel.findRootNodeAncestor(source, (node) => node.internal && node.internal.type === 'File');
  if (!parentNode) {
    const thisNode = await context.nodeModel.getNodeById({ id: context.id });
    if (!thisNode) {
      return null;
    }

    parentNode = await context.nodeModel.findRootNodeAncestor(thisNode, (node) => node.internal && node.internal.type === 'File');
    if (!parentNode) {
      return null;
    }
  }

  const { dir } = parentNode;
  const resolved = path.resolve(dir, fieldValue);
  const filePath = normalize(resolved);

  const fileNode = await context.nodeModel.findOne({
    type: 'File',
    query: {
      filter: {
        absolutePath: {
          eq: filePath,
        },
      },
    },
  });

  if (!fileNode) {
    return null;
  }

  return fileNode;
};
