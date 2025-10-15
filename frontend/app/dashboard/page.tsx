"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Navigation from "../components/Navigation";
import { Layout, Card, Row, Col, Typography, Statistic, Button } from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import API from "../services/api";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function DashboardPage() {
  const [products, setProducts] = useState<number>(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get("/product?page=1&limit=1");
        setProducts(response.data.total);
      } catch (error) {
        console.error("Failed to fetch products count:", error);
      }
    };
    fetchProduct();
  }, []);

  return (
    <ProtectedRoute>
      <Layout className="min-h-screen">
        <Navigation />
        <Content className="p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <Title level={2}>Dashboard</Title>
              <Text type="secondary">Welcome to your personal dashboard</Text>
            </div>

            <Row gutter={[16, 16]} className="mb-8">
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Profile Status"
                    value="Complete"
                    prefix={<UserOutlined />}
                    valueStyle={{ color: "#3f8600" }}
                  />
                  <div className="mt-4">
                    <Link href="/profile">
                      <Button type="primary" icon={<EditOutlined />}>
                        Manage Profile
                      </Button>
                    </Link>
                  </div>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Products"
                    value={products}
                    prefix={<ShoppingOutlined />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                  <div className="mt-4">
                    <Link href="/products">
                      <Button type="primary" icon={<EyeOutlined />}>
                        View Products
                      </Button>
                    </Link>
                  </div>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Account Type"
                    value="Standard"
                    valueStyle={{ color: "#722ed1" }}
                  />
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Last Login"
                    value="Today"
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title="Quick Actions" className="h-full">
                  <div className="space-y-4">
                    <Link href="/profile" className="block">
                      <Button
                        size="large"
                        className="w-full"
                        icon={<UserOutlined />}
                      >
                        Update Profile Information
                      </Button>
                    </Link>
                    <Link href="/products" className="block">
                      <Button
                        size="large"
                        className="w-full"
                        icon={<ShoppingOutlined />}
                      >
                        Manage Products
                      </Button>
                    </Link>
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Recent Activity" className="h-full">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <Text strong>Account Created</Text>
                        <br />
                        <Text type="secondary">Welcome to the platform!</Text>
                      </div>
                      <Text type="secondary">Today</Text>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <Text strong>Profile Setup</Text>
                        <br />
                        <Text type="secondary">
                          Complete your profile information
                        </Text>
                      </div>
                      <Text type="secondary">Pending</Text>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </ProtectedRoute>
  );
}
