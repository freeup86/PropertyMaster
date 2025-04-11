import React, { useState, useEffect } from 'react';
import MaintenanceRequestService from '../services/maintenanceRequestService';
import { MaintenanceRequestDto } from '../../../../../Shared/PropertyMaster.Models/DTOs';

interface MaintenanceRequestListProps {
    propertyId?: string;
    unitId?: string;
}

const MaintenanceRequestList: React.FC<MaintenanceRequestListProps> = ({ propertyId, unitId }) => {
    const [requests, setRequests] = useState<MaintenanceRequestDto[]>([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                if (propertyId) {
                    const fetchedRequests = await MaintenanceRequestService.getRequestsByProperty(propertyId);
                    setRequests(fetchedRequests);
                } else if (unitId) {
                    const fetchedRequests = await MaintenanceRequestService.getRequestsByUnit(unitId);
                    setRequests(fetchedRequests);
                } else {
                     // Fetch all or handle as needed
                }
            } catch (error) {
                console.error('Error fetching maintenance requests:', error);
                // Handle error (e.g., display an error message)
            }
        };

        fetchRequests();
    }, [propertyId, unitId]);

    return (
        <div>
            <h2>Maintenance Requests</h2>
            {requests.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Unit</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Priority</th>
                            {/* Add more headers as needed */}
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(request => (
                            <tr key={request.id}>
                                <td>{request.id}</td>
                                <td>{request.unitNumber}</td>
                                <td>{request.category}</td>
                                <td>{request.description}</td>
                                <td>{request.status}</td>
                                <td>{request.priority}</td>
                                {/* Add more cells as needed */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No maintenance requests found.</p>
            )}
        </div>
    );
};

export default MaintenanceRequestList;