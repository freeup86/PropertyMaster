// File: PropertyMaster/Client/Web/property-master-web/src/services/calendarService.ts
import axios from 'axios';
import { formatISO } from 'date-fns';

// Define the base URL for your API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5044';

// Define an interface matching the backend CalendarEventDto
export interface CalendarEvent {
    id: string;
    title: string;
    start: string; // Keep as string to match backend
    end?: string | null;
    eventType: string;
    color?: string;
    relatedEntityId?: string | null;
}

// Function to fetch calendar events from the API
export const getCalendarEvents = async (startDate?: Date, endDate?: Date): Promise<CalendarEvent[]> => {
    try {
        // Prepare query parameters if dates are provided
        const params = new URLSearchParams();
        if (startDate) {
            params.append('startDate', formatISO(startDate, { representation: 'date' }));
        }
        if (endDate) {
            params.append('endDate', formatISO(endDate, { representation: 'date' }));
        }

        // Make the GET request using axios
        const response = await axios.get<CalendarEvent[]>(`${API_BASE_URL}/api/calendar`, { params });

        // Return the raw API data without parsing dates
        return response.data;

    } catch (error) {
        console.error("Error fetching calendar events:", error);
        throw error; // Re-throw error to be caught by the calling component
    }
};