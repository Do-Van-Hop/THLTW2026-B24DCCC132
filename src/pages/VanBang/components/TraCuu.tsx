import React, { useState } from 'react';
import { useModel } from 'umi';
import { Form, Input, InputNumber, DatePicker, Button, Table, Space, Typography, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

const TraCuu: React.FC = () => {
  const { traCuuVanBang, fieldConfigs } = useModel('vanbang');
  const [results, setResults] = useState<any[]>([]);
  const [form] = Form.useForm();

  const handleSearch = () => {
    form.validateFields().then(values => {
      const criteria: any = {};
      if (values.soHieu) criteria.soHieu = values.soHieu;
      if (values.soVaoSo) criteria.soVaoSo = values.soVaoSo;
      if (values.maSV) criteria.maSV = values.maSV;
      if (values.hoTen) criteria.hoTen = values.hoTen;
      if (values.ngaySinh) criteria.ngaySinh = values.ngaySinh.format('YYYY-MM-DD');

      const found = traCuuVanBang(criteria);
      setResults(found);
    }).catch(() => {});
  };

  const dynamicColumns = fieldConfigs.map(fc => ({
    title: fc.label,
    dataIndex: ['sinhVien', 'dynamicFields', fc.key],
    key: fc.key,
    render: (value: any) => {
      if (fc.type === 'date' && value) return dayjs(value).format('DD/MM/YYYY');
      if (fc.type === 'number') return value?.toLocaleString();
      return value;
    },
  }));

  const columns = [
    { title: 'Số hiệu VB', dataIndex: ['sinhVien', 'soHieuVanBang'], key: 'soHieu' },
    { title: 'Số vào sổ', dataIndex: ['sinhVien', 'soVaoSo'], key: 'soVaoSo' },
    { title: 'Mã SV', dataIndex: ['sinhVien', 'maSV'], key: 'maSV' },
    { title: 'Họ tên', dataIndex: ['sinhVien', 'hoTen'], key: 'hoTen' },
    { title: 'Ngày sinh', dataIndex: ['sinhVien', 'ngaySinh'], key: 'ngaySinh', render: (d: string) => dayjs(d).format('DD/MM/YYYY') },
    ...dynamicColumns,
    {
      title: 'Quyết định',
      key: 'qd',
      render: (_: any, record: { quyetDinh: { soQD: any; ngayBanHanh: any; }; }) => `${record.quyetDinh.soQD} - ${record.quyetDinh.ngayBanHanh}`,
    },
  ];

  return (
    <div>
      <Card title="Tra cứu văn bằng" style={{ marginBottom: 16 }}>
        <Form form={form} layout="vertical">
          <Form.Item name="soHieu" label="Số hiệu văn bằng">
            <Input placeholder="Nhập số hiệu văn bằng" />
          </Form.Item>
          <Form.Item name="soVaoSo" label="Số vào sổ">
            <InputNumber placeholder="Nhập số vào sổ" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="maSV" label="Mã sinh viên">
            <Input placeholder="Nhập mã sinh viên" />
          </Form.Item>
          <Form.Item name="hoTen" label="Họ tên">
            <Input placeholder="Nhập họ tên" />
          </Form.Item>
          <Form.Item name="ngaySinh" label="Ngày sinh">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            Tra cứu
          </Button>
        </Form>
      </Card>

      {results.length > 0 && (
        <Table
          dataSource={results}
          rowKey={(r: any) => r.sinhVien.id}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      )}
      {results.length === 0 && (
        <Text type="secondary">Nhập ít nhất 2 tham số và nhấn Tra cứu để xem kết quả.</Text>
      )}
    </div>
  );
};

export default TraCuu;