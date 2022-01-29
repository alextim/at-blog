# AT-SEO

## Limitations

For now the `author' field is a string array in Frontmatter.

- for FB: profile link array
- for Twitter: twitter user name
- for schema: name and link

To solve this problem it's needed to change value of single author from from String to Object

## Problematic code
### schema.org

```js
const getAuthor = (a) => {
  if (!a || !a.length) {
    return false;
  }
  return a.map((name) => ({
    '@type': 'Person',
    name, 
    // TODO: add URL of author profile    
    // url: 'http://example.com/profile/janedoe123'
  }));
};
```

### OpenGraph


https://stackoverflow.com/questions/46658129/facebook-stopped-displaying-articleauthor

```js
  if (author && author.length) {
    author.forEach((name) => {
      og.push({
        property: 'article:author',
        // TODO: change content to URL on author profile: FB or webpage
        content: name,
      });
    });
  }
```

### Twitter

```js
  if (config.twitterCreator || config.twitterSite) {
    twitter.push(
      {
        name: 'twitter:site',
        content: config.twitterSite || config.twitterCreator,
      },
      {
        name: 'twitter:creator',
        // TODO: change content to author user name on Twitter        
        content: config.twitterCreator || config.twitterSite,
      },
    );
  }
```