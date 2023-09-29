// TODO
const INDEX = `
<!DOCTYPE html>
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
`

const BOOK_INDEX = `
<!DOCTYPE html>
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
`

const CHAPTER = `
<!DOCTYPE html>
<html lang="{{ languageCode }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ title }}</title>
  </head>
  <body>
    {{{ content }}}
  </body>
</html>
`

exports.INDEX = INDEX;
exports.BOOK_INDEX = BOOK_INDEX;
exports.CHAPTER = CHAPTER;
