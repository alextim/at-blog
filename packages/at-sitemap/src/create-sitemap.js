const writeSiteMap = require('./write-sitemap');
const getNodeImages = require('./get-node-images');

const getPureSlug = (slug, localeCodes) => {
  const a = slug.split('/');
  const locale = a[1];
  const isLocalized = localeCodes.some((el) => locale === el);
  if (!isLocalized) {
    return slug;
  }
  return `/${a.slice(2).join('/')}`;
};

const getSlugLocale = (slug, localeCodes, defaultLang) => {
  const a = slug.split('/');
  const locale = a[1];
  const isLocalized = localeCodes.some((el) => locale === el);
  if (!isLocalized) {
    return defaultLang;
  }
  return locale;
};

module.exports = (allSitePages, allMdPages, reporter, options, siteUrl) => {
  reporter.info(`Parsing ${allSitePages.length} nodes...`);

  const { locales, defaultLang } = options;

  const localeCodes = Object.keys(locales);

  const buildDate = new Date().toISOString();

  const urlData = allSitePages.map(({ node: { path } }) => {
    const pureSlug = getPureSlug(path, localeCodes);

    const result = {
      url: siteUrl + path,
      changefreq: 'weekly',
      priority: 0.7,
    };

    const edge = allMdPages.find(({ node: { slug } }) => slug === path);

    if (options.lastmod === 1) {
      result.lastmod = buildDate;
    } else if (options.lastmod === 2 && edge && edge.node.dateModified) {
      result.lastmod = new Date(edge.node.dateModified).toISOString();
    }

    const links = allSitePages
      .filter(({ node: { path: linkSlug } }) => getPureSlug(linkSlug, localeCodes) === pureSlug)
      .map(({ node: { path: linkSlug } }) => ({
        url: siteUrl + linkSlug,
        lang: locales[getSlugLocale(linkSlug, localeCodes, defaultLang)].htmlLang,
      }));

    if (links) {
      result.links = links;
    }

    if (options.includeImages && edge) {
      const img = getNodeImages(siteUrl, edge.node, options.ignoreImagesWithoutAlt);
      if (img) {
        result.img = img;
      }
    }

    return result;
  });

  if (!urlData.length) {
    reporter.info('No data for sitemap. Nothing generated.');
    return false;
  }

  const generationOptions = {
    hostname: siteUrl,
    lastmodDateOnly: options.lastmodDateOnly,
    xmlns: {
      news: false,
      xhtml: true,
      image: options.includeImages,
      video: false,
    },
  };

  const filePath = `${options.buildDir}/${options.sitemapFileName}`;
  reporter.info(`Writing sitemap to "${filePath}" for ${urlData.length} URLs...`);
  return writeSiteMap(urlData, generationOptions, filePath).then(() => {
    reporter.info('Sitemap created');
    return true;
  });
};
