# AT-BLOG

It's a GitHub hosted NPM package for Gatsby.

## Installation in your project

1. create `.npmrc` in the project root

   ```text
   @alextim:registry=https://npm.pkg.github.com
   ```

2. Run `yarn add @alextim/at-blog`

## Configuration

- Install `@alextim/at-site-core`, `@alextim/slugify` and `@alextim/translit` packages.

- Add to `gatsby-config.js`:

  ```js
  module.exports = {
    plugins: [
      ...
      {
        resolve: '@alextim/at-site-core',
        options: {
          templatesDir: `${__dirname}/src/templates/`,
          pageDirs: {
            page: 'pages',
            blogPage: 'blog/pages',          
          },
          i18n,
        },
      },
      {
        resolve: '@alextim/at-blog',
        options: {
          // defaultTranslitLocale: 'uk', // 'ru' or 'uk'
          // cardsPerPage: 12,
          // blogPath: '/blog/',
          // categoryPath: '/category/',
          // tagsPath: '/tags/',
          // yearsPath: '/years/',
          // postDirs: { 
          //   post: 'blog/posts' 
          // },
          templatesDir: `${__dirname}/src/templates/blog/`,
          // CREATE_TAG_PAGES: false,
          // CREATE_CATEGORY_PAGES: false,
          // CREATE_YEAR_PAGES: false,
          i18n,
        },
      },
      ...
    ],
  };
  ```

## Troubleshooting

In case of error:

```text
Integrity checked failed 
```

Use `yarn add @alextim/at-blog --upgrade-checksums` instead to solve the issue.

## Source

[npm-tiny](https://github.com/windix/npm-tiny)

[Host and Publish NPM package on GitHub](https://medium.com/@windix/zost-and-publish-npm-package-on-github-bb419a2acfd3)

[How to make a beautiful, tiny npm package and publish it](https://www.freecodecamp.org/news/how-to-make-a-beautiful-tiny-npm-package-and-publish-it-2881d4307f78/)
