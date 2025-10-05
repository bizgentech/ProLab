import React, { useState, useEffect } from "react";
import { WorkOrder } from "@/api/entities";
import { Sample } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FolderKanban, Search, Plus, MapPin, TrendingUp, 
  CheckCircle, XCircle, Clock, DollarSign 
} from "lucide-react";

export default function Projects() {
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

  // Group work orders by project
  const projectsMap = {};
  workOrders.forEach(wo => {
    const projectName = wo.project_name || "Unnamed Project";
    if (!projectsMap[projectName]) {
      projectsMap[projectName] = {
        name: projectName,
        client: wo.client_name,
        workOrders: [],
        location: wo.location
      };
    }
    projectsMap[projectName].workOrders.push(wo);
  });

  const projects = Object.values(projectsMap);

  const getProjectStats = (project) => {
    const projectSamples = samples.filter(s => 
      project.workOrders.some(wo => wo.wo_number === s.wo_number)
    );
    const passedSamples = projectSamples.filter(s => s.test_results === "Pass").length;
    const totalSamples = projectSamples.length;
    const passRate = totalSamples > 0 ? Math.round((passedSamples / totalSamples) * 100) : 0;

    const completedWOs = project.workOrders.filter(wo => wo.status === "Completed").length;
    const totalWOs = project.workOrders.length;

    return {
      totalSamples,
      passRate,
      completedWOs,
      totalWOs,
      progress: totalWOs > 0 ? Math.round((completedWOs / totalWOs) * 100) : 0
    };
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B]">Projects</h1>
          <p className="text-[#64748B] mt-1">Manage all active and completed projects</p>
        </div>
        <Button className="gap-2 bg-[#2563EB] hover:bg-[#1D4ED8]">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Total Projects</p>
                <p className="text-3xl font-bold text-[#1E293B] mt-1">{projects.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#2563EB] bg-opacity-10">
                <FolderKanban className="w-6 h-6 text-[#2563EB]" />
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
                  {projects.filter(p => p.workOrders.some(wo => wo.status !== "Completed")).length}
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
                <p className="text-sm text-[#64748B]">Total Samples</p>
                <p className="text-3xl font-bold text-[#1E293B] mt-1">{samples.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#F59E0B] bg-opacity-10">
                <CheckCircle className="w-6 h-6 text-[#F59E0B]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Avg Pass Rate</p>
                <p className="text-3xl font-bold text-[#1E293B] mt-1">94%</p>
              </div>
              <div className="p-3 rounded-lg bg-[#10B981] bg-opacity-10">
                <CheckCircle className="w-6 h-6 text-[#10B981]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
        <Input
          placeholder="Search projects by name or client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, idx) => {
          const stats = getProjectStats(project);
          const isActive = project.workOrders.some(wo => wo.status !== "Completed");

          return (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{project.name}</CardTitle>
                    <p className="text-sm text-[#64748B]">{project.client}</p>
                  </div>
                  <Badge className={isActive ? "bg-[#10B981] text-white" : "bg-[#64748B] text-white"}>
                    {isActive ? "Active" : "Completed"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-[#64748B]">
                  <MapPin className="w-4 h-4" />
                  <span>{project.location || "Location not specified"}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#64748B]">Progress</span>
                    <span className="font-medium">{stats.progress}%</span>
                  </div>
                  <div className="w-full bg-[#E2E8F0] rounded-full h-2">
                    <div 
                      className="bg-[#2563EB] h-2 rounded-full transition-all"
                      style={{ width: `${stats.progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#E2E8F0]">
                  <div>
                    <p className="text-xs text-[#64748B]">Work Orders</p>
                    <p className="text-lg font-bold text-[#1E293B]">
                      {stats.completedWOs}/{stats.totalWOs}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B]">Pass Rate</p>
                    <p className="text-lg font-bold text-[#10B981]">{stats.passRate}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#64748B]">Total Samples</p>
                    <p className="text-lg font-bold text-[#1E293B]">{stats.totalSamples}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B]">Value</p>
                    <p className="text-lg font-bold text-[#1E293B]">
                      ${(stats.totalWOs * 850).toLocaleString()}
                    </p>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FolderKanban className="w-16 h-16 mx-auto mb-4 text-[#64748B] opacity-50" />
            <h3 className="text-xl font-semibold text-[#1E293B] mb-2">No Projects Found</h3>
            <p className="text-[#64748B] mb-4">
              {searchTerm ? "Try a different search term" : "Create your first project to get started"}
            </p>
            <Button className="bg-[#2563EB] hover:bg-[#1D4ED8]">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}