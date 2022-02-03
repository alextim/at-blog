/**
 * Field extesion @fileByRelativePath don't work properly after update >= v4.6.0
 */
const path = require('path');

const normalize = (s) => s.split('\\').join('/');
const predicat = (node) => node.internal && node.internal.type === 'File';

// eslint-disable-next-line no-unused-vars
module.exports = async (source, args, context, info) => {
  const fieldValue = await context.defaultFieldResolver(source, args, context, info);

  if (!fieldValue) {
    return null;
  }

  /**
   * first call of findRootNodeAncestor is for lists such as blog, services, object types
   */
  let parentNode = await context.nodeModel.findRootNodeAncestor(source, predicat);
  if (!parentNode) {
    /**
     * secod call of findRootNodeAncestor is for individual pages such as home, contacts, about, post, service etc
     */
    const thisNode = await context.nodeModel.getNodeById({ id: context.id });
    if (!thisNode) {
      return null;
    }

    parentNode = await context.nodeModel.findRootNodeAncestor(thisNode, predicat);
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
