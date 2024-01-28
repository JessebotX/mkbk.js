#!/usr/bin/env node

import { Command } from 'commander';

const VERSION = '0.1.3';

function main() {
    const program = new Command();

    program
        .name('mkbk')
        .description('A static site generator for a collection of markdown-based books.')
        .version(VERSION);

    program.command('build')
        .description('Compile a collection into its output folder')
        .argument('<string>', 'path to the root of the collection')
        .action(buildCommand);

    program.parse();
}

function buildCommand(str) {
    console.log(`Compiling ${str}`);
    console.log('WIP');
}

main();
