import api from './api';

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  size: number;
  bedrooms: number;
  bathrooms: number;
  marketRent: number;
  isOccupied: boolean;
  propertyName: string;
}

export interface CreateUnitRequest {
  unitNumber: string;
  size: number;
  bedrooms: number;
  bathrooms: number;
  marketRent: number;
  isOccupied: boolean;
}

export interface UpdateUnitRequest {
  unitNumber?: string;
  size?: number;
  bedrooms?: number;
  bathrooms?: number;
  marketRent?: number;
  isOccupied?: boolean;
}

export interface UnitDto {
  id: string;
  propertyId: string;
  unitNumber: string;
  size: number;
  bedrooms: number;
  bathrooms: number;
  marketRent: number;
  isOccupied: boolean;
  propertyName: string;
  imageUrls: string[]; 
}

const unitService = {
  getUnits: async (propertyId: string): Promise<Unit[]> => {
    const response = await api.get(`/properties/${propertyId}/units`);
    return response.data;
  },

  getUnit: async (propertyId: string, unitId: string): Promise<Unit> => {
    const response = await api.get(`/properties/${propertyId}/units/${unitId}`);
    return response.data;
  },

  createUnit: async (propertyId: string, unit: CreateUnitRequest): Promise<Unit> => {
    const response = await api.post(`/properties/${propertyId}/units`, unit);
    return response.data;
  },

  updateUnit: async (propertyId: string, unitId: string, unit: UpdateUnitRequest): Promise<Unit> => {
    const response = await api.put(`/properties/${propertyId}/units/${unitId}`, unit);
    return response.data;
  },

  deleteUnit: async (propertyId: string, unitId: string): Promise<void> => {
    await api.delete(`/properties/${propertyId}/units/${unitId}`);
  },
};

export default unitService;