#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const { program } = require('commander');

const collection = require('./collection');
const renderer = require('./renderer');

const BOOKS_DIRECTORY = 'books';

program.version('0.0.5');
program
    .command('build <inputDirectory>')
    .description('builds a collection at <inputDirectory>')
    .action((inputDirectory) => {
        try {
            const source = fs.readFileSync(path.join(inputDirectory, 'mkbk.yml'), 'utf-8');
            const fullCollection = collection.readFromYAML(source, path.join(inputDirectory, BOOKS_DIRECTORY));

            renderer.htmlSite(fullCollection, inputDirectory);
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.error(`Cannot find mkbk.yml in directory "${inputDirectory}"`);
            } else if (err.code === 'EACCES') {
                console.error(`Cannot read mkbk.yml (lack of permissions?)`);
            } else {
                console.error(err)
            }
        }
    });
program
    .command('verbose <inputDirection>')
    .description('print the <inputDirectory> collection object to stdout')
    .action((inputDirectory) => {
        try {
            const source = fs.readFileSync(path.join(inputDirectory, 'mkbk.yml'), 'utf-8');
            const fullCollection = collection.readFromYAML(source, path.join(inputDirectory, BOOKS_DIRECTORY));

            console.log('collection:', fullCollection);
            console.log('books:     ', fullCollection.books);
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.error(`Cannot find mkbk.yml in directory "${inputDirectory}"`);
            } else if (err.code === 'EACCES') {
                console.error(`Cannot read mkbk.yml (lack of permissions?)`);
            } else {
                console.error(err)
            }
        }
    });


program.parse();
