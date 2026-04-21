import { useState, useEffect } from 'react';
import { Post, Tag } from '../types';
import { stripMarkdown } from '../utils/markdown';

const STORAGE_KEYS = {
  posts: 'blog_posts',
  tags: 'blog_tags',
};

const initialTags: Tag[] = [
  { id: '1', name: 'React' },
  { id: '2', name: 'JavaScript' },
  { id: '3', name: 'CSS' },
];

const initialPosts: Post[] = [
  {
    id: '1',
    title: 'Học React cơ bản',
    slug: 'hoc-react-co-ban',
    content: '# React cơ bản\n\nReact là thư viện JavaScript phổ biến để xây dựng giao diện người dùng. Nó được phát triển bởi Facebook.\n\n## Tại sao nên học React?\n- Component-based\n- Hiệu suất cao với Virtual DOM\n- Hệ sinh thái phong phú',
    excerpt: 'React là thư viện...',
    thumbnail: 'https://scientyficworld.org/wp-content/uploads/2022/08/React-js-2048x1152.jpg',
    tags: ['React', 'JavaScript'],
    status: 'published',
    viewCount: 120,
    createdAt: '2025-01-15',
    updatedAt: '2025-01-15',
    author: 'Nguyễn Văn A',
  },
  {
    id: '2',
    title: 'JavaScript nâng cao',
    slug: 'javascript-nang-cao',
    content: '# JavaScript nâng cao\n\nClosure, Promise, async/await, và các khái niệm nâng cao khác.\n\n## Closure là gì?\nClosure là hàm có thể truy cập biến từ phạm vi bên ngoài ngay cả khi hàm đó đã được trả về.',
    excerpt: 'Closure, Promise...',
    thumbnail: 'https://static.vecteezy.com/system/resources/thumbnails/018/792/316/small_2x/js-connected-alphabet-letter-logo-icon-combination-design-with-dots-and-red-color-creative-template-for-company-and-business-vector.jpg',
    tags: ['JavaScript'],
    status: 'published',
    viewCount: 80,
    createdAt: '2025-02-10',
    updatedAt: '2025-02-10',
    author: 'Trần Thị B',
  },
  {
    id: '3',
    title: 'CSS Grid và Flexbox',
    slug: 'css-grid-flexbox',
    content: '# CSS Grid và Flexbox\n\nHai công cụ bố trí mạnh mẽ trong CSS hiện đại.\n\n## Flexbox\nDùng cho bố trí một chiều.\n\n## Grid\nDùng cho bố trí hai chiều.',
    excerpt: 'Hai công cụ bố trí mạnh mẽ trong CSS hiện đại...',
    thumbnail: 'https://codelucky.com/wp-content/uploads/2025/06/css-background-color.png',
    tags: ['CSS'],
    status: 'published',
    viewCount: 45,
    createdAt: '2025-02-20',
    updatedAt: '2025-02-20',
    author: 'Nguyễn Văn A',
  },
  {
    id: '4',
    title: 'TypeScript cho người mới',
    slug: 'typescript-co-ban',
    content: '# TypeScript cho người mới\n\nTypeScript là superset của JavaScript giúp thêm kiểu tĩnh.\n\n## Lợi ích\n- Phát hiện lỗi sớm\n- Tự động hoàn thành mã\n- Dễ bảo trì',
    excerpt: 'TypeScript là superset của JavaScript...',
    thumbnail: 'https://d2ms8rpfqc4h24.cloudfront.net/uploads/2021/12/Understand-Typescript.jpg',
    tags: ['TypeScript', 'JavaScript'],
    status: 'published',
    viewCount: 67,
    createdAt: '2025-03-01',
    updatedAt: '2025-03-01',
    author: 'Trần Thị B',
  },
  {
    id: '5',
    title: 'Xây dựng REST API với Node.js',
    slug: 'rest-api-nodejs',
    content: '# REST API với Node.js\n\nSử dụng Express để tạo REST API đơn giản.\n\n## Các bước\n1. Khởi tạo project\n2. Cài đặt Express\n3. Định nghĩa routes\n4. Kết nối database',
    excerpt: 'Sử dụng Express để tạo REST API...',
    thumbnail: 'https://codedamn-blog.s3.amazonaws.com/wp-content/uploads/2022/10/02012225/nodejs.png',
    tags: ['Node.js', 'JavaScript'],
    status: 'published',
    viewCount: 92,
    createdAt: '2025-03-10',
    updatedAt: '2025-03-10',
    author: 'Nguyễn Văn A',
  },
  {
    id: '6',
    title: 'Next.js: Framework React mạnh mẽ',
    slug: 'nextjs-framework',
    content: '# Next.js\n\nNext.js là framework React hỗ trợ SSR, SSG và nhiều tính năng khác.\n\n## Tính năng nổi bật\n- Server-side rendering\n- Static site generation\n- API routes\n- Image optimization',
    excerpt: 'Next.js là framework React hỗ trợ SSR, SSG...',
    thumbnail: 'https://i.ytimg.com/vi/guZS6vBlO9g/maxresdefault.jpg',
    tags: ['Next.js', 'React'],
    status: 'published',
    viewCount: 110,
    createdAt: '2025-03-15',
    updatedAt: '2025-03-15',
    author: 'Trần Thị B',
  },
  {
    id: '7',
    title: 'Quản lý state với Redux Toolkit',
    slug: 'redux-toolkit',
    content: '# Redux Toolkit\n\nCách chuẩn để viết Redux logic.\n\n## Các bước cơ bản\n- Tạo slice\n- Cấu hình store\n- Sử dụng useSelector và useDispatch',
    excerpt: 'Cách chuẩn để viết Redux logic...',
    thumbnail: 'https://sujantmg.com.np/_next/image?url=%2Fstatic%2Fimages%2Fblogs%2F9%2Fimage1.jpg&w=3840&q=75',
    tags: ['React', 'JavaScript'],
    status: 'draft',
    viewCount: 0,
    createdAt: '2025-03-20',
    updatedAt: '2025-03-20',
    author: 'Nguyễn Văn A',
  },
  {
    id: '8',
    title: 'Tailwind CSS: Utility-first CSS',
    slug: 'tailwind-css',
    content: '# Tailwind CSS\n\nFramework CSS theo hướng utility-first.\n\n## Ưu điểm\n- Tùy biến cao\n- Không cần viết CSS custom\n- Responsive dễ dàng',
    excerpt: 'Framework CSS theo hướng utility-first...',
    thumbnail: 'https://s3-alpha.figma.com/hub/file/3717520423/c8464e20-9731-4bfd-9e0a-149e62250dfe-cover.png',
    tags: ['CSS'],
    status: 'published',
    viewCount: 34,
    createdAt: '2025-03-25',
    updatedAt: '2025-03-25',
    author: 'Trần Thị B',
  },
  {
    id: '9',
    title: 'Web Performance: Tối ưu tốc độ tải trang',
    slug: 'web-performance',
    content: '# Tối ưu hiệu suất web\n\nCác kỹ thuật giúp tăng tốc độ tải trang.\n\n## Kỹ thuật\n- Lazy loading\n- Code splitting\n- Nén ảnh\n- Sử dụng CDN',
    excerpt: 'Các kỹ thuật giúp tăng tốc độ tải trang...',
    thumbnail: 'https://blog.openreplay.com/images/optimizing-web-performance-with-advanced-techniques/images/hero.png',
    tags: ['JavaScript', 'CSS'],
    status: 'published',
    viewCount: 28,
    createdAt: '2025-04-01',
    updatedAt: '2025-04-01',
    author: 'Nguyễn Văn A',
  },
  {
    id: '10',
    title: 'Testing React với Jest và React Testing Library',
    slug: 'testing-react',
    content: '# Testing React\n\nViết unit test và integration test cho React app.\n\n## Công cụ\n- Jest\n- React Testing Library\n- Mock API',
    excerpt: 'Viết unit test và integration test cho React app...',
    thumbnail: 'http://alignminds.com/wp-content/uploads/2020/02/5-Trending-React-Native-UI-Components-in-2019.png',
    tags: ['React', 'TypeScript'],
    status: 'draft',
    viewCount: 0,
    createdAt: '2025-04-05',
    updatedAt: '2025-04-05',
    author: 'Trần Thị B',
  },
];

export default function useBlogData() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const storedPosts = localStorage.getItem(STORAGE_KEYS.posts);
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } else {
      setPosts(initialPosts);
      localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(initialPosts));
    }

    const storedTags = localStorage.getItem(STORAGE_KEYS.tags);
    if (storedTags) {
      setTags(JSON.parse(storedTags));
    } else {
      setTags(initialTags);
      localStorage.setItem(STORAGE_KEYS.tags, JSON.stringify(initialTags));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.tags, JSON.stringify(tags));
  }, [tags]);

  const addPost = (post: Omit<Post, 'id' | 'viewCount' | 'createdAt' | 'updatedAt' | 'excerpt'>) => {
    const newId = Date.now().toString();
    const now = new Date().toISOString().split('T')[0];
    const excerpt = stripMarkdown(post.content, 100);
    const newPost: Post = {
      ...post,
      id: newId,
      excerpt,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    setPosts([...posts, newPost]);
  };

  const updatePost = (id: string, updated: Partial<Post>) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        const newData = { ...p, ...updated, updatedAt: new Date().toISOString().split('T')[0] };
        if (updated.content) newData.excerpt = stripMarkdown(updated.content, 100);
        return newData;
      }
      return p;
    }));
  };

  const deletePost = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  const incrementViewCount = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, viewCount: p.viewCount + 1 } : p));
  };

  const addTag = (name: string) => {
    const newId = Date.now().toString();
    setTags([...tags, { id: newId, name }]);
  };

  const updateTag = (id: string, name: string) => {
    setTags(tags.map(t => t.id === id ? { ...t, name } : t));
    const oldName = tags.find(t => t.id === id)?.name;
    if (oldName && oldName !== name) {
      setPosts(posts.map(p => ({
        ...p,
        tags: p.tags.map(t => t === oldName ? name : t),
      })));
    }
  };

  const deleteTag = (id: string) => {
    const tagToDelete = tags.find(t => t.id === id);
    if (tagToDelete) {
      setTags(tags.filter(t => t.id !== id));
      setPosts(posts.map(p => ({
        ...p,
        tags: p.tags.filter(t => t !== tagToDelete.name),
      })));
    }
  };

  const getPostBySlug = (slug: string) => posts.find(p => p.slug === slug);

  const getRelatedPosts = (post: Post, limit = 3) => {
    return posts
      .filter(p => p.id !== post.id && p.status === 'published' && p.tags.some(t => post.tags.includes(t)))
      .slice(0, limit);
  };

  return {
    posts,
    tags,
    addPost,
    updatePost,
    deletePost,
    incrementViewCount,
    addTag,
    updateTag,
    deleteTag,
    getPostBySlug,
    getRelatedPosts,
  };
}