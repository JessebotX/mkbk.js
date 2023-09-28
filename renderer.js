const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

const defaultLayouts = require('./default-layouts');

function htmlSite(collection, inputDirectory) {
    const rootOutputDir = collection.hasOwnProperty('outputDir') ? collection.outputDir : path.join(inputDirectory, 'out');
    fs.mkdirSync(rootOutputDir, { recursive: true });

    const layoutsDir = path.join(inputDirectory, 'layout');

    let indexLayout = defaultLayouts.INDEX;
    try {
        indexLayout = fs.readFileSync(path.join(layoutsDir, 'index.html'), 'utf-8');
    } catch {
        console.log(`Using default chapter layout since it failed to read ${path.join(layoutsDir, 'index.html')}`);
    }

    let bookIndexLayout = defaultLayouts.BOOK_INDEX;
    try {
        bookIndexLayout = fs.readFileSync(path.join(layoutsDir, 'book.html'), 'utf-8');
    } catch (err) {
        console.log(`Using default chapter layout since it failed to read ${path.join(layoutsDir, 'book.html')}`);
    }

    let chapterLayout = defaultLayouts.CHAPTER;
    try {
        chapterLayout = fs.readFileSync(path.join(layoutsDir, 'chapter.html'), 'utf-8');
    } catch (err) {
        console.log(`Using default chapter layout since it failed to read ${path.join(layoutsDir, 'chapter.html')}`);
    }

    // index.html
    const { title, description, baseURL, languageCode, books } = collection;
    try {
        const indexHTMLContent = ejs.render(indexLayout, {title, languageCode, description, baseURL, books, params: collection});
        fs.writeFileSync(path.join(rootOutputDir, 'index.html'), indexHTMLContent);
    } catch (err) {
        console.error(err);
        return;
    }

    // book
    collection.books.forEach((book) => {
        const bookOutputDir = path.join(rootOutputDir, book.id);
        try {
            fs.mkdirSync(bookOutputDir, { recursive: true });
        } catch (err) {
            console.log(err);
            return;
        }

        // create book.html
        const {
            title,
            languageCode,
            genre,
            shortDescription,
            coverFileName,
            licenseFileName,
            status,
            mirrors,
            author,
        } = book;

        try {
            const bookHTMLContent = ejs.render(
                bookIndexLayout,
                {
                    title,
                    languageCode,
                    genre,
                    shortDescription,
                    coverFileName,
                    licenseFileName,
                    status,
                    mirrors,
                    author,
                    params: book
                }
            );
            fs.writeFileSync(path.join(bookOutputDir, 'index.html'), bookHTMLContent);
        } catch (err) {
            console.error(err);
            return;
        }
    });
}

exports.htmlSite = htmlSite;
