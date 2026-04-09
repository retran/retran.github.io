import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  let articles: Awaited<ReturnType<typeof getCollection<'articles'>>> = [];
  try {
    articles = await getCollection('articles', ({ data }) => !data.draft);
  } catch {
    // Collection may be empty or not yet populated — return feed with zero items
  }

  articles.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'retran.me',
    description: 'Articles by Andrew Vasilyev',
    site: context.site!,
    items: articles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.date,
      description: article.data.description,
      link: `/articles/${article.id}/`,
    })),
  });
}
