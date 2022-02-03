const getBreadcrumbsSchema = ({ breadcrumbs, siteUrl }) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map(({ to, title: name }, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: siteUrl + to,
  })),
});

module.exports = getBreadcrumbsSchema;
