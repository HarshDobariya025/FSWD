
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventForm from '@/components/EventForm';
import EventCard from '@/components/EventCard';
import EventDetails from '@/components/EventDetails';
import SearchBar from '@/components/SearchBar';
import { api, Event } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('events');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Protect this route
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch events
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      try {
        const allEvents = await api.getEvents();
        setEvents(allEvents);
        setFilteredEvents(allEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        toast.error('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      loadEvents();
    }
  }, [isAuthenticated]);

  // Handle create event
  const handleCreateEvent = async (formData: Omit<Event, 'id' | 'createdBy'>) => {
    setIsLoading(true);
    try {
      const newEvent = await api.createEvent({
        ...formData,
        createdBy: user?.id || '',
      });
      setEvents([newEvent, ...events]);
      setFilteredEvents([newEvent, ...filteredEvents]);
      setActiveTab('events');
      toast.success('Event created successfully!');
    } catch (error) {
      console.error('Failed to create event:', error);
      toast.error('Failed to create event');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle update event
  const handleUpdateEvent = async (formData: Partial<Event>) => {
    if (!selectedEvent) return;

    setIsLoading(true);
    try {
      const updatedEvent = await api.updateEvent(selectedEvent.id, formData);
      setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
      setFilteredEvents(filteredEvents.map(event => event.id === updatedEvent.id ? updatedEvent : event));
      setSelectedEvent(null);
      setActiveTab('events');
      toast.success('Event updated successfully!');
    } catch (error) {
      console.error('Failed to update event:', error);
      toast.error('Failed to update event');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete event
  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;

    setIsLoading(true);
    try {
      await api.deleteEvent(eventToDelete);
      setEvents(events.filter(event => event.id !== eventToDelete));
      setFilteredEvents(filteredEvents.filter(event => event.id !== eventToDelete));
      setIsDeleteDialogOpen(false);
      setEventToDelete(null);
      toast.success('Event deleted successfully!');
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error('Failed to delete event');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredEvents(events);
      return;
    }

    setIsLoading(true);
    try {
      const results = await api.searchEvents(query);
      setFilteredEvents(results);
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle view event
  const handleViewEvent = async (id: string) => {
    try {
      const event = await api.getEventById(id);
      if (event) {
        setSelectedEvent(event);
        setIsViewModalOpen(true);
      }
    } catch (error) {
      console.error('Failed to fetch event details:', error);
      toast.error('Failed to load event details');
    }
  };

  // Handle edit event
  const handleEditEvent = (id: string) => {
    const event = events.find(e => e.id === id);
    if (event) {
      setSelectedEvent(event);
      setActiveTab('edit');
    }
  };

  // Handle confirm delete
  const handleConfirmDelete = (id: string) => {
    setEventToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="container py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Event Dashboard</h1>
            <p className="text-sm text-gray-500">Manage your college events</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {activeTab === 'events' && (
              <SearchBar onSearch={handleSearch} />
            )}
            
            <TabsList>
              <TabsTrigger value="events">All Events</TabsTrigger>
              <TabsTrigger value="create">
                <Plus size={16} className="mr-1" /> New Event
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="events" className="mt-6 animate-fade-in">
          {isLoading ? (
            <div className="text-center py-8">Loading events...</div>
          ) : filteredEvents.length > 0 ? (
            <>
              {searchQuery && (
                <div className="mb-4 text-sm">
                  Showing {filteredEvents.length} results for "{searchQuery}"
                  <Button variant="ghost" size="sm" onClick={() => handleSearch('')}>
                    Clear
                  </Button>
                </div>
              )}
              <div className="event-card-grid">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onView={handleViewEvent}
                    onEdit={() => handleEditEvent(event.id)}
                    onDelete={() => handleConfirmDelete(event.id)}
                    showActions={true}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-lg font-medium mb-2">No events found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? `No events match your search for "${searchQuery}"`
                  : "You haven't created any events yet"}
              </p>
              <Button onClick={() => setActiveTab('create')}>
                <Plus size={16} className="mr-1" /> Create Event
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="create" className="mt-6 animate-fade-in">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h2 className="text-xl font-semibold mb-6">Create New Event</h2>
            <EventForm onSubmit={handleCreateEvent} isLoading={isLoading} />
          </div>
        </TabsContent>

        <TabsContent value="edit" className="mt-6 animate-fade-in">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h2 className="text-xl font-semibold mb-6">Edit Event</h2>
            <EventForm 
              onSubmit={handleUpdateEvent} 
              initialData={selectedEvent}
              isLoading={isLoading}
            />
          </div>
        </TabsContent>
      </Tabs>

      <EventDetails
        event={selectedEvent}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        onEdit={handleEditEvent}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this event. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEvent} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
