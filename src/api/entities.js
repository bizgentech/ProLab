import apiClient from '@/services/api';

// Mock data expandido para desarrollo - eliminar cuando Laravel esté listo
const mockWorkOrders = [
  {
    id: 1,
    wo_number: "WO-2025-001",
    client_name: "ABC Construction",
    project_name: "I-95 Expansion",
    service_type: "Density Testing",
    location: "Miami, FL",
    assigned_to: "John Martinez",
    priority: "Urgent",
    status: "In Progress",
    created_date: "2025-10-01",
    amount: 1250,
    special_instructions: "High priority - DOT inspection scheduled"
  },
  {
    id: 2,
    wo_number: "WO-2025-002",
    client_name: "Florida DOT",
    project_name: "State Road 7",
    service_type: "Asphalt Testing",
    location: "Fort Lauderdale, FL",
    assigned_to: "Sarah Chen",
    priority: "Normal",
    status: "Assigned",
    created_date: "2025-10-02",
    amount: 850
  },
  {
    id: 3,
    wo_number: "WO-2025-003",
    client_name: "HALLEY Construction",
    project_name: "Broward Mall Renovation",
    service_type: "Concrete Testing",
    location: "Plantation, FL",
    assigned_to: "Mike Johnson",
    priority: "Normal",
    status: "Completed",
    created_date: "2025-09-28",
    completed_date: "2025-10-03",
    amount: 650
  },
  {
    id: 4,
    wo_number: "WO-2025-004",
    client_name: "ABC Construction",
    project_name: "Turnpike Extension",
    service_type: "Soil Testing",
    location: "Miramar, FL",
    assigned_to: "Emily Rodriguez",
    priority: "High",
    status: "In Progress",
    created_date: "2025-10-03",
    amount: 980
  },
  {
    id: 5,
    wo_number: "WO-2025-005",
    client_name: "Florida DOT",
    project_name: "State Road 7",
    service_type: "Gradation Analysis",
    location: "Fort Lauderdale, FL",
    assigned_to: "David Kim",
    priority: "Normal",
    status: "Assigned",
    created_date: "2025-10-04",
    amount: 450
  }
];

const mockSamples = [
  {
    id: 1,
    sample_id: "SMP-2025-001",
    wo_number: "WO-2025-001",
    project_name: "I-95 Expansion",
    sample_type: "Soil",
    location: "Station 10+50",
    status: "Testing",
    collected_by: "John Martinez",
    collection_date: "2025-10-01T10:30:00",
    test_results: "In Progress",
    latitude: 25.7617,
    longitude: -80.1918
  },
  {
    id: 2,
    sample_id: "SMP-2025-002",
    wo_number: "WO-2025-001",
    project_name: "I-95 Expansion",
    sample_type: "Asphalt",
    location: "Station 12+00",
    status: "Completed",
    collected_by: "John Martinez",
    collection_date: "2025-10-01T14:20:00",
    test_results: "Pass",
    latitude: 25.7625,
    longitude: -80.1920
  },
  {
    id: 3,
    sample_id: "SMP-2025-003",
    wo_number: "WO-2025-002",
    project_name: "State Road 7",
    sample_type: "Asphalt",
    location: "Mile Marker 15",
    status: "In Lab",
    collected_by: "Sarah Chen",
    collection_date: "2025-10-02T09:15:00",
    test_results: "Pending",
    latitude: 26.1224,
    longitude: -80.1373
  },
  {
    id: 4,
    sample_id: "SMP-2025-004",
    wo_number: "WO-2025-003",
    project_name: "Broward Mall Renovation",
    sample_type: "Concrete",
    location: "Building A Foundation",
    status: "Completed",
    collected_by: "Mike Johnson",
    collection_date: "2025-09-28T11:00:00",
    test_results: "Pass",
    latitude: 26.1276,
    longitude: -80.2584
  },
  {
    id: 5,
    sample_id: "SMP-2025-005",
    wo_number: "WO-2025-004",
    project_name: "Turnpike Extension",
    sample_type: "Soil",
    location: "Station 5+25",
    status: "Collected",
    collected_by: "Emily Rodriguez",
    collection_date: "2025-10-03T08:45:00",
    test_results: "Pending",
    latitude: 25.9876,
    longitude: -80.2322
  },
  {
    id: 6,
    sample_id: "SMP-2025-006",
    wo_number: "WO-2025-004",
    project_name: "Turnpike Extension",
    sample_type: "Soil",
    location: "Station 6+10",
    status: "Testing",
    collected_by: "Emily Rodriguez",
    collection_date: "2025-10-03T10:30:00",
    test_results: "In Progress",
    latitude: 25.9880,
    longitude: -80.2325
  }
];

const mockEmployees = [
  {
    id: 1,
    full_name: "John Martinez",
    email: "john@cti.com",
    position: "Field Technician",
    current_status: "On Shift",
    created_by: "tech@cti.com",
    clock_in_time: "08:00 AM"
  },
  {
    id: 2,
    full_name: "Sarah Chen",
    email: "sarah@cti.com",
    position: "Field Technician",
    current_status: "On Shift",
    created_by: "admin@cti.com",
    clock_in_time: "07:30 AM"
  },
  {
    id: 3,
    full_name: "Mike Johnson",
    email: "mike@cti.com",
    position: "Lab Technician",
    current_status: "On Shift",
    created_by: "admin@cti.com",
    clock_in_time: "08:00 AM"
  },
  {
    id: 4,
    full_name: "Emily Rodriguez",
    email: "emily@cti.com",
    position: "Field Technician",
    current_status: "On Shift",
    created_by: "admin@cti.com",
    clock_in_time: "06:00 AM"
  },
  {
    id: 5,
    full_name: "David Kim",
    email: "david@cti.com",
    position: "Field Technician",
    current_status: "Off Duty",
    created_by: "admin@cti.com"
  }
];

const mockLabTests = [
  {
    id: 1,
    sample_id: "SMP-2025-002",
    test_type: "Asphalt Content",
    test_date: "2025-10-02",
    technician: "Lab Tech",
    result: "Pass",
    value: "5.8%",
    spec_min: "5.0%",
    spec_max: "6.5%"
  },
  {
    id: 2,
    sample_id: "SMP-2025-004",
    test_type: "Compressive Strength",
    test_date: "2025-10-03",
    technician: "Lab Tech",
    result: "Pass",
    value: "4200 psi",
    spec_min: "4000 psi",
    spec_max: null
  }
];

const mockInvoices = [
  {
    id: 1,
    invoice_number: "INV-2025-001",
    client_name: "ABC Construction",
    work_orders: ["WO-2025-001", "WO-2025-004"],
    amount: 2230,
    status: "Sent",
    issue_date: "2025-10-01",
    due_date: "2025-10-31"
  },
  {
    id: 2,
    invoice_number: "INV-2025-002",
    client_name: "Florida DOT",
    work_orders: ["WO-2025-002"],
    amount: 850,
    status: "Paid",
    issue_date: "2025-09-28",
    due_date: "2025-10-28",
    paid_date: "2025-10-02"
  },
  {
    id: 3,
    invoice_number: "INV-2025-003",
    client_name: "HALLEY Construction",
    work_orders: ["WO-2025-003"],
    amount: 650,
    status: "Sent",
    issue_date: "2025-10-03",
    due_date: "2025-11-02"
  }
];

// Base Entity Class
class Entity {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.mockData = [];
  }

  async list(sortBy = '-created_date') {
    // Cuando Laravel esté listo:
    // const response = await apiClient.get(this.endpoint);
    // return response.data;
    
    // Por ahora retornar mock data
    return [...this.mockData];
  }

  async get(id) {
    // const response = await apiClient.get(`${this.endpoint}/${id}`);
    // return response.data;
    
    return this.mockData.find(item => item.id === id);
  }

  async create(data) {
    // const response = await apiClient.post(this.endpoint, data);
    // return response.data;
    
    const newItem = { id: Date.now(), created_date: new Date().toISOString().split('T')[0], ...data };
    this.mockData.push(newItem);
    return newItem;
  }

  async update(id, data) {
    // const response = await apiClient.put(`${this.endpoint}/${id}`, data);
    // return response.data;
    
    const index = this.mockData.findIndex(item => item.id === id);
    if (index !== -1) {
      this.mockData[index] = { ...this.mockData[index], ...data };
      return this.mockData[index];
    }
    throw new Error('Not found');
  }

  async delete(id) {
    // await apiClient.delete(`${this.endpoint}/${id}`);
    
    this.mockData = this.mockData.filter(item => item.id !== id);
  }

  async filter(params) {
    // const response = await apiClient.get(this.endpoint, { params });
    // return response.data;
    
    return this.mockData.filter(item => {
      return Object.keys(params).every(key => item[key] === params[key]);
    });
  }
}

// Create entity instances
class WorkOrderEntity extends Entity {
  constructor() {
    super('/work-orders');
    this.mockData = mockWorkOrders;
  }
}

class SampleEntity extends Entity {
  constructor() {
    super('/samples');
    this.mockData = mockSamples;
  }
}

class EmployeeEntity extends Entity {
  constructor() {
    super('/employees');
    this.mockData = mockEmployees;
  }
}

class LabTestEntity extends Entity {
  constructor() {
    super('/lab-tests');
    this.mockData = mockLabTests;
  }
}

class FieldTestEntity extends Entity {
  constructor() {
    super('/field-tests');
    this.mockData = [];
  }
}

class ProjectEntity extends Entity {
  constructor() {
    super('/projects');
    this.mockData = [];
  }
}

class ClientEntity extends Entity {
  constructor() {
    super('/clients');
    this.mockData = [];
  }
}

class InvoiceEntity extends Entity {
  constructor() {
    super('/invoices');
    this.mockData = mockInvoices;
  }
}

class SampleTransferEntity extends Entity {
  constructor() {
    super('/sample-transfers');
    this.mockData = [];
  }
}

class ActivityLogEntity extends Entity {
  constructor() {
    super('/activity-logs');
    this.mockData = [];
  }
}

// Export instances
export const WorkOrder = new WorkOrderEntity();
export const Sample = new SampleEntity();
export const Employee = new EmployeeEntity();
export const LabTest = new LabTestEntity();
export const FieldTest = new FieldTestEntity();
export const Project = new ProjectEntity();
export const Client = new ClientEntity();
export const Invoice = new InvoiceEntity();
export const SampleTransfer = new SampleTransferEntity();
export const ActivityLog = new ActivityLogEntity();

// Auth
export const User = {
  me: async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) throw new Error('Not authenticated');
    return JSON.parse(userStr);
  }
};