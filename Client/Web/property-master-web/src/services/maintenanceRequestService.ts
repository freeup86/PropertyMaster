import axios from 'axios';
  import { CreateMaintenanceRequestDto, UpdateMaintenanceRequestDto } from '../../../../../Shared/PropertyMaster.Models/DTOs';
  import { MaintenanceRequestDto } from '../../../../../Shared/PropertyMaster.Models/DTOs';

  const API_URL = 'api/maintenancerequests'; // Adjust if your API route is different

  const MaintenanceRequestService = {
      getRequestsByProperty: async (propertyId: string): Promise<MaintenanceRequestDto[]> => {
          const response = await axios.get<MaintenanceRequestDto[]>(`<span class="math-inline">\{API\_URL\}/property/</span>{propertyId}`);
          return response.data;
      },

      getRequestsByUnit: async (unitId: string): Promise<MaintenanceRequestDto[]> => {
          const response = await axios.get<MaintenanceRequestDto[]>(`<span class="math-inline">\{API\_URL\}/unit/</span>{unitId}`);
          return response.data;
      },

      getRequest: async (id: string): Promise<MaintenanceRequestDto> => {
          const response = await axios.get<MaintenanceRequestDto>(`<span class="math-inline">\{API\_URL\}/</span>{id}`);
          return response.data;
      },

      createRequest: async (request: CreateMaintenanceRequestDto): Promise<MaintenanceRequestDto> => {
          const response = await axios.post<MaintenanceRequestDto>(API_URL, request);
          return response.data;
      },

      updateRequest: async (id: string, request: UpdateMaintenanceRequestDto): Promise<MaintenanceRequestDto> => {
          const response = await axios.put<MaintenanceRequestDto>(`<span class="math-inline">\{API\_URL\}/</span>{id}`, request);
          return response.data;
      },

      deleteRequest: async (id: string): Promise<void> => {
          await axios.delete(`<span class="math-inline">\{API\_URL\}/</span>{id}`);
      },
  };

  export default MaintenanceRequestService;