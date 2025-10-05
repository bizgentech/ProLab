import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Employee } from "@/api/entities";
import { useAuth } from "@/contexts/AuthContext";
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
  const [employee, setEmployee] = useState(null);
  const location = useLocation();
  const { user: currentUser, logout } = useAuth();

  React.useEffect(() => {
    if (currentUser) {
      loadEmployee();
    }
  }, [currentUser]);

  const loadEmployee = async () => {
    try {
      const employees = await Employee.filter({ created_by: currentUser.email });
      if (employees && employees.length > 0 && employees[0].position === "Field Technician") {
        setEmployee(employees[0]);
      }
    } catch (error) {
      console.error("Failed to load employee data:", error);
    }
  };

  // If user is a field technician and not already on the FieldTechApp page, redirect
  if (employee && currentPageName !== "FieldTechApp") {
    window.location.href = createPageUrl("FieldTechApp");
    return null;
  }

  const toggleSubmenu = (title) => {
    setExpandedMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const handleLogout = () => {
    logout();
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
                    {currentUser ? currentUser.name.substring(0, 2).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden lg:inline">{currentUser ? currentUser.name : 'User'}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled className="text-xs text-[#64748B]">
                  {currentUser?.email}
                </DropdownMenuItem>
                <DropdownMenuItem disabled className="text-xs text-[#64748B] capitalize">
                  Role: {currentUser?.role?.replace('_', ' ')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-[#EF4444]"
                >
                  Logout
                </DropdownMenuItem>
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