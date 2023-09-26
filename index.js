const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const { program } = require('commander');

const collection = require('./collection');

const BOOKS_DIRECTORY = "books"

program.version('0.0.1');
program
    .command('build <inputDirectory>')
    .description('builds a collection at <inputDirectory>')
    .action((inputDirectory) => {
        const mkbkYAML = fs.readFileSync(path.join(inputDirectory, 'mkbk.yml'), 'utf-8');

        const full_collection = collection.readFromYAML(mkbkYAML, path.join(inputDirectory, BOOKS_DIRECTORY));
        console.log("Collection:", full_collection);
    });

program.parse();
