const getOgMeta = ({
  ogLocale,
  i18n,
  locale,
  metaTitle,
  metaDescription,
  siteName,
  imgURL,
  ogImage,
  isArticle,
  datePublished,
  dateModified,
  author,
  tags,
  fbAppID,
  socialLinks,
}) => {
  const og = [
    {
      property: 'og:locale',
      content: ogLocale,
    },
    ...(i18n?.localeCodes
      .filter((code) => code !== locale)
      .map((code) => ({
        property: 'og:locale:alternate',
        content: i18n.locales[code].ogLocale,
      })) || []),
    {
      property: 'og:site_name',
      content: siteName,
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
      content: ogImage?.src || imgURL,
    },
    {
      property: 'og:image:alt"',
      content: metaDescription,
    },
  ];

  if (ogImage?.src) {
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
          // TODO: change content to URL on author profile: FB or webpage
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

  if (fbAppID) {
    og.push({
      property: 'fb:app_id',
      content: fbAppID,
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

  return og;
};

export default getOgMeta;
