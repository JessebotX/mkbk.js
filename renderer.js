const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const { marked } = require('marked');

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
    // const { title, description, baseURL, languageCode, books } = collection;
    // try {
    //     const indexHTMLContent = ejs.render(indexLayout, {title, languageCode, description, baseURL, books, params: collection});
    //     fs.writeFileSync(path.join(rootOutputDir, 'index.html'), indexHTMLContent);
    // } catch (err) {
    //     console.error(err);
    //     return;
    // }

    const { title, description, baseURL, languageCode, books } = collection;
    try {
        writeFileWithTemplate(
            path.join(rootOutputDir, 'index.html'), indexLayout, { title, description, baseURL, languageCode, books, params: collection});
    } catch (err) {
        console.error(err);
        return;
    }

    // book
    collection.books.forEach((book) => {
        const bookOutputDir = path.join(rootOutputDir, book.id);
        try {
            writeBook(book, path.join(inputDirectory, 'books', book.id), bookOutputDir, bookIndexLayout, chapterLayout);
        } catch (err) {
            console.log(err);
            return;
        }
    });
}

function writeBook(book, workingDir, outputDir, indexTemplate, chapterTemplate) {
    fs.mkdirSync(outputDir, { recursive: true });

    // parse blurb file before creating book.html
    const blurbMD = fs.readFileSync(path.join(workingDir, book.blurbFileName), 'utf-8');
    book.content = marked.parse(blurbMD);

    // create book.html
    const {
        content,
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

    writeFileWithTemplate(path.join(outputDir, 'index.html'), indexTemplate, { content, title, languageCode, genre, shortDescription, coverFileName, licenseFileName, status, mirrors, author, params: book });

    if (coverFileName) {
        fs.cpSync(path.join(workingDir, book.coverFileName), path.join(outputDir, book.coverFileName), { preserveTimestamps: true });
    }

    if (book.licenseFileName) {
        fs.cpSync(path.join(workingDir, book.licenseFileName), path.join(outputDir, book.licenseFileName), { preserveTimestamps: true });
    }
}

function writeFileWithTemplate(outputPath, template, params) {
    const content = ejs.render(template, params);
    fs.writeFileSync(outputPath, content);
}

exports.htmlSite = htmlSite;
