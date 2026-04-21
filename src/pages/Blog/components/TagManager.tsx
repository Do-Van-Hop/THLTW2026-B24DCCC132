import React, { useState } from 'react';
import { Table, Input, Button, Space, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Tag } from '../types';

const TagManager: React.FC<{ tags: Tag[]; onAdd: (name: string) => void; onUpdate: (id: string, name: string) => void; onDelete: (id: string) => void; posts: any[] }> = ({ tags, onAdd, onUpdate, onDelete, posts }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newTagName, setNewTagName] = useState('');

  const handleAdd = () => {
    if (!newTagName.trim()) {
      message.warning('Vui lòng nhập tên thẻ');
      return;
    }
    onAdd(newTagName.trim());
    setNewTagName('');
    message.success('Thêm thẻ thành công');
  };

  const handleUpdate = (id: string, oldName: string) => {
    if (!editValue.trim()) {
      message.warning('Tên không được để trống');
      return;
    }
    onUpdate(id, editValue.trim());
    setEditingId(null);
    message.success('Cập nhật thẻ thành công');
  };

  const columns = [
    { title: 'Tên thẻ', dataIndex: 'name', key: 'name' },
    { title: 'Số bài viết', key: 'count', render: (_: any, record: Tag) => posts.filter(p => p.tags.includes(record.name)).length },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Tag) => (
        <Space>
          {editingId === record.id ? (
            <>
              <Input value={editValue} onChange={e => setEditValue(e.target.value)} style={{ width: 120 }} />
              <Button size="small" type="primary" onClick={() => handleUpdate(record.id, record.name)}>Lưu</Button>
              <Button size="small" onClick={() => setEditingId(null)}>Hủy</Button>
            </>
          ) : (
            <>
              <Button icon={<EditOutlined />} size="small" onClick={() => { setEditingId(record.id); setEditValue(record.name); }} />
              <Popconfirm title="Xóa thẻ sẽ xóa khỏi bài viết. Tiếp tục?" onConfirm={() => { onDelete(record.id); message.success('Đã xóa'); }}>
                <Button icon={<DeleteOutlined />} danger size="small" />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input placeholder="Tên thẻ mới" value={newTagName} onChange={e => setNewTagName(e.target.value)} />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm</Button>
      </Space>
      <Table dataSource={tags} columns={columns} rowKey="id" pagination={false} />
    </div>
  );
};

export default TagManager;  