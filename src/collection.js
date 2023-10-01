const path = require('path');

/* Example:
   parse({ title: 'John Doe Collection', languageCode: 'en',  'description': '...', ... })
  */

function parse(workingDir, options) {
    const { title, baseURL, languageCode, description, booksDir, faviconPath } = options;
    if (!languageCode) {
        languageCode = 'en';
    }

    const collection = {
        title,
        baseURL,
        languageCode,
        description,
        faviconPath,
        params: options
    };

    collection.books = readBooks(booksDir ? booksDir : path.join(workingDir, 'books'));

    return collection;
}

function readBooks(booksDir, collection) {
    const folders = fs.readdirSync(booksDir);
    const books = folders.filter(folder => fs.existsSync(path.join(booksDir, folder, 'mkbk-book.yml'))).map(folder => {
        const thisDir = path.join(booksDir, folder);
        const configFilePath = path.join(thisDir, BOOK_CONFIG_YAML_FILE);
        const configSource = fs.readFileSync(configFilePath, 'utf-8');

        return book.readFromYAML(configSource, folder, path.join(thisDir, 'chapters'), collection);
    });
    return books;
}

exports = {
    parse
};
