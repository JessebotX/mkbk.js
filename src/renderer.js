const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const { marked } = require('marked');
const epub = require('epub-gen-memory').default;

const defaultLayouts = require('./default-layouts');

function generateHTMLSite(collection) {
    const inputDir = collection.workingDir;
    const rootOutputDir = path.join(inputDir, collection.outputRelativeDir);
    fs.mkdirSync(rootOutputDir, { recursive: true });

    const layoutDir = path.join(inputDir, collection.layoutRelativeDir);

    let indexLayout = defaultLayouts.INDEX;
    try {
        indexLayout = fs.readFileSync(path.join(layoutDir, 'index.html'), 'utf-8');
    } catch (err) {
        console.log(`Using default chapter layout since it failed to read ${path.join(layoutDir, 'index.html')}`);
    }

    let bookIndexLayout = defaultLayouts.BOOK_INDEX;
    try {
        bookIndexLayout = fs.readFileSync(path.join(layoutDir, 'book.html'), 'utf-8');
    } catch (err) {
        console.log(`Using default chapter layout since it failed to read ${path.join(layoutDir, 'book.html')}`);
    }

    let chapterLayout = defaultLayouts.CHAPTER;
    try {
        chapterLayout = fs.readFileSync(path.join(layoutDir, 'chapter.html'), 'utf-8');
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
            writeBook(book, path.join(inputDir, 'books', book.id), bookOutputDir, bookIndexLayout, chapterLayout, collection);
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

function writeBook(book, workingDir, outputDir, indexTemplate, chapterTemplate, collection) {
    fs.mkdirSync(outputDir, { recursive: true });

    // parse blurb file before creating book.html
    const blurbPath = path.join(workingDir, book.blurbRelativePath);
    if (fs.existsSync(blurbPath)) {
        const blurbMD = fs.readFileSync(blurbPath, 'utf-8');
        book.content = marked.parse(blurbMD);
    } else {
        book.content = "No blurb provided...";
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

    book.parent = collection;

    const bookTemplateObject = {
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
        parent: book.parent,
        params: book
    };

    copyFileFromWorkingDir(coverRelativePath, outputDir, workingDir);
    copyFileFromWorkingDir(licenseRelativePath, outputDir, workingDir);

    book.chapters.forEach(
        (chapter) => writeChapter(chapter, outputDir, chapterTemplate, book));

    let chaptersObjectArray = [];
    book.chapters.forEach(
        (chapter) => chaptersObjectArray.push({ title: chapter.frontmatter.title, content: chapter.content }));

    writeFileWithTemplate(
        path.join(outputDir, 'index.html'),
        indexTemplate,
        bookTemplateObject
    );

    writeFileWithTemplate(
        path.join(outputDir, 'rss.xml'),
        defaultLayouts.RSS,
        bookTemplateObject
    );

    // create epub
    epub({
        title,
        author: author.name,
        description,
        cover: coverRelativePath,
        lang: languageCode,
    }, chaptersObjectArray).then(
        content => fs.writeFileSync(`${path.join(outputDir, id)}.epub`, Buffer.from(content)),
        err => console.error(err)
    );
}

function writeFileWithTemplate(outputPath, layoutSource, params) {
    const template = handlebars.compile(layoutSource);
    const content = template(params);
    fs.writeFileSync(outputPath, content);
}

function copyFileFromWorkingDir(input, outputDir, workingDir) {
    if (input) {
        fs.cp(path.join(workingDir, input), path.join(outputDir, input), { preserveTimestamps: true }, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
}

function writeChapter(chapter, outputDir, chapterTemplate, book) {
    chapter.content = marked.parse(chapter.content);
    const { id } = chapter;
    chapter.parent = book;


    const chapterTemplateObject = {
        id,
        content: chapter.content,
        frontmatter: chapter.frontmatter,
        parent: chapter.parent,
        params: chapter
    };

    writeFileWithTemplate(
        path.join(outputDir, chapter.id + '.html'),
        chapterTemplate,
        chapterTemplateObject
    );
}

exports.generateHTMLSite = generateHTMLSite;
