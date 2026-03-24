import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import { useModel } from 'umi';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  initialValues?: any;
}

const QuyetDinhForm: React.FC<Props> = ({ visible, onCancel, onOk, initialValues }) => {
  const [form] = Form.useForm();
  const { soVanBang } = useModel('vanbang');

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          ngayBanHanh: initialValues.ngayBanHanh ? dayjs(initialValues.ngayBanHanh) : undefined,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleOk = () => {
    form.validateFields().then(values => onOk(values));
  };

  return (
    <Modal title={initialValues ? 'Sửa quyết định' : 'Thêm quyết định tốt nghiệp'} visible={visible} onCancel={onCancel} onOk={handleOk} width={600}>
      <Form form={form} layout="vertical">
        <Form.Item name="nam" label="Năm tốt nghiệp" rules={[{ required: true }]}>
          <InputNumber min={2000} max={2100} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="soVanBangId" label="Sổ văn bằng (để trống sẽ tự tạo mới)">
          <Select allowClear placeholder="Chọn sổ văn bằng hoặc để trống để tự tạo">
            {soVanBang.map(s => <Select.Option key={s.id} value={s.id}>Sổ năm {s.nam}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="soQD" label="Số quyết định" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="ngayBanHanh" label="Ngày ban hành" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item name="dot" label="Đợt tốt nghiệp" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="trichYeu" label="Trích yếu">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QuyetDinhForm;