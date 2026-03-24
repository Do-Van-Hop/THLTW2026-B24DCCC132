import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, InputNumber, Select } from 'antd';
import dayjs from 'dayjs';
import { useModel } from 'umi';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
}

const SinhVienForm: React.FC<Props> = ({ visible, onCancel, onOk }) => {
  const [form] = Form.useForm();
  const { fieldConfigs } = useModel('vanbang');

  useEffect(() => {
    if (!visible) form.resetFields();
  }, [visible, form]);

  const handleOk = () => {
    form.validateFields().then(values => {
      // Tách dynamicFields
      const dynamicFields: Record<string, any> = {};
      fieldConfigs.forEach(fc => {
        if (values[fc.key] !== undefined) {
          dynamicFields[fc.key] = values[fc.key];
        }
      });
      onOk({
        ...values,
        dynamicFields,
      });
    });
  };

  const renderFieldInput = (config: any) => {
    if (config.type === 'number') {
      return <InputNumber style={{ width: '100%' }} />;
    }
    if (config.type === 'date') {
      return <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />;
    }
    return <Input />;
  };

  return (
    <Modal title="Thêm sinh viên cấp văn bằng" visible={visible} onCancel={onCancel} onOk={handleOk} width={600}>
      <Form form={form} layout="vertical">
        <Form.Item name="maSV" label="Mã sinh viên" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="hoTen" label="Họ tên" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="ngaySinh" label="Ngày sinh" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>

        {fieldConfigs.map(fc => (
          <Form.Item
            key={fc.id}
            name={fc.key}
            label={fc.label}
            rules={[{ required: fc.required, message: `Vui lòng nhập ${fc.label}` }]}
          >
            {renderFieldInput(fc)}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default SinhVienForm;