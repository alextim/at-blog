const path = require('path');
const pathExists = require('../../lib/pathExists');

const getTemplate = (template, templatesDir) => {
  if (!template) {
    return null;
  }
  const pathToTemplate = path.join(templatesDir, template);
  let file;
  if (pathExists(pathToTemplate)) {
    file = path.join(pathToTemplate, `${template}.jsx`);
  } else {
    file = `${pathToTemplate}.jsx`;
  }
  try {
    return require.resolve(file);
  } catch {
    console.warn(`Template "${file}" is not exist`);
    return null;
  }
};

module.exports = getTemplate;
