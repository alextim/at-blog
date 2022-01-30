const fs = require('fs');

module.exports = (reporter, options, siteUrl, mainNotEmpty) => {
  if (!options.createRobotsTxt) {
    reporter.info('"robots.txt" generation is disabled');
    return;
  }

  let s = `
User-agent: *
Disallow: ${options.noIndex ? '/' : ''}`;

  if (mainNotEmpty) {
    s += `\nsitemap: ${siteUrl}/${options.sitemapFileName}`;
  }

  const filePath = `${options.buildDir}/robots.txt`;

  fs.writeFileSync(filePath, s);
  reporter.info('"robots.txt" created');
};
