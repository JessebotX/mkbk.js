// SPDX-License-Identifier: MPL-2.0

const path = require('path');

function parse(workingDir, options) {
    const {
        id,
        content,
        title,
        languageCode,
        genre,
        description,
        coverPath,
        licensePath,
        status,
        mirrors,
        author,
        chaptersDir,
    } = options;

    if (!chaptersDir) {
        chaptersDir = path.join(workingDir, 'chapters');
    }

    const book = {
        id,
        content,
        title,
        languageCode,
        genre,
        description,
        coverRelativePath,
        licenseRelativePath,
        status,
        mirrors,
        author,
        workingDir,
        chaptersDir,
    };

    book.chapters = readChapters(chaptersDir);

    return book;
}

function readChapters(chaptersDir) {
    const chapterFiles = fs.readdirSync(chaptersDir);
    let chapters = chapterFiles.filter(file => path.extname(file) === '.md').map(file => {
        const source = fs.readFileSync(path.join(chaptersDir, file));
        const id = file.replace(/.md$/i, '');
        const chapterItem = chapter.parse(id, source);

        return chapterItem;
    });

    setChaptersNextPrev(chapters);

    return chapters;
}

exports.
