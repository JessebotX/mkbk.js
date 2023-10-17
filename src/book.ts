// SPDX-License-Identifier: MPL-2.0

import * as fs from 'fs';
import * as path from 'path';

interface LinkItem {
    name: string;
    link: string;
    isLink?: boolean;
}

interface Author {
    name: string;
    bio?: string;
    donate?: LinkItem[];
}

export interface BookOptions {
    id: string;
    title: string;
    workingDir?: string;
    chaptersDir?: string;
    coverRelPath?: string;
    blurbRelPath?: string;
    languageCode?: string;
    tags?: string[];
    description?: string;
    copyright?: string;
    status?: string;
    customCSSRelPath?: string;
    customJSRelPath?: string;
    mirrors?: LinkItem;
    author?: Author;
}

export interface Book extends BookOptions {
    chaptersDir: string;
    languageCode: string;
    blurbRelPath: string;
    params: BookOptions;
    content?: string;
}

export function parse(options: BookOptions): Book {
    console.log(options);
    const {
        id,
        title,
        coverRelPath,
        tags,
        description,
        copyright,
        status,
        mirrors,
        author
    } = options;

    let { languageCode, blurbRelPath, chaptersDir } = options;

    if (!languageCode) {
        languageCode = 'en';
    }

    if (!blurbRelPath) {
        blurbRelPath = 'index.md';
    }

    if (!chaptersDir) {
        chaptersDir = 'chapters';
    }

    const book: Book = {
        languageCode,
        chaptersDir,
        blurbRelPath,
        id,
        title,
        coverRelPath,
        tags,
        description,
        copyright,
        status,
        mirrors,
        author,
        params: options,
    };

    return book;
}
