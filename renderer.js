const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
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

    // copy layout/assets into root of output directory
    const themeAssetsDir = path.join(layoutsDir, 'assets');
    if (fs.existsSync(themeAssetsDir)) {
        try {
            fs.cpSync(themeAssetsDir, rootOutputDir, { preserveTimestamps: true, recursive: true });
        } catch (err) {
            console.error(err);
            return;
        }
    }

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
        id,
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
        chapters,
    } = book;

    writeFileWithTemplate(
        path.join(outputDir, 'index.html'),
        indexTemplate,
        {
            id,
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
            chapters,
            params: book
        }
    );

    if (coverFileName) {
        fs.cpSync(path.join(workingDir, book.coverFileName), path.join(outputDir, book.coverFileName), { preserveTimestamps: true });
    }

    if (licenseFileName) {
        fs.cpSync(path.join(workingDir, book.licenseFileName), path.join(outputDir, book.licenseFileName), { preserveTimestamps: true });
    }

    book.chapters.forEach((chapter) => {
        writeChapter(chapter, outputDir, chapterTemplate);
    });
}

function writeChapter(chapter, outputDir, chapterTemplate) {
    chapter.content = marked.parse(chapter.content);
    const { id } = chapter;

    writeFileWithTemplate(
        path.join(outputDir, chapter.id + '.html'),
        chapterTemplate,
        {
            id,
            content: chapter.content,
            frontmatter: chapter.frontmatter,
            params: chapter
        });
}

function writeFileWithTemplate(outputPath, layoutSource, params) {
    const template = handlebars.compile(layoutSource);
    const content = template(params);
    fs.writeFileSync(outputPath, content);
}

exports.htmlSite = htmlSite;
