"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Navigation from "../components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showToast } from "@/lib/toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import API from "../services/api";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  userName: string;
}

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userName: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        userName: user.userName || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await API.put(`/user/${user.id}`, formData);
      showToast.success("Profile updated successfully!");
      window.location.reload(); // Simple refresh for now
    } catch (error: any) {
      showToast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="p-6 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground">User Profile</h2>
              <p className="text-muted-foreground">Manage your account information</p>
            </div>

            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onFinish} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-enhanced"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-enhanced"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userName">Username</Label>
                    <Input
                      id="userName"
                      name="userName"
                      placeholder="Enter your username"
                      value={formData.userName}
                      onChange={handleInputChange}
                      className="input-enhanced"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="card-enhanced mt-6">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-semibold">User ID</p>
                    <p className="text-sm text-muted-foreground">
                      Unique identifier for your account
                    </p>
                  </div>
                  <code className="text-sm bg-muted px-2 py-1 rounded">{user.id}</code>
                </div>

                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-semibold">Account Status</p>
                    <p className="text-sm text-muted-foreground">Current status of your account</p>
                  </div>
                  <span className="text-chart-1 font-medium">Active</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-semibold">Member Since</p>
                    <p className="text-sm text-muted-foreground">When you joined the platform</p>
                  </div>
                  <span>Today</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
