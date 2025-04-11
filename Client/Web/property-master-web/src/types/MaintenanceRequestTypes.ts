export interface CreateMaintenanceRequestDto {
  unitId: string;
  propertyId: string;
  tenantId?: string;
  requestDate: string;
  description: string;
  category: string;
  priority: string;
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
}

export interface PropertyDto {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: number;
  acquisitionDate: string;
  acquisitionPrice: number;
  currentValue: number;
}

  export interface MaintenanceRequestDto {
    id: string;
    unitId: string;
    tenantId?: string;
    propertyId: string;
    requestDate: string;
    description: string;
    status: string;
    category: string;
    priority: string;
    assignedTo?: string;
    notes?: string;
  
    // Add these navigation properties for display
    unitNumber: string;
    tenantName: string;
    propertyName: string;
  }
  
  export interface UpdateMaintenanceRequestDto {
    status?: string;
    category?: string;
    priority?: string;
    assignedTo?: string;
    notes?: string;
  }