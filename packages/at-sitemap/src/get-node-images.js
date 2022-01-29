const imagesFromAst = (htmlAst, specialFolder) => {
  const a = [];

  const findImageTags = (node) => {
    if (node.tagName === 'img') {
      const {
        properties: { src, alt, title },
      } = node;
      if (src.startsWith('/')) {
        a.push({ src, alt, title });
      } else if (src.startsWith(specialFolder)) {
        a.push({ src: `/${src}`, alt, title });
      }
    }
    if (node.children) {
      node.children.forEach((childNode) => {
        findImageTags(childNode);
      });
    }
  };

  findImageTags(htmlAst);

  return a;
};

const getNodeImages = (siteUrl, { htmlAst, cover, sections }, ignoreImagesWithoutAlt) => {
  const pageImages = {};

  const addImage = (image) => {
    if (!image || (ignoreImagesWithoutAlt && !image.alt)) {
      return;
    }
    const img = image.xl || image.sm;
    if (!img || !img.publicURL) {
      return;
    }
    pageImages[img.publicURL] = { alt: image.alt, title: image.title };
  };

  addImage(cover);

  if (sections) {
    sections.forEach(({ image: sectionImage, items }) => {
      addImage(sectionImage);
      if (items) {
        items.forEach(({ image: itemImage }) => addImage(itemImage));
      }
    });
  }

  const astImages = imagesFromAst(htmlAst);
  astImages.forEach(({ src, alt, title }) => {
    if (!ignoreImagesWithoutAlt || alt) {
      pageImages[src] = { alt, title };
    }
  });

  const pageImagesKeys = Object.keys(pageImages);
  if (pageImagesKeys.length === 0) {
    return null;
  }

  return pageImagesKeys.map((image) => ({
    url: siteUrl + image,
    title: pageImages[image].alt,
    caption: pageImages[image].title,
  }));
};

module.exports = getNodeImages;
