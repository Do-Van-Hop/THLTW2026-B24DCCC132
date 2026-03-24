import React from 'react';
import { useModel } from 'umi';
import { Table, Button, Space, Popconfirm, Tag } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface Props {
  onAddSinhVien: (quyetDinhId: string) => void;
  onDeleteQuyetDinh: (id: string) => void;
  onDeleteSinhVien: (quyetDinhId: string, sinhVienId: string) => void;
  onViewDetails?: (sinhVien: any, quyetDinh: any) => void; // để xem chi tiết
}

const QuyetDinhList: React.FC<Props> = ({ onAddSinhVien, onDeleteQuyetDinh, onDeleteSinhVien, onViewDetails }) => {
  const { quyetDinh, fieldConfigs } = useModel('vanbang');

  const dynamicColumns = fieldConfigs.map(fc => ({
    title: fc.label,
    dataIndex: ['dynamicFields', fc.key],
    key: fc.key,
    render: (value: any) => {
      if (fc.type === 'date' && value) return dayjs(value).format('DD/MM/YYYY');
      if (fc.type === 'number') return value?.toLocaleString();
      return value;
    },
  }));

  const sinhVienColumns = (qdId: string) => [
    { title: 'Mã SV', dataIndex: 'maSV', key: 'maSV' },
    { title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
    { title: 'Ngày sinh', dataIndex: 'ngaySinh', key: 'ngaySinh', render: (d: string) => dayjs(d).format('DD/MM/YYYY') },
    { title: 'Số hiệu VB', dataIndex: 'soHieuVanBang', key: 'soHieuVanBang' },
    ...dynamicColumns,
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: { id: string; }) => (
        <Space>
          {onViewDetails && (
            <Button icon={<EyeOutlined />} size="small" onClick={() => onViewDetails(record, qdId)} />
          )}
          <Popconfirm title="Thu hồi văn bằng?" onConfirm={() => onDeleteSinhVien(qdId, record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const columns = [
    { title: 'Số QĐ', dataIndex: 'soQD', key: 'soQD' },
    { title: 'Ngày ban hành', dataIndex: 'ngayBanHanh', key: 'ngayBanHanh', render: (d: string) => dayjs(d).format('DD/MM/YYYY') },
    { title: 'Trích yếu', dataIndex: 'trichYeu', key: 'trichYeu' },
    { title: 'Đợt', dataIndex: 'dot', key: 'dot' },
    { title: 'Số vào sổ', dataIndex: 'soVaoSo', key: 'soVaoSo' },
    { title: 'Số sinh viên', key: 'svCount', render: (_: any, record: { sinhVien: string | any[]; }) => record.sinhVien.length },
    { title: 'Lượt tra cứu', dataIndex: 'searchCount', key: 'searchCount' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: { id: string; }) => (
        <Space>
          <Button size="small" onClick={() => onAddSinhVien(record.id)}>Thêm SV</Button>
          <Popconfirm title="Xóa quyết định?" onConfirm={() => onDeleteQuyetDinh(record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={quyetDinh}
      rowKey="id"
      expandable={{
        expandedRowRender: (record) => (
          <Table
            columns={sinhVienColumns(record.id)}
            dataSource={record.sinhVien}
            rowKey="id"
            pagination={false}
          />
        ),
      }}
    />
  );
};

export default QuyetDinhList;