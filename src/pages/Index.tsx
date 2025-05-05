
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { api, Event } from '@/services/api';
import EventCard from '@/components/EventCard';
import EventDetails from '@/components/EventDetails';
import SearchBar from '@/components/SearchBar';
import { useAuth } from '@/context/AuthContext';
import { Calendar } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const allEvents = await api.getEvents();
        setEvents(allEvents);
        setFilteredEvents(allEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setFilteredEvents(events);
      return;
    }

    try {
      const results = await api.searchEvents(query);
      setFilteredEvents(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleViewEvent = async (id: string) => {
    try {
      const event = await api.getEventById(id);
      if (event) {
        setSelectedEvent(event);
        setIsViewModalOpen(true);
      }
    } catch (error) {
      console.error('Failed to fetch event details:', error);
    }
  };

  const upcomingEvents = filteredEvents
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-college-purple/90 to-college-dark-purple text-white py-16">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Discover & Join College Events
              </h1>
              <p className="text-lg md:text-xl text-white/80">
                Stay connected with all the exciting events happening around your campus.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="bg-white text-college-purple hover:bg-white/90">
                      Manage Events
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button size="lg" className="bg-white text-college-purple hover:bg-white/90">
                      Get Started
                    </Button>
                  </Link>
                )}
                <Button size="lg" className="border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <img 
                src="https://www.shutterstock.com/image-vector/cheerful-college-students-books-backpacks-600nw-1715887273.jpg" 
                alt="College Events" 
                className="rounded-lg shadow-lg max-w-md w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search & Featured Events Section */}
      <section className="py-12 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Events</h2>
              <p className="text-gray-600">Browse upcoming events on campus</p>
            </div>
            <SearchBar onSearch={handleSearch} />
          </div>

          {isLoading ? (
            <div className="text-center py-12">Loading events...</div>
          ) : filteredEvents.length > 0 ? (
            <div className="event-card-grid">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onView={handleViewEvent}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-gray-600">No events found</p>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container px-4 mx-auto">
            <div className="flex items-center mb-8">
              <Calendar size={24} className="text-college-purple mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onView={handleViewEvent}
                />
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                <Button variant="outline">
                  {isAuthenticated ? "View All Events" : "Sign In to Browse More"}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer Section */}
      <footer className="bg-gray-100 py-8">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-college-purple">CollegeBuzz</h3>
              <p className="text-sm text-gray-600">© 2025 College Event Management</p>
            </div>
            <div className="flex space-x-6">
              <Link to="/" className="text-gray-600 hover:text-college-purple">About</Link>
              <Link to="/" className="text-gray-600 hover:text-college-purple">Contact</Link>
              <Link to="/" className="text-gray-600 hover:text-college-purple">Privacy</Link>
              <Link to="/" className="text-gray-600 hover:text-college-purple">Terms</Link>
            </div>
          </div>
        </div>
      </footer>

      <EventDetails
        event={selectedEvent}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />
    </div>
  );
};

export default Index;
