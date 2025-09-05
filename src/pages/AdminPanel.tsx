/** @format */

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Shield,
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
  UserCog,
} from "lucide-react";

export const AdminPanel = () => {
  const { user } = useAuth();
  const [stats] = useState({
    totalUsers: 1234,
    totalAds: 5678,
    activeUsers: 892,
    pendingAds: 23,
  });

  return (
    <div className="min-h-screen bg-gradient-surface p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.name}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Ads</p>
                    <p className="text-2xl font-bold">{stats.totalAds}</p>
                  </div>
                  <ShoppingBag className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold">{stats.activeUsers}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Ads</p>
                    <p className="text-2xl font-bold">{stats.pendingAds}</p>
                  </div>
                  <Settings className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="ads">Ads</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCog className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage users, view details, and modify permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Input
                    placeholder="Search users..."
                    className="max-w-sm glass-button"
                  />
                  <Button>Add User</Button>
                </div>
                
                <div className="rounded-md border glass-card">
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">
                      User management functionality will be implemented here.
                      This includes user listing, role management, and user details.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ads" className="mt-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Ad Management
                </CardTitle>
                <CardDescription>
                  Review, approve, and manage advertisements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Input
                    placeholder="Search ads..."
                    className="max-w-sm glass-button"
                  />
                  <div className="flex gap-2">
                    <Button variant="outline">Pending ({stats.pendingAds})</Button>
                    <Button variant="outline">All Ads</Button>
                  </div>
                </div>
                
                <div className="rounded-md border glass-card">
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">
                      Ad management functionality will be implemented here.
                      This includes ad approval, moderation, and listing management.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analytics & Reports
                </CardTitle>
                <CardDescription>
                  View platform statistics and generate reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border glass-card">
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">
                      Analytics dashboard will be implemented here.
                      This includes charts, graphs, and detailed reports.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Settings
                </CardTitle>
                <CardDescription>
                  Configure platform settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="site-name">Site Name</Label>
                    <Input
                      id="site-name"
                      defaultValue="OLX Clone"
                      className="glass-button"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="admin@olxclone.com"
                      className="glass-button"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <Button variant="outline">Reset to Defaults</Button>
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};