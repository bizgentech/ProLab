import React, { useState, useEffect } from "react";
import { Client, WorkOrder, Project } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  FileText,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
} from "lucide-react";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientProjects, setClientProjects] = useState([]);
  const [clientWorkOrders, setClientWorkOrders] = useState([]);

  const [clientForm, setClientForm] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "FL",
    zip_code: "",
    client_type: "General Contractor",
    payment_terms: "Net 30",
    special_instructions: "",
    status: "Active",
  });

  const [orderForm, setOrderForm] = useState({
    project_id: "",
    service_type: "Density Testing",
    location: "",
    contact_person: "",
    contact_phone: "",
    requested_date: "",
    estimated_quantity: "",
    special_instructions: "",
    priority: "Normal",
  });

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
  if (searchTerm) {
    const filtered = clients.filter((client) => {
      const searchLower = searchTerm.toLowerCase();
      const companyName = String(client.company_name || '').toLowerCase();
      const contactName = String(client.contact_name || '').toLowerCase();
      const email = String(client.email || '').toLowerCase();
      
      return companyName.includes(searchLower) ||
             contactName.includes(searchLower) ||
             email.includes(searchLower);
    });
    setFilteredClients(filtered);
  } else {
    setFilteredClients(clients);
  }
}, [searchTerm, clients]);

  const loadClients = async () => {
    try {
      const data = await Client.list();
      setClients(data || []);
      setFilteredClients(data || []);
    } catch (error) {
      console.error("Error loading clients:", error);
    }
  };

  const handleCreateClient = () => {
    setEditingClient(null);
    setClientForm({
      company_name: "",
      contact_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "FL",
      zip_code: "",
      client_type: "General Contractor",
      payment_terms: "Net 30",
      special_instructions: "",
      status: "Active",
    });
    setShowClientModal(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setClientForm({
      company_name: client.company_name || "",
      contact_name: client.contact_name || "",
      email: client.email || "",
      phone: client.phone || "",
      address: client.address || "",
      city: client.city || "",
      state: client.state || "FL",
      zip_code: client.zip_code || "",
      client_type: client.client_type || "General Contractor",
      payment_terms: client.payment_terms || "Net 30",
      special_instructions: client.special_instructions || "",
      status: client.status || "Active",
    });
    setShowClientModal(true);
  };

  const handleSaveClient = async () => {
    try {
      if (editingClient) {
        await Client.update(editingClient.id, clientForm);
      } else {
        await Client.create(clientForm);
      }
      setShowClientModal(false);
      loadClients();
    } catch (error) {
      console.error("Error saving client:", error);
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (confirm("Are you sure you want to delete this client?")) {
      try {
        await Client.delete(clientId);
        loadClients();
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  const handleViewDetails = async (client) => {
    setSelectedClient(client);
    
    // Load client's projects and work orders
    try {
      const projects = await Project.filter({ client_id: client.id });
      const workOrders = await WorkOrder.filter({ client: client.company_name });
      setClientProjects(projects || []);
      setClientWorkOrders(workOrders || []);
    } catch (error) {
      console.error("Error loading client details:", error);
      setClientProjects([]);
      setClientWorkOrders([]);
    }
    
    setShowDetailsModal(true);
  };

  const handleCreateWorkOrder = (client) => {
    setSelectedClient(client);
    setOrderForm({
      project_id: "",
      service_type: "Density Testing",
      location: "",
      contact_person: client.contact_name,
      contact_phone: client.phone,
      requested_date: "",
      estimated_quantity: "",
      special_instructions: "",
      priority: "Normal",
    });
    setShowOrderModal(true);
  };

  const handleSubmitWorkOrder = async () => {
    try {
      const woNumber = `WO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      
      await WorkOrder.create({
        wo_number: woNumber,
        client: selectedClient.company_name,
        client_id: selectedClient.id,
        service_type: orderForm.service_type,
        location: orderForm.location,
        contact_person: orderForm.contact_person,
        contact_phone: orderForm.contact_phone,
        requested_date: orderForm.requested_date,
        estimated_quantity: orderForm.estimated_quantity,
        special_instructions: orderForm.special_instructions,
        priority: orderForm.priority,
        status: "Pending Assignment",
        created_date: new Date().toISOString(),
      });

      setShowOrderModal(false);
      alert("Work order request submitted successfully!");
    } catch (error) {
      console.error("Error creating work order:", error);
      alert("Error submitting work order. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-[#10B981] text-white";
      case "Inactive":
        return "bg-[#64748B] text-white";
      case "On Hold":
        return "bg-[#F59E0B] text-white";
      default:
        return "bg-[#64748B] text-white";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B]">Clients</h1>
          <p className="text-[#64748B] mt-1">Manage client information and work orders</p>
        </div>
        <Button
          onClick={handleCreateClient}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Total Clients</p>
                <p className="text-2xl font-bold text-[#1E293B]">{clients.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-[#2563EB]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Active</p>
                <p className="text-2xl font-bold text-[#10B981]">
                  {clients.filter((c) => c.status === "Active").length}
                </p>
              </div>
              <Building2 className="w-8 h-8 text-[#10B981]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">General Contractors</p>
                <p className="text-2xl font-bold text-[#1E293B]">
                  {clients.filter((c) => c.client_type === "General Contractor").length}
                </p>
              </div>
              <Building2 className="w-8 h-8 text-[#64748B]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B]">Government</p>
                <p className="text-2xl font-bold text-[#1E293B]">
                  {clients.filter((c) => c.client_type === "Government").length}
                </p>
              </div>
              <Building2 className="w-8 h-8 text-[#3B82F6]" />
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
              placeholder="Search clients by name, contact, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Terms</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-[#64748B]">
                    No clients found. Click "Add Client" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-[#1E293B]">{client.company_name}</p>
                        <p className="text-sm text-[#64748B]">{client.city}, {client.state}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{client.contact_name}</p>
                        <p className="text-xs text-[#64748B]">{client.email}</p>
                        <p className="text-xs text-[#64748B]">{client.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{client.client_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                    </TableCell>
                    <TableCell>{client.payment_terms}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(client)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCreateWorkOrder(client)}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClient(client)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClient(client.id)}
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

      {/* Create/Edit Client Modal */}
      <Dialog open={showClientModal} onOpenChange={setShowClientModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingClient ? "Edit Client" : "Add New Client"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input
                  value={clientForm.company_name}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, company_name: e.target.value })
                  }
                  placeholder="ABC Construction"
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Name *</Label>
                <Input
                  value={clientForm.contact_name}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, contact_name: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={clientForm.email}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, email: e.target.value })
                  }
                  placeholder="john@abcconstruction.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input
                  value={clientForm.phone}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, phone: e.target.value })
                  }
                  placeholder="(305) 555-0100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={clientForm.address}
                onChange={(e) =>
                  setClientForm({ ...clientForm, address: e.target.value })
                }
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={clientForm.city}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, city: e.target.value })
                  }
                  placeholder="Miami"
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={clientForm.state}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, state: e.target.value })
                  }
                  placeholder="FL"
                />
              </div>
              <div className="space-y-2">
                <Label>ZIP Code</Label>
                <Input
                  value={clientForm.zip_code}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, zip_code: e.target.value })
                  }
                  placeholder="33101"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client Type</Label>
                <Select
                  value={clientForm.client_type}
                  onValueChange={(value) =>
                    setClientForm({ ...clientForm, client_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General Contractor">General Contractor</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                    <SelectItem value="Developer">Developer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payment Terms</Label>
                <Select
                  value={clientForm.payment_terms}
                  onValueChange={(value) =>
                    setClientForm({ ...clientForm, payment_terms: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Net 15">Net 15</SelectItem>
                    <SelectItem value="Net 30">Net 30</SelectItem>
                    <SelectItem value="Net 45">Net 45</SelectItem>
                    <SelectItem value="Net 60">Net 60</SelectItem>
                    <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={clientForm.status}
                onValueChange={(value) =>
                  setClientForm({ ...clientForm, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Special Instructions</Label>
              <Textarea
                value={clientForm.special_instructions}
                onChange={(e) =>
                  setClientForm({ ...clientForm, special_instructions: e.target.value })
                }
                placeholder="Any special instructions or notes..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowClientModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveClient}
                className="bg-[#2563EB] hover:bg-[#1D4ED8]"
              >
                {editingClient ? "Update Client" : "Create Client"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Client Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-6">
              {/* Client Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#64748B]">Company Name</p>
                      <p className="font-medium">{selectedClient.company_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#64748B]">Status</p>
                      <Badge className={getStatusColor(selectedClient.status)}>
                        {selectedClient.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#64748B]">Contact Person</p>
                      <p className="font-medium">{selectedClient.contact_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#64748B]">Client Type</p>
                      <p className="font-medium">{selectedClient.client_type}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#64748B]">Email</p>
                      <p className="font-medium">{selectedClient.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#64748B]">Phone</p>
                      <p className="font-medium">{selectedClient.phone}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B]">Address</p>
                    <p className="font-medium">
                      {selectedClient.address}, {selectedClient.city}, {selectedClient.state} {selectedClient.zip_code}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B]">Payment Terms</p>
                    <p className="font-medium">{selectedClient.payment_terms}</p>
                  </div>
                  {selectedClient.special_instructions && (
                    <div>
                      <p className="text-sm text-[#64748B]">Special Instructions</p>
                      <p className="font-medium">{selectedClient.special_instructions}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Projects ({clientProjects.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {clientProjects.length === 0 ? (
                    <p className="text-[#64748B] text-sm">No projects yet</p>
                  ) : (
                    <div className="space-y-2">
                      {clientProjects.map((project) => (
                        <div
                          key={project.id}
                          className="p-3 border border-[#E2E8F0] rounded-lg"
                        >
                          <p className="font-medium">{project.project_name}</p>
                          <p className="text-sm text-[#64748B]">{project.location}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Work Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Work Orders ({clientWorkOrders.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {clientWorkOrders.length === 0 ? (
                    <p className="text-[#64748B] text-sm">No work orders yet</p>
                  ) : (
                    <div className="space-y-2">
                      {clientWorkOrders.slice(0, 5).map((wo) => (
                        <div
                          key={wo.id}
                          className="p-3 border border-[#E2E8F0] rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium text-[#2563EB]">{wo.wo_number}</p>
                            <p className="text-sm text-[#64748B]">{wo.service_type}</p>
                          </div>
                          <Badge>{wo.status}</Badge>
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
                <Button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleCreateWorkOrder(selectedClient);
                  }}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Create Work Order
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Work Order Modal */}
      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Work Order Request</DialogTitle>
            {selectedClient && (
              <p className="text-sm text-[#64748B]">
                For: {selectedClient.company_name}
              </p>
            )}
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Service Type *</Label>
              <Select
                value={orderForm.service_type}
                onValueChange={(value) =>
                  setOrderForm({ ...orderForm, service_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Density Testing">Density Testing</SelectItem>
                  <SelectItem value="Concrete Testing">Concrete Testing</SelectItem>
                  <SelectItem value="Asphalt Testing">Asphalt Testing</SelectItem>
                  <SelectItem value="Soil Testing">Soil Testing</SelectItem>
                  <SelectItem value="Aggregate Testing">Aggregate Testing</SelectItem>
                  <SelectItem value="Field Inspection">Field Inspection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Location *</Label>
              <Input
                value={orderForm.location}
                onChange={(e) =>
                  setOrderForm({ ...orderForm, location: e.target.value })
                }
                placeholder="Job site address or description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Contact Person *</Label>
                <Input
                  value={orderForm.contact_person}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, contact_person: e.target.value })
                  }
                  placeholder="On-site contact"
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Phone *</Label>
                <Input
                  value={orderForm.contact_phone}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, contact_phone: e.target.value })
                  }
                  placeholder="(305) 555-0100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Requested Date *</Label>
                <Input
                  type="date"
                  value={orderForm.requested_date}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, requested_date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Estimated Quantity</Label>
                <Input
                  value={orderForm.estimated_quantity}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, estimated_quantity: e.target.value })
                  }
                  placeholder="e.g., 10 tests, 50 samples"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={orderForm.priority}
                onValueChange={(value) =>
                  setOrderForm({ ...orderForm, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Special Instructions</Label>
              <Textarea
                value={orderForm.special_instructions}
                onChange={(e) =>
                  setOrderForm({ ...orderForm, special_instructions: e.target.value })
                }
                placeholder="Any special requirements or notes..."
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowOrderModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitWorkOrder}
                className="bg-[#2563EB] hover:bg-[#1D4ED8]"
              >
                Submit Work Order Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}