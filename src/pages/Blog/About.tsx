import React from 'react';
import { Card, Avatar, Typography, Space, Button } from 'antd';
import { GithubOutlined, MailOutlined, LinkedinOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const About: React.FC = () => {
  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Card>
        <div style={{ textAlign: 'center' }}>
          <Avatar size={120} src="https://bizweb.dktcdn.net/100/463/551/products/pin-cai-ao-hoat-hinh-vo-dien-2.jpg?v=1697696614323" />
          <Title level={2}>Đỗ Văn Hợp</Title>
          <Paragraph>Fullstack Developer, đam mê React, Node.js và viết lách.</Paragraph>
          <Paragraph>Kỹ năng: JavaScript, TypeScript, React, Node.js, MongoDB, Ant Design.</Paragraph>
          <Space size="large">
            <Button icon={<GithubOutlined />} href="https://github.com/Do-Van-Hop" target="_blank">GitHub</Button>
            <Button icon={<LinkedinOutlined />} href="https://www.linkedin.com/in/h%E1%BB%A3p-%C4%91%E1%BB%97-v%C4%83n-565165354/" target="_blank">LinkedIn</Button>
            <Button icon={<MailOutlined />} href="mailto:hopdv.ptit.2006@gmail.com">Email</Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default About;