import api from './api';

export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  leaseStartDate?: string;
  leaseEndDate?: string;
  unitId: string;
  unitNumber: string;
  propertyId: string;
  propertyName: string;
}

export interface CreateTenantRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  leaseStartDate?: string;
  leaseEndDate?: string;
  unitId: string;
}

export interface UpdateTenantRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  leaseStartDate?: string;
  leaseEndDate?: string;
}

const tenantService = {
  getTenantsByProperty: async (propertyId: string): Promise<Tenant[]> => {
    const response = await api.get(`/tenants/property/${propertyId}`);
    return response.data;
  },

  getTenantsByUnit: async (unitId: string): Promise<Tenant[]> => {
    const response = await api.get(`/tenants/unit/${unitId}`);
    return response.data;
  },

  getTenant: async (tenantId: string): Promise<Tenant> => {
    const response = await api.get(`/tenants/${tenantId}`);
    return response.data;
  },

  createTenant: async (tenant: CreateTenantRequest): Promise<Tenant> => {
    const response = await api.post('/tenants', tenant);
    return response.data;
  },

  updateTenant: async (tenantId: string, tenant: UpdateTenantRequest): Promise<Tenant> => {
    const response = await api.put(`/tenants/${tenantId}`, tenant);
    return response.data;
  },

  deleteTenant: async (tenantId: string): Promise<void> => {
    await api.delete(`/tenants/${tenantId}`);
  },
};

export default tenantService;