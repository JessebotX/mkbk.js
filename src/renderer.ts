const epub = require('epub-gen-memory').default;

import * as path from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { marked } from 'marked';

import * as defaultLayouts from './renderer-default-layouts';
import { Collection } from './collection';

/**
 * Generate a full static website using a collection object
 */
export function genCollectionStaticSite(collection: Collection) {
	const inputDir = collection.workingDir;
	const rootOutputDir = path.join(inputDir, collection.outputRelDir);
	fs.mkdirSync(rootOutputDir, { recursive: true });

	const layoutDir = path.join(inputDir, collection.layoutRelDir);
	const indexTemplate = getTemplate(path.join(layoutDir, 'index.html'), defaultLayouts.INDEX);
	const bookTemplate = getTemplate(path.join(layoutDir, 'book.html'), defaultLayouts.BOOK_INDEX);
	const chapterTemplate = getTemplate(path.join(layoutDir, 'chapter.html'), defaultLayouts.CHAPTER);
	copy(path.join(layoutDir, 'assets'), rootOutputDir);

	const { title, description, baseURL, languageCode, books } = collection;

	console.log(indexTemplate);
	console.log(bookTemplate);
	console.log(chapterTemplate);
}

function getTemplate(templateFilePath, defaultTemplate) {
	let template = defaultTemplate;
	try {
		template = fs.readFileSync(templateFilePath, 'utf-8');
	} catch(err) {
		console.log(`WARNING: ${templateFilePath} not read. Using default layout.`);
	}

	return template;
}

function copy(input, output, recursive = true) {
	if (input) {
		fs.cp(input, output, { preserveTimestamps: true, recursive }, (err) => {
			if (err) {
				console.error(err);
			}
		});
	}
}
