import * as matter from 'gray-matter';
import { Book } from './book';

export interface ChapterData {
    content: string;
    [frontmatter: string]: any;
}

export interface Chapter extends ChapterData {
    id: string;
	parent?: Book;
}

export interface ChapterOptions {
    id: string;
    source: string;
    fetchFn?: (source: string) => ChapterData;
};

/**
 * Parse a chapter file in markdown format with yaml frontmatter
 */
export function parse({ id, source, fetchFn }: ChapterOptions) {
    let data: ChapterData;

    if (fetchFn) {
        data = fetchFn(source);
    } else {
        const { data: frontmatter, content } = matter(source);
        data = {
            frontmatter,
            content
        };
    }

    const { frontmatter, content } = data;

    return {
        id: id,
        frontmatter,
        content
    };
}
