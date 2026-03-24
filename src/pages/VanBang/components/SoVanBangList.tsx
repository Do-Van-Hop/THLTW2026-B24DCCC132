import React from 'react';
import { useModel } from 'umi';
import { Table, Button } from 'antd';

interface Props {
  onAddQuyetDinh: (soVanBangId?: string, nam?: number) => void;
}

const SoVanBangList: React.FC<Props> = ({ onAddQuyetDinh }) => {
  const { soVanBang } = useModel('vanbang');

  const columns = [
    { title: 'Năm', dataIndex: 'nam', key: 'nam' },
    { title: 'Số vào sổ hiện tại', dataIndex: 'soVaoSo', key: 'soVaoSo' },
    { title: 'Số quyết định', key: 'soQDCount', render: (_: any, record: { quyetDinhIds: string | any[]; }) => record.quyetDinhIds.length },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: { id: string | undefined; nam: number | undefined; }) => (
        <Button type="primary" size="small" onClick={() => onAddQuyetDinh(record.id, record.nam)}>
          Thêm quyết định
        </Button>
      ),
    },
  ];

  return <Table columns={columns} dataSource={soVanBang} rowKey="id" />;
};

export default SoVanBangList;