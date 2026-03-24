import React, { useState } from 'react';
import { useModel } from 'umi';
import { Table, Button, Modal, Form, Input, Select, Switch, Space, Popconfirm, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const FieldConfigList: React.FC = () => {
  const { fieldConfigs, addFieldConfig, updateFieldConfig, deleteFieldConfig } = useModel('vanbang');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const openModal = (record?: any) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue(record);
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const data = {
        key: values.key,
        label: values.label,
        type: values.type,
        required: values.required,
        order: values.order,
      };
      if (editingId) {
        updateFieldConfig(editingId, data);
      } else {
        addFieldConfig(data);
      }
      setModalVisible(false);
    });
  };

  const columns = [
    { title: 'Key', dataIndex: 'key', key: 'key' },
    { title: 'Nhãn', dataIndex: 'label', key: 'label' },
    { title: 'Kiểu dữ liệu', dataIndex: 'type', key: 'type' },
    { title: 'Bắt buộc', dataIndex: 'required', key: 'required', render: (val: boolean) => (val ? 'Có' : 'Không') },
    { title: 'Thứ tự', dataIndex: 'order', key: 'order' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openModal(record)} />
          <Popconfirm title="Xóa trường này?" onConfirm={() => deleteFieldConfig(record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()} style={{ marginBottom: 16 }}>
        Thêm trường
      </Button>
      <Table columns={columns} dataSource={fieldConfigs} rowKey="id" />

      <Modal
        title={editingId ? 'Sửa trường' : 'Thêm trường'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="key" label="Key (tên dùng trong code)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="label" label="Nhãn hiển thị" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Kiểu dữ liệu" rules={[{ required: true }]}>
            <Select>
              <Option value="string">Chuỗi</Option>
              <Option value="number">Số</Option>
              <Option value="date">Ngày</Option>
            </Select>
          </Form.Item>
          <Form.Item name="required" label="Bắt buộc" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="order" label="Thứ tự" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default FieldConfigList;