export interface INews {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    content: any;
    headline: number;
    breaking_news: number;
    slug: string;
    status: string;
    category: string;
    viewers: number;
    category_name: string;
    author: string;
    editor: string;
    source: string;
    keywords: string[];
    published_at: string;
    createdAt: string;
    updatedAt: string;
}