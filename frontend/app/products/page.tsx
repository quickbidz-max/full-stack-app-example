"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Navigation from "../components/Navigation";
import {
  Layout,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Typography,
  message,
  Popconfirm,
  Space,
  Tag,
  Select,
  Pagination,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import API from "../services/api";

const { Content } = Layout;
const { Title, Text } = Typography;

export interface Product {
  id: number;
  product_name: string;
  description: string;
  price: string;
  quantity: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();
  
  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  useEffect(() => {
    fetchProducts();
  }, [currentPage, pageSize, searchText, sortBy, sortOrder]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        sortBy,
        sortOrder,
        ...(searchText && { search: searchText }),
      });
      
      const response = await API.get(`/product?${params}`);
      setProducts(response.data.data);
      setTotal(response.data.total);
    } catch (error: any) {
      message.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      product_name: product.product_name,
      description: product.description,
      price: parseFloat(product.price),
      quantity: parseInt(product.quantity),
      category: product.category,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/product/${id}`);
      message.success("Product deleted successfully");
      fetchProducts();
    } catch (error: any) {
      message.error("Failed to delete product");
    }
  };

  const onFinish = async (values: any) => {
    try {
      const productData = {
        ...values,
        price: values.price.toString(),
        quantity: values.quantity.toString(),
      };

      if (editingProduct) {
        await API.put(`/product/${editingProduct.id}`, productData);
        message.success("Product updated successfully");
      } else {
        await API.post("/product", productData);
        message.success("Product created successfully");
      }

      setModalVisible(false);
      fetchProducts();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to save product");
    }
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: string) => `$${parseFloat(price).toFixed(2)}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: string) => {
        const qty = parseInt(quantity);
        return (
          <Tag color={qty > 10 ? "green" : qty > 5 ? "orange" : "red"}>
            {qty}
          </Tag>
        );
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Product) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ProtectedRoute>
      <Layout className="min-h-screen">
        <Navigation />
        <Content className="p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <Title level={2}>Products</Title>
                <Text type="secondary">Manage your product inventory</Text>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
                size="large"
              >
                Add Product
              </Button>
            </div>

            <Card className="shadow-sm">
              {/* Search and Filter Controls */}
              <div className="mb-4 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <SearchOutlined />
                  <Input
                    placeholder="Search products..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 200 }}
                    allowClear
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Text>Sort by:</Text>
                  <Select
                    value={sortBy}
                    onChange={setSortBy}
                    style={{ width: 120 }}
                  >
                    <Select.Option value="product_name">Name</Select.Option>
                    <Select.Option value="category">Category</Select.Option>
                    <Select.Option value="price">Price</Select.Option>
                    <Select.Option value="quantity">Quantity</Select.Option>
                    <Select.Option value="createdAt">Created</Select.Option>
                    <Select.Option value="updatedAt">Updated</Select.Option>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Text>Order:</Text>
                  <Select
                    value={sortOrder}
                    onChange={setSortOrder}
                    style={{ width: 100 }}
                  >
                    <Select.Option value="ASC">Ascending</Select.Option>
                    <Select.Option value="DESC">Descending</Select.Option>
                  </Select>
                </div>
              </div>

              <Table
                columns={columns}
                dataSource={products}
                rowKey="id"
                loading={loading}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: total,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} products`,
                  onChange: (page, size) => {
                    setCurrentPage(page);
                    setPageSize(size || 10);
                  },
                  onShowSizeChange: (current, size) => {
                    setCurrentPage(1);
                    setPageSize(size);
                  },
                }}
              />
            </Card>

            <Modal
              title={editingProduct ? "Edit Product" : "Add New Product"}
              open={modalVisible}
              onCancel={() => setModalVisible(false)}
              footer={null}
              width={600}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                size="large"
              >
                <Form.Item
                  label="Product Name"
                  name="product_name"
                  rules={[
                    { required: true, message: "Please input product name!" },
                  ]}
                >
                  <Input placeholder="Enter product name" />
                </Form.Item>

                <Form.Item
                  label="Description"
                  name="description"
                  rules={[
                    { required: true, message: "Please input description!" },
                  ]}
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="Enter product description"
                  />
                </Form.Item>

                <Form.Item
                  label="Price"
                  name="price"
                  rules={[
                    { required: true, message: "Please input price!" },
                    {
                      type: "number",
                      min: 0,
                      message: "Price must be positive!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Enter price"
                    prefix="$"
                    min={0}
                    step={0.01}
                  />
                </Form.Item>

                <Form.Item
                  label="Quantity"
                  name="quantity"
                  rules={[
                    { required: true, message: "Please input quantity!" },
                    {
                      type: "number",
                      min: 0,
                      message: "Quantity must be non-negative!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Enter quantity"
                    min={0}
                  />
                </Form.Item>

                <Form.Item
                  label="Category"
                  name="category"
                  rules={[
                    { required: true, message: "Please input category!" },
                  ]}
                >
                  <Input placeholder="Enter category" />
                </Form.Item>

                <Form.Item className="mb-0">
                  <Space>
                    <Button type="primary" htmlType="submit">
                      {editingProduct ? "Update" : "Create"}
                    </Button>
                    <Button onClick={() => setModalVisible(false)}>
                      Cancel
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </Content>
      </Layout>
    </ProtectedRoute>
  );
}
