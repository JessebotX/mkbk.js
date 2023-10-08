const INDEX = `<!DOCTYPE html>
<html lang="{{ languageCode }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ title }}</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`;

const BOOK_INDEX = `<!DOCTYPE html>
<html lang="{{ languageCode }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ title }}</title>
  </head>
  <body>
    <h1>Content:</h1>

    {{{ content }}}
  </body>
</html>
`;

const CHAPTER = `<!DOCTYPE html>
<html lang="{{ languageCode }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ title }}</title>
  </head>
  <body>
    {{{ content }}}

    {{#with frontmatter.date}}
    {{dateFormat . "YYYY-MM-DDTHH:mm:ssZ"}}
    {{/with}}
  </body>
</html>
`;

const RSS = `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{{ title }}</title>
    <link>{{ parent.baseURL }}/{{ id }}</link>
    {{#with description}}
    <description>{{ . }}</description>
    {{/with}}
    <generator>mkbk --- github.com/JessebotX/mkbk</generator>
    <language>{{languageCode}}</language>
    {{#each chapters}}
    <item>
      <title>{{ frontmatter.title }}</title>
      <link>{{ parent.parent.baseURL }}/{{parent.id}}/{{id}}.html</link>
      {{#with frontmatter.date}}
      <pubDate>{{dateFormat . "YYYY-MM-DDTHH:mm:ssZ"}}</pubDate>
      {{/with}}
      <guid>{{ parent.parent.baseURL }}/{{ parent.id }}/{{ id }}.html</guid>
      {{#with frontmatter.description}}
      <description>{{ . }}</description>
      {{else}}
      <description>{{frontmatter.title}}</description>
      {{/with}}
    </item>
    {{/each}}
  </channel>
</rss>
`

exports.INDEX = INDEX;
exports.BOOK_INDEX = BOOK_INDEX;
exports.CHAPTER = CHAPTER;
exports.RSS = RSS;
