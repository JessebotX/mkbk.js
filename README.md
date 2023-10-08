# mkbk
[![CI](https://github.com/JessebotX/mkbk.js/actions/workflows/testing.yml/badge.svg)](https://github.com/JessebotX/mkbk.js/actions/workflows/testing.yml)

📚 A Book Library SSG.

A static site generator geared towards creatives looking to distribute their markdown-based written works.

## Features
* Generate a full static site from a straightforward organization of markdown files
* Automatically creates [RSS](https://en.wikipedia.org/wiki/RSS) feeds and [EPUB](https://en.wikipedia.org/wiki/EPUB) eBook files for every book in your library
* Customization: provides powerful theming capabilities allowing you to customize the internal HTML output using the [Handlebars](https://handlebarsjs.com/) templating engine.
* Extensible: returns a collection object which prevents lock-in to a specific output paradigm (ie. _bring your own renderer_) and allows you to generate other non-HTML formats.

## COPYING
See [LICENSE.txt](LICENSE.txt)

SPDX-License-Identifier: `MPL-2.0`

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
     '.', // Specify working directory
     {
       title: 'Book Collection Web Title',
       baseURL: 'https://example.com/books',
       languageCode: 'en',
       books: [
         {
           id: 'unique-book-id',
           title: "Book Title",
           languageCode: 'en',
           tags: ["Science-fiction", "Fantasy", "Action", "Adventure"],
           description: 'One or two sentences describing the book.'
           coverRelativePath: 'cover.webp',
           blurbRelativePath: 'index.md',
           status: 'Completed',
           workingDir: './books/warp'
         },
         {
           id: 'unique-book-id-2',
           title: "Book Title 2",
           languageCode: 'en',
           tags: ["Dark Fantasy", "Action", "Thriller"],
           description: 'One or two sentences describing the book.'
           coverRelativePath: 'cover.webp',
           blurbRelativePath: 'index.md',
           status: 'On Hiatus',
           workingDir: './books/warp'
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
PROJECT_ROOT/ # Also the workingDir specified in collection.parse(workingDir, options)
    package.json
    index.js
    out/ # This is where the final site is created
        book-id-1/
            
    # ...
```

## TODO
* TODO: Implement CLI
* TODO: TypeScript support
* TODO: Check out how tailwind implements standalone cli <https://github.com/tailwindlabs/tailwindcss/tree/master/standalone-cli>
