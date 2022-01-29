const quote = (str) => `'${str}'`;

const SELF = quote('self');
const NONE = quote('none');
const UNSAFE_INLINE = quote('unsafe-inline');
const DATA = 'data:';

const serialize = (csp) =>
  Object.keys(csp)
    .map((key) => (csp[key] ? `${key} ${csp[key].join(' ')}` : key))
    .join(';');

const getCSP = (ga = false, gmaps = false, youtube = false, tags = false, ads = false, remarketing = false) => {
  const CSP = {
    'default-src': [SELF],
    'manifest-src': [SELF],
    'upgrade-insecure-requests': null,
    'prefetch-src': [SELF],
    'connect-src': [SELF],
    'style-src': [SELF, UNSAFE_INLINE],
    'font-src': [SELF, DATA],
    'base-uri': [NONE],
    'frame-src': gmaps || youtube || (ga && remarketing) ? [] : [NONE],
    'frame-ancestors': [NONE],
    'form-action': [NONE],
    'script-src': [SELF, UNSAFE_INLINE],
    'img-src': [SELF, DATA],
    'object-src': [NONE],
  };

  if (tags) {
    const tagsURL = 'https://tagmanager.google.com';

    CSP['script-src'].push(tagsURL);
    CSP['style-src'].push(tagsURL, 'https://fonts.googleapis.com');
    CSP['img-src'].push('https://ssl.gstatic.com', 'https://www.gstatic.com');
    CSP['font-src'].push('https://fonts.gstatic.com');
  }

  if (ga) {
    const gaURL = 'https://www.google-analytics.com';

    const gaCommon = ['www.google-analytics.com', 'https://stats.g.doubleclick.net']; // ,

    CSP['script-src'].push(gaURL, 'https://ssl.google-analytics.com');
    CSP['img-src'].push(gaURL, ...gaCommon);
    CSP['connect-src'].push(gaURL, ...gaCommon);

    CSP['script-src'].push(gaURL); // 'unsafe-eval'

    if (ads || remarketing) {
      const googleURL = 'https://www.google.com';
      const adsURL = 'https://googleads.g.doubleclick.net';

      CSP['script-src'].push('https://www.googleadservices.com');

      if (ads) {
        CSP['img-src'].push(adsURL);
      }

      if (remarketing) {
        CSP['script-src'].push(adsURL);
        CSP['frame-src'].push('https://bid.g.doubleclick.net');
      }
      CSP['script-src'].push(googleURL);
      CSP['img-src'].push(googleURL);
    }
  }

  if (gmaps) {
    CSP['frame-src'].push('*.google.com');
    CSP['script-src'].push('maps.googleapis.com');
    CSP['img-src'].push('maps.gstatic.com', '*.googleapis.com', '*.ggpht');
  }

  if (youtube) {
    CSP['frame-src'].push('https://www.youtube.com');
    CSP['img-src'].push('*.ytimg.com');
  }

  return serialize(CSP);
};

module.exports = getCSP;
