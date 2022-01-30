# gatsby-plugin-sitemap

For Gatsby.

Works with `@alextim/gatsby-plugin-blogcore` plugin.

During build it generates

- i18n XML sitemap for `MdPage` and `MdPost`
- simple sitemap for images.
  Looks for images in Frontmatter and markdown body.

## Plugin options

| Name                   | Default value                          | Notes                                                                       |
| ---------------------- | -------------------------------------- | --------------------------------------------------------------------------- |
| createRobotsTxt        | true                                   |
| noIndex                | false                                  | true - `Disallow: /`                                                        |
|                        |                                        | false - `Disallow:`                                                         |
| excludePaths           | ['/dev-404-page', '/404', '/404.html'] |
| sitemapFileName        | `sitemap.xml`                          |
| buildDir               | `./public`                             |
| lastmod                | 1                                      | 0 - no, 1 - build date, 2 - dateModified                                    |
| lastmodDateOnly        | false                                  | [sitemap.js API](https://github.com/ekalinin/sitemap.js/blob/master/api.md) |
| includeImages          | true                                   |
| ignoreImagesWithoutAlt | true                                   |
| createLinkInHead       | true                                   |
| specialFolder          | `assets`                               | looks for images here                                                       |
