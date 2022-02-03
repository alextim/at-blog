# gatsby-plugin-blogcore

Plugin for Gatsby.

It generates:

- from Markdown - pages
- from YAML- main menu, social links, footer nav, address, contacts

## Installation in your project

1. create `.npmrc` in the project root

   ```text
   @alextim:registry=https://npm.pkg.github.com
   ```

2. Install `@alextim/gatsby-plugin-blogcore`, `@alextim/slugify`, `@alextim/translit` and `@alextim/i18n-utils`packages.

## Configuration

- Add to `gatsby-config.js`:

  ```js
  module.exports = {
    plugins: [
      ...
      {
        resolve: '@alextim/gatsby-plugin-blogcore',
        options: {
          page: { folder: 'pages' },
          blogPage: { folder: 'blog/pages' },
          // defaultTranslitLocale: 'uk', // 'ru' or 'uk'
          // cardsPerPage: 12,
          // blogPath: '/blog/',
          // categoryPath: '/category/',
          // tagsPath: '/tags/',
          // yearsPath: '/years/',
          // postDirs: {
          //   post: { folder: 'blog/posts' },
          // },
          // authorDirs: {
          //   author: { folder: 'blog/authors', prefix: 'authors' },
          // },
          // CREATE_TAG_PAGES: false,
          // CREATE_CATEGORY_PAGES: false,
          // CREATE_YEAR_PAGES: false,
          locales: i18n.locales,         // Object
          defaultLang: i18n.defaultLang, // string
          // noIndex: false
        },
      },
      ...
    ],
  };
  ```

## Plugin options

| Name                  | Default value                                             | Note                                  |
| --------------------- | --------------------------------------------------------- | ------------------------------------- |
| pageDirs              | { page: { folder: 'pages' } }                             |
|                       |                                                           |
| defaultTranslitLocale | `uk`                                                      | `ru` or `uk`                          |
| cardsPerPage          | 12                                                        |
| blogPath              | `/blog/`                                                  |
| categoryPath          | `/category/`                                              |
| tagsPath              | `/tags/`                                                  |
| yearsPath             | `/years/`                                                 |
| postDirs              | { post: { folder: 'blog/posts' } }                        |
| authorDirs            | { author: { folder: 'blog/authors', prefix: 'authors' } } |
| templatesDir          | REQUIRED: string                                          |
| CREATE_TAG_PAGES      | false                                                     |
| CREATE_CATEGORY_PAGES | false                                                     |
| CREATE_YEAR_PAGES     | false                                                     |
|                       |                                                           |
| locales               | REQUIRED: object                                          |
| defaultLang           | REQUIRED: string                                          |
| noIndex               | false                                                     | if true force `noindex` field to true |

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
