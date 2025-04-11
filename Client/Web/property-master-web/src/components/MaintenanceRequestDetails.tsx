import React, { useState, useEffect } from 'react';
import MaintenanceRequestService from '../services/maintenanceRequestService';
import { MaintenanceRequestDto, UpdateMaintenanceRequestDto } from '../types/MaintenanceRequestTypes';
import { useParams, useNavigate } from 'react-router-dom';

const MaintenanceRequestDetails: React.FC = () => {
    const [request, setRequest] = useState<MaintenanceRequestDto | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedRequest, setUpdatedRequest] = useState<UpdateMaintenanceRequestDto>({
        status: '',
        category: '',
        priority: '',
        assignedTo: '',
        notes: '',
    });
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRequest = async () => {
            if (id) {
                try {
                    const fetchedRequest = await MaintenanceRequestService.getRequest(id);
                    setRequest(fetchedRequest);
                    setUpdatedRequest({
                        status: fetchedRequest.status,
                        category: fetchedRequest.category,
                        priority: fetchedRequest.priority,
                        assignedTo: fetchedRequest.assignedTo || '',
                        notes: fetchedRequest.notes || '',
                    });
                } catch (error) {
                    console.error('Error fetching maintenance request:', error);
                    // Handle error (e.g., display an error message or redirect)
                }
            }
        };

        fetchRequest();
    }, [id]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUpdatedRequest((prevRequest: UpdateMaintenanceRequestDto) => ({ // Typed prevRequest
            ...prevRequest,
            [name]: value,
        }));
    };

    const handleSaveClick = async () => {
        if (!id || !request) return;

        try {
            await MaintenanceRequestService.updateRequest(id, updatedRequest);
            const fetchedRequest = await MaintenanceRequestService.getRequest(id);
            setRequest(fetchedRequest);
            setIsEditing(false);
            navigate(`/maintenance-requests/${id}`); // Navigate back to details
        } catch (error) {
            console.error('Error updating maintenance request:', error);
            // Handle error (e.g., display an error message)
        }
    };

    if (!request) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Maintenance Request Details</h2>
            <div>
                <p><strong>ID:</strong> {request.id}</p>
                <p><strong>Unit:</strong> {request.unitNumber}</p>
                <p><strong>Tenant:</strong> {request.tenantName}</p>
                <p><strong>Property:</strong> {request.propertyName}</p>
                <p><strong>Request Date:</strong> {request.requestDate.toString()}</p>
                <p><strong>Description:</strong> {request.description}</p>
                {!isEditing ? (
                    <>
                        <p><strong>Status:</strong> {request.status}</p>
                        <p><strong>Category:</strong> {request.category}</p>
                        <p><strong>Priority:</strong> {request.priority}</p>
                        {request.assignedTo && <p><strong>Assigned To:</strong> {request.assignedTo}</p>}
                        {request.notes && <p><strong>Notes:</strong> {request.notes}</p>}
                        <button onClick={handleEditClick}>Edit</button>
                    </>
                ) : (
                    <>
                        <div>
                            <label>Status:</label>
                            <input type="text" name="status" value={updatedRequest.status} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label>Category:</label>
                            <input type="text" name="category" value={updatedRequest.category} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label>Priority:</label>
                            <input type="text" name="priority" value={updatedRequest.priority} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label>Assigned To:</label>
                            <input type="text" name="assignedTo" value={updatedRequest.assignedTo} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label>Notes:</label>
                            <textarea name="notes" value={updatedRequest.notes} onChange={handleInputChange} />
                        </div>
                        <button onClick={handleSaveClick}>Save</button>
                        <button onClick={handleCancelClick}>Cancel</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default MaintenanceRequestDetails;