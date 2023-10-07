const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const { marked } = require('marked');

const defaultLayouts = require('./default-layouts');

function generateHTMLSite(collection) {
    const inputDir = collection.workingDir;
    const rootOutputDir = path.join(inputDir, collection.outputRelativeDir);
    fs.mkdirSync(rootOutputDir, { recursive: true });

    const layoutDir = path.join(inputDir, collection.layoutRelativeDir);

    let indexLayout = defaultLayouts.INDEX;
    try {

    } catch (err) {
        console.log(`Using default chapter layout since it failed to read ${path.join(layoutDir, 'index.html')}`);
    }

    let bookIndexLayout = defaultLayouts.BOOK_INDEX;
    try {
        bookIndexLayout = fs.readFileSync(path.join(layoutsDir, 'book.html'), 'utf-8');
    } catch (err) {
        console.log(`Using default chapter layout since it failed to read ${path.join(layoutDir, 'book.html')}`);
    }

    let chapterLayout = defaultLayouts.CHAPTER;
    try {
        chapterLayout = fs.readFileSync(path.join(layoutsDir, 'chapter.html'), 'utf-8');
    } catch (err) {
        console.log(`Using default chapter layout since it failed to read ${path.join(layoutDir, 'chapter.html')}`);
    }

    // copy layout/assets into root of output directory
    copyDir(path.join(layoutDir, 'assets'), rootOutputDir);

    // collection index
    const { title, description, baseURL, languageCode, books } = collection;

    handlebars.registerHelper('dateFormat', require('handlebars-dateformat'));

    try {
        writeFileWithTemplate(
            path.join(rootOutputDir, 'index.html'), indexLayout, {
                title, description, baseURL, languageCode, books,
                params: collection
            });
    } catch (err) {
        console.error(err);
        return;
    }

    // book
    collection.books.forEach((book) => {
        const bookOutputDir = path.join(rootOutputDir, book.id);
        try {
            writeBook(book, path.join(inputDir, 'books', book.id), bookOutputDir, bookIndexLayout, chapterLayout);
        } catch (err) {
            console.error(err);
            return;
        }
    });
}

function copyDir(input, output) {
    if (fs.existsSync(input)) {
        fs.cp(input, output, { preserveTimestamps: true, recursive: true }, (err) => {
            if (err) {
                console.error(err);
            }
        })
    } else {
        console.error(`Cannot find directory ${input}`);
    }
}

function writeBook(book, workingDir, outputDir, indexTemplate, chapterTemplate) {
    fs.mkdirSync(outputDir, { recursive: true });

    // parse blurb file before creating book.html
    const blurbPath = path.join(workingDir, book.blurbRelativePath);
    if (fs.existsSync(blurbPath)) {
        const blurbMD = fs.readFileSync(blurbPath, 'utf-8');
        book.content = marked.parse(blurbMD);
    } else {
        book.content = "No blurb provided..."
    }

    // create book index.html
    const {
        id,
        content,
        title,
        languageCode,
        tags,
        description,
        coverRelativePath,
        licenseRelativePath,
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
            tags,
            description,
            coverRelativePath,
            licenseRelativePath,
            status,
            mirrors,
            author,
            chapters,
            params: book
        }
    );

    if (coverRelativePath) {
        fs.cp(path.join(workingDir, coverRelativePath), path.join(outputDir, coverRelativePath), { preserveTimestamps: true }, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

    if (licenseRelativePath) {
        fs.cp(path.join(workingDir, licenseRelativePath), path.join(outputDir, licenseRelativePath), { preserveTimestamps: true }, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

    book.chapters.forEach((chapter) => {
        writeChapter(chapter, outputDir, chapterTemplate);
    });
}

function writeFileWithTemplate(outputPath, layoutSource, params) {
    const template = handlebars.compile(layoutSource);
    const content = template(params);
    fs.writeFileSync(outputPath, content);
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

exports.generateHTMLSite = generateHTMLSite;
