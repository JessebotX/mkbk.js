const collection = require('./collection');

test('Create a collection', () => {
    expect(
        collection.parse(
            './testdata/john-doe-collection',
            {
                title: 'John Doe Collection',
                baseURL: 'https://example.com',
                languageCode: 'en',
                faviconPath: './favicon.png',
                books: [
                    {
                        id: '1',
                        workingDir: './testdata/john-doe-collection/books/1',
                        title: 'Book 1',
                        description: 'One/two sentences describing the book',
                        coverRelativePath: '',
                        languageCode: 'en',
                        status: 'Completed',
                        tags: ['NEW!', 'Contemporary', 'Non-fiction'],
                        author: {
                            name: 'John Doe',
                            bio: "John Doe is the world's most infamous author of the 21st century",
                            links: [
                                {
                                    name: 'Reddit',
                                    address: 'https://reddit.com'
                                },
                                {
                                    name: 'Patreon',
                                    address: 'https://patreon.com'
                                },
                                {
                                    name: 'Bitcoin',
                                    address: '1234567890abcdefghijklmnopqrstuvwxyz',
                                    nonLink: true
                                }
                            ],
                        },
                    }
                ],
            })
    ).toBeDefined();
});


test('Create a collection with default values', () => {
    // languageCode
    expect(
        collection.parse(
            '../testdata/john-doe-collection',
            {}
        ).languageCode
    ).toBe('en');
});

test('Create a collection with no books', () => {
    expect(
        collection.parse(
            '../testdata/john-doe-collection',
            {
                title: 'John Doe Collection',
                baseURL: 'https://example.com',
            })
            .books
    ).toBeUndefined();
});
