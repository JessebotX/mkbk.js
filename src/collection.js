// SPDX-License-Identifier: MPL-2.0

const book = require('./book');

function parse(workingDir, options) {
    const {
        title,
        baseURL,
        description,
        faviconPath,
        customCollectionCSSRelativePath,
        customBookCSSRelativePath,
        customChapterCSSRelativePath
    } = options;

    let { languageCode, layoutRelativeDir, outputRelativeDir } = options;

    if (!languageCode) {
        languageCode = 'en'; // probably what most people want
    }

    if (!outputRelativeDir) {
        outputRelativeDir = 'out';
    }

    if (!layoutRelativeDir) {
        layoutRelativeDir = 'layout';
    }

    const collection = {
        title,
        baseURL,
        languageCode,
        description,
        faviconPath,
        workingDir,
        layoutRelativeDir,
        outputRelativeDir,
        customCollectionCSSRelativePath,
        customBookCSSRelativePath,
        customChapterCSSRelativePath,
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
