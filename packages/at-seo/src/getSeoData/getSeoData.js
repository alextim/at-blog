const getPageSchema = require('../utils/getPageSchema');

const getWebSiteSchema = require('./helpers/getWebSiteSchema');
const getOrganizationSchema = require('./helpers/getOrganizationSchema');
const getBreadcrumbsSchema = require('./helpers/getBreadcrumbsSchema');
const getTwitterMeta = require('./helpers/getTwitterMeta');
const getOgMeta = require('./helpers/getOgMeta');

function getSeoData({
  config,
  siteMeta,
  i18n,
  orgContacts,
  orgAddress,
  socialLinks,
  title,
  keywords,
  headline,
  description,
  locale,
  pathname,
  pageType,
  imgPath,
  datePublished,
  dateModified,
  author,
  breadcrumbs,
  tags,
  canonical,
  noindex,
  metas = [],
  links = [],
}) {
  const isRoot = pathname === '/';

  const pageUrl = `${config.siteUrl}${pathname}`;
  const homeUrl = i18n ? `${config.siteUrl}${i18n.localizePath('/', locale)}` : pageUrl;

  let imgUrl;
  if (imgPath) {
    imgUrl = `${config.siteUrl}${imgPath}`;
  }

  const purePath = i18n ? i18n.purePath(pathname) : pathname;

  const { htmlLang, ogLocale, siteTitle, siteDescription } = siteMeta;

  const isArticle = pageType === 'Article' || pageType === 'BlogPosting';

  const metaTitle = title || siteTitle;
  const metaDescription = description || siteDescription;

  /** *
   * https://developer.mozilla.org/ru/docs/Web/HTTP/Headers/Content-Language
   *
   * Не  используйте этот мета элемент как здесь для констатирования языка документа:
   *
   * <meta httpEquiv="content-language" content={htmlLang} />
   *
   *  */
  const meta = [
    {
      name: 'robots',
      content: `${noindex ? 'no' : ''}index, follow`,
    },
    {
      name: 'description',
      content: metaDescription,
    },
    {
      name: 'theme-color',
      content: config.themeColor,
    },
  ];
  if (keywords) {
    meta.push({
      name: 'keywords',
      content: keywords,
    });
  }

  const og = getOgMeta({
    ogLocale,
    i18n,
    locale,
    metaTitle,
    metaDescription,
    siteName: i18n.locales[locale].siteShortName,
    imgUrl,
    pageUrl,
    ogImage: { ...config.ogImage, src: `${config.ogImage.src}${locale}.jpg` },
    isArticle,
    datePublished,
    dateModified,
    author,
    tags,
    fbAppID: config.fbAppID,
    socialLinks,
  });

  const twitter = getTwitterMeta({
    metaTitle,
    metaDescription,
    imgUrl,
    twitterImage: { ...config.twitterImage, src: `${config.twitterImage.src}${locale}.jpg` },
    twitterCreator: config.twitterCreator,
    twitterSite: config.twitterSite,
  });

  const link = [
    {
      rel: 'author',
      type: 'text/plain',
      href: `${config.siteUrl}/humans.txt`,
    },
  ];

  if (canonical) {
    link.push({
      rel: 'canonical',
      href: pageUrl,
    });
  }

  if (i18n) {
    Array.prototype.push.apply(
      link,
      i18n.localeCodes.map((code) => ({
        rel: 'alternate',
        hrefLang: i18n.locales[code].htmlLang,
        href: `${config.siteUrl}${i18n.localizePath(purePath, code)}`,
      })),
    );
    link.push({
      rel: 'alternate',
      hrefLang: 'x-default',
      href: `${config.siteUrl}${purePath}`,
    });
  }

  const scriptSrc = [
    getWebSiteSchema({
      siteUrl: config.siteUrl,
      siteTitle,
      siteDescription,
      htmlLang,
    }),

    getPageSchema({
      organizationName: orgAddress.name,
      siteUrl: config.siteUrl,
      siteLogo: config.siteLogo,
      pageUrl,
      headline: headline || metaDescription,
      metaTitle,
      metaDescription,
      htmlLang,
      imgUrl,
      datePublished,
      dateModified,
      author,
      pageType,
    }),
  ];

  if (isRoot) {
    scriptSrc.push(
      getOrganizationSchema({
        orgContacts,
        orgAddress,
        config,
        homeUrl,
        socialLinks,
      }),
    );
  }

  if (!config.noBreadcrumbs && !isRoot && breadcrumbs && breadcrumbs.length) {
    scriptSrc.push(
      getBreadcrumbsSchema({
        breadcrumbs,
        siteUrl: config.siteUrl,
      }),
    );
  }

  return {
    htmlAttributes: { lang: htmlLang },
    title: metaTitle,
    meta: [...meta, ...og, ...twitter, ...metas],
    link: [...link, ...links],
    script: scriptSrc.map((el) => ({
      type: 'application/ld+json',
      innerHTML: JSON.stringify(el),
    })),
  };
}

module.exports = getSeoData;
