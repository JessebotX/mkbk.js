// SPDX-License-Identifier: MPL-2.0

const book = require('./book');

function parse(workingDir, options) {
    const {
        title,
        baseURL,
        languageCode,
        description,
        faviconPath,
        customCollectionCSSPath,
        customBookCSSPath,
        customChapterCSSPath,
    } = options;

    if (!languageCode) {
        languageCode = 'en'; // probably what most people want
    }

    const collection = {
        title,
        baseURL,
        languageCode,
        description,
        faviconPath,
        workingDir,
        customCollectionCSSPath,
        customBookCSSPath,
        customChapterCSSPath,
    };

    if (options.books.length <= 0) {
        return collection;
    }

    collection.books = [];
    options.books.forEach((item) => {
        const { workingDir } = item;
        const newBook = book.parse(workingDir, item);
        collection.books.push(newBook);
    });

    return collection;
}

exports = {
    parse
};
