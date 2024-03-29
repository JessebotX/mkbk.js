// SPDX-License-Identifier: MPL-2.0

import * as fs from 'fs';
import * as path from 'path';

import * as chapter from './chapter';
import { Chapter } from './chapter';
import { Collection } from './collection';

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
    workingDir: string;
    chaptersRelDir?: string;
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
    chaptersRelDir: string;
    languageCode: string;
    blurbRelPath: string;
    params: BookOptions;
    content?: string;
    chapters?: Chapter[];
    parent?: Collection;
}

/**
 * Parse a configuration for a single book
 */
export function parse(options: BookOptions): Book {
    const {
        id,
        title,
        coverRelPath,
        tags,
        description,
        copyright,
        status,
        mirrors,
        author,
        workingDir
    } = options;

    if (!id) {
        throw new Error("mkbk book defined does not have an id");
    }

    if (!workingDir) {
        throw new Error("mkbk book defined does not have workingDir defined");
    }

    let { languageCode, blurbRelPath, chaptersRelDir } = options;

    if (!languageCode) {
        languageCode = 'en';
    }

    if (!blurbRelPath) {
        blurbRelPath = 'index.md';
    }

    if (!chaptersRelDir) {
        chaptersRelDir = 'chapters';
    }

    const book: Book = {
        languageCode,
        workingDir,
        chaptersRelDir,
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
        chapters: parseAllChapters(path.join(workingDir, chaptersRelDir)),
    };

    return book;
}

function parseAllChapters(dir: string): Chapter[] {
    const chapterFiles = fs.readdirSync(dir);

    if (!chapterFiles) {
        return [];
    }

    let chapters: Chapter[] = chapterFiles.filter(file => path.extname(file) === '.md').map(file => {
        const source = fs.readFileSync(path.join(dir, file)).toString();
        const id = file.replace(/.md$/i, '');
        const chapterItem = chapter.parse({ id, source });

        return chapterItem;
    });

    // Set next and previous for each chapter
    //
    // This is done in book.ts rather than chapter.ts because it is
    // designed so that a book doesn't know anything else about other
    // books, and a chapter would not know anything else about other
    // chapters.
    for (let i: number = 0; i < chapters.length; i++) {
        if ((i-1) >= 0) {
            chapters[i].prev = chapters[i-1];
        }

        if ((i+1) < chapters.length) {
            chapters[i].next = chapters[i+1];
        }
    }

    return chapters;
}
