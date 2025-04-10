"use client";
import React, { useEffect, useState } from 'react';
import useEventStore, { Event } from '@/store/eventStore';
import { Header } from '@/components/header/page';
import { Footer } from '@/components/footer/page';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { 
  Loader2, 
  Calendar, 
  MapPin, 
  ChevronDown, 
  X, 
  SlidersHorizontal,
  Check 
} from 'lucide-react';
import { currencyMapping } from '@/utils/currency';

// Event status badge component
const EventStatusBadge = ({ event }: { event: Event }) => {
  const now = new Date();
  const startDate = new Date(event.startingTime);
  const endDate = new Date(event.endingTime);
  
  let status: 'upcoming' | 'ongoing' | 'past';
  
  if (now < startDate) {
    status = 'upcoming';
  } else if (now >= startDate && now <= endDate) {
    status = 'ongoing';
  } else {
    status = 'past';
  }
  
  const statusConfig = {
    upcoming: {
      text: 'Upcoming',
      bgColor: 'bg-blue-600',
      textColor: 'text-white'
    },
    ongoing: {
      text: 'Live Now',
      bgColor: 'bg-green-600',
      textColor: 'text-white'
    },
    past: {
      text: 'Past Event',
      bgColor: 'bg-gray-600',
      textColor: 'text-white'
    }
  };
  
  const config = statusConfig[status];
  
  return (
    <span className={`absolute top-3 right-3 ${config.bgColor} ${config.textColor} text-xs font-medium px-2 py-1 rounded-full z-10`}>
      {config.text}
    </span>
  );
};

type StatusFilter = 'All Status' | 'Upcoming' | 'Live Now' | 'Past Events';

// Dropdown component for filters
interface FilterOption<T = string> {
    title: string;
    options: T[];
    selectedOption: T;
    onChange: (option: T) => void;
}

const FilterDropdown = <T extends string>({ 
    title, 
    options, 
    selectedOption, 
    onChange 
}: FilterOption<T>) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    
    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-gray-800 px-4 py-2 rounded-lg text-white"
            >
                <span>{title}: <span className="text-purple-400">{selectedOption}</span></span>
                <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            
            {isOpen && (
                <div className="absolute z-20 mt-1 w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="max-h-60 overflow-y-auto py-1">
                        {options.map((option: string) => (
                            <button
                                key={option}
                                className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center justify-between"
                                onClick={() => {
                                    onChange(option as T);
                                    setIsOpen(false);
                                }}
                            >
                                <span className="text-white">{option}</span>
                                {selectedOption === option && <Check className="w-4 h-4 text-purple-400" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Filter drawer for mobile
const FilterDrawer = ({ 
  isOpen, 
  onClose,
  countries,
  selectedCountry,
  onCountryChange,
  statuses,
  selectedStatus,
  onStatusChange,
  categories,
  selectedCategory,
  onCategoryChange
}: { 
  isOpen: boolean;
  onClose: () => void;
  countries: string[];
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  statuses: StatusFilter[];
  selectedStatus: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string) => void;
}) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 mt-8"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 mt-8 w-80 max-w-full bg-gray-900 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-white text-xl font-semibold">Filters</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-full"
            title="Close filters"
            aria-label="Close filters"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto h-full pb-20 mt-5">
          {/* Country Filter */}
          <div className="mb-8">
            <h3 className="text-white font-medium mb-3">Country</h3>
            <div className="space-y-2">
              {countries.map(country => (
                <button
                  key={country}
                  onClick={() => {
                    onCountryChange(country);
                    // Don't close drawer to allow multiple selections
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center justify-between ${
                    selectedCountry === country
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span>{country}</span>
                  {selectedCountry === country && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="mb-8">
            <h3 className="text-white font-medium mb-3">Event Status</h3>
            <div className="space-y-2">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => {
                    onStatusChange(status);
                    // Don't close drawer to allow multiple selections
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center justify-between ${
                    selectedStatus === status
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span>{status}</span>
                  {selectedStatus === status && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
          
          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="mb-12">
              <h3 className="text-white font-medium mb-3">Category</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      onCategoryChange(category);
                      // Don't close drawer to allow multiple selections
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center justify-between ${
                      selectedCategory === category
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span>{category}</span>
                    {selectedCategory === category && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-gray-900">
          <button
            onClick={onClose}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

const EventsPage = () => {
  const { 
    events, 
    filteredEvents,
    fetchAllEvents, 
    filterEventsByCountry,
    isLoading, 
    selectedCountry,
    getUpcomingEvents
  } = useEventStore();
  
  const [countries] = useState([
    'Nigeria', 'Rwanda', 'Liberia', 'Uganda'
  ]);
  
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('All Status');
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);
  
  useEffect(() => {
    // Update upcoming events when country changes or events are loaded
    if (events.length > 0) {
      setUpcomingEvents(getUpcomingEvents(selectedCountry, 90));
    }
  }, [getUpcomingEvents, selectedCountry, events]);

  // Ensure we set a default category on first load or when filtered events change
  useEffect(() => {
    if (filteredEvents.length > 0 && activeCategory === null) {
      setActiveCategory('All');
    }
  }, [filteredEvents, activeCategory]);

  // Handle country change
  const handleCountryChange = (country: string): void => {
    filterEventsByCountry(country);
    // Reset category selection when changing country
    setActiveCategory('All');
  };
  
  // Handle status change
  const handleStatusChange = (status: StatusFilter): void => {
    setActiveStatus(status);
  };

  // Get unique categories from filtered events
  const eventCategories = ['All', ...Array.from(new Set(filteredEvents.map(event => event.category)))];
  
  // Filter events by category and status
  const getFilteredEvents = () => {
    const now = new Date();
    
    // First filter by category
    const categoryFiltered = !activeCategory || activeCategory === 'All' 
      ? filteredEvents 
      : filteredEvents.filter(event => event.category === activeCategory);
    
    // Then filter by status
    if (activeStatus === 'All Status') {
      return categoryFiltered;
    }
    
    return categoryFiltered.filter(event => {
      const startDate = new Date(event.startingTime);
      const endDate = new Date(event.endingTime);
      
      switch (activeStatus) {
        case 'Upcoming':
          return now < startDate;
        case 'Live Now':
          return now >= startDate && now <= endDate;
        case 'Past Events':
          return now > endDate;
        default:
          return true;
      }
    });
  };
  
  const displayEvents = getFilteredEvents();

  // Event Card Component to avoid duplication
  const EventCard = ({ event }: { event: Event }) => (
    <Link href={`/events/${event._id}`} className="block">
      <div className="bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-xl h-full">
        <div className="relative h-48">
          {/* Status Badge */}
          <EventStatusBadge event={event} />
          
          <Image
            src={event.imageUrl || '/images/event-placeholder.jpg'}
            alt={event.name}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <span className="inline-block bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
              {event.category}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">{event.name}</h3>
          <p className="text-gray-300 text-sm mb-2 flex items-center">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </p>
          <div className="flex items-center text-sm text-gray-400 mb-3">
            <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
            <span>{format(new Date(event.startingTime), 'MMM dd, yyyy • h:mm a')}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-purple-400 font-medium">
              {event.tickets.length > 0 && 
                `From ${currencyMapping[event.country] || '$'}${Math.min(...event.tickets.map(t => t.price))}`
              }
            </div>
            <div className="text-xs text-gray-400">
              {event.quantity} tickets left
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />
      <main className="flex-grow pt-24 pb-12 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Events</h1>
            
            {/* Mobile Filter Button */}
            <button 
              className="md:hidden bg-gray-800 p-2 rounded-lg text-white flex items-center gap-2"
              onClick={() => setIsDrawerOpen(true)}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
          
          {/* Desktop Filters - Dropdowns */}
          <div className="hidden md:grid md:grid-cols-3 gap-4 mb-8">
            <FilterDropdown 
              title="Country" 
              options={countries} 
              selectedOption={selectedCountry} 
              onChange={handleCountryChange} 
            />
            
            <FilterDropdown 
              title="Event Status" 
              options={['All Status', 'Upcoming', 'Live Now', 'Past Events']} 
              selectedOption={activeStatus} 
              onChange={handleStatusChange} 
            />
            
            {eventCategories.length > 0 && (
              <FilterDropdown 
                title="Category" 
                options={eventCategories} 
                selectedOption={activeCategory || 'All'} 
                onChange={setActiveCategory} 
              />
            )}
          </div>
          
          {/* Active Filters Summary */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-gray-400">Active filters:</span>
              <div className="flex flex-wrap gap-2">
                <span className="bg-purple-600/20 text-purple-400 text-sm px-3 py-1 rounded-full flex items-center">
                  {selectedCountry}
                </span>
                
                {activeStatus !== 'All Status' && (
                  <span className="bg-purple-600/20 text-purple-400 text-sm px-3 py-1 rounded-full flex items-center">
                    {activeStatus}
                  </span>
                )}
                
                {activeCategory && activeCategory !== 'All' && (
                  <span className="bg-purple-600/20 text-purple-400 text-sm px-3 py-1 rounded-full flex items-center">
                    {activeCategory}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Events Section */}
          {upcomingEvents.length > 0 && activeCategory === 'All' && activeStatus === 'All Status' && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-white mb-6">Upcoming Events in {selectedCountry}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.slice(0, 3).map(event => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            </div>
          )}
          
          {/* Events Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
            </div>
          ) : displayEvents.length > 0 ? (
            <>
              <h2 className="text-2xl font-bold text-white mt-8 mb-6">
                {activeCategory === 'All' ? 'All Events' : activeCategory} in {selectedCountry}
                {activeStatus !== 'All Status' && ` - ${activeStatus}`}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayEvents.map(event => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 mt-8">
              <h3 className="text-xl text-gray-400">No events found with the selected filters</h3>
              <p className="text-gray-500 mt-2">Try changing your filters or check back later.</p>
            </div>
          )}
        </div>
      </main>
      
      {/* Mobile Filter Drawer */}
      <FilterDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        countries={countries}
        selectedCountry={selectedCountry}
        onCountryChange={handleCountryChange}
        statuses={['All Status', 'Upcoming', 'Live Now', 'Past Events']}
        selectedStatus={activeStatus}
        onStatusChange={handleStatusChange}
        categories={eventCategories}
        selectedCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      <Footer />
    </div>
  );
};

export default EventsPage;
