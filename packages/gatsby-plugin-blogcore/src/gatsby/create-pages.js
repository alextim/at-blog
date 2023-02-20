/* eslint-disable no-console */
const path = require('path');
const i18n = require('@alextim/i18n-utils');

const wrapper = require('../lib/promise-wrapper');
const createBlogPages = require('./helpers/createBlogPages');
const withOptions = require('./plugin-options');

const getTemplate = require('./helpers/getTemplate');

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
    locales,
    defaultLang,
  } = withOptions(pluginOptions);

  const slug2template = (slug) => {
    const purified = i18n.pureSlug(slug, locales);
    return purified === '/' ? undefined : purified.toString();
  };

  console.log('=====createPages=====');
  const result = await wrapper(
    graphql(`
      {
        pages: allMdPage(limit: 100, filter: { type: { eq: "page" } }) {
          edges {
            node {
              id
              template
              slug
              locale
            }
          }
        }
        posts: allMdPost(limit: 1000, filter: { type: { eq: "blog" } }, sort: { datePublished: DESC }) {
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
    `),
  );

  if (result.errors) {
    reporter.panic(result.errors);
    return;
  }

  const pages = result.data.pages.edges.sort((a, b) => a.node.slug - b.node.slug);

  if (pages.length === 0) {
    console.warn('\nNo pages');
  } else {
    const pageDefaultTemplate = require.resolve(path.join(templatesDir, 'page.jsx'));
    console.log(`\nMd pages: ${pages.length}`);
    console.log('---------------');
    pages.forEach(({ node: { id, template, slug, locale } }) => {
      console.log('pagepath=', slug);
      createPage({
        path: slug,
        component: getTemplate(template || slug2template(slug), templatesDir) || pageDefaultTemplate,
        context: {
          id,
          locale,
        },
      });
    });
  }

  createBlogPages({
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

    locales,
    defaultLang,
  });
};
