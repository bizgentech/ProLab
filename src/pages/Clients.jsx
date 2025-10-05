import React, { useState, useEffect } from "react";
import { WorkOrder } from "@/api/entities";
import { Sample } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Building2, Search, Plus, Mail, Phone, MapPin,
  TrendingUp, DollarSign, FileText
} from "lucide-react";

export default function Clients() {
  const [workOrders, setWorkOrders] = useState([]);
  const [samples, setSamples] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const orders = await WorkOrder.list("-created_date");
    const allSamples = await Sample.list();
    setWorkOrders(orders);
    setSamples(allSamples);
  };

  // Group by client
  const clientsMap = {};
  workOrders.forEach(wo => {
    const clientName = wo.client_name || "Unknown Client";
    if (!clientsMap[clientName]) {
      clientsMap[clientName] = {
        name: clientName,
        workOrders: [],
        projects: new Set()
      };
    }
    clientsMap[clientName].workOrders.push(wo);
    if (wo.project_name) {
      clientsMap[clientName].projects.add(wo.project_name);
    }
  });

  const clients = Object.values(clientsMap).map(client => ({
    ...client,
    projectCount: client.projects.size
  }));

  const getClientStats = (client) => {
    const clientSamples = samples.filter(s =>
      client.workOrders.some(wo => wo.wo_number === s.wo_number)
    );
    const activeWOs = client.workOrders.filter(wo => wo.status !== "Completed").length;
    const revenue = client.workOrders.length * 850;

    return {
      activeWOs,
      totalSamples: clientSamples.length,
      revenue
    };
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B]">Clients</h1>
          <p className="text-[#64748B] mt-1">Manage client relationships and projects</p>
        </div>
        <Button className="gap-2 bg-[#2563EB] hover:bg-[#1D4ED8]">
          <Plus className="w-4 h-4" />
          Add Client
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Total Clients</p>
                <p className="text-3xl font-bold text-[#1E293B] mt-1">{clients.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#2563EB] bg-opacity-10">
                <Building2 className="w-6 h-6 text-[#2563EB]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Active Projects</p>
                <p className="text-3xl font-bold text-[#10B981] mt-1">
                  {clients.reduce((sum, c) => sum + c.projectCount, 0)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#10B981] bg-opacity-10">
                <TrendingUp className="w-6 h-6 text-[#10B981]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Total Revenue</p>
                <p className="text-3xl font-bold text-[#1E293B] mt-1">
                  ${(workOrders.length * 850).toLocaleString()}
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
                <p className="text-sm text-[#64748B]">Avg per Client</p>
                <p className="text-3xl font-bold text-[#1E293B] mt-1">
                  ${clients.length > 0 ? Math.round((workOrders.length * 850) / clients.length).toLocaleString() : 0}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#2563EB] bg-opacity-10">
                <DollarSign className="w-6 h-6 text-[#2563EB]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
        <Input
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client, idx) => {
          const stats = getClientStats(client);

          return (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white font-bold text-xl">
                    {client.name.substring(0, 1)}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{client.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {stats.activeWOs} Active WOs
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-[#64748B]">
                    <Mail className="w-4 h-4" />
                    <span>contact@{client.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#64748B]">
                    <Phone className="w-4 h-4" />
                    <span>(305) 555-{String(idx).padStart(4, '0')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E2E8F0]">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#2563EB]">{client.projectCount}</p>
                    <p className="text-xs text-[#64748B]">Projects</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#10B981]">{stats.totalSamples}</p>
                    <p className="text-xs text-[#64748B]">Samples</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#F59E0B]">${Math.round(stats.revenue/1000)}k</p>
                    <p className="text-xs text-[#64748B]">Revenue</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Portal
                  </Button>
                  <Button size="sm" className="bg-[#2563EB] hover:bg-[#1D4ED8]">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}