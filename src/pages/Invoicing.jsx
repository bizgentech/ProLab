import React, { useState, useEffect } from "react";
import { WorkOrder } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Receipt, Search, Plus, Download, DollarSign,
  Clock, CheckCircle, AlertCircle, Send
} from "lucide-react";

export default function Invoicing() {
  const [workOrders, setWorkOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const orders = await WorkOrder.list("-created_date");
    setWorkOrders(orders);
  };

  // Generate invoice data from work orders
  const invoices = workOrders.map((wo, idx) => {
    const statuses = ["Draft", "Sent", "Paid", "Overdue"];
    const status = wo.status === "Completed" ? "Paid" : statuses[idx % 4];
    const amount = Math.round(Math.random() * 3000) + 500;
    const invoiceDate = new Date(wo.created_date);
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + 30);

    return {
      id: `INV-${String(1000 + idx).padStart(4, '0')}`,
      client: wo.client_name,
      project: wo.project_name,
      invoiceDate: invoiceDate.toLocaleDateString(),
      dueDate: dueDate.toLocaleDateString(),
      amount,
      status,
      workOrder: wo.wo_number
    };
  });

  const filteredInvoices = invoices.filter(inv => {
    const matchesTab = 
      activeTab === "all" ||
      inv.status.toLowerCase() === activeTab;
    
    const matchesSearch = 
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.project.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const stats = {
    draft: invoices.filter(i => i.status === "Draft").length,
    sent: invoices.filter(i => i.status === "Sent").length,
    paid: invoices.filter(i => i.status === "Paid").length,
    overdue: invoices.filter(i => i.status === "Overdue").length,
    totalOutstanding: invoices
      .filter(i => i.status !== "Paid")
      .reduce((sum, i) => sum + i.amount, 0),
    paidThisMonth: invoices
      .filter(i => i.status === "Paid")
      .reduce((sum, i) => sum + i.amount, 0),
    overdueAmount: invoices
      .filter(i => i.status === "Overdue")
      .reduce((sum, i) => sum + i.amount, 0)
  };

  const statusConfig = {
    "Draft": { color: "bg-gray-500 text-white", icon: Clock },
    "Sent": { color: "bg-blue-500 text-white", icon: Send },
    "Paid": { color: "bg-green-500 text-white", icon: CheckCircle },
    "Overdue": { color: "bg-red-500 text-white", icon: AlertCircle }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B]">Invoicing</h1>
          <p className="text-[#64748B] mt-1">Manage invoices and payments</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="gap-2 bg-[#2563EB] hover:bg-[#1D4ED8]">
            <Plus className="w-4 h-4" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Total Outstanding</p>
                <p className="text-3xl font-bold text-[#F59E0B] mt-1">
                  ${stats.totalOutstanding.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#F59E0B] bg-opacity-10">
                <DollarSign className="w-6 h-6 text-[#F59E0B]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Paid This Month</p>
                <p className="text-3xl font-bold text-[#10B981] mt-1">
                  ${stats.paidThisMonth.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#10B981] bg-opacity-10">
                <CheckCircle className="w-6 h-6 text-[#10B981]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Overdue</p>
                <p className="text-3xl font-bold text-[#EF4444] mt-1">
                  ${stats.overdueAmount.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#EF4444] bg-opacity-10">
                <AlertCircle className="w-6 h-6 text-[#EF4444]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Avg Collection</p>
                <p className="text-3xl font-bold text-[#1E293B] mt-1">28 days</p>
              </div>
              <div className="p-3 rounded-lg bg-[#2563EB] bg-opacity-10">
                <Clock className="w-6 h-6 text-[#2563EB]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {[
          { id: "all", label: "All", count: invoices.length },
          { id: "draft", label: "Draft", count: stats.draft },
          { id: "sent", label: "Sent", count: stats.sent },
          { id: "paid", label: "Paid", count: stats.paid },
          { id: "overdue", label: "Overdue", count: stats.overdue }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-[#2563EB] text-white'
                : 'bg-white text-[#64748B] hover:bg-[#F1F5F9] border border-[#E2E8F0]'
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
          placeholder="Search by invoice #, client, project..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Invoices Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F8FAFC]">
                  <TableHead className="font-semibold">Invoice #</TableHead>
                  <TableHead className="font-semibold">Client</TableHead>
                  <TableHead className="font-semibold">Project</TableHead>
                  <TableHead className="font-semibold">Invoice Date</TableHead>
                  <TableHead className="font-semibold">Due Date</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-[#64748B]">
                      No invoices found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice) => {
                    const StatusIcon = statusConfig[invoice.status].icon;
                    
                    return (
                      <TableRow key={invoice.id} className="hover:bg-[#F8FAFC]">
                        <TableCell className="font-medium text-[#2563EB]">
                          {invoice.id}
                        </TableCell>
                        <TableCell>{invoice.client}</TableCell>
                        <TableCell>{invoice.project}</TableCell>
                        <TableCell className="text-sm text-[#64748B]">
                          {invoice.invoiceDate}
                        </TableCell>
                        <TableCell className="text-sm text-[#64748B]">
                          {invoice.dueDate}
                        </TableCell>
                        <TableCell className="font-semibold">
                          ${invoice.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConfig[invoice.status].color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            {invoice.status !== "Paid" && (
                              <Button size="sm" className="bg-[#2563EB] hover:bg-[#1D4ED8]">
                                Send
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}