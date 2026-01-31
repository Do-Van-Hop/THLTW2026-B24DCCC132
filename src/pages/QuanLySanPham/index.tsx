import React, { useState } from 'react';
import { useModel } from 'umi';
import {
  Card,
  Table,
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  message,
  Row,
  Col,
  Space,
  Typography,
  Tag,
  Select,
  Slider,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  CloseOutlined,
  SaveOutlined,
  EditOutlined,
} from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const QuanLySanPham: React.FC = () => {
  const {
    products,
    searchText,
    setSearchText,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    selectedStatus,
    setSelectedStatus,
    addProduct,
    deleteProduct,
    updateProduct,
    getFilteredProducts,
    getProductStatus,
    categories,
  } = useModel('productModel');

  const [form] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const filteredProducts = getFilteredProducts();

  const columns = [
    {
      title: 'STT',
      key: 'index',
      render: (_: any, __: any, index: number) => index + 1,
      width: 80,
      align: 'center' as const,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Giá (VND)',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => price.toLocaleString('vi-VN'),
      align: 'right' as const,
      sorter: (a: any, b: any) => a.price - b.price,
    },
    {
      title: 'Số lượng tồn kho',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center' as const,
      sorter: (a: any, b: any) => a.quantity - b.quantity,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: any, record: any) => {
        const status = getProductStatus(record.quantity);
        return <Tag color={status.color}>{status.text}</Tag>;
      },
      align: 'center' as const,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setEditingProduct(record);
              form.setFieldsValue(record);
              setDrawerVisible(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
      align: 'center' as const,
    },
  ];

  const handleAdd = () => {
    form.validateFields()
      .then((values) => {
        setLoading(true);
        console.log('Form values for add:', values);
        
        try {
          // Chuyển đổi giá trị từ form
          const newProduct = {
            name: values.name,
            category: values.category,
            price: Number(values.price),
            quantity: Number(values.quantity),
          };
          
          addProduct(newProduct);
          message.success('Thêm sản phẩm thành công!');
          form.resetFields();
          setDrawerVisible(false);
        } catch (error) {
          console.error('Error adding product:', error);
          message.error('Có lỗi xảy ra khi thêm sản phẩm!');
        } finally {
          setLoading(false);
        }
      })
      .catch(errorInfo => {
        console.log('Validate Failed:', errorInfo);
      });
  };

  const handleUpdate = () => {
    form.validateFields()
      .then((values) => {
        setLoading(true);
        try {
          if (editingProduct) {
            console.log('Form values for update:', values);
            const updatedData = {
              name: values.name,
              category: values.category,
              price: Number(values.price),
              quantity: Number(values.quantity),
            };
            
            updateProduct(editingProduct.id, updatedData);
            message.success('Cập nhật sản phẩm thành công!');
            setEditingProduct(null);
            form.resetFields();
            setDrawerVisible(false);
          }
        } catch (error) {
          console.error('Error updating product:', error);
          message.error('Có lỗi xảy ra khi cập nhật sản phẩm!');
        } finally {
          setLoading(false);
        }
      })
      .catch(errorInfo => {
        console.log('Validate Failed:', errorInfo);
      });
  };

  const handleDelete = (id: number) => {
    deleteProduct(id);
    message.success('Xóa sản phẩm thành công!');
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleResetFilters = () => {
    setSearchText('');
    setSelectedCategory('Tất cả');
    setPriceRange([0, 50000000]);
    setSelectedStatus('');
  };

  const handleSliderChange = (value: any) => {
    setPriceRange(value as [number, number]);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
          Quản lý Sản phẩm
        </Title>

        {/* Bộ lọc */}
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col span={6}>
            <Input
              placeholder="Tìm kiếm theo tên..."
              allowClear
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={() => handleSearch(searchText)}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="Danh mục"
              style={{ width: '100%' }}
              value={selectedCategory}
              onChange={setSelectedCategory}
            >
              {categories.map((cat: string) => (
                <Option key={cat} value={cat}>{cat}</Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <Select
              placeholder="Trạng thái"
              style={{ width: '100%' }}
              value={selectedStatus}
              onChange={setSelectedStatus}
              allowClear
            >
              <Option value="Còn hàng">Còn hàng</Option>
              <Option value="Sắp hết">Sắp hết</Option>
              <Option value="Hết hàng">Hết hàng</Option>
            </Select>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingProduct(null);
                form.resetFields();
                setDrawerVisible(true);
              }}
            >
              Thêm sản phẩm
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleResetFilters}>
              Đặt lại bộ lọc
            </Button>
          </Col>
        </Row>

        {/* Khoảng giá */}
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col span={24}>
            <span>Khoảng giá: </span>
            <Slider
              range
              min={0}
              max={50000000}
              step={1000000}
              value={priceRange}
              onChange={handleSliderChange}
              style={{ width: '300px', marginLeft: 16, marginRight: 16 }}
            />
            <span>
              {priceRange[0].toLocaleString('vi-VN')} - {priceRange[1].toLocaleString('vi-VN')} VND
            </span>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          bordered
        />
      </Card>

      {/* Drawer thêm/sửa sản phẩm */}
      <Drawer
        title={editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
        placement="right"
        onClose={() => {
          form.resetFields();
          setEditingProduct(null);
          setDrawerVisible(false);
        }}
        visible={drawerVisible}
        width={520}
        extra={
          <Space>
            <Button
              onClick={() => {
                form.resetFields();
                setEditingProduct(null);
                setDrawerVisible(false);
              }}
              icon={<CloseOutlined />}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              onClick={editingProduct ? handleUpdate : handleAdd}
              loading={loading}
              icon={<SaveOutlined />}
            >
              {editingProduct ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ quantity: 1, price: 1000, category: 'Laptop' }}
        >
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
              { min: 3, message: 'Tên sản phẩm phải có ít nhất 3 ký tự!' }
            ]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="category"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select placeholder="Chọn danh mục">
              <Option value="Laptop">Laptop</Option>
              <Option value="Điện thoại">Điện thoại</Option>
              <Option value="Máy tính bảng">Máy tính bảng</Option>
              <Option value="Phụ kiện">Phụ kiện</Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Giá (VND)"
                name="price"
                rules={[
                  { required: true, message: 'Vui lòng nhập giá sản phẩm!' },
                  {
                    type: 'number',
                    min: 1,
                    message: 'Giá phải lớn hơn 0!'
                  }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value ? value.replace(/\$\s?|(,*)/g, '') : ''}
                  min={0}
                  step={1000}
                  addonAfter="₫"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số lượng"
                name="quantity"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng!' },
                  {
                    type: 'number',
                    min: 0,
                    message: 'Số lượng không được âm!'
                  }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  step={1}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

export default QuanLySanPham;