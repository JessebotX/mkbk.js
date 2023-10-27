# mkbk
![npm](https://img.shields.io/npm/dw/mkbk)

[![CI](https://github.com/JessebotX/mkbk.js/actions/workflows/testing.yml/badge.svg)](https://github.com/JessebotX/mkbk.js/actions/workflows/testing.yml)

[![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)

> 📚 A book library static site generator .

A static site generator geared towards creatives looking to distribute their markdown-based written works.

## Features
- Generate a full static site from a straightforward organization of markdown files
- Creates [RSS](https://en.wikipedia.org/wiki/RSS) feeds and [EPUB](https://en.wikipedia.org/wiki/EPUB) files for every book
- **Customization**: provides powerful theming capabilities allowing you to customize the internal HTML output using the Nunjucks templating engine.
- **Extensible**: returns a collection object which prevents lock-in to a specific output paradigm (ie. _bring your own renderer_) and allows you to generate other non-HTML formats.

## COPYING
SPDX-License-Identifier: `MPL-2.0`

See [LICENSE.txt](LICENSE.txt)

## Usage
### Installation and Quickstart
Ensure you have `node.js` and `npm` installed.

1. Bootstrap a node project:
   ```bash
   npm init -y
   npm install mkbk
   ```
2. Create an `index.js` file with the following contents:
   ```js
   const { collection, renderer } = require('mkbk');

   // Create a collection project
   const project = collection.parse(
     {
       title: 'Book Collection Web Title',
       workingDir: '.',
       baseURL: 'https://example.com/books', // REQUIRED for RSS feeds
       languageCode: 'en',
       books: [
         {
           id: 'unique-book-id',       // REQUIRED
           workingDir: './books/warp', // REQUIRED
           title: "Book Title",
           languageCode: 'en',
           tags: ["Science Fiction", "Fantasy", "Action", "Adventure"],
           description: 'One or two sentences describing the book.',
           coverRelPath: 'cover.webp',
           blurbRelPath: 'index.md',
           status: 'Completed',
         },
         {
           id: 'unique-book-id-2', // REQUIRED
           workingDir: './books/warp', // REQUIRED
           title: "Book Title 2",
           languageCode: 'en',
           tags: ["Dark Fantasy", "Action", "Thriller"],
           description: 'One or two sentences describing the book.',
           coverRelPath: 'cover.webp',
           blurbRelPath: 'index.md',
           status: 'On Hiatus',
         },
       ]
     }
   );

   // Generate HTML Site from a collection object
   try {
     renderer.generateHTMLSite(project);
   } catch (err) {
     console.log(err);
   }
   ```
3. Structure your content as seen in [**Folder Structure**](#folder-structure) and [examples](testdata/)
4. Run `node index.js` to build static website.

### Folder Structure
`mkbk` utilizes a straightforward folder structure for your source files.

```bash
PROJECT_ROOT/
    package.json
    index.js
    books/ # source directory containing a bunch of books
      book-id-1/
        index.md
        cover.webp
        chapters/
          markdown-file-1.md
          markdown-file-2.md
    layout/ # customize internal html generation
      index.html
      book.html
      chapter.html
      assets/
        styles.css
        placeholder-image.png
    out/ # This is where the final site is created
      index.html
      styles.css
      placeholder-image.png
      book-id-1/
        index.html
        cover.webp
        markdown-file-1.html
        markdown-file-2.html
        rss.xml
        book-id-1.epub
    # ...
```
