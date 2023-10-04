const collection = require('./collection');

const johnDoeCollection = collection.parse(
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
    }
);

test('Create a collection', () => {
    expect(johnDoeCollection).toBeDefined();
});


const emptyJohnDoeCollection = collection.parse(
    '../testdata/john-doe-collection',
    {}
);

test('Create a collection with default values', () => {
    expect(emptyJohnDoeCollection.languageCode).toBe('en');
    expect(emptyJohnDoeCollection.layoutRelativeDir).toBe('layout');
    expect(emptyJohnDoeCollection.outputRelativeDir).toBe('out');
});

const barebonesJohnDoeCollection = collection.parse(
    '../testdata/john-doe-collection',
    {
        title: 'John Doe Collection',
        baseURL: 'https://example.com',
    }
);

test('Create a collection with no books', () => {
    expect(barebonesJohnDoeCollection.books).toBeUndefined();
});
