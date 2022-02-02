const path = require('path');

const normalize = (s) => s.split('\\').join('/');

// eslint-disable-next-line no-unused-vars
module.exports = async (source, args, context, info) => {
  const fieldValue = await context.defaultFieldResolver(source, args, context, info);
  if (!fieldValue) {
    return null;
  }

  const parentFileNode = context.nodeModel.findRootNodeAncestor(source, (node) => node.internal && node.internal.type === 'File');
  if (!parentFileNode) {
    return null;
  }

  const { dir } = parentFileNode;

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
