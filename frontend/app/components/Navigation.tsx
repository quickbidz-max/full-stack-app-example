'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Layout, Menu, Button, Dropdown, Avatar, Typography } from 'antd';
import { UserOutlined, LogoutOutlined, DashboardOutlined, ProfileOutlined, ShoppingOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Text } = Typography;

export default function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: <Link href="/profile">Profile</Link>,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const navItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: <Link href="/products">Products</Link>,
    },
  ];

  return (
    <Header className="bg-white shadow-sm px-6 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/dashboard" className="text-xl font-bold text-blue-600 mr-8">
          MyApp
        </Link>
        <Menu
          mode="horizontal"
          items={navItems}
          className="border-none bg-transparent"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <Text className="text-gray-600">
          Welcome, {user?.name || user?.userName}
        </Text>
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          arrow
        >
          <Button type="text" className="flex items-center space-x-2">
            <Avatar icon={<UserOutlined />} size="small" />
            <span>{user?.userName}</span>
          </Button>
        </Dropdown>
      </div>
    </Header>
  );
}
