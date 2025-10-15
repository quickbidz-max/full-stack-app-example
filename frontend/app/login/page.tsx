"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { Button, Form, Input, Card, Typography, message } from "antd";
import Link from "next/link";

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push("/dashboard");
    }
  }, [token, router]);

  const onFinish = async (values: {
    emailOrUsername: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      await login(values.emailOrUsername, values.password);
      message.success("Login successful!");
      router.push("/dashboard");
    } catch (error: any) {
      console.log("error", error);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Title level={2}>Sign in to your account</Title>
          <Text type="secondary">
            Enter your credentials to access your dashboard
          </Text>
        </div>

        <Card className="shadow-lg">
          <Form name="login" onFinish={onFinish} layout="vertical" size="large">
            <Form.Item
              label="Email or Username"
              name="emailOrUsername"
              rules={[
                {
                  required: true,
                  message: "Please input your email or username!",
                },
              ]}
            >
              <Input placeholder="Enter your email or username" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full"
                size="large"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-4">
            <Text>
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-800"
              >
                Sign up here
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}
