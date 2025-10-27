"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Navigation from "../components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  ShoppingCart,
  Eye,
  Edit,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import API from "../services/api";

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
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
              <p className="text-muted-foreground">Welcome to your personal dashboard</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
                  <User className="h-4 w-4 text-chart-1" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chart-1">Complete</div>
                  <div className="mt-4">
                    <Link href="/profile">
                      <Button className="w-full" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Manage Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Products</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-chart-2" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chart-2">{products}</div>
                  <div className="mt-4">
                    <Link href="/products">
                      <Button className="w-full" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View Products
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Account Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chart-3">Standard</div>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Last Login</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chart-4">Today</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/profile" className="block">
                    <Button
                      size="lg"
                      className="w-full"
                      variant="outline"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Update Profile Information
                    </Button>
                  </Link>
                  <Link href="/products" className="block">
                    <Button
                      size="lg"
                      className="w-full"
                      variant="outline"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Manage Products
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-semibold">Account Created</p>
                      <p className="text-sm text-muted-foreground">Welcome to the platform!</p>
                    </div>
                    <Badge variant="secondary">Today</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-semibold">Profile Setup</p>
                      <p className="text-sm text-muted-foreground">
                        Complete your profile information
                      </p>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
