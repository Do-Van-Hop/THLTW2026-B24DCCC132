import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Radio, message } from 'antd';
import type { Course } from '../hooks/useCourseData';

const { TextArea } = Input;
const { Option } = Select;

interface CourseFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: Course | null;
  instructors: string[];
  isNameExists: (name: string, excludeId?: string) => boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  instructors,
  isNameExists,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    } else if (visible && !initialValues) {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleOk = () => {
    form.validateFields().then(values => {
      if (isNameExists(values.name, initialValues?.id)) {
        message.error('Tên khóa học đã tồn tại!');
        return;
      }
      onSubmit(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={initialValues ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={600}
    >
      <Form form={form} layout="vertical" initialValues={{ status: 'Đang mở', studentCount: 0 }}>
        <Form.Item
          name="name"
          label="Tên khóa học"
          rules={[
            { required: true, message: 'Vui lòng nhập tên khóa học' },
            { max: 100, message: 'Tối đa 100 ký tự' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="instructor"
          label="Giảng viên"
          rules={[{ required: true, message: 'Vui lòng chọn giảng viên' }]}
        >
          <Select>
            {instructors.map(inst => (
              <Option key={inst} value={inst}>{inst}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="studentCount"
          label="Số lượng học viên"
          rules={[
            { required: true, message: 'Vui lòng nhập số lượng' },
            { type: 'number', min: 0, message: 'Số lượng không âm' },
          ]}
        >
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả khóa học (HTML)"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <TextArea rows={4} placeholder="Nhập mô tả có thể sử dụng HTML" />
        </Form.Item>

        <Form.Item name="status" label="Trạng thái">
          <Radio.Group>
            <Radio value="Đang mở">Đang mở</Radio>
            <Radio value="Đã kết thúc">Đã kết thúc</Radio>
            <Radio value="Tạm dừng">Tạm dừng</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CourseForm;