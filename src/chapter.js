// SPDX-License-Identifier: MPL-2.0

const matter = require('gray-matter');

function parse(id, options) {
    const { data: frontmatter, content } = matter(source);

    return {
        id,
        frontmatter,
        content
    };
}

exports = {
    parse
}
