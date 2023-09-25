const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const { program } = require('commander');

program.version('0.0.1')
program
    .command('build <source>')
    .description('builds a collection at <source> directory')
    .action((source) => {
        // TODO remove hardcoding
        const file = fs.readFileSync(path.join(source, 'mkbk.yml'), 'utf-8');

        const collection = yaml.parse(file);
        console.log("Collection:", collection);
        console.log("Collection.Author:", collection.author);
        console.log("Collection.Author.Links:", collection.author.links);
        console.log("Collection.Author.Donate", collection.author.donate);
    });
program.parse()
