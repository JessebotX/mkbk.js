const yaml = require('yaml');
const fs = require('fs');
const path = require('path');

const book = require('./book');

const BOOK_CONFIG_YAML_FILE = 'mkbk-book.yml';

/**
 * Load a mkbk collection from an mkbk YAML source
 *
 * @param {string} source: yaml file contents
 * @param {string} booksDir: directory containing book source files/folders
 */
function readFromYAML(source, booksDir) {
    const collection = yaml.parse(source);
    collection.books = readBooks(booksDir);
    return collection;
}

function readBooks(booksDir) {
    const folders = fs.readdirSync(booksDir);
    const books = folders.filter(folder => fs.existsSync(path.join(booksDir, folder, 'mkbk-book.yml'))).map(folder => {
        const thisDir = path.join(booksDir, folder);
        const configFilePath = path.join(thisDir, BOOK_CONFIG_YAML_FILE);
        const configSource = fs.readFileSync(configFilePath, 'utf-8');

        return book.readFromYAML(configSource, folder, path.join(thisDir, 'chapters'));
    });
    return books;
}

exports.readFromYAML = readFromYAML;
