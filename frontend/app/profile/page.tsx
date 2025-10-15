"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Navigation from "../components/Navigation";
import {
  Layout,
  Card,
  Form,
  Input,
  Button,
  Typography,
  message,
  Spin,
} from "antd";
import { useAuth } from "../contexts/AuthContext";
import API from "../services/api";

const { Content } = Layout;
const { Title, Text } = Typography;

interface UserProfile {
  id: number;
  name: string;
  email: string;
  userName: string;
}

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        userName: user.userName,
      });
    }
  }, [user, form]);

  const onFinish = async (values: Partial<UserProfile>) => {
    if (!user) return;

    setLoading(true);
    try {
      await API.put(`/user/${user.id}`, values);
      message.success("Profile updated successfully!");
      window.location.reload(); // Simple refresh for now
    } catch (error: any) {
      message.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <ProtectedRoute>
        <Layout className="min-h-screen">
          <Navigation />
          <Content className="p-6 bg-gray-50 flex items-center justify-center">
            <Spin size="large" />
          </Content>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout className="min-h-screen">
        <Navigation />
        <Content className="p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Title level={2}>User Profile</Title>
              <Text type="secondary">Manage your account information</Text>
            </div>

            <Card className="shadow-sm">
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                size="large"
              >
                <Form.Item
                  label="Full Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please input your full name!" },
                    { min: 2, message: "Name must be at least 2 characters!" },
                  ]}
                >
                  <Input placeholder="Enter your full name" />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                    { type: "email", message: "Please enter a valid email!" },
                  ]}
                >
                  <Input placeholder="Enter your email" />
                </Form.Item>

                <Form.Item
                  label="Username"
                  name="userName"
                  rules={[
                    { required: true, message: "Please input your username!" },
                    {
                      min: 3,
                      message: "Username must be at least 3 characters!",
                    },
                    {
                      pattern: /^[a-zA-Z0-9_]+$/,
                      message:
                        "Username can only contain letters, numbers, and underscores!",
                    },
                  ]}
                >
                  <Input placeholder="Enter your username" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                  >
                    Update Profile
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            <Card title="Account Information" className="mt-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
                  <div>
                    <Text strong>User ID</Text>
                    <br />
                    <Text type="secondary">
                      Unique identifier for your account
                    </Text>
                  </div>
                  <Text code>{user.id}</Text>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
                  <div>
                    <Text strong>Account Status</Text>
                    <br />
                    <Text type="secondary">Current status of your account</Text>
                  </div>
                  <Text className="text-green-600">Active</Text>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
                  <div>
                    <Text strong>Member Since</Text>
                    <br />
                    <Text type="secondary">When you joined the platform</Text>
                  </div>
                  <Text>Today</Text>
                </div>
              </div>
            </Card>
          </div>
        </Content>
      </Layout>
    </ProtectedRoute>
  );
}
