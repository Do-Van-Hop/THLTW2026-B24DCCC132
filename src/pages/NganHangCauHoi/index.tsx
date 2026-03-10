import React, { useState } from 'react';
import { useModel } from 'umi';
import {
  Tabs,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Popconfirm,
  Tag,
  List,
  Divider,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;
const { Text } = Typography;

const NganHangCauHoiPage: React.FC = () => {
  const {
    khoiKienThuc,
    monHoc,
    cauHoi,
    cauTrucDe,
    deThi,
    themKhoiKienThuc,
    suaKhoiKienThuc,
    xoaKhoiKienThuc,
    themMonHoc,
    suaMonHoc,
    xoaMonHoc,
    themCauHoi,
    suaCauHoi,
    xoaCauHoi,
    timKiemCauHoi,
    themCauTrucDe,
    suaCauTrucDe,
    xoaCauTrucDe,
    taoDeThi,
    xoaDeThi,
  } = useModel('nganhangcauhoi');

  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<string>('khoi');
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState<any>({});

  const [cauTrucModalVisible, setCauTrucModalVisible] = useState(false);
  const [deThiModalVisible, setDeThiModalVisible] = useState(false);
  const [editingCauTruc, setEditingCauTruc] = useState<any>(null);
  const [cauTrucForm] = Form.useForm();
  const [deThiForm] = Form.useForm();

  const openModal = (type: string, record?: any) => {
    setModalType(type);
    setEditing(record || null);
    if (record) form.setFieldsValue(record);
    else form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    let success = true;

    switch (modalType) {
      case 'khoi':
        success = editing
          ? suaKhoiKienThuc(editing.id, values.ten)
          : themKhoiKienThuc(values.ten);
        break;
      case 'mon':
        success = editing
          ? suaMonHoc(editing.id, values.maMon, values.tenMon, values.soTinChi)
          : themMonHoc(values.maMon, values.tenMon, values.soTinChi);
        break;
      case 'cauhoi':
        const data = {
          maCauHoi: values.maCauHoi,
          monHocId: values.monHocId,
          noiDung: values.noiDung,
          mucDo: values.mucDo,
          khoiKienThucId: values.khoiKienThucId,
        };
        success = editing
          ? suaCauHoi(editing.id, data)
          : themCauHoi(data);
        break;
      default:
        break;
    }

    if (success !== false) {
      setModalVisible(false);
      form.resetFields();
    }
  };

  const openCauTrucModal = (record?: any) => {
    setEditingCauTruc(record || null);
    if (record) {
      cauTrucForm.setFieldsValue({
        ten: record.ten,
        monHocId: record.monHocId,
        yeuCau: record.yeuCau,
      });
    } else {
      cauTrucForm.resetFields();
      cauTrucForm.setFieldsValue({ yeuCau: [{ mucDo: 'Dễ', soLuong: 1 }] });
    }
    setCauTrucModalVisible(true);
  };

  const handleCauTrucSubmit = async () => {
    const values = await cauTrucForm.validateFields();
    const { ten, monHocId, yeuCau } = values;
    let success;
    if (editingCauTruc) {
      success = suaCauTrucDe(editingCauTruc.id, ten, monHocId, yeuCau);
    } else {
      success = themCauTrucDe(ten, monHocId, yeuCau);
    }
    if (success) {
      setCauTrucModalVisible(false);
      cauTrucForm.resetFields();
    }
  };

  const openDeThiModal = (cauTruc?: any) => {
    deThiForm.resetFields();
    if (cauTruc) {
      deThiForm.setFieldsValue({
        tenDe: '',
        monHocId: cauTruc.monHocId,
        yeuCau: cauTruc.yeuCau,
      });
    } else {
      deThiForm.setFieldsValue({
        yeuCau: [{ mucDo: 'Dễ', soLuong: 1 }],
      });
    }
    setDeThiModalVisible(true);
  };

  const handleDeThiSubmit = async () => {
    const values = await deThiForm.validateFields();
    const { tenDe, monHocId, yeuCau } = values;
    const success = taoDeThi(tenDe, monHocId, yeuCau);
    if (success) {
      setDeThiModalVisible(false);
      deThiForm.resetFields();
    }
  };

  const filteredCauHoi = timKiemCauHoi(
    search.monHocId,
    search.mucDo,
    search.khoiKienThucId
  );

  const khoiColumns = [
    { title: 'Tên khối', dataIndex: 'ten' },
    {
      title: 'Thao tác',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openModal('khoi', record)} />
          <Popconfirm title="Xóa khối?" onConfirm={() => xoaKhoiKienThuc(record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const monColumns = [
    { title: 'Mã môn', dataIndex: 'maMon' },
    { title: 'Tên môn', dataIndex: 'tenMon' },
    { title: 'Tín chỉ', dataIndex: 'soTinChi' },
    {
      title: 'Thao tác',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openModal('mon', record)} />
          <Popconfirm title="Xóa môn?" onConfirm={() => xoaMonHoc(record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const cauHoiColumns = [
    { title: 'Mã', dataIndex: 'maCauHoi' },
    {
      title: 'Môn',
      render: (r: any) => monHoc.find((m) => m.id === r.monHocId)?.tenMon,
    },
    { title: 'Nội dung', dataIndex: 'noiDung', ellipsis: true },
    {
      title: 'Mức độ',
      dataIndex: 'mucDo',
      render: (m: string) => <Tag>{m}</Tag>,
    },
    {
      title: 'Khối',
      render: (r: any) => khoiKienThuc.find((k) => k.id === r.khoiKienThucId)?.ten,
    },
    {
      title: 'Thao tác',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openModal('cauhoi', record)} />
          <Popconfirm title="Xóa câu hỏi?" onConfirm={() => xoaCauHoi(record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const cauTrucColumns = [
    { title: 'Tên cấu trúc', dataIndex: 'ten' },
    {
      title: 'Môn học',
      render: (r: any) => monHoc.find((m) => m.id === r.monHocId)?.tenMon,
    },
    {
      title: 'Số yêu cầu',
      render: (r: any) => r.yeuCau.length,
    },
    {
      title: 'Thao tác',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openCauTrucModal(record)} />
          <Button
            icon={<PlusOutlined />}
            size="small"
            onClick={() => openDeThiModal(record)}
            title="Tạo đề từ cấu trúc này"
          />
          <Popconfirm title="Xóa cấu trúc?" onConfirm={() => xoaCauTrucDe(record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const deThiColumns = [
    { title: 'Tên đề', dataIndex: 'tenDe' },
    {
      title: 'Môn',
      render: (r: any) => monHoc.find((m) => m.id === r.monHocId)?.tenMon,
    },
    {
      title: 'Số câu',
      render: (r: any) => r.cauHoiIds.length,
    },
    {
      title: 'Ngày tạo',
      render: (r: any) => new Date(r.ngayTao).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      render: (_: any, r: any) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              Modal.info({
                title: r.tenDe,
                width: 800,
                content: (
                  <div>
                    <p>Môn: {monHoc.find((m) => m.id === r.monHocId)?.tenMon}</p>
                    <p>Ngày tạo: {new Date(r.ngayTao).toLocaleString('vi-VN')}</p>
                    <Divider />
                    <List
                      header={<div>Danh sách câu hỏi</div>}
                      dataSource={r.cauHoiIds}
                      renderItem={(id: string) => {
                        const ch = cauHoi.find((c) => c.id === id);
                        return (
                          <List.Item key={id}>
                            <Text>
                              {ch?.maCauHoi} - {ch?.noiDung} ({ch?.mucDo})
                            </Text>
                          </List.Item>
                        );
                      }}
                    />
                  </div>
                ),
                onOk() {},
              });
            }}
          >
            Xem
          </Button>
          <Popconfirm title="Xóa đề?" onConfirm={() => xoaDeThi(r.id)}>
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Khối kiến thức" key="1">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal('khoi')}
            style={{ marginBottom: 16 }}
          >
            Thêm khối
          </Button>
          <Table columns={khoiColumns} dataSource={khoiKienThuc} rowKey="id" />
        </TabPane>

        <TabPane tab="Môn học" key="2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal('mon')}
            style={{ marginBottom: 16 }}
          >
            Thêm môn
          </Button>
          <Table columns={monColumns} dataSource={monHoc} rowKey="id" />
        </TabPane>

        <TabPane tab="Câu hỏi" key="3">
          <Space style={{ marginBottom: 16 }}>
            <Select
              placeholder="Môn"
              allowClear
              style={{ width: 160 }}
              onChange={(v) => setSearch({ ...search, monHocId: v })}
            >
              {monHoc.map((m) => (
                <Option key={m.id} value={m.id}>
                  {m.tenMon}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Mức độ"
              allowClear
              style={{ width: 140 }}
              onChange={(v) => setSearch({ ...search, mucDo: v })}
            >
              <Option value="Dễ">Dễ</Option>
              <Option value="Trung bình">Trung bình</Option>
              <Option value="Khó">Khó</Option>
              <Option value="Rất khó">Rất khó</Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openModal('cauhoi')}
            >
              Thêm câu hỏi
            </Button>
          </Space>
          <Table columns={cauHoiColumns} dataSource={filteredCauHoi} rowKey="id" />
        </TabPane>

        <TabPane tab="Cấu trúc đề" key="4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openCauTrucModal()}
            style={{ marginBottom: 16 }}
          >
            Thêm cấu trúc
          </Button>
          <Table columns={cauTrucColumns} dataSource={cauTrucDe} rowKey="id" />
        </TabPane>

        <TabPane tab="Đề thi" key="5">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openDeThiModal()}
            style={{ marginBottom: 16 }}
          >
            Tạo đề thi
          </Button>
          <Table columns={deThiColumns} dataSource={deThi} rowKey="id" />
        </TabPane>
      </Tabs>

      <Modal
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          {modalType === 'khoi' && (
            <Form.Item name="ten" label="Tên khối" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          )}
          {modalType === 'mon' && (
            <>
              <Form.Item name="maMon" label="Mã môn" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="tenMon" label="Tên môn" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="soTinChi" label="Tín chỉ">
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </>
          )}
          {modalType === 'cauhoi' && (
            <>
              <Form.Item name="maCauHoi" label="Mã câu hỏi">
                <Input />
              </Form.Item>
              <Form.Item name="monHocId" label="Môn học" rules={[{ required: true }]}>
                <Select>
                  {monHoc.map((m) => (
                    <Option key={m.id} value={m.id}>
                      {m.tenMon}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="noiDung" label="Nội dung" rules={[{ required: true }]}>
                <Input.TextArea rows={3} />
              </Form.Item>
              <Form.Item name="mucDo" label="Mức độ" rules={[{ required: true }]}>
                <Select>
                  <Option value="Dễ">Dễ</Option>
                  <Option value="Trung bình">Trung bình</Option>
                  <Option value="Khó">Khó</Option>
                  <Option value="Rất khó">Rất khó</Option>
                </Select>
              </Form.Item>
              <Form.Item name="khoiKienThucId" label="Khối" rules={[{ required: true }]}>
                <Select>
                  {khoiKienThuc.map((k) => (
                    <Option key={k.id} value={k.id}>
                      {k.ten}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      <Modal
        visible={cauTrucModalVisible}
        title={editingCauTruc ? 'Sửa cấu trúc đề' : 'Thêm cấu trúc đề'}
        onOk={handleCauTrucSubmit}
        onCancel={() => setCauTrucModalVisible(false)}
        width={700}
        destroyOnClose
      >
        <Form form={cauTrucForm} layout="vertical">
          <Form.Item name="ten" label="Tên cấu trúc" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="monHocId" label="Môn học" rules={[{ required: true }]}>
            <Select>
              {monHoc.map((m) => (
                <Option key={m.id} value={m.id}>
                  {m.tenMon}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.List name="yeuCau">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'mucDo']}
                      rules={[{ required: true, message: 'Chọn mức độ' }]}
                    >
                      <Select placeholder="Mức độ" style={{ width: 120 }}>
                        <Option value="Dễ">Dễ</Option>
                        <Option value="Trung bình">Trung bình</Option>
                        <Option value="Khó">Khó</Option>
                        <Option value="Rất khó">Rất khó</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'khoiKienThucId']}>
                      <Select placeholder="Khối (tùy chọn)" style={{ width: 150 }} allowClear>
                        {khoiKienThuc.map((k) => (
                          <Option key={k.id} value={k.id}>
                            {k.ten}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'soLuong']}
                      rules={[{ required: true, message: 'Nhập số lượng' }]}
                    >
                      <InputNumber min={1} placeholder="Số lượng" style={{ width: 100 }} />
                    </Form.Item>
                    <Button type="link" danger onClick={() => remove(name)} icon={<DeleteOutlined />} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm yêu cầu
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      <Modal
        visible={deThiModalVisible}
        title="Tạo đề thi"
        onOk={handleDeThiSubmit}
        onCancel={() => setDeThiModalVisible(false)}
        width={700}
        destroyOnClose
      >
        <Form form={deThiForm} layout="vertical">
          <Form.Item name="tenDe" label="Tên đề thi" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="monHocId" label="Môn học" rules={[{ required: true }]}>
            <Select>
              {monHoc.map((m) => (
                <Option key={m.id} value={m.id}>
                  {m.tenMon}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.List name="yeuCau">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'mucDo']}
                      rules={[{ required: true, message: 'Chọn mức độ' }]}
                    >
                      <Select placeholder="Mức độ" style={{ width: 120 }}>
                        <Option value="Dễ">Dễ</Option>
                        <Option value="Trung bình">Trung bình</Option>
                        <Option value="Khó">Khó</Option>
                        <Option value="Rất khó">Rất khó</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'khoiKienThucId']}>
                      <Select placeholder="Khối (tùy chọn)" style={{ width: 150 }} allowClear>
                        {khoiKienThuc.map((k) => (
                          <Option key={k.id} value={k.id}>
                            {k.ten}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'soLuong']}
                      rules={[{ required: true, message: 'Nhập số lượng' }]}
                    >
                      <InputNumber min={1} placeholder="Số lượng" style={{ width: 100 }} />
                    </Form.Item>
                    <Button type="link" danger onClick={() => remove(name)} icon={<DeleteOutlined />} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm yêu cầu
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </Card>
  );
};

export default NganHangCauHoiPage;