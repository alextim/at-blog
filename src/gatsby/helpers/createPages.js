/* eslint-disable no-console */
const path = require('path');

const compString = (a, b) => {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
};

const compNum = (a, b) => a - b;

const map2Object = (m) =>
  [...m]
    .sort(([, a], [, b]) => compString(a.title, b.title))
    .reduce((acc, [to, { title, count }]) => {
      // eslint-disable-next-line no-param-reassign
      acc[to] = {
        title,
        count,
      };
      return acc;
    }, {});

module.exports = ({
  edges,
  locales,

  type,

  createPage,

  cardsPerPage,
  blogPath,
  categoryPath,
  tagsPath,
  yearsPath,
  templatesDir,

  CREATE_TAG_PAGES = false,
  CREATE_CATEGORY_PAGES = false,
  CREATE_YEAR_PAGES = false,

  i18n,

  postListTemplateName = 'post-list',
  postDefaultTemplateName = 'post',
  categoryListTemplateName = 'category-list',
  categoryTemplateName = 'category',
  tagListTemplateName = 'tag-list',
  tagTemplateName = 'tags',
  yearListTemplateName = 'year-list',
  yearTemplateName = 'years',
}) => {
  const yearMap2Object = (m, prefix, locale) =>
    [...m]
      .map(([key]) => key)
      .sort(compNum)
      .reduce((acc, key) => {
        // eslint-disable-next-line no-param-reassign
        acc[key] = {
          to: i18n.localizePath(`/${prefix}/${key}/`, locale),
          count: m.get(key),
        };
        return acc;
      }, {});

  const postListTemplate = require.resolve(path.join(templatesDir, `${postListTemplateName}.jsx`));
  const postDefaultTemplate = require.resolve(
    path.join(templatesDir, `${postDefaultTemplateName}.jsx`),
  );

  locales.forEach(({ code: locale }) => {
    console.log(`\n-------- Locale=${locale} --------`);

    /**
     * Posts
     *
     */
    const posts = edges.filter(({ node }) => node.locale === locale && node.type === type);

    if (posts.length === 0) {
      console.warn(`\nNo ${type} posts`);
    } else {
      const tagMap = new Map();
      const categoryMap = new Map();
      const yearMap = new Map();

      console.log(`\nMd ${type} posts: ${posts.length}`);
      console.log('---------------');
      posts.forEach(({ node: { id, category, tags, year, slug } }) => {
        if (CREATE_TAG_PAGES && tags) {
          tags.forEach(({ title, to }) => {
            if (tagMap.get(to)) {
              const o = tagMap.get(to);
              o.count += 1;
              tagMap.set(to, o);
            } else {
              tagMap.set(to, { title, count: 1 });
            }
          });
        }

        if (CREATE_CATEGORY_PAGES && category) {
          category.forEach(({ title, to }) => {
            if (categoryMap.get(to)) {
              const o = categoryMap.get(to);
              o.count += 1;
              categoryMap.set(to, o);
            } else {
              categoryMap.set(to, { title, count: 1 });
            }
          });
        }

        if (CREATE_YEAR_PAGES && year) {
          if (yearMap.get(year)) {
            yearMap.set(year, yearMap.get(year) + 1);
          } else {
            yearMap.set(year, 1);
          }
        }

        console.log('pagepath=', slug);
        createPage({
          path: slug,
          component: postDefaultTemplate,
          context: {
            id,
            type,
            locale,
          },
        });
      });

      const categories = map2Object(categoryMap);
      const tags = map2Object(tagMap);
      const years = yearMap2Object(yearMap, 'years', locale);

      {
        const numPages = Math.ceil(posts.length / cardsPerPage);

        console.log(`\nPost List: numPages=${numPages}`);
        console.log('---------------');
        for (let i = 0; i < numPages; i += 1) {
          const to = i18n.localizePath(blogPath, locale);
          const pagePath = i === 0 ? to : `${to}${i + 1}/`;
          console.log('pagepath=', pagePath);
          createPage({
            path: pagePath,
            component: postListTemplate,
            context: {
              to,
              type,
              locale,
              limit: cardsPerPage,
              skip: i * cardsPerPage,
              numPages,
              currentPage: i + 1,
              categories,
              tags,
              years,
            },
          });
        }
      }

      if (CREATE_CATEGORY_PAGES) {
        const categoryListTemplate = require.resolve(
          path.join(templatesDir, `${categoryListTemplateName}.jsx`),
        );
        const categoryTemplate = require.resolve(
          path.join(templatesDir, `${categoryTemplateName}.jsx`),
        );

        {
          const pagePath = i18n.localizePath(categoryPath, locale);
          console.log('\nCategory List: pagepath=', pagePath);
          createPage({
            path: pagePath,
            component: categoryListTemplate,
            context: {
              type,
              locale,
              categories,
            },
          });
        }

        console.log('\nCategory pages');
        console.log('---------------');
        categoryMap.forEach(({ title: category, count }, to) => {
          const numPages = Math.ceil(count / cardsPerPage);
          for (let i = 0; i < numPages; i++) {
            const pagePath = i === 0 ? to : `${to}${i + 1}/`;
            console.log('pagepath=', pagePath);
            createPage({
              path: pagePath,
              component: categoryTemplate,
              context: {
                to,
                type,
                locale,
                category,
                limit: cardsPerPage,
                skip: i * cardsPerPage,
                numPages,
                currentPage: i + 1,
                categories,
                tags,
                years,
              },
            });
          }
        });
      }

      if (CREATE_TAG_PAGES) {
        const tagListTemplate = require.resolve(
          path.join(templatesDir, `${tagListTemplateName}.jsx`),
        );
        const tagTemplate = require.resolve(path.join(templatesDir, `${tagTemplateName}.jsx`));

        {
          const pagePath = i18n.localizePath(tagsPath, locale);
          console.log('\nTag List: pagepath=', pagePath);
          createPage({
            path: pagePath,
            component: tagListTemplate,
            context: {
              type,
              locale,
              tags,
            },
          });
        }
        console.log('\nTag pages');
        console.log('---------------');
        tagMap.forEach(({ title: tag, count }, to) => {
          const numPages = Math.ceil(count / cardsPerPage);
          for (let i = 0; i < numPages; i += 1) {
            const pagePath = i === 0 ? to : `${to}${i + 1}/`;
            console.log('pagepath=', pagePath);
            createPage({
              path: pagePath,
              component: tagTemplate,
              context: {
                to,
                type,
                locale,
                tag,
                limit: cardsPerPage,
                skip: i * cardsPerPage,
                numPages,
                currentPage: i + 1,
                categories,
                tags,
                years,
              },
            });
          }
        });
      }

      if (CREATE_YEAR_PAGES) {
        const yearListTemplate = require.resolve(
          path.join(templatesDir, `${yearListTemplateName}.jsx`),
        );
        const yearTemplate = require.resolve(path.join(templatesDir, `${yearTemplateName}.jsx`));

        {
          const pagePath = i18n.localizePath(yearsPath, locale);
          console.log('\nYear List: pagepath=', pagePath);
          createPage({
            path: pagePath,
            component: yearListTemplate,
            context: {
              type,
              locale,
              years,
            },
          });
        }

        console.log('\nYear pages');
        console.log('---------------');
        yearMap.forEach((count, year) => {
          const numPages = Math.ceil(count / cardsPerPage);
          for (let i = 0; i < numPages; i += 1) {
            const to = i18n.localizePath(`${yearsPath}${year}/`, locale);
            const pagePath = i === 0 ? to : `${to}${i + 1}/`;
            console.log('pagepath=', pagePath);
            createPage({
              path: pagePath,
              component: yearTemplate,
              context: {
                to,
                type,
                locale,
                year,
                limit: cardsPerPage,
                skip: i * cardsPerPage,
                numPages,
                currentPage: i + 1,
                categories,
                tags,
                years,
              },
            });
          }
        });
      }
    }
  });
};
