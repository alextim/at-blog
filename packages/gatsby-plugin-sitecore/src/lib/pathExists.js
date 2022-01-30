const fs = require('fs');

const pathExists = (path) => {
  try {
    return fs.existsSync(path);
  } catch (err) {
    return false;
  }
};

module.exports = pathExists;
