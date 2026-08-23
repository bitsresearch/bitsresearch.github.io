import React, { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { blogPosts } from '../blogPosts';

const SITE_ORIGIN = 'https://bitsresearch.github.io';

const setMeta = (selector: string, attribute: 'name' | 'property', key: string, content: string) => {
  let element = document.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams();
  const post = blogPosts.find(item => item.slug === slug);
  if (!post) return <Navigate to="/404.html" replace />;

  const canonicalPath = `/blog/${post.slug}/`;
  const canonicalUrl = `${SITE_ORIGIN}${canonicalPath}`;
  const readingMinutes = Math.max(1, Math.ceil(post.bodyHtml.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length / 220));

  useEffect(() => {
    document.title = `${post.title} | BITS`;
    setMeta('meta[name="description"]', 'name', 'description', post.description);
    setMeta('meta[name="robots"]', 'name', 'robots', 'index, follow');
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'article');
    setMeta('meta[property="og:title"]', 'property', 'og:title', post.title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', post.description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMeta('meta[property="og:image"]', 'property', 'og:image', post.image ? `${SITE_ORIGIN}${post.image}` : `${SITE_ORIGIN}/images/og-image.jpg`);
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', post.title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', post.description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', post.image ? `${SITE_ORIGIN}${post.image}` : `${SITE_ORIGIN}/images/og-image.jpg`);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.dataset.blogSchema = 'true';
    schema.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      image: post.image ? [`${SITE_ORIGIN}${post.image}`] : undefined,
      datePublished: post.dateISO,
      dateModified: post.dateISO,
      inLanguage: 'en-GB',
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
      author: { '@type': 'Person', name: 'Charlie Tak Hei Kwong', alternateName: '鄺德希', url: `${SITE_ORIGIN}/people/` },
      publisher: { '@type': 'Organization', name: 'Building Identity Through Stories', alternateName: 'BITS', url: SITE_ORIGIN },
      articleSection: post.category,
      keywords: post.tags,
    });
    document.head.appendChild(schema);
    return () => schema.remove();
  }, [canonicalUrl, post]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
      <article aria-labelledby="blog-post-title">
        <header className="text-center max-w-4xl mx-auto mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sage-700 dark:text-sage-300 mb-4">{post.category}</p>
          <h1 id="blog-post-title" className="text-4xl md:text-6xl font-serif text-earth-900 dark:text-earth-50 leading-tight mb-6">{post.title}</h1>
          <p className="text-lg md:text-xl text-earth-700 dark:text-earth-300 leading-relaxed mb-6">{post.standfirst}</p>
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 text-sm text-earth-700 dark:text-earth-300" aria-label="Post details">
            <span>By <Link to="/people/" rel="author" className="underline underline-offset-4 hover:text-sage-700 dark:hover:text-sage-300">Charlie Tak Hei Kwong 鄺德希</Link></span>
            <span aria-hidden="true">•</span>
            <span>Published <time dateTime={post.dateISO}>{post.dateText}</time></span>
            <span aria-hidden="true">•</span>
            <span>{readingMinutes} min read</span>
          </div>
        </header>

        {post.image && (
          <figure className="mb-10">
            <img src={post.image} alt={post.imageAlt} className="w-full rounded-4xl shadow-sm" />
            {post.caption && <figcaption className="mt-3 text-sm text-earth-700 dark:text-earth-300 text-center">{post.caption}</figcaption>}
          </figure>
        )}

        <div className="bg-white dark:bg-earth-800 border border-earth-200 dark:border-earth-700 rounded-4xl shadow-sm px-6 py-9 sm:px-10 md:px-14 md:py-12">
          <div className="blog-prose" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
          {post.tags.length > 0 && (
            <footer className="mt-10 pt-7 border-t border-earth-200 dark:border-earth-700">
              <h2 className="text-sm font-bold uppercase tracking-widest text-earth-900 dark:text-earth-100 mb-4">Topics</h2>
              <ul className="flex flex-wrap gap-2" aria-label="Post topics">
                {post.tags.map(tag => <li key={tag} className="px-3 py-2 rounded-full bg-sage-50 dark:bg-earth-900 text-sm text-earth-800 dark:text-earth-200">{tag}</li>)}
              </ul>
            </footer>
          )}
        </div>
      </article>
    </div>
  );
};
