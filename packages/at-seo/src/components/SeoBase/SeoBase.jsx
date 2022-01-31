/* eslint-disable import/no-unresolved */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Helmet } from 'react-helmet';

import getPageSchema from '../../utils/getPageSchema';

import getWebSiteSchema from './helpers/getWebSiteSchema';
import getOrganizationSchema from './helpers/getOrganizationSchema';
import getBreadcrumbsSchema from './helpers/getBreadcrumbsSchema';

import getTwitterMeta from './helpers/getTwitterMeta';
import getOgMeta from './helpers/getOgMeta';

const SeoBase = ({
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
}) => {
  const isRoot = pathname === '/';

  const URL = `${config.siteUrl}${pathname}`;
  const homeURL = i18n ? `${config.siteUrl}${i18n.localizePath('/', locale)}` : URL;

  let imgURL;
  if (imgPath) {
    imgURL = `${config.siteUrl}${imgPath}`;
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
    imgURL,
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
    imgURL,
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
      href: URL,
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
      URL,
      headline: headline || metaDescription,
      metaTitle,
      metaDescription,
      htmlLang,
      imgURL,
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
        homeURL,
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

  const scripts = scriptSrc.map((el) => ({
    type: 'application/ld+json',
    innerHTML: JSON.stringify(el),
  }));

  return (
    <Helmet
      htmlAttributes={{ lang: htmlLang }}
      title={metaTitle}
      meta={[...meta, ...og, ...twitter, ...metas]}
      link={[...link, ...links]}
      script={scripts}
    />
  );
};

export default SeoBase;
