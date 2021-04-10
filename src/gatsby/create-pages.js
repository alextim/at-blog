/* eslint-disable no-console */
const withOptions = require('./plugin-options');
const createPages = require('./helpers/createPages');

module.exports = async ({ graphql, actions, reporter }, pluginOptions) => {
  const { createPage } = actions;

  const {
    cardsPerPage,
    blogPath,
    categoryPath,
    tagsPath,
    yearsPath,
    templatesDir,
    CREATE_TAG_PAGES,
    CREATE_CATEGORY_PAGES,
    CREATE_YEAR_PAGES,
    i18n,
  } = withOptions(pluginOptions);

  console.log('=====createPosts=====');
  const result = await graphql(`
    {
      site {
        siteMetadata {
          siteUrl
          locales {
            code
          }
        }
      }
      posts: allMdPost(
        limit: 1000
        filter: { type: { eq: "blog" } }
        sort: { fields: [datePublished], order: DESC }
      ) {
        edges {
          node {
            id
            template
            tags {
              title
              to
            }
            category {
              title
              to
            }
            slug
            type
            locale
            year
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panic(result.errors);
    return;
  }

  createPages({
    locales: result.data.site.siteMetadata.locales,
    edges: result.data.posts.edges,

    type: 'blog',

    createPage,

    cardsPerPage,

    blogPath,
    categoryPath,
    tagsPath,
    yearsPath,

    templatesDir,

    CREATE_TAG_PAGES,
    CREATE_CATEGORY_PAGES,
    CREATE_YEAR_PAGES,

    i18n,
  });
};
