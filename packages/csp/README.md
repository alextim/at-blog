# Content Security Policy

usage:

```js
const getCSP = require('@alextim/csp');

const ga = true;
const youtube = true;
const gmaps = true;
const tags = true;
const ads = true;
const remarketing = true;

const csp = getCSP(ga, gmaps, youtube, tags, ads, remarketing);

const header = `Content-Security-Policy: ${csp}`;
```

`ads` or `remarketing` require `ga` to be set `true`

More about CSP for google services is [here](https://developers.google.com/tag-manager/web/csp).