const resolverAuthor = {
  author: {
    type: ['String'],
    resolve: async (source, args, context) => {
      const { author } = source;
      if (!author || author.length === 0) {
        return null;
      }

      const result = [];
      const n = author.length;

      for (let i = 0; i < n; i++) {
        // eslint-disable-next-line no-await-in-loop
        const node = await context.nodeModel.findOne({
          type: 'Author',
          query: {
            filter: { email: { eq: author[i] } },
          },
        });
        if (node) {
          result.push(`${node.lastName} ${node.firstName}`);
        }
      }
      return result.length > 0 ? result : null;
    },
  },
};

module.exports = resolverAuthor;
