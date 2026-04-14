import React, { useState, useMemo } from 'react';
import { Table, Button, Input, Select, Space, Popconfirm, Tag, message, Card, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import useCourseData from './hooks/useCourseData';
import CourseForm from './components/CourseForm';

const { Title } = Typography;
const { Option } = Select;

const CourseManagement: React.FC = () => {
  const { courses, instructors, addCourse, updateCourse, deleteCourse, isNameExists } = useCourseData();
  const [searchText, setSearchText] = useState('');
  const [filterInstructor, setFilterInstructor] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  const filteredCourses = useMemo(() => {
    let filtered = courses;
    if (searchText) {
      filtered = filtered.filter(c => c.name.toLowerCase().includes(searchText.toLowerCase()));
    }
    if (filterInstructor) {
      filtered = filtered.filter(c => c.instructor === filterInstructor);
    }
    if (filterStatus) {
      filtered = filtered.filter(c => c.status === filterStatus);
    }
    return [...filtered].sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
  }, [courses, searchText, filterInstructor, filterStatus]);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 100 },
    { title: 'Tên khóa học', dataIndex: 'name', key: 'name' },
    { title: 'Giảng viên', dataIndex: 'instructor', key: 'instructor' },
    { 
      title: 'Số lượng học viên', 
      dataIndex: 'studentCount', 
      key: 'studentCount', 
      sorter: (a: any, b: any) => a.studentCount - b.studentCount 
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Đang mở' ? 'green' : status === 'Đã kết thúc' ? 'red' : 'orange';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => {
              setEditingCourse(record);
              setModalVisible(true);
            }} 
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => {
              if (record.studentCount > 0) {
                message.error('Không thể xóa khóa học đã có học viên!');
                return;
              }
              deleteCourse(record.id);
              message.success('Đã xóa khóa học');
            }}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleFormSubmit = (values: any) => {
    if (editingCourse) {
      updateCourse(editingCourse.id, values);
      message.success('Cập nhật thành công');
    } else {
      addCourse(values);
      message.success('Thêm khóa học thành công');
    }
    setModalVisible(false);
    setEditingCourse(null);
  };

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center' }}>Quản lý khóa học online</Title>

        <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Input
              placeholder="Nhập tên khóa học"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 220 }}
              allowClear
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Select
              placeholder="Chọn giảng viên"
              {...(filterInstructor ? { value: filterInstructor } : {})}
              onChange={setFilterInstructor}
              style={{ width: 180 }}    
              allowClear
            >
              {instructors.map(inst => (
                <Option key={inst} value={inst}>{inst}</Option>
              ))}
            </Select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Select
              placeholder="Chọn trạng thái"
              {...(filterStatus ? { value: filterStatus } : {})}
              onChange={setFilterStatus}
              style={{ width: 140 }}
              allowClear
            >
              <Option value="Đang mở">Đang mở</Option>
              <Option value="Đã kết thúc">Đã kết thúc</Option>
              <Option value="Tạm dừng">Tạm dừng</Option>
            </Select>
          </div>
          
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => {
              setEditingCourse(null);
              setModalVisible(true);
            }}
          >
            Thêm khóa học
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredCourses}
          rowKey="id"
          pagination={{ pageSize: 5, showSizeChanger: true, showTotal: (total) => `Tổng ${total} khóa học` }}
        />
      </Card>

      <CourseForm
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingCourse(null);
        }}
        onSubmit={handleFormSubmit}
        initialValues={editingCourse}
        instructors={instructors}
        isNameExists={isNameExists}
      />
    </div>
  );
};

export default CourseManagement;