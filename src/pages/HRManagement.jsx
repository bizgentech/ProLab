import React, { useState, useEffect } from "react";
import { Employee } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Award, Clock, FileText, TrendingUp, Search, Plus, Phone, Mail, X, Upload, UserPlus } from "lucide-react";

const tabs = [
  { id: "employees", label: "Employees", icon: Users },
  { id: "candidates", label: "Candidates", icon: UserPlus },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "time", label: "Time & Attendance", icon: Clock },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "performance", label: "Performance", icon: TrendingUp }
];

export default function HRManagement() {
  const [activeTab, setActiveTab] = useState("employees");
  const [employees, setEmployees] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [addCandidateOpen, setAddCandidateOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    full_name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    employment_type: "Full-time",
    hire_date: "",
    hourly_rate: "",
    status: "Active"
  });
  const [newCandidate, setNewCandidate] = useState({
    full_name: "",
    email: "",
    phone: "",
    position_applied: "",
    source: "",
    status: "New",
    resume: "",
    notes: ""
  });

  useEffect(() => {
    loadEmployees();
    loadCandidates();
  }, []);

  const loadEmployees = async () => {
    const emps = await Employee.list("-created_date");
    setEmployees(emps);
  };

  const loadCandidates = async () => {
    // Mock candidates - in real app, this would be a separate entity
    const mockCandidates = [
      {
        id: 1,
        full_name: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "(305) 555-0101",
        position_applied: "Field Technician",
        source: "LinkedIn",
        status: "Interview Scheduled",
        applied_date: "2025-09-25",
        notes: "Strong background in construction testing"
      },
      {
        id: 2,
        full_name: "Michael Chen",
        email: "mchen@email.com",
        phone: "(305) 555-0102",
        position_applied: "Lab Technician",
        source: "Indeed",
        status: "New",
        applied_date: "2025-09-28",
        notes: "Fresh graduate, chemistry degree"
      }
    ];
    setCandidates(mockCandidates);
  };

  const handleAddEmployee = async () => {
    try {
      await Employee.create(newEmployee);
      setAddEmployeeOpen(false);
      setNewEmployee({
        full_name: "",
        email: "",
        phone: "",
        position: "",
        department: "",
        employment_type: "Full-time",
        hire_date: "",
        hourly_rate: "",
        status: "Active"
      });
      await loadEmployees();
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Error adding employee. Please try again.");
    }
  };

  const handleAddCandidate = async () => {
    // In real app, this would create a Candidate entity
    const candidate = {
      ...newCandidate,
      id: candidates.length + 1,
      applied_date: new Date().toISOString().split('T')[0]
    };
    setCandidates([candidate, ...candidates]);
    setAddCandidateOpen(false);
    setNewCandidate({
      full_name: "",
      email: "",
      phone: "",
      position_applied: "",
      source: "",
      status: "New",
      resume: "",
      notes: ""
    });
  };

  const filteredEmployees = employees.filter(emp =>
    emp.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCandidates = candidates.filter(cand =>
    cand.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cand.position_applied.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const certExpiring = employees.reduce((count, emp) => {
    const expiring = emp.certifications?.filter(cert => cert.status === "Expiring Soon") || [];
    return count + expiring.length;
  }, 0);

  const candidateStats = {
    new: candidates.filter(c => c.status === "New").length,
    interview: candidates.filter(c => c.status === "Interview Scheduled").length,
    offer: candidates.filter(c => c.status === "Offer Extended").length
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B]">HR Management</h1>
          <p className="text-[#64748B] mt-1">Manage employees, candidates, certifications, and documents</p>
        </div>
        <Button 
          className="gap-2 bg-[#2563EB] hover:bg-[#1D4ED8]"
          onClick={() => activeTab === "employees" ? setAddEmployeeOpen(true) : setAddCandidateOpen(true)}
        >
          <Plus className="w-4 h-4" />
          {activeTab === "employees" ? "Add New Employee" : "Add Candidate"}
        </Button>
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

      {/* Tab Content */}
      {activeTab === "employees" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#64748B]">Total Employees</p>
                    <p className="text-3xl font-bold text-[#1E293B] mt-1">{employees.length}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#2563EB] bg-opacity-10">
                    <Users className="w-6 h-6 text-[#2563EB]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#64748B]">Active Today</p>
                    <p className="text-3xl font-bold text-[#1E293B] mt-1">
                      {employees.filter(e => e.current_status === "On Shift" || e.current_status === "Available").length}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#10B981] bg-opacity-10">
                    <Users className="w-6 h-6 text-[#10B981]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#64748B]">Certs Expiring</p>
                    <p className="text-3xl font-bold text-[#1E293B] mt-1">{certExpiring}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#EF4444] bg-opacity-10">
                    <Award className="w-6 h-6 text-[#EF4444]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#64748B]">Avg Tenure</p>
                    <p className="text-3xl font-bold text-[#1E293B] mt-1">3.2 yrs</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F59E0B] bg-opacity-10">
                    <TrendingUp className="w-6 h-6 text-[#F59E0B]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <Input
              placeholder="Search by name, position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Employee Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#F8FAFC]">
                      <TableHead className="font-semibold">Employee</TableHead>
                      <TableHead className="font-semibold">Position</TableHead>
                      <TableHead className="font-semibold">Department</TableHead>
                      <TableHead className="font-semibold">Certifications</TableHead>
                      <TableHead className="font-semibold">Employment</TableHead>
                      <TableHead className="font-semibold">Hire Date</TableHead>
                      <TableHead className="font-semibold">Contact</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white font-semibold">
                              {employee.full_name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-[#1E293B]">{employee.full_name}</p>
                              <p className="text-sm text-[#64748B]">{employee.employee_id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {employee.certifications?.slice(0, 2).map((cert, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className={
                                  cert.status === "Active" ? "bg-[#10B981] bg-opacity-10 text-[#10B981] border-[#10B981]" :
                                  cert.status === "Expiring Soon" ? "bg-[#F59E0B] bg-opacity-10 text-[#F59E0B] border-[#F59E0B]" :
                                  "bg-[#EF4444] bg-opacity-10 text-[#EF4444] border-[#EF4444]"
                                }
                              >
                                {cert.name}
                              </Badge>
                            ))}
                            {employee.certifications && employee.certifications.length > 2 && (
                              <Badge variant="outline" className="bg-[#F1F5F9]">
                                +{employee.certifications.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-[#F1F5F9]">
                            {employee.employment_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-[#64748B]">
                          {employee.hire_date ? new Date(employee.hire_date).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Phone className="w-4 h-4 text-[#64748B]" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Mail className="w-4 h-4 text-[#64748B]" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            employee.status === "Active" ? "bg-[#10B981] text-white" :
                            employee.status === "On Leave" ? "bg-[#F59E0B] text-white" :
                            "bg-[#64748B] text-white"
                          }>
                            {employee.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "candidates" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-[#64748B]">Total Candidates</p>
                <p className="text-3xl font-bold text-[#1E293B] mt-1">{candidates.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-[#64748B]">New Applications</p>
                <p className="text-3xl font-bold text-[#2563EB] mt-1">{candidateStats.new}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-[#64748B]">Interviews</p>
                <p className="text-3xl font-bold text-[#F59E0B] mt-1">{candidateStats.interview}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-[#64748B]">Offers Extended</p>
                <p className="text-3xl font-bold text-[#10B981] mt-1">{candidateStats.offer}</p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <Input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Candidates Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#F8FAFC]">
                      <TableHead className="font-semibold">Candidate</TableHead>
                      <TableHead className="font-semibold">Position Applied</TableHead>
                      <TableHead className="font-semibold">Source</TableHead>
                      <TableHead className="font-semibold">Applied Date</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCandidates.map((candidate) => (
                      <TableRow key={candidate.id} className="hover:bg-[#F8FAFC]">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-white font-semibold">
                              {candidate.full_name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-[#1E293B]">{candidate.full_name}</p>
                              <p className="text-sm text-[#64748B]">{candidate.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{candidate.position_applied}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{candidate.source}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-[#64748B]">
                          {new Date(candidate.applied_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            candidate.status === "New" ? "bg-[#2563EB] text-white" :
                            candidate.status === "Interview Scheduled" ? "bg-[#F59E0B] text-white" :
                            candidate.status === "Offer Extended" ? "bg-[#10B981] text-white" :
                            "bg-[#64748B] text-white"
                          }>
                            {candidate.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button size="sm" className="bg-[#2563EB] hover:bg-[#1D4ED8]">
                              Schedule Interview
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "certifications" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-[#64748B]">Total Active</p>
                <p className="text-3xl font-bold text-[#1E293B] mt-1">87</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-[#64748B]">Expiring This Month</p>
                <p className="text-3xl font-bold text-[#F59E0B] mt-1">5</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-[#64748B]">Expired</p>
                <p className="text-3xl font-bold text-[#EF4444] mt-1">2</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-[#64748B]">Renewals Needed</p>
                <p className="text-3xl font-bold text-[#1E293B] mt-1">7</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent className="p-8 text-center">
              <Award className="w-16 h-16 mx-auto mb-4 text-[#64748B] opacity-50" />
              <h3 className="text-lg font-semibold text-[#1E293B] mb-2">Certification Management</h3>
              <p className="text-[#64748B]">Track and manage employee certifications and renewals</p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "time" && (
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="w-16 h-16 mx-auto mb-4 text-[#64748B] opacity-50" />
            <h3 className="text-lg font-semibold text-[#1E293B] mb-2">Time & Attendance</h3>
            <p className="text-[#64748B]">Track employee time entries and attendance records</p>
          </CardContent>
        </Card>
      )}

      {activeTab === "documents" && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-[#64748B] opacity-50" />
            <h3 className="text-lg font-semibold text-[#1E293B] mb-2">Document Management</h3>
            <p className="text-[#64748B]">Store and manage employee documents securely</p>
          </CardContent>
        </Card>
      )}

      {activeTab === "performance" && (
        <Card>
          <CardContent className="p-8 text-center">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-[#64748B] opacity-50" />
            <h3 className="text-lg font-semibold text-[#1E293B] mb-2">Performance Reviews</h3>
            <p className="text-[#64748B]">Track employee performance metrics and reviews</p>
          </CardContent>
        </Card>
      )}

      {/* Add Employee Dialog */}
      <Dialog open={addEmployeeOpen} onOpenChange={setAddEmployeeOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={newEmployee.full_name}
                  onChange={(e) => setNewEmployee({...newEmployee, full_name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone</Label>
                <Input
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                  placeholder="(305) 555-0100"
                />
              </div>
              <div>
                <Label>Position *</Label>
                <Select value={newEmployee.position} onValueChange={(val) => setNewEmployee({...newEmployee, position: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Field Technician">Field Technician</SelectItem>
                    <SelectItem value="Lab Technician">Lab Technician</SelectItem>
                    <SelectItem value="Engineer">Engineer</SelectItem>
                    <SelectItem value="Inspector">Inspector</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Department *</Label>
                <Select value={newEmployee.department} onValueChange={(val) => setNewEmployee({...newEmployee, department: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Field Operations">Field Operations</SelectItem>
                    <SelectItem value="Laboratory">Laboratory</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Employment Type</Label>
                <Select value={newEmployee.employment_type} onValueChange={(val) => setNewEmployee({...newEmployee, employment_type: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Hire Date *</Label>
                <Input
                  type="date"
                  value={newEmployee.hire_date}
                  onChange={(e) => setNewEmployee({...newEmployee, hire_date: e.target.value})}
                />
              </div>
              <div>
                <Label>Hourly Rate ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newEmployee.hourly_rate}
                  onChange={(e) => setNewEmployee({...newEmployee, hourly_rate: e.target.value})}
                  placeholder="25.00"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddEmployeeOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAddEmployee}
              disabled={!newEmployee.full_name || !newEmployee.email || !newEmployee.position || !newEmployee.department || !newEmployee.hire_date}
              className="bg-[#2563EB] hover:bg-[#1D4ED8]"
            >
              Add Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Candidate Dialog */}
      <Dialog open={addCandidateOpen} onOpenChange={setAddCandidateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Candidate</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={newCandidate.full_name}
                  onChange={(e) => setNewCandidate({...newCandidate, full_name: e.target.value})}
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={newCandidate.email}
                  onChange={(e) => setNewCandidate({...newCandidate, email: e.target.value})}
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone</Label>
                <Input
                  value={newCandidate.phone}
                  onChange={(e) => setNewCandidate({...newCandidate, phone: e.target.value})}
                  placeholder="(305) 555-0100"
                />
              </div>
              <div>
                <Label>Position Applied For *</Label>
                <Select value={newCandidate.position_applied} onValueChange={(val) => setNewCandidate({...newCandidate, position_applied: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Field Technician">Field Technician</SelectItem>
                    <SelectItem value="Lab Technician">Lab Technician</SelectItem>
                    <SelectItem value="Engineer">Engineer</SelectItem>
                    <SelectItem value="Inspector">Inspector</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Source</Label>
                <Select value={newCandidate.source} onValueChange={(val) => setNewCandidate({...newCandidate, source: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="How did they find us?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Indeed">Indeed</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Company Website">Company Website</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={newCandidate.status} onValueChange={(val) => setNewCandidate({...newCandidate, status: val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Screening">Screening</SelectItem>
                    <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                    <SelectItem value="Offer Extended">Offer Extended</SelectItem>
                    <SelectItem value="Hired">Hired</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Resume/CV</Label>
              <div className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-6 text-center hover:border-[#2563EB] transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-[#64748B]" />
                <p className="text-sm text-[#64748B] mb-1">Drop file here or click to upload</p>
                <p className="text-xs text-[#94A3B8]">PDF, DOC, DOCX up to 10MB</p>
              </div>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={newCandidate.notes}
                onChange={(e) => setNewCandidate({...newCandidate, notes: e.target.value})}
                placeholder="Additional information about the candidate..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCandidateOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAddCandidate}
              disabled={!newCandidate.full_name || !newCandidate.email || !newCandidate.position_applied}
              className="bg-[#2563EB] hover:bg-[#1D4ED8]"
            >
              Add Candidate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}