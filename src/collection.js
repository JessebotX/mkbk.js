// SPDX-License-Identifier: MPL-2.0

const book = require('./book');

function parse(workingDir, options) {
    const {
        title,
        baseURL,
        description,
        faviconPath,
        customCollectionCSSPath,
        customBookCSSPath,
        customChapterCSSPath
    } = options;

    let { languageCode } = options;

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

    if (!options.books) {
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

exports.parse = parse;
