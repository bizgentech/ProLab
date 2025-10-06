import React, { useState, useEffect } from "react";
import { Project, Client, WorkOrder, Sample } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FolderKanban,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectWorkOrders, setProjectWorkOrders] = useState([]);
  const [projectSamples, setProjectSamples] = useState([]);

  const [projectForm, setProjectForm] = useState({
    project_name: "",
    client_id: "",
    client_name: "",
    location: "",
    address: "",
    city: "",
    state: "FL",
    zip_code: "",
    contract_value: "",
    start_date: "",
    end_date: "",
    status: "Active",
    description: "",
    specifications: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = projects.filter((project) => {
        const searchLower = searchTerm.toLowerCase();
        const projectName = String(project.project_name || '').toLowerCase();
        const clientName = String(project.client_name || '').toLowerCase();
        const location = String(project.location || '').toLowerCase();
        
        return projectName.includes(searchLower) ||
               clientName.includes(searchLower) ||
               location.includes(searchLower);
      });
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects);
    }
  }, [searchTerm, projects]);

  const loadData = async () => {
    try {
      const [projectsData, clientsData] = await Promise.all([
        Project.list(),
        Client.list()
      ]);
      setProjects(projectsData || []);
      setFilteredProjects(projectsData || []);
      setClients(clientsData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setProjectForm({
      project_name: "",
      client_id: "",
      client_name: "",
      location: "",
      address: "",
      city: "",
      state: "FL",
      zip_code: "",
      contract_value: "",
      start_date: "",
      end_date: "",
      status: "Active",
      description: "",
      specifications: "",
    });
    setShowProjectModal(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectForm({
      project_name: project.project_name || "",
      client_id: project.client_id || "",
      client_name: project.client_name || "",
      location: project.location || "",
      address: project.address || "",
      city: project.city || "",
      state: project.state || "FL",
      zip_code: project.zip_code || "",
      contract_value: project.contract_value || "",
      start_date: project.start_date || "",
      end_date: project.end_date || "",
      status: project.status || "Active",
      description: project.description || "",
      specifications: project.specifications || "",
    });
    setShowProjectModal(true);
  };

  const handleSaveProject = async () => {
    try {
      if (editingProject) {
        await Project.update(editingProject.id, projectForm);
      } else {
        await Project.create(projectForm);
      }
      setShowProjectModal(false);
      loadData();
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await Project.delete(projectId);
        loadData();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const handleClientChange = (clientId) => {
    const client = clients.find(c => c.id === parseInt(clientId));
    if (client) {
      setProjectForm({
        ...projectForm,
        client_id: clientId,
        client_name: client.company_name
      });
    }
  };

  const handleViewDetails = async (project) => {
    setSelectedProject(project);
    
    try {
      const workOrders = await WorkOrder.filter({ project_name: project.project_name });
      const allSamples = await Sample.list();
      const samples = allSamples.filter(s => 
        workOrders.some(wo => wo.wo_number === s.wo_number)
      );
      
      setProjectWorkOrders(workOrders || []);
      setProjectSamples(samples || []);
    } catch (error) {
      console.error("Error loading project details:", error);
      setProjectWorkOrders([]);
      setProjectSamples([]);
    }
    
    setShowDetailsModal(true);
  };

  const calculateProgress = (project) => {
    const workOrders = projectWorkOrders.filter(wo => 
      wo.project_name === project.project_name
    );
    if (workOrders.length === 0) return 0;
    
    const completed = workOrders.filter(wo => wo.status === "Completed").length;
    return Math.round((completed / workOrders.length) * 100);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-[#10B981] text-white";
      case "Completed":
        return "bg-[#3B82F6] text-white";
      case "On Hold":
        return "bg-[#F59E0B] text-white";
      default:
        return "bg-[#64748B] text-white";
    }
  };

  const formatCurrency = (value) => {
    if (!value) return "$0";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B]">Projects</h1>
          <p className="text-[#64748B] mt-1">Manage project information and progress</p>
        </div>
        <Button
          onClick={handleCreateProject}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Total Projects</p>
                <p className="text-2xl font-bold text-[#1E293B]">{projects.length}</p>
              </div>
              <FolderKanban className="w-8 h-8 text-[#2563EB]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Active</p>
                <p className="text-2xl font-bold text-[#10B981]">
                  {projects.filter((p) => p.status === "Active").length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#10B981]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Completed</p>
                <p className="text-2xl font-bold text-[#3B82F6]">
                  {projects.filter((p) => p.status === "Completed").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-[#3B82F6]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Total Value</p>
                <p className="text-2xl font-bold text-[#1E293B]">
                  {formatCurrency(projects.reduce((sum, p) => sum + (parseFloat(p.contract_value) || 0), 0))}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-[#10B981]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <Input
              placeholder="Search projects by name, client, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Project Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-[#64748B]">
                    No projects found. Click "Add Project" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-[#1E293B]">{project.project_name}</p>
                        <p className="text-sm text-[#64748B]">{project.location}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{project.client_name}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-[#64748B]">
                        <MapPin className="w-3 h-3" />
                        {project.city}, {project.state}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="text-[#64748B]">
                          {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'}
                        </p>
                        {project.end_date && (
                          <p className="text-[#64748B]">
                            to {new Date(project.end_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{formatCurrency(project.contract_value)}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(project)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProject(project)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-[#EF4444] hover:text-[#DC2626]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Project Modal */}
      <Dialog open={showProjectModal} onOpenChange={setShowProjectModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Project" : "Add New Project"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Project Name *</Label>
                <Input
                  value={projectForm.project_name}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, project_name: e.target.value })
                  }
                  placeholder="I-95 Expansion Project"
                />
              </div>
              <div className="space-y-2">
                <Label>Client *</Label>
                <Select
                  value={projectForm.client_id}
                  onValueChange={handleClientChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={String(client.id)}>
                        {client.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location Description</Label>
              <Input
                value={projectForm.location}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, location: e.target.value })
                }
                placeholder="I-95 between Mile Marker 10-15"
              />
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={projectForm.address}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, address: e.target.value })
                }
                placeholder="Street address"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={projectForm.city}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, city: e.target.value })
                  }
                  placeholder="Miami"
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={projectForm.state}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, state: e.target.value })
                  }
                  placeholder="FL"
                />
              </div>
              <div className="space-y-2">
                <Label>ZIP Code</Label>
                <Input
                  value={projectForm.zip_code}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, zip_code: e.target.value })
                  }
                  placeholder="33101"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={projectForm.start_date}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, start_date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={projectForm.end_date}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, end_date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Contract Value</Label>
                <Input
                  type="number"
                  value={projectForm.contract_value}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, contract_value: e.target.value })
                  }
                  placeholder="50000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={projectForm.status}
                onValueChange={(value) =>
                  setProjectForm({ ...projectForm, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={projectForm.description}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, description: e.target.value })
                }
                placeholder="Project description and scope..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Specifications</Label>
              <Textarea
                value={projectForm.specifications}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, specifications: e.target.value })
                }
                placeholder="Technical specifications, standards, requirements..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowProjectModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProject}
                className="bg-[#2563EB] hover:bg-[#1D4ED8]"
              >
                {editingProject ? "Update Project" : "Create Project"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Project Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-6">
              {/* Project Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#64748B]">Project Name</p>
                      <p className="font-medium">{selectedProject.project_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#64748B]">Status</p>
                      <Badge className={getStatusColor(selectedProject.status)}>
                        {selectedProject.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#64748B]">Client</p>
                      <p className="font-medium">{selectedProject.client_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#64748B]">Contract Value</p>
                      <p className="font-medium">{formatCurrency(selectedProject.contract_value)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#64748B]">Start Date</p>
                      <p className="font-medium">
                        {selectedProject.start_date ? new Date(selectedProject.start_date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#64748B]">End Date</p>
                      <p className="font-medium">
                        {selectedProject.end_date ? new Date(selectedProject.end_date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B]">Location</p>
                    <p className="font-medium">{selectedProject.location}</p>
                    <p className="text-sm text-[#64748B]">
                      {selectedProject.address && `${selectedProject.address}, `}
                      {selectedProject.city}, {selectedProject.state} {selectedProject.zip_code}
                    </p>
                  </div>
                  {selectedProject.description && (
                    <div>
                      <p className="text-sm text-[#64748B]">Description</p>
                      <p className="font-medium">{selectedProject.description}</p>
                    </div>
                  )}
                  {selectedProject.specifications && (
                    <div>
                      <p className="text-sm text-[#64748B]">Specifications</p>
                      <p className="font-medium">{selectedProject.specifications}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Progress Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-[#64748B]">Work Orders</p>
                    <p className="text-2xl font-bold text-[#1E293B]">{projectWorkOrders.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-[#64748B]">Samples Collected</p>
                    <p className="text-2xl font-bold text-[#1E293B]">{projectSamples.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-[#64748B]">Pass Rate</p>
                    <p className="text-2xl font-bold text-[#10B981]">
                      {projectSamples.length > 0
                        ? Math.round((projectSamples.filter(s => s.test_results === "Pass").length / projectSamples.length) * 100)
                        : 0}%
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Work Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Work Orders ({projectWorkOrders.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {projectWorkOrders.length === 0 ? (
                    <p className="text-[#64748B] text-sm">No work orders yet</p>
                  ) : (
                    <div className="space-y-2">
                      {projectWorkOrders.map((wo) => (
                        <div
                          key={wo.id}
                          className="p-3 border border-[#E2E8F0] rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium text-[#2563EB]">{wo.wo_number}</p>
                            <p className="text-sm text-[#64748B]">{wo.service_type}</p>
                            <p className="text-xs text-[#64748B]">{wo.location}</p>
                          </div>
                          <Badge>{wo.status}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Samples */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Samples ({projectSamples.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {projectSamples.length === 0 ? (
                    <p className="text-[#64748B] text-sm">No samples yet</p>
                  ) : (
                    <div className="space-y-2">
                      {projectSamples.slice(0, 5).map((sample) => (
                        <div
                          key={sample.id}
                          className="p-3 border border-[#E2E8F0] rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium text-[#2563EB]">{sample.sample_id}</p>
                            <p className="text-sm text-[#64748B]">{sample.sample_type} - {sample.location}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge>{sample.status}</Badge>
                            {sample.test_results === "Pass" && (
                              <CheckCircle className="w-4 h-4 text-[#10B981]" />
                            )}
                            {sample.test_results === "Fail" && (
                              <XCircle className="w-4 h-4 text-[#EF4444]" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}