const sanitize = (x, defaultValue) => (x === undefined ? defaultValue : x);
const sanitizeTrue = (x) => !!sanitize(x, true);

const getPluginOptions = ({
  createRobotsTxt,
  noIndex,
  excludePaths = ['/dev-404-page', '/404', '/404.html'],
  sitemapFileName = 'sitemap.xml',
  buildDir = './public',
  lastmod,
  lastmodDateOnly,
  includeImages,
  ignoreImagesWithoutAlt,
  createLinkInHead,
  specialFolder = 'assets',
  defaultLang,
  locales,
}) => ({
  // default: true
  createRobotsTxt: sanitizeTrue(createRobotsTxt),
  // default: true
  noIndex: !!noIndex,

  // pages to exclude.
  // Paths must start with "/"
  excludePaths,

  // generated sitemap filenames
  sitemapFileName,

  // build dir to read the output files from
  // also to write the sitemap to
  buildDir,

  // default: 1
  // 0 - no
  // 1 - build date
  // 2 - dateModified
  lastmod: lastmod == null ? 1 : Number(lastmod),
  lastmodDateOnly: !!lastmodDateOnly,

  includeImages: sanitizeTrue(includeImages),
  // don't add images with missing alt tag to sitemap
  ignoreImagesWithoutAlt: sanitizeTrue(ignoreImagesWithoutAlt),

  // add sitemaps link to pages' head
  createLinkInHead: sanitizeTrue(createLinkInHead),

  specialFolder,

  defaultLang,
  locales,
});

module.exports = getPluginOptions;
