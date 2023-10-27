const collection = require('../src/collection.ts');

test("Test default values config", () => {
	expect(collection.parse({})).toBeDefined();
	expect(collection.parse({}).languageCode).toBe('en');
	expect(collection.parse({}).workingDir).toBe('.');
	expect(collection.parse({}).layoutRelDir).toBe('layout');
	expect(collection.parse({}).outputRelDir).toBe('out');
	expect(collection.parse({}).books).toBeUndefined();
});

test("Test basic collection parsing", () => {
	expect(collection.parse({
		title: "John Doe's Collection",
		workingDir: 'testdata/john-doe-collection',
		books: [
			{
				id: 'warp',
				workingDir: 'testdata/john-doe-collection/books/1',
				title: 'Warp',
				coverRelPath: 'cover.webp'
			}
		]
	})).toBeDefined();
});

test("Test throw on duplicate book identifiers", () => {
	expect(() => {
		collection.parse({
			title: "John Doe's Collection",
			workingDir: 'testdata/john-doe-collection',
			books: [
				{
					id: 'warp',
					workingDir: 'testdata/john-doe-collection/books/1',
					title: 'Warp',
					coverRelPath: 'cover.webp'
				},
				{
					id: 'warp',
					workingDir: 'testdata/john-doe-collection/books/1',
					title: 'Another Book With Same Identifier'
				}
			]
		})
	}).toThrow();
});

test("Test duplicate books with different identifiers", () => {
	expect(() => {
		collection.parse({
			title: "John Doe's Collection",
			workingDir: 'testdata/john-doe-collection',
			books: [
				{
					id: 'warp',
					workingDir: 'testdata/john-doe-collection/books/1',
					title: 'Warp',
					coverRelPath: 'cover.webp'
				},
				{
					id: 'warp-2',
					workingDir: 'testdata/john-doe-collection/books/1',
					title: 'Warp'
				}
			]
		})
	}).toBeDefined();
});

test("Test throw on empty book", () => {
	expect(() => {
		collection.parse({
			title: "John Doe's Collection",
			workingDir: 'testdata/john-doe-collection',
			books: [
				{}
			]
		})
	}).toThrow();
});

test("Test throw on book with no identifier", () => {
	expect(() => {
		collection.parse({
			title: "John Doe's Collection",
			workingDir: 'testdata/john-doe-collection',
			books: [
				{
					workingDir: 'testdata/john-doe-collection/books/1'
				}
			]
		})
	}).toThrow();
});

test("Test throw on book with no working directory", () => {
	expect(() => {
		collection.parse({
			title: "John Doe's Collection",
			workingDir: 'testdata/john-doe-collection',
			books: [
				{
					id: 'book1',
				}
			]
		})
	}).toThrow();
});

test("Test throw on book with incorrect directory", () => {
	expect(() => {
		collection.parse({
			title: "John Doe's Collection",
			workingDir: 'testdata/john-doe-collection',
			books: [
				{
					id: 'book1',
					workingDir: 'unknown-directory/'
				}
			]
		})
	}).toThrow();
});

test("Test book default values", () => {
	expect(collection.parse({
		books: [
			{
				id: 'book1',
				workingDir: 'testdata/john-doe-collection/books/1'
			}
		]
	}).books[0].languageCode).toBe('en');

	expect(collection.parse({
		books: [
			{
				id: 'book1',
				workingDir: 'testdata/john-doe-collection/books/1'
			}
		]
	}).books[0].blurbRelPath).toBe('index.md');

	expect(collection.parse({
		books: [
			{
				id: 'book1',
				workingDir: 'testdata/john-doe-collection/books/1'
			}
		]
	}).books[0].chaptersRelDir).toBe('chapters');
});
