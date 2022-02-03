const getTwitterMeta = ({ metaTitle, metaDescription, imgUrl, twitterImage, twitterCreator, twitterSite }) => {
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
      content: twitterImage?.src || imgUrl,
    },
    {
      name: 'twitter:image:alt',
      content: metaDescription,
    },
  ];

  if (twitterImage?.src) {
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

  if (twitterCreator || twitterSite) {
    twitter.push(
      {
        name: 'twitter:site',
        content: twitterSite || twitterCreator,
      },
      {
        name: 'twitter:creator',
        // TODO: change content to author user name on Twitter
        content: twitterCreator || twitterSite,
      },
    );
  }

  return twitter;
};

module.exports = getTwitterMeta;
