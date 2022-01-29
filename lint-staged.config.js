module.exports = {
  '*.{js,ts,tsx}': ['eslint --fix'],
  '*.{md,mdx,json,yaml}': ['prettier "**/*.{mdx,json,yaml}" --write'],
};
