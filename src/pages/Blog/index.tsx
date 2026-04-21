import React, { useState, useMemo, useEffect } from 'react';
import { Row, Col, Input, Tag, Pagination, Card, Spin } from 'antd';
import { useDebounce } from 'use-debounce';
import useBlogData from './hooks/useBlogData';
import PostCard from './components/PostCard';

const { Search } = Input;

const BlogHome: React.FC = () => {
  const { posts } = useBlogData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch] = useDebounce(searchTerm, 300);
  const pageSize = 9;

  const publishedPosts = posts.filter(p => p.status === 'published');

  const filteredPosts = useMemo(() => {
    let filtered = publishedPosts;
    if (debouncedSearch) {
      filtered = filtered.filter(p => p.title.toLowerCase().includes(debouncedSearch.toLowerCase()));
    }
    if (selectedTag) {
      filtered = filtered.filter(p => p.tags.includes(selectedTag));
    }
    return filtered;
  }, [publishedPosts, debouncedSearch, selectedTag]);

  const paginatedPosts = filteredPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalTags = Array.from(new Set(publishedPosts.flatMap(p => p.tags)));

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedTag]);

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Card>
        <h1 style={{ textAlign: 'center' }}>Blog cá nhân</h1>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
          <Search placeholder="Tìm kiếm bài viết..." onChange={e => setSearchTerm(e.target.value)} style={{ width: 300 }} allowClear />
        </div>
        <div style={{ marginBottom: 16, textAlign: 'center' }}>
          <Tag.CheckableTag key="all" checked={selectedTag === null} onChange={() => setSelectedTag(null)}>Tất cả</Tag.CheckableTag>
          {totalTags.map(tag => (
            <Tag.CheckableTag key={tag} checked={selectedTag === tag} onChange={() => setSelectedTag(tag)}>{tag}</Tag.CheckableTag>
          ))}
        </div>
        <Row gutter={[16, 16]}>
          {paginatedPosts.map(post => (
            <Col xs={24} sm={12} md={8} key={post.id}>
              <PostCard post={post} />
            </Col>
          ))}
        </Row>
        {filteredPosts.length > pageSize && (
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Pagination current={currentPage} pageSize={pageSize} total={filteredPosts.length} onChange={setCurrentPage} />
          </div>
        )}
      </Card>
    </div>
  );
};

export default BlogHome;