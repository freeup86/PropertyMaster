import React, { useState, useEffect } from 'react';
import MaintenanceRequestService from '../services/maintenanceRequestService';
import { CreateMaintenanceRequestDto, UnitDto, PropertyDto } from '../../../../../Shared/PropertyMaster.Models/DTOs';
import unitService from '../services/unitService';
import propertyService from '../services/propertyService';
import { useNavigate } from 'react-router-dom';

const CreateMaintenanceRequest: React.FC = () => {
    const [units, setUnits] = useState<UnitDto[]>([]);
    const [properties, setProperties] = useState<PropertyDto[]>([]);
    const [request, setRequest] = useState<CreateMaintenanceRequestDto>({
        unitId: '',
        propertyId: '',
        requestDate: new Date().toISOString().split('T')[0], // Default to today's date
        description: '',
        category: '',
        priority: 'Medium',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUnitsAndProperties = async () => {
            try {
                const fetchedProperties = await propertyService.getProperties();
                setProperties(fetchedProperties);

                if (fetchedProperties.length > 0) {
                    // Fetch units for the first property by default
                    const firstPropertyId = fetchedProperties[0].id;
                    setRequest((prevRequest: CreateMaintenanceRequestDto) => ({ ...prevRequest, propertyId: firstPropertyId })); // Typed prevRequest
                    const fetchedUnits = await unitService.getUnits(firstPropertyId);
                    setUnits(fetchedUnits);
                }
            } catch (error) {
                console.error('Error fetching units or properties:', error);
                // Handle error (e.g., display an error message)
            }
        };

        fetchUnitsAndProperties();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setRequest((prevRequest: CreateMaintenanceRequestDto) => ({ // Typed prevRequest
            ...prevRequest,
            [name]: value,
        }));

        if (name === 'propertyId') {
            // Fetch units when propertyId changes
            const fetchUnits = async () => {
                try {
                    const fetchedUnits = await unitService.getUnits(value);
                    setUnits(fetchedUnits);
                    setRequest((prevRequest: CreateMaintenanceRequestDto) => ({ ...prevRequest, unitId: fetchedUnits.length > 0 ? fetchedUnits[0].id : '' })); // Typed prevRequest, reset unitId
                } catch (error) {
                    console.error('Error fetching units for property:', error);
                    setUnits([]);
                }
            };
            fetchUnits();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await MaintenanceRequestService.createRequest(request);
            // Optionally, show a success message or redirect
            navigate('/maintenance-requests'); // Redirect to the list page
        } catch (error) {
            console.error('Error creating maintenance request:', error);
            // Handle error (e.g., display an error message)
        }
    };

    return (
        <div>
            <h2>Create Maintenance Request</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="propertyId">Property:</label>
                    <select id="propertyId" name="propertyId" value={request.propertyId} onChange={handleInputChange} required>
                        {properties.map(property => (
                            <option key={property.id} value={property.id}>{property.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="unitId">Unit:</label>
                    <select id="unitId" name="unitId" value={request.unitId} onChange={handleInputChange} required>
                        {units.map(unit => (
                            <option key={unit.id} value={unit.id}>{unit.unitNumber}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="requestDate">Request Date:</label>
                    <input type="date" id="requestDate" name="requestDate" value={request.requestDate} onChange={handleInputChange} required />
                </div>

                <div>
                    <label htmlFor="category">Category:</label>
                    <input type="text" id="category" name="category" value={request.category} onChange={handleInputChange} required />
                </div>

                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" name="description" value={request.description} onChange={handleInputChange} required />
                </div>

                <div>
                    <label htmlFor="priority">Priority:</label>
                    <select id="priority" name="priority" value={request.priority} onChange={handleInputChange} required>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>

                <button type="submit">Create Request</button>
            </form>
        </div>
    );
};

export default CreateMaintenanceRequest;