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

const mockUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@cti.com",
    role: "admin",
    status: "Active"
  },
  {
    id: 2,
    name: "Field Tech",
    email: "tech@cti.com",
    role: "field_technician",
    status: "Active"
  },
  {
    id: 3,
    name: "Lab Tech",
    email: "lab@cti.com",
    role: "lab_technician",
    status: "Active"
  },
  {
    id: 4,
    name: "Engineer",
    email: "engineer@cti.com",
    role: "engineer",
    status: "Active"
  }
];

// Base Entity Class with localStorage persistence
class Entity {
  constructor(endpoint, initialMockData = []) {
    this.endpoint = endpoint;
    this.storageKey = `mock_${endpoint.replace(/\//g, '_')}`;
    
    // Load from localStorage or use initial mock data
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        this.mockData = JSON.parse(stored);
      } catch (e) {
        this.mockData = [...initialMockData];
        this.saveMockData();
      }
    } else {
      this.mockData = [...initialMockData];
      this.saveMockData();
    }
  }

  saveMockData() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.mockData));
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
    
    const newItem = { 
      id: Date.now(), 
      created_date: new Date().toISOString().split('T')[0], 
      ...data 
    };
    this.mockData.push(newItem);
    this.saveMockData(); // Save to localStorage
    return newItem;
  }

  async update(id, data) {
    // const response = await apiClient.put(`${this.endpoint}/${id}`, data);
    // return response.data;
    
    const index = this.mockData.findIndex(item => item.id === id);
    if (index !== -1) {
      this.mockData[index] = { ...this.mockData[index], ...data };
      this.saveMockData(); // Save to localStorage
      return this.mockData[index];
    }
    throw new Error('Not found');
  }

  async delete(id) {
    // await apiClient.delete(`${this.endpoint}/${id}`);
    
    this.mockData = this.mockData.filter(item => item.id !== id);
    this.saveMockData(); // Save to localStorage
  }

  async filter(params) {
    // const response = await apiClient.get(this.endpoint, { params });
    // return response.data;
    
    return this.mockData.filter(item => {
      return Object.keys(params).every(key => item[key] === params[key]);
    });
  }
}

// Create entity instances with initial mock data
class WorkOrderEntity extends Entity {
  constructor() {
    super('/work-orders', mockWorkOrders);
  }
}

class SampleEntity extends Entity {
  constructor() {
    super('/samples', mockSamples);
  }
}

class EmployeeEntity extends Entity {
  constructor() {
    super('/employees', mockEmployees);
  }
}

class LabTestEntity extends Entity {
  constructor() {
    super('/lab-tests', mockLabTests);
  }
}

class FieldTestEntity extends Entity {
  constructor() {
    super('/field-tests', []);
  }
}

class ProjectEntity extends Entity {
  constructor() {
    super('/projects', []);
  }
}

class ClientEntity extends Entity {
  constructor() {
    super('/clients', []);
  }
}

class InvoiceEntity extends Entity {
  constructor() {
    super('/invoices', mockInvoices);
  }
}

class SampleTransferEntity extends Entity {
  constructor() {
    super('/sample-transfers', []);
  }
}

class ActivityLogEntity extends Entity {
  constructor() {
    super('/activity-logs', []);
  }
}

class UserEntity extends Entity {
  constructor() {
    super('/users', mockUsers);
  }

  async me() {
    const userStr = localStorage.getItem('user');
    if (!userStr) throw new Error('Not authenticated');
    return JSON.parse(userStr);
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
export const User = new UserEntity();