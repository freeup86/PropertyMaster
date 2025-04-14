// File: PropertyMaster/Client/Web/property-master-web/src/components/calendar/CalendarView.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Views, View, EventProps } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import calendar styles
import { getCalendarEvents, CalendarEvent as ApiCalendarEvent } from '../../services/calendarService'; // Import service and type
import { CircularProgress, Typography, Box, Paper, Alert } from '@mui/material'; // Material UI components

// Setup the localizer by providing the required functions to react-big-calendar
const locales = {
    'en-US': enUS,
};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

// Define the event type expected by react-big-calendar
// It needs start/end as Date objects, and an optional 'resource' for resource views
interface CalendarDisplayEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    resource?: any; // Keep resource for compatibility, even if not used now
    color?: string; // Pass color through
    eventType?: string; // Pass event type through
}

// Custom Event component for styling (optional)
const CustomEvent: React.FC<EventProps<CalendarDisplayEvent>> = ({ event }) => (
    <div style={{ backgroundColor: event.color || '#3174ad', borderRadius: '3px', padding: '2px 4px', color: 'white', fontSize: '0.8em' }}>
        <strong>{event.title}</strong>
        {/* You could add more details here based on eventType if needed */}
    </div>
);


export const CalendarView: React.FC = () => {
    const [events, setEvents] = useState<CalendarDisplayEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<View>(Views.MONTH); // Default view
    const [currentDate, setCurrentDate] = useState<Date>(new Date()); // Track current date/range

    // Function to fetch events based on the calendar's visible range
    const fetchEvents = useCallback(async (fetchDate: Date, fetchView: View) => {
        setLoading(true);
        setError(null);
    
        try {
            let startDate: Date;
            let endDate: Date;
    
            if (fetchView === Views.MONTH) {
                const startOfMonthDate = new Date(fetchDate.getFullYear(), fetchDate.getMonth(), 1);
                startDate = startOfWeek(startOfMonthDate, { locale: enUS });
                const endOfMonthDate = new Date(fetchDate.getFullYear(), fetchDate.getMonth() + 1, 0);
                endDate = new Date(startOfWeek(endOfMonthDate, { locale: enUS }).getTime() + 6 * 24 * 60 * 60 * 1000);
            } else if (fetchView === Views.WEEK) {
                startDate = startOfWeek(fetchDate, { locale: enUS });
                endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);
            } else {
                startDate = new Date(fetchDate.setHours(0, 0, 0, 0));
                endDate = new Date(fetchDate.setHours(23, 59, 59, 999));
            }
    
            const apiEvents: ApiCalendarEvent[] = await getCalendarEvents(startDate, endDate);
    
            // Map API events to the format react-big-calendar expects
            const formattedEvents: CalendarDisplayEvent[] = apiEvents.map(e => ({
                id: e.id,
                title: e.title,
                start: new Date(e.start), // Convert string to Date
                end: e.end ? new Date(e.end) : new Date(e.start), // Convert string to Date, fallback to start
                allDay: !(e.end && new Date(e.start).toDateString() !== new Date(e.end).toDateString()), // Update allDay logic
                color: e.color,
                eventType: e.eventType,
            }));
    
            setEvents(formattedEvents);
        } catch (err) {
            setError("Failed to load calendar events. Please try again later.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []); // Dependencies for useCallback

    // Fetch events when component mounts or when view/date changes
    useEffect(() => {
        fetchEvents(currentDate, currentView);
    }, [fetchEvents, currentDate, currentView]);


    // Handlers for calendar navigation and view changes
    const handleNavigate = (newDate: Date) => {
        setCurrentDate(newDate);
    };

    const handleViewChange = (newView: View) => {
        setCurrentView(newView);
    };

    return (
        <Paper sx={{ p: 3, height: '80vh' }}> {/* Use Paper for background and padding */}
            <Typography variant="h4" gutterBottom>
                Event Calendar
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                </Box>
            )}
            {!loading && (
                 <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 'calc(100% - 50px)' }} // Adjust height as needed
                    views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]} // Allow different views
                    view={currentView} // Controlled view
                    date={currentDate} // Controlled date
                    onNavigate={handleNavigate} // Handle navigation
                    onView={handleViewChange} // Handle view change
                    components={{
                         event: CustomEvent, // Use custom component for event rendering
                    }}
                    eventPropGetter={(event) => ({ // Dynamically set style based on event props
                        style: {
                            backgroundColor: event.color,
                            borderRadius: '5px',
                            opacity: 0.8,
                            color: 'black',
                            border: '0px',
                            display: 'block'
                        }
                    })}
                />
            )}
        </Paper>
    );
};