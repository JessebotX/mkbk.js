const matter = require('gray-matter');
const path = require('path');

function read(source) {
    const { data: frontmatter, content } = matter(source);

    return {
        frontmatter,
        content
    };
}

exports.read = read;
