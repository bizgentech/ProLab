
import React, { useState, useEffect } from "react";
import { Employee } from "@/api/entities";
import { WorkOrder } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, MessageCircle, Clock, Search, Download, Plus, LayoutGrid, User } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const statusColors = {
  "On Shift": "bg-[#10B981]",
  "Off Duty": "bg-[#EF4444]",
  "Break": "bg-[#F59E0B]",
  "Available": "bg-[#3B82F6]"
};

export default function FieldTechnicians() {
  const [technicians, setTechnicians] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list"); // list or individual

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const employees = await Employee.filter({ position: "Field Technician" });
    const orders = await WorkOrder.list();
    setTechnicians(employees);
    setWorkOrders(orders);
  };

  const filteredTechs = technicians.filter(tech => {
    const matchesTab = activeTab === "All" || tech.current_status === activeTab;
    const matchesSearch = tech.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabs = [
    { label: "All", count: technicians.length },
    { label: "On Shift", count: technicians.filter(t => t.current_status === "On Shift").length },
    { label: "Available", count: technicians.filter(t => t.current_status === "Available").length },
    { label: "Off Duty", count: technicians.filter(t => t.current_status === "Off Duty").length }
  ];

  const getTechWorkOrders = (techName) => {
    return workOrders.filter(wo => wo.assigned_to === techName);
  };

  const getTodayStats = (techName) => {
    const techOrders = getTechWorkOrders(techName);
    return {
      samples: Math.floor(Math.random() * 15) + 5,
      tests: Math.floor(Math.random() * 20) + 8,
      hours: techOrders.length > 0 ? "6.5" : "0"
    };
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B]">Field Technicians</h1>
          <p className="text-[#64748B] mt-1">Real-time tracking and management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Timesheet
          </Button>
          <Button className="gap-2 bg-[#2563EB] hover:bg-[#1D4ED8]">
            <Plus className="w-4 h-4" />
            Add Technician
          </Button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 p-1 bg-[#F1F5F9] rounded-lg w-fit">
        <button
          onClick={() => setViewMode("list")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
            viewMode === "list"
              ? 'bg-white text-[#2563EB] shadow-sm'
              : 'text-[#64748B] hover:text-[#1E293B]'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          List View
        </button>
        <button
          onClick={() => setViewMode("individual")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
            viewMode === "individual"
              ? 'bg-white text-[#2563EB] shadow-sm'
              : 'text-[#64748B] hover:text-[#1E293B]'
          }`}
        >
          <User className="w-4 h-4" />
          Individual Dashboard
        </button>
      </div>

      {viewMode === "list" && (
        <>
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.label
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-white text-[#64748B] hover:bg-[#F1F5F9]'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <Input
              placeholder="Search by name, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Technician Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTechs.map((tech) => {
              const stats = getTodayStats(tech.full_name);
              const assignment = getTechWorkOrders(tech.full_name)[0];
              
              return (
                <Card key={tech.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white font-semibold text-lg">
                            {tech.full_name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${statusColors[tech.current_status]}`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-[#1E293B]">{tech.full_name}</h3>
                          <p className="text-sm text-[#64748B]">{tech.employee_id}</p>
                        </div>
                      </div>
                      <Badge className={`${statusColors[tech.current_status]} text-white`}>
                        {tech.current_status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#64748B]">Current Assignment:</span>
                        <span className="font-medium text-[#1E293B]">
                          {assignment ? assignment.wo_number : "No Assignment"}
                        </span>
                      </div>
                      {assignment && (
                        <div className="text-sm text-[#64748B] pl-4">
                          {assignment.project_name}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-[#64748B]" />
                        <span className="text-[#64748B]">{tech.current_location || "Location unavailable"}</span>
                      </div>
                      {tech.current_status === "On Shift" && tech.clock_in_time && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-[#64748B]" />
                          <span className="text-[#64748B]">
                            Clocked in at {tech.clock_in_time} ({stats.hours} hrs)
                          </span>
                        </div>
                      )}
                    </div>

                    {tech.current_status === "On Shift" && (
                      <div className="bg-[#F8FAFC] rounded-lg p-3 space-y-2">
                        <p className="text-xs font-medium text-[#64748B] uppercase">Today's Activity</p>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-2xl font-bold text-[#2563EB]">{stats.samples}</p>
                            <p className="text-xs text-[#64748B]">Samples</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-[#10B981]">{stats.tests}</p>
                            <p className="text-xs text-[#64748B]">Tests</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-[#F59E0B]">{stats.hours}</p>
                            <p className="text-xs text-[#64748B]">Hours</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Link to={createPageUrl("FieldTechApp")} className="flex-1">
                        <Button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8]">
                          View Dashboard
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-2">
                        <MapPin className="w-4 h-4" />
                        Track
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Live Map Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#2563EB]" />
                Live Technician Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-[#F8FAFC] rounded-lg h-[400px] flex items-center justify-center">
                <div className="text-center text-[#64748B]">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="font-medium">Map View</p>
                  <p className="text-sm">Real-time technician locations would be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Bar */}
          <div className="bg-white rounded-lg p-4 border border-[#E2E8F0]">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-[#64748B]">
                  <strong className="text-[#1E293B]">{technicians.filter(t => t.current_status === "On Shift").length}</strong> techs on shift
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#2563EB]" />
                <span className="text-[#64748B]">
                  <strong className="text-[#1E293B]">42</strong> samples collected today
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span className="text-[#64748B]">
                  <strong className="text-[#1E293B]">15</strong> active work orders
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {viewMode === "individual" && (
        <Card>
          <CardContent className="p-16 text-center">
            <User className="w-20 h-20 mx-auto mb-6 text-[#64748B] opacity-50" />
            <h3 className="text-2xl font-semibold text-[#1E293B] mb-3">Select a Technician</h3>
            <p className="text-[#64748B] max-w-md mx-auto mb-6">
              Click "View Dashboard" on any technician card above to see their individual dashboard
            </p>
            <Button onClick={() => setViewMode("list")} className="bg-[#2563EB] hover:bg-[#1D4ED8]">
              Back to List View
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
