const collection = require('./collection.ts');

const config = collection.parse({
});

test("Test default values config", () => {
	expect(config.languageCode).toBe('en');
	expect(config.workingDir).toBe('.');
	expect(config.layoutRelDir).toBe('layout');
	expect(config.outputRelDir).toBe('out');
});
