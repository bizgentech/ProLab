import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Users, DollarSign, Bell, FileText, Shield, 
  Settings as SettingsIcon, Plus, Mail, Trash2, Edit
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const tabs = [
  { id: "users", label: "User Management", icon: Users },
  { id: "billing", label: "Billing Rates", icon: DollarSign },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "templates", label: "Templates", icon: FileText },
  { id: "security", label: "Security", icon: Shield },
  { id: "general", label: "General", icon: SettingsIcon }
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("user");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadUsers();
    loadCurrentUser();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await User.list();
      setUsers(allUsers);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadCurrentUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading current user:", error);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail) return;
    
    // In a real app, this would send an invitation email
    alert(`Invitation sent to ${inviteEmail} with role: ${inviteRole}`);
    setShowInviteModal(false);
    setInviteEmail("");
    setInviteRole("user");
  };

  const handleLogout = async () => {
    await User.logout();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1E293B]">Settings</h1>
        <p className="text-[#64748B] mt-1">Configure system settings and preferences</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-[#E2E8F0]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* User Management Tab */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-[#1E293B]">User Management</h2>
              <p className="text-sm text-[#64748B]">Manage user accounts and permissions</p>
            </div>
            <Button 
              onClick={() => setShowInviteModal(true)}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] gap-2"
            >
              <Plus className="w-4 h-4" />
              Invite User
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F8FAFC]">
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Last Active</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-[#F8FAFC]">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white font-semibold">
                            {user.full_name ? user.full_name.split(' ').map(n => n[0]).join('') : 'U'}
                          </div>
                          <div>
                            <p className="font-medium text-[#1E293B]">{user.full_name || 'Unknown'}</p>
                            {currentUser && user.id === currentUser.id && (
                              <Badge variant="outline" className="text-xs">You</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#64748B]">{user.email}</TableCell>
                      <TableCell>
                        <Badge className={
                          user.role === "admin" 
                            ? "bg-[#EF4444] text-white" 
                            : "bg-[#64748B] text-white"
                        }>
                          {user.role || 'user'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-[#10B981] text-white">Active</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-[#64748B]">
                        {new Date(user.created_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {currentUser && user.id !== currentUser.id && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#EF4444]">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Current User Info */}
          {currentUser && (
            <Card>
              <CardHeader>
                <CardTitle>Your Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input value={currentUser.full_name || ''} disabled />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={currentUser.email} disabled />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline">Change Password</Button>
                  <Button 
                    variant="outline" 
                    className="text-[#EF4444] border-[#EF4444]"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Billing Rates Tab */}
      {activeTab === "billing" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#1E293B]">Billing Rates</h2>
            <p className="text-sm text-[#64748B]">Configure service rates and pricing</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Field Testing Rates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Nuclear Density Testing</Label>
                  <div className="flex gap-2">
                    <Input placeholder="125.00" />
                    <span className="flex items-center text-[#64748B]">per test</span>
                  </div>
                </div>
                <div>
                  <Label>Concrete Testing</Label>
                  <div className="flex gap-2">
                    <Input placeholder="85.00" />
                    <span className="flex items-center text-[#64748B]">per test</span>
                  </div>
                </div>
                <div>
                  <Label>Soil Testing</Label>
                  <div className="flex gap-2">
                    <Input placeholder="95.00" />
                    <span className="flex items-center text-[#64748B]">per test</span>
                  </div>
                </div>
                <Button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8]">
                  Save Field Rates
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Laboratory Testing Rates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Gradation Analysis</Label>
                  <div className="flex gap-2">
                    <Input placeholder="75.00" />
                    <span className="flex items-center text-[#64748B]">per test</span>
                  </div>
                </div>
                <div>
                  <Label>Asphalt Content</Label>
                  <div className="flex gap-2">
                    <Input placeholder="120.00" />
                    <span className="flex items-center text-[#64748B]">per test</span>
                  </div>
                </div>
                <div>
                  <Label>Marshall Stability</Label>
                  <div className="flex gap-2">
                    <Input placeholder="150.00" />
                    <span className="flex items-center text-[#64748B]">per test</span>
                  </div>
                </div>
                <Button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8]">
                  Save Lab Rates
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Labor Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Field Technician</Label>
                  <div className="flex gap-2">
                    <Input placeholder="28.50" />
                    <span className="flex items-center text-[#64748B]">/hr</span>
                  </div>
                </div>
                <div>
                  <Label>Lab Technician</Label>
                  <div className="flex gap-2">
                    <Input placeholder="32.00" />
                    <span className="flex items-center text-[#64748B]">/hr</span>
                  </div>
                </div>
                <div>
                  <Label>Engineer</Label>
                  <div className="flex gap-2">
                    <Input placeholder="85.00" />
                    <span className="flex items-center text-[#64748B]">/hr</span>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4 bg-[#2563EB] hover:bg-[#1D4ED8]">
                Save Labor Rates
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#1E293B]">Notification Settings</h2>
            <p className="text-sm text-[#64748B]">Configure email and system notifications</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-[#1E293B]">New Work Orders</p>
                  <p className="text-sm text-[#64748B]">Receive emails when new work orders are created</p>
                </div>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-[#1E293B]">Test Results</p>
                  <p className="text-sm text-[#64748B]">Notifications when test results are available</p>
                </div>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-[#1E293B]">Certification Expiry</p>
                  <p className="text-sm text-[#64748B]">Alerts for expiring employee certifications</p>
                </div>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-[#1E293B]">Invoice Status</p>
                  <p className="text-sm text-[#64748B]">Updates on invoice payments and reminders</p>
                </div>
                <input type="checkbox" className="w-5 h-5" />
              </div>
              <Button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8]">
                Save Notification Preferences
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#1E293B]">Report Templates</h2>
            <p className="text-sm text-[#64748B]">Customize report formats and templates</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Work Order Assignment Email</Label>
                <Textarea 
                  rows={4}
                  placeholder="Hello {technician_name}, You have been assigned work order {wo_number}..."
                />
              </div>
              <div>
                <Label>Test Results Notification</Label>
                <Textarea 
                  rows={4}
                  placeholder="Test results are now available for {project_name}..."
                />
              </div>
              <Button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8]">
                Save Templates
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#1E293B]">Security Settings</h2>
            <p className="text-sm text-[#64748B]">Manage security and access control</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Security Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-[#1E293B]">Two-Factor Authentication</p>
                  <p className="text-sm text-[#64748B]">Require 2FA for admin users</p>
                </div>
                <input type="checkbox" className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-[#1E293B]">Session Timeout</p>
                  <p className="text-sm text-[#64748B]">Auto-logout after inactivity</p>
                </div>
                <select className="border rounded-lg px-3 py-2">
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                  <option>Never</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-[#1E293B]">Password Requirements</p>
                  <p className="text-sm text-[#64748B]">Minimum 8 characters with special characters</p>
                </div>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
              <Button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8]">
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#1E293B]">General Settings</h2>
            <p className="text-sm text-[#64748B]">Company information and preferences</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Company Name</Label>
                <Input defaultValue="CTI - Construction Testing & Inspection, Inc." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone</Label>
                  <Input defaultValue="(305) 555-0100" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input defaultValue="info@ctilabs.com" />
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <Input defaultValue="123 Business Blvd, Miami, FL 33101" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Time Zone</Label>
                  <select className="w-full border rounded-lg px-3 py-2">
                    <option>Eastern Time (ET)</option>
                    <option>Central Time (CT)</option>
                    <option>Mountain Time (MT)</option>
                    <option>Pacific Time (PT)</option>
                  </select>
                </div>
                <div>
                  <Label>Date Format</Label>
                  <select className="w-full border rounded-lg px-3 py-2">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
              <Button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8]">
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Invite User Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="user@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div>
              <Label>Role</Label>
              <select 
                className="w-full border rounded-lg px-3 py-2"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <p className="text-xs text-[#64748B] mt-1">
                Admins have full access to all features. Users have limited access.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleInviteUser}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] gap-2"
            >
              <Mail className="w-4 h-4" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}