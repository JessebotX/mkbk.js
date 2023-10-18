export const INDEX = `<!DOCTYPE html>
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

export const BOOK_INDEX = `<!DOCTYPE html>
<html lang="{{ languageCode }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ title }}</title>
  </head>
  <body>
    <h1>Content:</h1>
  </body>
</html>
`;

export const CHAPTER = `<!DOCTYPE html>
<html lang="{{ parent.languageCode }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ title }}</title>
  </head>
<body>

  </body>
</html>
`;

export const RSS = `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{{ title }}</title>
    <link>{{ parent.baseURL }}/{{ id }}</link>
    {% if description -%}
    <description>{{ description }}</description>
    {%- endif %}
    <generator>mkbk --- github.com/JessebotX/mkbk</generator>
    <language>{{languageCode}}</language>

    {%- for chapter in chapters %}
    <item>
      <title>{{ chapter.frontmatter.title }}</title>
      <link>
        {{ chapter.parent.parent.baseURL }}/{{chapter.parent.id}}/{{id}}.html
      </link>
      <guid>
        {{chapter.parent.parent.baseURL}}/{{chapter.parent.id}}/{{id}}.html
      </guid>

      {% if chapter.description -%}
      <description>{{ chapter.description }}</description>
      {%- endif %}
    </item>
    {% endfor -%}

  </channel>
</rss>
`
