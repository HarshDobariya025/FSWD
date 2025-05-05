
import { toast } from 'sonner';

// Define event type
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  type: string;
  imageUrl: string;
  createdBy: string;
}

// Mock data for events
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Annual Tech Symposium',
    description: 'Join us for a day of tech talks, workshops, and networking opportunities with industry professionals.',
    date: '2025-06-15',
    time: '09:00 AM',
    location: 'Main Auditorium',
    organizer: 'Computer Science Department',
    type: 'Academic',
    imageUrl: 'https://source.unsplash.com/random/800x600/?tech',
    createdBy: '1234'
  },
  {
    id: '2',
    title: 'Spring Music Festival',
    description: 'Annual college music festival featuring performances from student bands and special guest artists.',
    date: '2025-05-20',
    time: '06:00 PM',
    location: 'Campus Quad',
    organizer: 'Student Activities Board',
    type: 'Cultural',
    imageUrl: 'https://source.unsplash.com/random/800x600/?music',
    createdBy: '1234'
  },
  {
    id: '3',
    title: 'Career Fair 2025',
    description: 'Connect with over 50 employers looking to hire interns and full-time employees.',
    date: '2025-07-10',
    time: '10:00 AM',
    location: 'Student Union',
    organizer: 'Career Services',
    type: 'Career',
    imageUrl: 'https://source.unsplash.com/random/800x600/?career',
    createdBy: '1234'
  },
  {
    id: '4',
    title: 'Basketball Tournament',
    description: 'Inter-department basketball tournament with prizes for winning teams.',
    date: '2025-05-15',
    time: '02:00 PM',
    location: 'Sports Complex',
    organizer: 'Sports Department',
    type: 'Sports',
    imageUrl: 'https://source.unsplash.com/random/800x600/?basketball',
    createdBy: '1234'
  }
];

// Store events in localStorage
const saveEvents = (events: Event[]) => {
  localStorage.setItem('events', JSON.stringify(events));
};

// Get events from localStorage or use mock data
const getStoredEvents = (): Event[] => {
  const storedEvents = localStorage.getItem('events');
  if (storedEvents) {
    return JSON.parse(storedEvents);
  }
  saveEvents(mockEvents);
  return mockEvents;
};

// Mock API methods
export const api = {
  // Get all events
  getEvents: async (): Promise<Event[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return getStoredEvents();
  },

  // Get event by ID
  getEventById: async (id: string): Promise<Event | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const events = getStoredEvents();
    return events.find(event => event.id === id);
  },

  // Create new event
  createEvent: async (eventData: Omit<Event, 'id'>): Promise<Event> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newEvent: Event = {
      ...eventData,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    const events = getStoredEvents();
    events.push(newEvent);
    saveEvents(events);
    
    toast.success('Event created successfully!');
    return newEvent;
  },

  // Update event
  updateEvent: async (id: string, eventData: Partial<Event>): Promise<Event> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const events = getStoredEvents();
    const eventIndex = events.findIndex(event => event.id === id);
    
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }
    
    const updatedEvent = { ...events[eventIndex], ...eventData };
    events[eventIndex] = updatedEvent;
    saveEvents(events);
    
    toast.success('Event updated successfully!');
    return updatedEvent;
  },

  // Delete event
  deleteEvent: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const events = getStoredEvents();
    const updatedEvents = events.filter(event => event.id !== id);
    
    if (events.length === updatedEvents.length) {
      throw new Error('Event not found');
    }
    
    saveEvents(updatedEvents);
    toast.success('Event deleted successfully!');
  },

  // Search events
  searchEvents: async (query: string): Promise<Event[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const events = getStoredEvents();
    const lowerQuery = query.toLowerCase();
    
    return events.filter(event => 
      event.title.toLowerCase().includes(lowerQuery) || 
      event.description.toLowerCase().includes(lowerQuery) ||
      event.location.toLowerCase().includes(lowerQuery) ||
      event.type.toLowerCase().includes(lowerQuery)
    );
  }
};

// Function to convert File to base64 for image upload simulation
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
