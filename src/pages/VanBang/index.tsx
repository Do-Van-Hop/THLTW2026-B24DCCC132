import React, { useState } from 'react';
import { Tabs, Card, Button, Modal, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import dayjs from 'dayjs';
import SoVanBangList from './components/SoVanBangList';
import QuyetDinhList from './components/QuyetDinhList';
import QuyetDinhForm from './components/QuyetDinhForm';
import SinhVienForm from './components/SinhVienForm';
import TraCuu from './components/TraCuu';
import FieldConfigList from './components/FieldConfigList';

const { TabPane } = Tabs;
const { Text } = Typography;

const VanBangPage: React.FC = () => {
  const { addQuyetDinh, deleteQuyetDinh, addSinhVien, removeSinhVien, fieldConfigs } = useModel('vanbang');
  const [modalQuyetDinhVisible, setModalQuyetDinhVisible] = useState(false);
  const [modalSinhVienVisible, setModalSinhVienVisible] = useState(false);
  const [selectedQuyetDinhId, setSelectedQuyetDinhId] = useState<string | null>(null);
  const [initialQuyetDinh, setInitialQuyetDinh] = useState<any>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [currentSinhVien, setCurrentSinhVien] = useState<any>(null);
  const [currentQuyetDinh, setCurrentQuyetDinh] = useState<any>(null);

  const handleAddQuyetDinh = (soVanBangId?: string, nam?: number) => {
    setInitialQuyetDinh(soVanBangId ? { soVanBangId, nam } : null);
    setModalQuyetDinhVisible(true);
  };

  const handleSubmitQuyetDinh = (values: any) => {
    addQuyetDinh(values);
    setModalQuyetDinhVisible(false);
  };

  const handleAddSinhVien = (quyetDinhId: string) => {
    setSelectedQuyetDinhId(quyetDinhId);
    setModalSinhVienVisible(true);
  };

  const handleSubmitSinhVien = (values: any) => {
    if (selectedQuyetDinhId) {
      addSinhVien(selectedQuyetDinhId, values);
      setModalSinhVienVisible(false);
      setSelectedQuyetDinhId(null);
    }
  };

  const handleViewDetails = (sinhVien: any, quyetDinhId: string) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { quyetDinh } = useModel('vanbang');
    const qd = quyetDinh.find(q => q.id === quyetDinhId);
    setCurrentSinhVien(sinhVien);
    setCurrentQuyetDinh(qd);
    setDetailsModalVisible(true);
  };

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Sổ văn bằng" key="1">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAddQuyetDinh()} style={{ marginBottom: 16 }}>
              Thêm quyết định mới
            </Button>
            <SoVanBangList onAddQuyetDinh={handleAddQuyetDinh} />
          </TabPane>

          <TabPane tab="Quyết định tốt nghiệp" key="2">
            <QuyetDinhList
              onAddSinhVien={handleAddSinhVien}
              onDeleteQuyetDinh={deleteQuyetDinh}
              onDeleteSinhVien={removeSinhVien}
              onViewDetails={handleViewDetails}
            />
          </TabPane>

          <TabPane tab="Tra cứu văn bằng" key="3">
            <TraCuu />
          </TabPane>

          <TabPane tab="Cấu hình biểu mẫu" key="4">
            <FieldConfigList />
          </TabPane>
        </Tabs>
      </Card>

      <QuyetDinhForm
        visible={modalQuyetDinhVisible}
        onCancel={() => setModalQuyetDinhVisible(false)}
        onOk={handleSubmitQuyetDinh}
        initialValues={initialQuyetDinh}
      />

      <SinhVienForm
        visible={modalSinhVienVisible}
        onCancel={() => setModalSinhVienVisible(false)}
        onOk={handleSubmitSinhVien}
      />

      <Modal
        title="Chi tiết văn bằng"
        visible={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={600}
      >
        {currentSinhVien && currentQuyetDinh && (
          <div>
            <p><strong>Quyết định:</strong> {currentQuyetDinh.soQD} - {currentQuyetDinh.ngayBanHanh}</p>
            <p><strong>Trích yếu:</strong> {currentQuyetDinh.trichYeu}</p>
            <p><strong>Số hiệu văn bằng:</strong> {currentSinhVien.soHieuVanBang}</p>
            <p><strong>Số vào sổ:</strong> {currentSinhVien.soVaoSo}</p>
            <p><strong>Mã sinh viên:</strong> {currentSinhVien.maSV}</p>
            <p><strong>Họ tên:</strong> {currentSinhVien.hoTen}</p>
            <p><strong>Ngày sinh:</strong> {currentSinhVien.ngaySinh}</p>
            {fieldConfigs.map(fc => (
              <p key={fc.id}>
                <strong>{fc.label}:</strong> {
                  fc.type === 'date' && currentSinhVien.dynamicFields[fc.key]
                    ? dayjs(currentSinhVien.dynamicFields[fc.key]).format('DD/MM/YYYY')
                    : currentSinhVien.dynamicFields[fc.key]
                }
              </p>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VanBangPage;