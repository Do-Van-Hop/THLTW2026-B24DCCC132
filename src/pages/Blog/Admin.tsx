import React, { useState } from 'react';
import { Tabs, Table, Button, Modal, Form, Input, Select, Switch, Tag, Popconfirm, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import useBlogData from './hooks/useBlogData';
import TagManager from './components/TagManager';
import { UserOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const Admin: React.FC = () => {
  const { posts, tags, addPost, updatePost, deletePost, addTag, updateTag, deleteTag } = useBlogData();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Tiêu đề', dataIndex: 'title' },
    { title: 'Trạng thái', dataIndex: 'status', render: (s: string) => <Tag color={s === 'published' ? 'green' : 'orange'}>{s === 'published' ? 'Đã đăng' : 'Nháp'}</Tag> },
    // eslint-disable-next-line @typescript-eslint/no-shadow
    { title: 'Thẻ', dataIndex: 'tags', render: (tags: string[]) => tags.map(t => <Tag key={t}>{t}</Tag>) },
    { title: 'Lượt xem', dataIndex: 'viewCount' },
    { title: 'Ngày tạo', dataIndex: 'createdAt' },
    {
      title: 'Thao tác',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => { setEditingPost(record); form.setFieldsValue(record); setModalVisible(true); }} />
          <Popconfirm title="Xóa bài viết?" onConfirm={() => { deletePost(record.id); message.success('Đã xóa'); }}>
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleSubmit = (values: any) => {
    const postData = {
      title: values.title,
      slug: values.slug,
      content: values.content,
      thumbnail: values.thumbnail,
      tags: values.tags,
      status: values.status,
      author: values.author,
    };
    if (editingPost) {
      updatePost(editingPost.id, postData);
      message.success('Cập nhật thành công');
    } else {
      addPost(postData);
      message.success('Thêm bài viết thành công');
    }
    setModalVisible(false);
    setEditingPost(null);
    form.resetFields();
  };

  return (
    <div style={{ padding: 24 }}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Bài viết" key="1">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingPost(null); form.resetFields(); setModalVisible(true); }}>Thêm bài viết</Button>
          <Table dataSource={posts} columns={columns} rowKey="id" style={{ marginTop: 16 }} pagination={{ pageSize: 5 }} />
        </TabPane>
        <TabPane tab="Quản lý thẻ" key="2">
          <TagManager tags={tags} onAdd={addTag} onUpdate={updateTag} onDelete={deleteTag} posts={posts} />
        </TabPane>
      </Tabs>

      <Modal
        title={editingPost ? 'Sửa bài viết' : 'Thêm bài viết'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="author" label="Tác giả" rules={[{ required: true }]}><Input placeholder="Nhập tên tác giả" /></Form.Item>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="thumbnail" label="URL ảnh đại diện"><Input /></Form.Item>
          <Form.Item name="tags" label="Thẻ"><Select mode="multiple">{tags.map(t => <Option key={t.id} value={t.name}>{t.name}</Option>)}</Select></Form.Item>
          <Form.Item name="status" label="Trạng thái"><Select><Option value="draft">Nháp</Option><Option value="published">Đã đăng</Option></Select></Form.Item>
          <Form.Item name="content" label="Nội dung (Markdown)" rules={[{ required: true }]}><TextArea rows={8} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Admin;