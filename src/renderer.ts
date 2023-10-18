const epub = require('epub-gen-memory').default;

import * as path from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as nunjucks from 'nunjucks';
import { marked } from 'marked';

import * as defaultLayouts from './renderer-default-layouts';
import { Collection } from './collection';
import * as collection from './collection';
import { Book } from './book';
import { Chapter } from './chapter';

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

	const nunjucksEnv = new nunjucks.Environment();
	writeFileWithTemplate(
		path.join(rootOutputDir, 'index.html'),
		indexTemplate,
		collection,
		nunjucksEnv
	);

	collection.books.forEach((book) => {
		const bookOutputDir = path.join(rootOutputDir, book.id);
		writeBook(
			book,
			bookOutputDir,
			bookTemplate,
			chapterTemplate,
			collection,
			nunjucksEnv
		);
	});
}

function writeBook(book: Book, outputDir: string, bookTemplate: string, chapterTemplate: string, collection: Collection, env) {
	fs.mkdirSync(outputDir, { recursive: true });
	book.parent = collection;

	const blurbPath = path.join(book.workingDir, book.blurbRelPath);
	if (fs.existsSync(blurbPath)) {
		const blurbMD = fs.readFileSync(blurbPath, 'utf-8');
		book.content = marked.parse(blurbMD);
	} else {
		book.content = 'No blurb provided';
	}

	const { title, author, description, coverRelPath, languageCode } = book;
	if (coverRelPath) {
		copy(
			path.join(book.workingDir, coverRelPath),
			path.join(outputDir, coverRelPath));
	}

	// write each chapter and prepare building an epub
	const epubChapters = [];
	book.chapters.forEach((chapter) => {
		writeChapter(chapter, outputDir, chapterTemplate, book, env);
		epubChapters.push({
			title: chapter.frontmatter.title,
			content: chapter.content
		});
	});

	// build epub
	const epubMeta: any = { title };

	if (author && author.name) {
		epubMeta.author = author.name;
	}

	if (description) {
		epubMeta.description = description;
	}

	if (coverRelPath) {
		// epubMeta.cover = path.join(book.workingDir, coverRelPath);
		epubMeta.cover = coverRelPath;
	}

	if (languageCode) {
		epubMeta.lang = languageCode;
	}

	epub(epubMeta, epubChapters).then(
		content => {
			fs.writeFileSync(`${path.join(outputDir, book.id)}.epub`, Buffer.from(content));
		},
		err => console.error(err)
	);

	// build book index
	writeFileWithTemplate(
		path.join(outputDir, 'index.html'),
		bookTemplate,
		book,
		env
	);

	// build rss feed
	console.log(book);
	writeFileWithTemplate(
		path.join(outputDir, 'rss.xml'),
		defaultLayouts.RSS,
		book,
		env
	);
}

function writeChapter(chapter: Chapter, outputDir: string, chapterTemplate: string, book: Book, env) {
	chapter.content = marked.parse(chapter.content);
	const { id } = chapter;
	chapter.parent = book;

	writeFileWithTemplate(
		path.join(outputDir, chapter.id + '.html'),
		chapterTemplate,
		chapter,
		env
	);
}

function writeFileWithTemplate(outputPath: string, templateSource: string, params: Object, env) {
	const content = env.renderString(templateSource, params);
	fs.writeFileSync(outputPath, content);
}

function getTemplate(templateFilePath: string, defaultTemplate: string): string {
	let template = defaultTemplate;
	try {
		template = fs.readFileSync(templateFilePath, 'utf-8');
	} catch(err) {
		console.log(`WARNING: ${templateFilePath} not read. Using default layout.`);
	}

	return template;
}

function copy(inputPath: string, outputPath: string, recursive: boolean = true) {
	if (inputPath) {
		fs.cp(inputPath, outputPath, { preserveTimestamps: true, recursive }, (err) => {
			if (err) {
				console.error(err);
			}
		});
	}
}

let obj = collection.parse({
	title:'hello',
	workingDir: 'testdata/john-doe-collection',
	baseURL: 'https://example.com',
	books: [
		{
			id: 'warp',
			workingDir: 'testdata/john-doe-collection/books/1',
			title: 'title',
			coverRelPath: 'cover.webp',
		},
	]
});
try {
	genCollectionStaticSite(obj);
} catch(err) {
	console.error(err);
}
