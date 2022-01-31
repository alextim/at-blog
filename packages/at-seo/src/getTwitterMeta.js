const getTwitterMeta = ({ metaTitle, metaDescription, imgURL, twitterImage, twitterCreator, twitterSite }) => {
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

export default getTwitterMeta;
