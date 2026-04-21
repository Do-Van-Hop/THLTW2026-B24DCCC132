import React from 'react';
import { Card, Typography, Tag, Button } from 'antd';
import { EyeOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import { Post } from '../types';

const { Meta } = Card;
const { Text } = Typography;

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  if (!post) return null;
  return (
    <Card
      hoverable
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      bodyStyle={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
      cover={<img alt={post.title} src={post.thumbnail} style={{ height: 180, objectFit: 'cover' }} />}
      actions={[
        <Link to={`/blog/post/${post.slug}`}>
          <Button type="link" style={{ height: '60px' }}>Đọc tiếp</Button>
        </Link>
      ]}
    >
      <Meta
        title={post.title}
        description={
          <>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <CalendarOutlined /> {post.createdAt} &nbsp; <EyeOutlined /> {post.viewCount}
              <UserOutlined /> {post.author || 'Anonymous'} &nbsp;
              <EyeOutlined /> {post.viewCount}
            </Text>
            <div style={{ margin: '8px 0' }}>{post.excerpt}</div>
            <div>
              {post.tags && post.tags.map(tag => (
                <Tag key={tag} color="blue">{tag}</Tag>
              ))}
            </div>
          </>
        }
      />
    </Card>
  );
};

export default PostCard;