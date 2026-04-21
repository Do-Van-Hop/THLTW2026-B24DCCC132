export interface Tag {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnail: string;
  tags: string[];
  status: 'draft' | 'published';
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  author: string;
}