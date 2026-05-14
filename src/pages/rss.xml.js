import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return rss({
    title: 'Shantayya Swami Blog',
    description: 'Cloud, DevOps, and AI engineering insights',
    site: context.site,
    items: posts
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map(post => ({
        title:       post.data.title,
        pubDate:     post.data.date,
        description: post.data.excerpt,
        link:        `/blog/${post.slug}/`,
      })),
    customData: '<language>en-us</language>',
  });
}
