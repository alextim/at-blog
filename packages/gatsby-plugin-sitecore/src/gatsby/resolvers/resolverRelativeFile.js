const path = require('path');

const normalize = (s) => s.split('\\').join('/');

// eslint-disable-next-line no-unused-vars
module.exports = async (source, args, context, info) => {
  const fieldValue = await context.defaultFieldResolver(source, args, context, info);

  if (!fieldValue) {
    return null;
  }

  const thisNode = context.nodeModel.getNodeById({ id: context.id });
  if (!thisNode) {
    return null;
  }

  const { fileAbsolutePath } = thisNode;

  const dir = path.dirname(fileAbsolutePath);

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
