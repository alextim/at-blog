const path = require('path');
const i18n = require('@alextim/i18n-utils');

const isValidLocale = require('./isValidLocale');

module.exports = ({ node, actions: { createNode, createParentChildLink }, getNode, createNodeId, createContentDigest }, options) => {
  const fileNode = getNode(node.parent);
  const { defaultLang, locales } = options;

  const parsedFilePath = path.parse(fileNode.relativePath);

  const { dir, name } = parsedFilePath;

  const [type, locale] = name.split('.');

  if (dir.split('/')[0] === 'locales' && !isValidLocale(locale, fileNode, locales)) {
    return;
  }

  let nodeType;
  let fieldData;

  if (type === 'footer-nav') {
    nodeType = 'FooterNav';
    fieldData = {
      to: i18n.localizePath(node.to, locale, defaultLang),
      title: node.title,
      locale,
    };
  } else if (type === 'main-nav') {
    nodeType = 'MainNav';
    fieldData = {
      to: i18n.localizePath(node.to, locale, defaultLang),
      title: node.title,
      locale,
    };

    if (node.submenu && Array.isArray(node.submenu)) {
      fieldData.submenu = node.submenu.map(({ title, to }) => ({
        title,
        to: i18n.localizePath(to, locale, defaultLang),
      }));
    }
  } else if (type === 'social-links') {
    nodeType = 'SocialLink';
    fieldData = {
      code: node.code,
      to: node.to,
      title: node.title,
      locale,
    };
  } else if (type === 'translations') {
    nodeType = 'Translation';
    fieldData = {
      key: node.key,
      value: node.value,
      locale,
    };
  } else if (type === 'address') {
    nodeType = 'Address';
    const contactPoint = node.contactPoint?.map((el) => {
      if (!el.emails) {
        return el;
      }
      const o = { ...el };
      o.email = [...el.emails];
      delete o.emails;
      return o;
    });
    fieldData = {
      name: node.name,
      alternateName: node.alternateName,
      legalName: node.legalName,
      description: node.description,
      contactPoint,
      postalAddress: node.postalAddress,
      locale,
    };
  } else if (type === 'contacts') {
    nodeType = 'Contact';
    fieldData = {
      organizationType: node.organizationType,
      phone: node.phone,
      voice: node.voice,
      geo: node.geo,
      fax: node.fax,
      email: node.emails,
      openingHours: node.openingHours,
      hasMap: node.hasMap,
      embedMap: node.embedMap,
      foundingDate: node.foundingDate,
      priceRange: node.priceRange,
      currenciesAccepted: node.currenciesAccepted,
      paymentAccepted: node.paymentAccepted,
    };
  } else if (type === 'authors') {
    nodeType = 'Author';
    fieldData = {
      firstName: node.firstName,
      lastName: node.lastName,
      slug: node.slug,
      email: node.email,
      avatar: node.avatar,
      locale,
    };
  } else {
    console.warn(`Unsupported YAML type: ${type}`);
    return;
  }
  const id = createNodeId(`${node.id} >>> ${nodeType}`);

  createNode({
    ...fieldData,
    // Required fields
    id,
    parent: node.id,
    children: [],
    internal: {
      type: nodeType,
      contentDigest: createContentDigest(fieldData),
      content: JSON.stringify(fieldData),
    },
  });

  createParentChildLink({ parent: node, child: getNode(id) });
};
