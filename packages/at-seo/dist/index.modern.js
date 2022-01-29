import React from 'react';
import { Helmet } from 'react-helmet';
import utils from '@alextim/utils';

function _extends() {
  _extends =
    Object.assign ||
    function (target) {
      for (let i = 1; i < arguments.length; i++) {
        const source = arguments[i];

        for (const key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

  return _extends.apply(this, arguments);
}

const getWebSiteSchema = function getWebSiteSchema(_ref) {
  const { siteUrl } = _ref;
  const { siteTitle } = _ref;
  const { siteDescription } = _ref;
  const { htmlLang } = _ref;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#WebSite`,
    url: siteUrl,
    name: siteTitle,
    description: siteDescription,
    inLanguage: htmlLang,
  };
};

const getAuthor = function getAuthor(a) {
  if (!a || !a.length) {
    return false;
  }

  return a.map((name) => ({
    '@type': 'Person',
    name,
  }));
};

const getPageSchema = function getPageSchema(_ref) {
  const { organizationName } = _ref;
  const { siteUrl } = _ref;
  const { siteLogo } = _ref;
  const { URL } = _ref;
  const { title } = _ref;
  const { headline } = _ref;
  const { htmlLang } = _ref;
  const { imgURL } = _ref;
  const { datePublished } = _ref;
  const { dateModified } = _ref;
  const { pageType } = _ref;
  const { publisher } = _ref;
  const { author } = _ref;
  const type = !pageType || !['Article', 'BlogPosting', 'Blog'].some((t) => pageType === t) ? 'WebPage' : pageType;
  const isArticle = pageType === 'Article' || pageType === 'BlogPosting';
  const o = {
    '@context': 'https://schema.org',
    '@type': type,
    name: title,
    inLanguage: htmlLang,
    publisher: publisher || {
      '@type': 'Organization',
      name: organizationName,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: siteLogo,
      },
    },
  };

  if (isArticle) {
    o.author = getAuthor(author) || o.publisher;
    o.mainEntityOfPage = {
      '@type': 'WebPage',
      '@id': URL,
    };
    o.headline = headline;

    if (datePublished) {
      o.datePublished = datePublished;
    }

    if (dateModified) {
      o.dateModified = dateModified;
    }
  } else {
    o.url = URL;
    o.description = headline;
  }

  if (imgURL) {
    o.image = imgURL;
  }

  return o;
};

const weekDays = {
  mo: 'Monday',
  tu: 'Tuesday',
  we: 'Wednesday',
  th: 'Thursday',
  fr: 'Friday',
  sa: 'Saturday',
  su: 'Sunday',
};

const getOpeningHoursSpecification = function getOpeningHoursSpecification(openingHours) {
  const parseDow = function parseDow(s) {
    if (!s) {
      return undefined;
    }

    let dow = s.split('-');

    if (dow.length > 1) {
      const d1 = dow[0].trim();
      const d2 = dow[1].trim();
      const keys = Object.keys(weekDays);
      const a = [];
      let first = false;
      let last = false;
      keys.forEach((d) => {
        if (d === d1) {
          first = true;
          a.push(weekDays[d]);
        } else if (d === d2) {
          last = true;
          a.push(weekDays[d]);
        } else if (first && !last) {
          a.push(weekDays[d]);
        }
      });
      return a;
    }

    dow = s.split(',');

    if (dow.length > 1) {
      return dow.map((d) => weekDays[d.trim()]);
    }

    return weekDays[s.trim()];
  };

  return openingHours.map((_ref) => {
    const dow = _ref[0];
    const timeStart = _ref[1];
    const timeFinish = _ref[2];
    return {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: parseDow(dow),
      opens: timeStart,
      closes: timeFinish,
    };
  });
};

const getOrganizationSchema = function getOrganizationSchema(_ref2) {
  const { orgContacts } = _ref2;
  const _ref2$orgAddress = _ref2.orgAddress;
  const orgAddress = _ref2$orgAddress === void 0 ? {} : _ref2$orgAddress;
  const { config } = _ref2;
  const { socialLinks } = _ref2;
  const { organizationType } = orgContacts;
  const { geo } = orgContacts;
  const { openingHours } = orgContacts;
  const organizationPhone = orgContacts.phone;
  const organizationEmail = orgContacts.email;
  const { hasMap } = orgContacts;
  const { priceRange } = orgContacts;
  const { currenciesAccepted } = orgContacts;
  const { paymentAccepted } = orgContacts;
  const organizationName = orgAddress.name;
  const { legalName } = orgAddress;
  const { alternateName } = orgAddress;
  const { description } = orgAddress;
  const { postalAddress } = orgAddress;
  const { contactPoint } = orgAddress;
  const schema = {
    '@context': 'https://schema.org',
    '@type': organizationType,
    '@id': `${config.siteUrl}/#Organization`,
    name: organizationName,
    description,
    url: config.siteUrl,
    logo: config.siteLogo,
  };

  if (config.siteBusinessPhoto) {
    schema.image = Array.isArray(config.siteBusinessPhoto) ? [].concat(config.siteBusinessPhoto) : config.siteBusinessPhoto;
  }

  if (postalAddress) {
    const o = { '@type': 'PostalAddress', ...postalAddress };

    if (postalAddress.streetAddress) {
      o.streetAddress = postalAddress.streetAddress.join(', ');
    }

    delete o.addressCountryName;
    schema.address = o;
  }

  if (legalName) {
    schema.legalName = legalName;
  }

  if (alternateName) {
    schema.alternateName = alternateName;
  }

  if (organizationPhone) {
    schema.telephone = utils.formatPhone(organizationPhone[0]);
  }

  if (organizationEmail) {
    schema.email = organizationEmail[0];
  }

  if (geo) {
    schema.geo = { '@type': 'GeoCoordinates', ...geo };
  }

  if (contactPoint) {
    schema.contactPoint = contactPoint.map((_ref3) => {
      const { name } = _ref3;
      const { contactType } = _ref3;
      const { telephone } = _ref3;
      const { email } = _ref3;
      const { areaServed } = _ref3;
      const o = {
        '@type': 'ContactPoint',
        name,
        contactType,
      };

      if (telephone) {
        o.telephone = telephone.reduce((acc, curr) => `${acc}${acc ? ', ' : ''}${utils.formatPhone(curr)}`, '');
      }

      if (email) {
        o.email = email.join();
      }

      if (areaServed) {
        o.areaServed = areaServed;
      }

      return o;
    });
  }

  if (socialLinks) {
    schema.sameAs = Object.keys(socialLinks).map((key) => socialLinks[key].to);
  }

  if (currenciesAccepted) {
    schema.currenciesAccepted = currenciesAccepted;
  }

  if (paymentAccepted) {
    schema.paymentAccepted = paymentAccepted;
  }

  if (priceRange) {
    schema.priceRange = priceRange;
  }

  if (Array.isArray(openingHours)) {
    schema.openingHoursSpecification = getOpeningHoursSpecification(openingHours);
  }

  if (hasMap) {
    schema.hasMap = hasMap;
  }

  return schema;
};

const getBreadcrumbsSchema = function getBreadcrumbsSchema(_ref) {
  const { breadcrumbs } = _ref;
  const { siteUrl } = _ref;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((_ref2, i) => {
      const { to } = _ref2;
      const name = _ref2.title;
      return {
        '@type': 'ListItem',
        position: i + 1,
        name,
        item: siteUrl + to,
      };
    }),
  };
};

const SeoBase = function SeoBase(_ref) {
  const { config } = _ref;
  const { siteMeta } = _ref;
  const { i18n } = _ref;
  const { orgContacts } = _ref;
  const { orgAddress } = _ref;
  const { socialLinks } = _ref;
  const { title } = _ref;
  const { keywords } = _ref;
  const { headline } = _ref;
  const { description } = _ref;
  const { locale } = _ref;
  const { pathname } = _ref;
  const { pageType } = _ref;
  const { imgPath } = _ref;
  const { datePublished } = _ref;
  const { dateModified } = _ref;
  const { author } = _ref;
  const { breadcrumbs } = _ref;
  const { tags } = _ref;
  const { canonical } = _ref;
  const { noindex } = _ref;
  const { metas } = _ref;
  const { links } = _ref;
  const isRoot = pathname === '/';
  const URL = `${config.siteUrl}${pathname}`;
  const homeURL = i18n ? `${config.siteUrl}${i18n.localizePath('/', locale)}` : URL;
  let imgURL;

  if (imgPath) {
    imgURL = `${config.siteUrl}${imgPath}`;
  }

  const purePath = i18n ? i18n.purePath(pathname) : pathname;

  const ogImage = { ...config.ogImage, src: `${config.ogImage.src}${locale}.jpg` };

  const twitterImage = { ...config.twitterImage, src: `${config.twitterImage.src}${locale}.jpg` };

  const { htmlLang } = siteMeta;
  const { ogLocale } = siteMeta;
  const { siteTitle } = siteMeta;
  const { siteDescription } = siteMeta;
  const isArticle = pageType === 'Article' || pageType === 'BlogPosting';
  const metaTitle = title || siteTitle;
  const metaDescription = description || siteDescription;
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
    {
      property: 'og:locale',
      content: ogLocale,
    },
  ].concat(
    (i18n === null || i18n === void 0
      ? void 0
      : i18n.localeCodes
        .filter((code) => code !== locale)
        .map((code) => ({
          property: 'og:locale:alternate',
          content: i18n.locales[code].ogLocale,
        }))) || [],
  );

  if (keywords) {
    meta.push({
      name: 'keywords',
      content: keywords,
    });
  }

  const og = [
    {
      property: 'og:site_name',
      content: i18n.locales[locale].siteShortName,
    },
    {
      property: 'og:url',
      content: URL,
    },
    {
      property: 'og:type',
      content: isArticle ? 'article' : 'website',
    },
    {
      property: 'og:title',
      content: metaTitle,
    },
    {
      property: 'og:description',
      content: metaDescription,
    },
    {
      property: 'og:image',
      content: imgURL || ogImage.src,
    },
    {
      property: 'og:image:alt"',
      content: metaDescription,
    },
  ];

  if (!imgURL) {
    og.push(
      {
        property: 'og:image:width',
        content: ogImage.width,
      },
      {
        property: 'og:image:height',
        content: ogImage.height,
      },
    );
  }

  if (isArticle) {
    if (datePublished) {
      og.push({
        property: 'article:published_time',
        content: datePublished,
      });
    }

    if (dateModified) {
      og.push({
        property: 'article:modified_time',
        content: dateModified,
      });
    }

    if (author && author.length) {
      author.forEach((name) => {
        og.push({
          property: 'article:author',
          content: name,
        });
      });
    }

    if (tags && Array.isArray(tags)) {
      tags.forEach((tag) => {
        og.push({
          property: 'article:tag',
          content: tag,
        });
      });
    }
  }

  if (config.fbAppID) {
    og.push({
      property: 'fb:app_id',
      content: config.fbAppID,
    });
  }

  if (socialLinks) {
    if (socialLinks.facebook) {
      og.push({
        property: 'article:publisher',
        content: socialLinks.facebook.to,
      });
    }

    Array.prototype.push.apply(
      og,
      Object.keys(socialLinks).map((key) => ({
        property: 'og:see_also',
        content: socialLinks[key].to,
      })),
    );
  }

  const twitter = [
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: metaTitle,
    },
    {
      name: 'twitter:description',
      content: metaDescription,
    },
    {
      name: 'twitter:image',
      content: imgURL || twitterImage.src,
    },
    {
      name: 'twitter:image:alt',
      content: metaDescription,
    },
  ];

  if (!imgURL) {
    twitter.push(
      {
        name: 'twitter:image:width',
        content: twitterImage.width,
      },
      {
        name: 'twitter:image:height',
        content: twitterImage.height,
      },
    );
  }

  if (config.twitterCreator || config.twitterSite) {
    twitter.push(
      {
        name: 'twitter:site',
        content: config.twitterSite || config.twitterCreator,
      },
      {
        name: 'twitter:creator',
        content: config.twitterCreator || config.twitterSite,
      },
    );
  }

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
  return /* #__PURE__ */ React.createElement(Helmet, {
    htmlAttributes: {
      lang: htmlLang,
    },
    title: metaTitle,
    meta: [].concat(meta, og, twitter, metas || []),
    link: [].concat(link, links || []),
    script: scripts,
  });
};

export { SeoBase, getPageSchema };
// # sourceMappingURL=index.modern.js.map
