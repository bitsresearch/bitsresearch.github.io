import blogPostData from './content/blog-posts.json';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  standfirst: string;
  dateISO: string;
  dateText: string;
  image: string;
  imageAlt: string;
  caption: string;
  bodyHtml: string;
  tags: string[];
}

export const blogPosts = blogPostData as BlogPost[];
