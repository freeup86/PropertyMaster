import api from './api';

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: number;
  acquisitionDate: string;
  acquisitionPrice: number;
  currentValue: number;
  lastValuationDate: string;
  unitCount: number;
}

export interface CreatePropertyRequest {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: number;
  acquisitionDate: string;
  acquisitionPrice: number;
  currentValue: number;
}

export interface UpdatePropertyRequest {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  type?: number;
  currentValue?: number;
  lastValuationDate?: string;
}

const propertyService = {
  getProperties: async (): Promise<Property[]> => {
    const response = await api.get('/properties');
    return response.data;
  },

  getProperty: async (id: string): Promise<Property> => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  createProperty: async (property: CreatePropertyRequest): Promise<Property> => {
    const response = await api.post('/properties', property);
    return response.data;
  },

  updateProperty: async (id: string, property: UpdatePropertyRequest): Promise<Property> => {
    console.log("Sending update request with data:", property); // Debug log
    const response = await api.put(`/properties/${id}`, property);
    return response.data;
  },

  deleteProperty: async (id: string): Promise<void> => {
    await api.delete(`/properties/${id}`);
  },
};

export default propertyService;