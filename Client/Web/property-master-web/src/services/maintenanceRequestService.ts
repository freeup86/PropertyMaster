// src/services/maintenanceRequestService.ts
import api from './api';
import { CreateMaintenanceRequestDto, UpdateMaintenanceRequestDto } from '../types/MaintenanceRequestTypes';
import { MaintenanceRequestDto } from '../types/MaintenanceRequestTypes';

const API_ENDPOINT = '/maintenancerequests';

const MaintenanceRequestService = {
    getRequestsByProperty: async (propertyId: string): Promise<MaintenanceRequestDto[]> => {
        const response = await api.get(`${API_ENDPOINT}/property/${propertyId}`);
        return response.data;
    },

    getRequestsByUnit: async (unitId: string): Promise<MaintenanceRequestDto[]> => {
        const response = await api.get(`${API_ENDPOINT}/unit/${unitId}`);
        return response.data;
    },

    getRequest: async (id: string): Promise<MaintenanceRequestDto> => {
        const response = await api.get(`${API_ENDPOINT}/${id}`);
        return response.data;
    },

    createRequest: async (request: CreateMaintenanceRequestDto): Promise<MaintenanceRequestDto> => {
        try {
            const response = await api.post(API_ENDPOINT, request);
            return response.data;
        } catch (error: any) { // Explicitly type error as 'any' to access properties
            console.error('Error creating maintenance request:', error);
            console.error('Response data:', error.response?.data);
            console.error('Response status:', error.response?.status);
            console.error('Response headers:', error.response?.headers);
            throw error;
        }
    },

    updateRequest: async (id: string, request: UpdateMaintenanceRequestDto): Promise<MaintenanceRequestDto> => {
        const response = await api.put(`${API_ENDPOINT}/${id}`, request);
        return response.data;
    },

    deleteRequest: async (id: string): Promise<void> => {
        await api.delete(`${API_ENDPOINT}/${id}`);
    },

    getAllRequests: async (): Promise<MaintenanceRequestDto[]> => {
        const response = await api.get(API_ENDPOINT);
        return response.data;
    },
};

export default MaintenanceRequestService;