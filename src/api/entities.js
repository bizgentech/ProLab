import apiClient from '@/services/api';

// Mock data para desarrollo - eliminar cuando Laravel esté listo
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
    created_date: "2025-01-15",
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
    created_date: "2025-01-14"
  }
];

const mockSamples = [
  {
    id: 1,
    sample_id: "SMP-2025-001",
    wo_number: "WO-2025-001",
    sample_type: "Soil",
    location: "Station 10+50",
    status: "Collected",
    collected_by: "John Martinez",
    collection_date: new Date().toISOString()
  }
];

const mockEmployees = [
  {
    id: 1,
    full_name: "John Martinez",
    position: "Field Technician",
    current_status: "Off Duty",
    created_by: "tech@cti.com"
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
    return this.mockData;
  }

  async get(id) {
    // const response = await apiClient.get(`${this.endpoint}/${id}`);
    // return response.data;
    
    return this.mockData.find(item => item.id === id);
  }

  async create(data) {
    // const response = await apiClient.post(this.endpoint, data);
    // return response.data;
    
    const newItem = { id: Date.now(), ...data };
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
    this.mockData = [];
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
    this.mockData = [];
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