function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var reactHelmet = require('react-helmet');
var utils = _interopDefault(require('@alextim/utils'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var getWebSiteSchema = function getWebSiteSchema(_ref) {
  var siteUrl = _ref.siteUrl,
      siteTitle = _ref.siteTitle,
      siteDescription = _ref.siteDescription,
      htmlLang = _ref.htmlLang;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': siteUrl + "/#WebSite",
    url: siteUrl,
    name: siteTitle,
    description: siteDescription,
    inLanguage: htmlLang
  };
};

var getAuthor = function getAuthor(a) {
  if (!a || !a.length) {
    return false;
  }

  return a.map(function (name) {
    return {
      '@type': 'Person',
      name: name
    };
  });
};

var getPageSchema = function getPageSchema(_ref) {
  var organizationName = _ref.organizationName,
      siteUrl = _ref.siteUrl,
      siteLogo = _ref.siteLogo,
      URL = _ref.URL,
      title = _ref.title,
      headline = _ref.headline,
      htmlLang = _ref.htmlLang,
      imgURL = _ref.imgURL,
      datePublished = _ref.datePublished,
      dateModified = _ref.dateModified,
      pageType = _ref.pageType,
      publisher = _ref.publisher,
      author = _ref.author;
  var type = !pageType || !['Article', 'BlogPosting', 'Blog'].some(function (t) {
    return pageType === t;
  }) ? 'WebPage' : pageType;
  var isArticle = pageType === 'Article' || pageType === 'BlogPosting';
  var o = {
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
        url: siteLogo
      }
    }
  };

  if (isArticle) {
    o.author = getAuthor(author) || o.publisher;
    o.mainEntityOfPage = {
      '@type': 'WebPage',
      '@id': URL
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

var weekDays = {
  mo: 'Monday',
  tu: 'Tuesday',
  we: 'Wednesday',
  th: 'Thursday',
  fr: 'Friday',
  sa: 'Saturday',
  su: 'Sunday'
};

var getOpeningHoursSpecification = function getOpeningHoursSpecification(openingHours) {
  var parseDow = function parseDow(s) {
    if (!s) {
      return undefined;
    }

    var dow = s.split('-');

    if (dow.length > 1) {
      var d1 = dow[0].trim();
      var d2 = dow[1].trim();
      var keys = Object.keys(weekDays);
      var a = [];
      var first = false;
      var last = false;
      keys.forEach(function (d) {
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
      return dow.map(function (d) {
        return weekDays[d.trim()];
      });
    }

    return weekDays[s.trim()];
  };

  return openingHours.map(function (_ref) {
    var dow = _ref[0],
        timeStart = _ref[1],
        timeFinish = _ref[2];
    return {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: parseDow(dow),
      opens: timeStart,
      closes: timeFinish
    };
  });
};

var getOrganizationSchema = function getOrganizationSchema(_ref2) {
  var orgContacts = _ref2.orgContacts,
      _ref2$orgAddress = _ref2.orgAddress,
      orgAddress = _ref2$orgAddress === void 0 ? {} : _ref2$orgAddress,
      config = _ref2.config,
      socialLinks = _ref2.socialLinks;
  var organizationType = orgContacts.organizationType,
      geo = orgContacts.geo,
      openingHours = orgContacts.openingHours,
      organizationPhone = orgContacts.phone,
      organizationEmail = orgContacts.email,
      hasMap = orgContacts.hasMap,
      priceRange = orgContacts.priceRange,
      currenciesAccepted = orgContacts.currenciesAccepted,
      paymentAccepted = orgContacts.paymentAccepted;
  var organizationName = orgAddress.name,
      legalName = orgAddress.legalName,
      alternateName = orgAddress.alternateName,
      description = orgAddress.description,
      postalAddress = orgAddress.postalAddress,
      contactPoint = orgAddress.contactPoint;
  var schema = {
    '@context': 'https://schema.org',
    '@type': organizationType,
    '@id': config.siteUrl + "/#Organization",
    name: organizationName,
    description: description,
    url: config.siteUrl,
    logo: config.siteLogo
  };

  if (config.siteBusinessPhoto) {
    schema.image = Array.isArray(config.siteBusinessPhoto) ? [].concat(config.siteBusinessPhoto) : config.siteBusinessPhoto;
  }

  if (postalAddress) {
    var o = _extends({
      '@type': 'PostalAddress'
    }, postalAddress);

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
    schema.geo = _extends({
      '@type': 'GeoCoordinates'
    }, geo);
  }

  if (contactPoint) {
    schema.contactPoint = contactPoint.map(function (_ref3) {
      var name = _ref3.name,
          contactType = _ref3.contactType,
          telephone = _ref3.telephone,
          email = _ref3.email,
          areaServed = _ref3.areaServed;
      var o = {
        '@type': 'ContactPoint',
        name: name,
        contactType: contactType
      };

      if (telephone) {
        o.telephone = telephone.reduce(function (acc, curr) {
          return "" + acc + (acc ? ', ' : '') + utils.formatPhone(curr);
        }, '');
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
    schema.sameAs = Object.keys(socialLinks).map(function (key) {
      return socialLinks[key].to;
    });
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

var getBreadcrumbsSchema = function getBreadcrumbsSchema(_ref) {
  var breadcrumbs = _ref.breadcrumbs,
      siteUrl = _ref.siteUrl;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map(function (_ref2, i) {
      var to = _ref2.to,
          name = _ref2.title;
      return {
        '@type': 'ListItem',
        'position': i + 1,
        name: name,
        item: siteUrl + to
      };
    })
  };
};

var SeoBase = function SeoBase(_ref) {
  var config = _ref.config,
      siteMeta = _ref.siteMeta,
      i18n = _ref.i18n,
      orgContacts = _ref.orgContacts,
      orgAddress = _ref.orgAddress,
      socialLinks = _ref.socialLinks,
      title = _ref.title,
      keywords = _ref.keywords,
      headline = _ref.headline,
      description = _ref.description,
      locale = _ref.locale,
      pathname = _ref.pathname,
      pageType = _ref.pageType,
      imgPath = _ref.imgPath,
      datePublished = _ref.datePublished,
      dateModified = _ref.dateModified,
      author = _ref.author,
      breadcrumbs = _ref.breadcrumbs,
      tags = _ref.tags,
      canonical = _ref.canonical,
      noindex = _ref.noindex,
      metas = _ref.metas,
      links = _ref.links;
  var isRoot = pathname === '/';
  var URL = "" + config.siteUrl + pathname;
  var homeURL = i18n ? "" + config.siteUrl + i18n.localizePath('/', locale) : URL;
  var imgURL;

  if (imgPath) {
    imgURL = "" + config.siteUrl + imgPath;
  }

  var purePath = i18n ? i18n.purePath(pathname) : pathname;

  var ogImage = _extends({}, config.ogImage, {
    src: "" + config.ogImage.src + locale + ".jpg"
  });

  var twitterImage = _extends({}, config.twitterImage, {
    src: "" + config.twitterImage.src + locale + ".jpg"
  });

  var htmlLang = siteMeta.htmlLang,
      ogLocale = siteMeta.ogLocale,
      siteTitle = siteMeta.siteTitle,
      siteDescription = siteMeta.siteDescription;
  var isArticle = pageType === 'Article' || pageType === 'BlogPosting';
  var metaTitle = title || siteTitle;
  var metaDescription = description || siteDescription;
  var meta = [{
    name: 'robots',
    content: (noindex ? 'no' : '') + "index, follow"
  }, {
    name: 'description',
    content: metaDescription
  }, {
    name: 'theme-color',
    content: config.themeColor
  }, {
    property: 'og:locale',
    content: ogLocale
  }].concat((i18n === null || i18n === void 0 ? void 0 : i18n.localeCodes.filter(function (code) {
    return code !== locale;
  }).map(function (code) {
    return {
      property: 'og:locale:alternate',
      content: i18n.locales[code].ogLocale
    };
  })) || []);

  if (keywords) {
    meta.push({
      name: 'keywords',
      content: keywords
    });
  }

  var og = [{
    property: 'og:site_name',
    content: i18n.locales[locale].siteShortName
  }, {
    property: 'og:url',
    content: URL
  }, {
    property: 'og:type',
    content: isArticle ? 'article' : 'website'
  }, {
    property: 'og:title',
    content: metaTitle
  }, {
    property: 'og:description',
    content: metaDescription
  }, {
    property: 'og:image',
    content: imgURL || ogImage.src
  }, {
    property: 'og:image:alt"',
    content: metaDescription
  }];

  if (!imgURL) {
    og.push({
      property: 'og:image:width',
      content: ogImage.width
    }, {
      property: 'og:image:height',
      content: ogImage.height
    });
  }

  if (isArticle) {
    if (datePublished) {
      og.push({
        property: 'article:published_time',
        content: datePublished
      });
    }

    if (dateModified) {
      og.push({
        property: 'article:modified_time',
        content: dateModified
      });
    }

    if (author && author.length) {
      author.forEach(function (name) {
        og.push({
          property: 'article:author',
          content: name
        });
      });
    }

    if (tags && Array.isArray(tags)) {
      tags.forEach(function (tag) {
        og.push({
          property: 'article:tag',
          content: tag
        });
      });
    }
  }

  if (config.fbAppID) {
    og.push({
      property: 'fb:app_id',
      content: config.fbAppID
    });
  }

  if (socialLinks) {
    if (socialLinks.facebook) {
      og.push({
        property: 'article:publisher',
        content: socialLinks.facebook.to
      });
    }

    Array.prototype.push.apply(og, Object.keys(socialLinks).map(function (key) {
      return {
        property: 'og:see_also',
        content: socialLinks[key].to
      };
    }));
  }

  var twitter = [{
    name: 'twitter:card',
    content: 'summary_large_image'
  }, {
    name: 'twitter:title',
    content: metaTitle
  }, {
    name: 'twitter:description',
    content: metaDescription
  }, {
    name: 'twitter:image',
    content: imgURL || twitterImage.src
  }, {
    name: 'twitter:image:alt',
    content: metaDescription
  }];

  if (!imgURL) {
    twitter.push({
      name: 'twitter:image:width',
      content: twitterImage.width
    }, {
      name: 'twitter:image:height',
      content: twitterImage.height
    });
  }

  if (config.twitterCreator || config.twitterSite) {
    twitter.push({
      name: 'twitter:site',
      content: config.twitterSite || config.twitterCreator
    }, {
      name: 'twitter:creator',
      content: config.twitterCreator || config.twitterSite
    });
  }

  var link = [{
    rel: 'author',
    type: 'text/plain',
    href: config.siteUrl + "/humans.txt"
  }];

  if (canonical) {
    link.push({
      rel: 'canonical',
      href: URL
    });
  }

  if (i18n) {
    Array.prototype.push.apply(link, i18n.localeCodes.map(function (code) {
      return {
        rel: 'alternate',
        hrefLang: i18n.locales[code].htmlLang,
        href: "" + config.siteUrl + i18n.localizePath(purePath, code)
      };
    }));
    link.push({
      rel: 'alternate',
      hrefLang: 'x-default',
      href: "" + config.siteUrl + purePath
    });
  }

  var scriptSrc = [getWebSiteSchema({
    siteUrl: config.siteUrl,
    siteTitle: siteTitle,
    siteDescription: siteDescription,
    htmlLang: htmlLang
  }), getPageSchema({
    organizationName: orgAddress.name,
    siteUrl: config.siteUrl,
    siteLogo: config.siteLogo,
    URL: URL,
    headline: headline || metaDescription,
    metaTitle: metaTitle,
    metaDescription: metaDescription,
    htmlLang: htmlLang,
    imgURL: imgURL,
    datePublished: datePublished,
    dateModified: dateModified,
    author: author,
    pageType: pageType
  })];

  if (isRoot) {
    scriptSrc.push(getOrganizationSchema({
      orgContacts: orgContacts,
      orgAddress: orgAddress,
      config: config,
      homeURL: homeURL,
      socialLinks: socialLinks
    }));
  }

  if (!config.noBreadcrumbs && !isRoot && breadcrumbs && breadcrumbs.length) {
    scriptSrc.push(getBreadcrumbsSchema({
      breadcrumbs: breadcrumbs,
      siteUrl: config.siteUrl
    }));
  }

  var scripts = scriptSrc.map(function (el) {
    return {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(el)
    };
  });
  return /*#__PURE__*/React.createElement(reactHelmet.Helmet, {
    htmlAttributes: {
      lang: htmlLang
    },
    title: metaTitle,
    meta: [].concat(meta, og, twitter, metas || []),
    link: [].concat(link, links || []),
    script: scripts
  });
};

exports.SeoBase = SeoBase;
exports.getPageSchema = getPageSchema;
//# sourceMappingURL=index.js.map
