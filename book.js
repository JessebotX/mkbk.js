const yaml = require('yaml');
const fs = require('fs');
const path = require('path');

const chapter = require('./chapter');

function readFromYAML(source, id, chaptersDir) {
    book = yaml.parse(source);
    book.id = id
    book.chapters = readChapters(chaptersDir);
    return book;
}

function readChapters(chaptersDir) {
    const chapterFiles = fs.readdirSync(chaptersDir);
    let chapters = chapterFiles.filter(file => path.extname(file) === '.md').map(file => {
        const source = fs.readFileSync(path.join(chaptersDir, file));
        const chapterItem = chapter.read(source);

        chapterItem.id = file.replace(/.md$/i, '');
        return chapterItem;
    });

    setChaptersNextPrev(chapters);

    return chapters;
}

function setChaptersNextPrev(chapters) {
    const total = chapters.length;
    for (let i = 0; i < total; i++) {
        if ((i - 1) >= 0) {
            chapters[i].previous = chapters[i-1];
        }

        if ((i + 1) <= (total - 1)) {
            chapters[i].next = chapters[i + 1];
        }
    }
}

exports.readFromYAML = readFromYAML;
