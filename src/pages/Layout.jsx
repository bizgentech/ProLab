

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, ClipboardList, Users, UserCog, UserCheck, 
  FlaskConical, Microscope, FileCheck, FolderKanban, Building2,
  BarChart3, Receipt, Settings, Menu, X, Search, Bell, ChevronDown,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Assuming User and Employee models are available globally or imported from a service/model layer
// This is a placeholder for how they might be imported if they exist in a typical project setup
// For the purpose of this exercise, I'll assume they are available or defined here as simple mocks
// If they are actual models, they would likely be imported from e.g., '@/models/User' or '@/services/api'
const User = {
  me: async () => {
    // Mock implementation for fetching current user
    // In a real app, this would call an API
    return { email: "admin@example.com", name: "Admin User" };
    // return { email: "tech@example.com", name: "Tech User" }; // Uncomment to test technician flow
  }
};

const Employee = {
  filter: async ({ created_by }) => {
    // Mock implementation for filtering employees
    // In a real app, this would call an API
    if (created_by === "tech@example.com") {
      return [{ id: 1, position: "Field Technician", created_by: "tech@example.com" }];
    }
    return [];
  }
};


const navigationItems = [
  { title: "Dashboard", url: createPageUrl("Dashboard"), icon: LayoutDashboard },
  { title: "Work Orders", url: createPageUrl("WorkOrders"), icon: ClipboardList, badge: "12" },
  { title: "Field Technicians", url: createPageUrl("FieldTechnicians"), icon: Users, badge: "8" },
  { title: "HR Management", url: createPageUrl("HRManagement"), icon: UserCog, badge: "3" },
  { title: "Inspectors", url: createPageUrl("Inspectors"), icon: UserCheck },
  { 
    title: "Samples", 
    icon: FlaskConical,
    submenu: [
      { title: "Sample Database", url: createPageUrl("Samples") },
      { title: "Sample Collection", url: createPageUrl("SampleCollection") },
      { title: "Chain of Custody", url: createPageUrl("ChainOfCustody") }
    ]
  },
  { 
    title: "Laboratory", 
    icon: Microscope,
    submenu: [
      { title: "Lab Queue", url: createPageUrl("LabQueue") },
      { title: "Testing", url: createPageUrl("Testing") },
      { title: "QC Review", url: createPageUrl("QCReview") }
    ]
  },
  { title: "Engineering Review", url: createPageUrl("EngineeringReview"), icon: FileCheck, badge: "8" },
  { title: "Projects", url: createPageUrl("Projects"), icon: FolderKanban },
  { title: "Clients", url: createPageUrl("Clients"), icon: Building2 },
  { title: "Reports & Analytics", url: createPageUrl("Reports"), icon: BarChart3 },
  { title: "Invoicing", url: createPageUrl("Invoicing"), icon: Receipt },
  { title: "Settings", url: createPageUrl("Settings"), icon: Settings }
];

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [employee, setEmployee] = useState(null);
  const location = useLocation();

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      // Check if user is a field technician
      const employees = await Employee.filter({ created_by: user.email });
      if (employees && employees.length > 0 && employees[0].position === "Field Technician") {
        setEmployee(employees[0]);
      }
    } catch (error) {
      // User not logged in or API call failed
      console.error("Failed to load user or employee data:", error);
    }
  };

  // If user is a field technician and not already on the FieldTechApp page, redirect
  if (employee && currentPageName !== "FieldTechApp") {
    // window.location.href = createPageUrl("FieldTechApp"); // This would cause a full page reload
    // For a React app, consider using navigate from react-router-dom for better UX
    // However, the outline specifically says `window.location.href`, so adhering to that.
    window.location.href = createPageUrl("FieldTechApp");
    return null; // Don't render anything while redirecting
  }

  const toggleSubmenu = (title) => {
    setExpandedMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 h-[70px] bg-white border-b border-[#E2E8F0] z-50">
        <div className="flex items-center justify-between h-full px-6">
          {/* Left: Logo & Menu Toggle */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <Link to={createPageUrl("Dashboard")} className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68caae368af6d6c0361ce882/9d05683e4_CTI-Logo-300x70.jpg" 
                alt="CTI Labs" 
                className="h-8"
              />
            </Link>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <Input
                placeholder="Search work orders, samples, projects..."
                className="pl-10 bg-[#F8FAFC] border-[#E2E8F0]"
              />
            </div>
          </div>

          {/* Right: Notifications & Profile */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-[#EF4444] text-white text-xs">
                5
              </Badge>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-medium">
                    {currentUser ? currentUser.name.substring(0, 2).toUpperCase() : 'AD'}
                  </div>
                  <span className="hidden lg:inline">{currentUser ? currentUser.name : 'Admin User'}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-[70px] bottom-0 w-[240px] bg-white border-r border-[#E2E8F0] transition-transform duration-300 z-40 overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <nav className="p-2">
          {navigationItems.map((item) => (
            <div key={item.title}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-[#1E293B] hover:bg-[#F1F5F9] transition-colors mb-1"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium text-sm">{item.title}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${expandedMenus[item.title] ? 'rotate-90' : ''}`} />
                  </button>
                  {expandedMenus[item.title] && (
                    <div className="ml-7 space-y-1 mb-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.title}
                          to={subitem.url}
                          className="block px-3 py-2 rounded-lg text-sm text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#2563EB] transition-colors"
                        >
                          {subitem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.url}
                  className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors mb-1 ${
                    location.pathname === item.url
                      ? 'bg-[#2563EB] text-white'
                      : 'text-[#1E293B] hover:bg-[#F1F5F9]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{item.title}</span>
                  </div>
                  {item.badge && (
                    <Badge className={location.pathname === item.url ? 'bg-white text-[#2563EB]' : 'bg-[#EF4444] text-white'}>
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`pt-[70px] transition-all duration-300 ${sidebarOpen ? 'lg:pl-[240px]' : ''}`}>
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

