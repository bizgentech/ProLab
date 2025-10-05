import React, { useState, useEffect } from "react";
import { WorkOrder } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, Download, Plus, MapPin, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusColors = {
  "Pending": "bg-[#64748B] text-white",
  "Assigned": "bg-[#3B82F6] text-white",
  "In Progress": "bg-[#F59E0B] text-white",
  "Completed": "bg-[#10B981] text-white",
  "On Hold": "bg-[#EF4444] text-white"
};

const priorityColors = {
  "Urgent": "bg-[#EF4444] text-white",
  "Normal": "bg-[#3B82F6] text-white",
  "Low": "bg-[#64748B] text-white"
};

export default function WorkOrders() {
  const [workOrders, setWorkOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadWorkOrders();
  }, []);

  const loadWorkOrders = async () => {
    const orders = await WorkOrder.list("-created_date");
    setWorkOrders(orders);
  };

  const filteredOrders = workOrders.filter(wo => {
    const matchesTab = activeTab === "All" || wo.status === activeTab;
    const matchesSearch = wo.wo_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.project_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabs = ["All", "Pending", "Assigned", "In Progress", "Completed"];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B]">Work Orders</h1>
          <p className="text-[#64748B] mt-1">Manage and track all work orders</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="gap-2 bg-[#2563EB] hover:bg-[#1D4ED8]">
            <Plus className="w-4 h-4" />
            New Work Order
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-[#2563EB] text-white'
                : 'bg-white text-[#64748B] hover:bg-[#F1F5F9]'
            }`}
          >
            {tab}
            {tab !== "All" && (
              <span className="ml-2">
                ({workOrders.filter(wo => wo.status === tab).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <Input
                placeholder="Search by WO number, client, or project..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Work Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F8FAFC]">
                  <TableHead className="font-semibold">WO Number</TableHead>
                  <TableHead className="font-semibold">Client</TableHead>
                  <TableHead className="font-semibold">Project</TableHead>
                  <TableHead className="font-semibold">Service Type</TableHead>
                  <TableHead className="font-semibold">Location</TableHead>
                  <TableHead className="font-semibold">Assigned To</TableHead>
                  <TableHead className="font-semibold">Priority</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Created</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <TableCell className="font-medium text-[#2563EB]">
                      {order.wo_number}
                    </TableCell>
                    <TableCell>{order.client_name}</TableCell>
                    <TableCell>{order.project_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-[#F1F5F9]">
                        {order.service_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#64748B]" />
                        <span className="text-sm">{order.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.assigned_to ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-xs">
                            {order.assigned_to.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm">{order.assigned_to}</span>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-[#EF4444]">Unassigned</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityColors[order.priority]}>
                        {order.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status]}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-[#64748B]">
                      {new Date(order.created_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Assign Technician</DropdownMenuItem>
                          <DropdownMenuItem className="text-[#EF4444]">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}