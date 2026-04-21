import React, { useEffect, useRef } from 'react';
import { useParams, history } from 'umi';
import { Card, Typography, Tag, Button, Row, Col } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import useBlogData from './hooks/useBlogData';
import { renderMarkdown } from './utils/markdown';
import PostCard from './components/PostCard';

const { Title, Text } = Typography;

const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { posts, getPostBySlug, incrementViewCount, getRelatedPosts } = useBlogData();
  const post = getPostBySlug(slug);
  const hasIncrementedRef = useRef<string | null>(null);

  useEffect(() => {
    if (post && hasIncrementedRef.current !== post.id) {
      incrementViewCount(post.id);
      hasIncrementedRef.current = post.id;
    }
  }, [post, incrementViewCount]);

  if (!post) {
    return <Card style={{ padding: 24, textAlign: 'center' }}>Bài viết không tồn tại</Card>;
  }

  const relatedPosts = getRelatedPosts(post);

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <Card>
        <Button icon={<ArrowLeftOutlined />} onClick={() => history.push('/blog')} style={{ marginBottom: 16 }}>Quay lại</Button>
        <img src={post.thumbnail} alt={post.title} style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />
        <Title>{post.title}</Title>
        <div style={{ marginBottom: 16 }}>
          <Text><CalendarOutlined /> {post.createdAt}</Text>
          <Text style={{ marginLeft: 16 }}><UserOutlined /> {post.author || 'Anonymous'}</Text>
          <Text style={{ marginLeft: 16 }}><EyeOutlined /> {post.viewCount}</Text>
          <div style={{ marginTop: 8 }}>{post.tags.map(tag => <Tag key={tag} color="blue">{tag}</Tag>)}</div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
      </Card>

      {relatedPosts.length > 0 && (
        <Card style={{ marginTop: 24 }}>
          <Title level={4}>Bài viết liên quan</Title>
          <Row gutter={[16, 16]}>
            {relatedPosts.map(rel => (
              <Col xs={24} sm={12} md={8} key={rel.id}>
                <PostCard post={rel} />
              </Col>
            ))}
          </Row>
        </Card>
      )}
    </div>
  );
};

export default PostDetail;