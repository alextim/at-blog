const createSitemap = require('../helpers/create-sitemap');
const createRobotsTxt = require('../helpers/create-robots-txt');
const withOptions = require('../helpers/plugin-options');
const { pluginName } = require('../helpers/constants');

module.exports = async ({ graphql, reporter }, pluginOptions) => {
  reporter.info(`${pluginName}: started...`);

  const options = withOptions(pluginOptions);

  const result = await graphql(`
    {
      site {
        siteMetadata {
          siteUrl
        }
      }
      allSitePage {
        edges {
          node {
            path
          }
        }
      }
      pages: allMdPage {
        edges {
          node {
            slug
            locale
            dateModified
            cover {
              title
              alt
              xl {
                publicURL
              }
              sm {
                publicURL
              }
            }
            sections {
              image {
                title
                alt
                xl {
                  publicURL
                }
                sm {
                  publicURL
                }
              }
              items {
                image {
                  title
                  alt
                  sm {
                    publicURL
                  }
                  xl {
                    publicURL
                  }
                }
              }
            }
            htmlAst
          }
        }
      }
      posts: allMdPost {
        edges {
          node {
            slug
            locale
            dateModified
            cover {
              title
              alt
              xl {
                publicURL
              }
              sm {
                publicURL
              }
            }
            htmlAst
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panic(result.errors);
    return;
  }
  const { siteUrl } = result.data.site.siteMetadata;

  const inExcludedPaths = (slug) => options.excludePaths.some((exPath) => slug.indexOf(exPath) !== -1);

  const pages = result.data.pages.edges.filter(({ node: { slug } }) => !inExcludedPaths(slug));
  const posts = result.data.posts.edges.filter(({ node: { slug } }) => !inExcludedPaths(slug));
  const allSitePages = result.data.allSitePage.edges.filter(({ node: { path } }) => !inExcludedPaths(path));

  const allMdPages = [...pages, ...posts];

  let mainNotEmpty;
  if (allSitePages.length) {
    reporter.info(`Md Posts: ${posts.length}`);
    reporter.info(`Md Pages: ${pages.length}`);
    reporter.info('------------------');
    reporter.info(`Total Nodes: ${allSitePages.length}`);
    mainNotEmpty = createSitemap(allSitePages, allMdPages, reporter, options, siteUrl);
  } else {
    reporter.info('No data for sitemap');
  }

  createRobotsTxt(reporter, options, siteUrl, mainNotEmpty);
};
