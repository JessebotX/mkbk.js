// SPDX-License-Identifier: MPL-2.0

import { Book, BookOptions } from './book';
import * as book from './book'

interface CollectionOptions {
    title: string;
    workingDir?: string;
    languageCode?: string;
    baseURL?: string;
    description?: string;
    customCSSRelPath?: string;
    customJSRelPath?: string;
    layoutRelDir?: string;
    outputRelDir?: string;
    faviconRelPath?: string;
    books?: BookOptions[];
}

export interface Collection extends CollectionOptions {
    books?: Book[];
    title: string;
    languageCode: string;
    workingDir: string;
    layoutRelDir: string;
    outputRelDir: string;
    params: CollectionOptions;
}

/**
 * Parse a collection of books.
 */
export function parse(options: CollectionOptions): Collection {
    const {
        title,
        baseURL,
        description,
        faviconRelPath,
        customCSSRelPath,
        customJSRelPath,
        books
    } = options;

    let { languageCode, workingDir, layoutRelDir, outputRelDir } = options;

    if (!languageCode) {
        languageCode = 'en';
    }

    if (!workingDir) {
        workingDir = '.';
    }

    if (!layoutRelDir) {
        layoutRelDir = 'layout'
    }

    if (!outputRelDir) {
        outputRelDir = 'out'
    }

    const collection: Collection = {
        title,
        languageCode,
        workingDir,
        layoutRelDir,
        outputRelDir,
        baseURL,
        description,
        faviconRelPath,
        customCSSRelPath,
        customJSRelPath,
        params: options,
    };

    if (!books) {
        return collection;
    }

    collection.books = [];
    books.forEach((bookOptions) => {
        const newBook = book.parse(bookOptions);
        collection.books.push(newBook);
    });

    return collection;
}

console.log(parse({title:'hello',
                   workingDir: 'testdata/john-doe-collection',
                   books: [
                       {
                           id: 'warp',
                           workingDir: 'testdata/john-doe-collection/books/1',
                           title: 'title',
                           coverRelPath: 'cover.webp',
                       }
                   ]}));

console.log(parse({title:'hello',
                   workingDir: 'testdata/john-doe-collection',
                   books: [
                       {
                           id: 'warp',
                           workingDir: 'testdata/john-doe-collection/books/1',
                           title: 'title',
                           coverRelPath: 'cover.webp',
                       }
                   ]}).books[0].chapters);
