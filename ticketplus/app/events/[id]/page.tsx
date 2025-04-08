"use client";
import React, { useEffect, useState } from 'react';
import useEventStore, { Event, MerchandiseItem, Ticket } from '@/store/eventStore';
import { Header } from '@/components/header/page';
import { Footer } from '@/components/footer/page';
import Image from 'next/image';
import { format } from 'date-fns';
import { Loader2, Calendar, Clock, MapPin, Check, X, Info } from 'lucide-react';
import { currencyMapping } from '@/utils/currency';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from '@/lib/utils';
import MiniCartDrawer from '@/components/cart/MiniCartDrawer';

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
      variant: 'default' as const
    },
    ongoing: {
      text: 'Live Now',
      variant: 'destructive' as const // or another valid variant
    },
    past: {
      text: 'Past Event',
      variant: 'secondary' as const
    }
  };
  
  const config = statusConfig[status];
  
  return (
    <Badge 
      className="absolute top-4 right-4 z-10" 
      variant={config.variant}
    >
      {config.text}
    </Badge>
  );
};

const EventDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { getEventById, addToCart } = useEventStore();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedMerchandise, setSelectedMerchandise] = useState<MerchandiseItem[]>([]);
  const [showMiniCart, setShowMiniCart] = useState(false);
  
  useEffect(() => {
    const fetchEvent = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const eventData = await getEventById(id as string);
          if (eventData) {
            setEvent(eventData);
          } else {
            toast.error('Event not found');
            router.push('/events');
          }
        } catch (error) {
          console.error('Error fetching event:', error);
          toast.error('Failed to load event details');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchEvent();
  }, [id, getEventById, router]);
  
  if (isLoading || !event) {
    return (
      <>
        <Header />
        <div className="pt-24 min-h-screen flex justify-center items-center bg-black">
          <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
        </div>
        <Footer />
      </>
    );
  }
  
  const isEventOver = new Date() > new Date(event.endingTime);
  const isSoldOut = event.quantity < 1;
  
  const toggleMerchandise = (item: MerchandiseItem) => {
    setSelectedMerchandise(prev => {
      const exists = prev.some(m => m._id === item._id);
      
      if (exists) {
        return prev.filter(m => m._id !== item._id);
      } else {
        return [...prev, { ...item }];
      }
    });
  };
  
  const handleAddToCart = () => {
    if (!selectedTicket) {
      toast.error('Please select a ticket');
      return;
    }
    
    // Format merchandise for cart
    const merchandise = selectedMerchandise.map(item => ({
      _id: item._id,
      itemName: item.itemName,
      price: item.price,
      qty: 1
    }));
    
    // Add to cart
    addToCart({
      _id: event._id,
      event,
      ticketId: selectedTicket._id,
      ticketName: selectedTicket.name,
      salePrice: selectedTicket.price,
      qty: 1,
      country: event.country,
      merchandise
    });
    
    // Show mini cart instead of redirect
    setShowMiniCart(true);
  };
  // Calculate total
  const calculateTotal = () => {
    const ticketPrice = selectedTicket?.price || 0;
    const merchandiseTotal = selectedMerchandise.reduce((sum, item) => sum + item.price, 0);
    return ticketPrice + merchandiseTotal;
  };

  return (
    <>
      <Header />
      <div className="pt-24 pb-12 min-h-screen bg-black">
        {/* Event Header Banner */}
        <div className="relative w-full overflow-hidden mb-10">
          <div className="h-[500px] relative">
            <EventStatusBadge event={event} />
            <Image
              src={event.imageUrl || '/images/event-placeholder.jpg'}
              alt={event.name}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <Badge className="mb-3 bg-purple-600 hover:bg-purple-700 text-white">
                {event.category}
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">{event.name}</h1>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-300 mt-4">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-purple-400" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-purple-400" />
                  <span>{format(new Date(event.startingTime), 'EEEE, MMMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-purple-400" />
                  <span>{format(new Date(event.startingTime), 'h:mm a')} - {format(new Date(event.endingTime), 'h:mm a')}</span>
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-4">
                {event.tickets.length > 0 && (
                  <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-800">
                    <span className="text-gray-400 text-sm">From</span>
                    <span className="text-white text-lg font-bold ml-2">
                      {currencyMapping[event.country] || '$'}{Math.min(...event.tickets.map(t => t.price))}
                    </span>
                  </div>
                )}
                
                <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-800">
                  <span className="text-gray-400 text-sm">Available</span>
                  <span className="text-white text-lg font-bold ml-2">
                    {event.quantity} tickets
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* About Tabs */}
              <Tabs defaultValue="about" className="mb-8">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="about">About Event</TabsTrigger>
                  <TabsTrigger value="organizer">About Organizer</TabsTrigger>
                </TabsList>
                <TabsContent value="about">
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="pt-6">
                      <p className="text-gray-300 leading-relaxed">
                        {event.description || "No description available for this event."}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="organizer">
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="pt-6">
                      <p className="text-gray-300 leading-relaxed">
                        {event.aboutOrganizer || "No information available about the organizer."}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              {/* Event Schedule */}
              <Card className="mb-8 bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Event Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start">
                      <div className="bg-purple-950 p-3 mr-4 rounded-lg">
                        <Calendar className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Date</div>
                        <div className="font-medium text-white">
                          {format(new Date(event.startingTime), 'EEEE, MMMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purple-950 p-3 mr-4 rounded-lg">
                        <Clock className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Time</div>
                        <div className="font-medium text-white">
                          {format(new Date(event.startingTime), 'h:mm a')} - {format(new Date(event.endingTime), 'h:mm a')}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Ticket & Merchandise Selection */}
            <div className="space-y-6">
              {/* Ticket Selection */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="border-b border-gray-800">
                  <CardTitle className="text-white">Select Tickets</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {isEventOver ? (
                    <div className="text-amber-400 bg-amber-950/60 rounded-lg p-4 flex items-center gap-3 border border-amber-900/40">
                      <div className="bg-amber-950 p-2 rounded-full">
                        <Clock className="h-5 w-5 text-amber-400" />
                      </div>
                      <p className="font-medium">This event has already ended.</p>
                    </div>
                  ) : isSoldOut ? (
                    <div className="text-red-400 bg-red-950/60 rounded-lg p-4 flex items-center gap-3 border border-red-900/40">
                      <div className="bg-red-950 p-2 rounded-full">
                        <X className="h-5 w-5 text-red-400" />
                      </div>
                      <p className="font-medium">This event is sold out.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {event.tickets.map(ticket => (
                        <div 
                          key={ticket._id}
                          onClick={() => !isEventOver && !isSoldOut && setSelectedTicket(ticket)}
                          className={cn(
                            "flex justify-between items-center p-4 rounded-lg cursor-pointer transition-colors",
                            selectedTicket?._id === ticket._id 
                              ? 'bg-purple-950/70 ring-1 ring-purple-500 border border-purple-800' 
                              : 'bg-gray-800 hover:bg-gray-800/80 border border-gray-700'
                          )}
                        >
                          <div>
                            <div className="font-medium text-lg text-white">{ticket.name}</div>
                            <div className="text-purple-400 font-semibold">
                              {currencyMapping[event.country] || '$'}{ticket.price.toFixed(2)}
                            </div>
                          </div>
                          {selectedTicket?._id === ticket._id ? (
                            <div className="bg-purple-600 p-2 rounded-full">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 border-2 border-gray-500 rounded-full"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Merchandise Selection */}
              {event.merchandise && event.merchandise.length > 0 && (
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="border-b border-gray-800">
                    <CardTitle className="text-white">Add Merchandise</CardTitle>
                    <CardDescription className="text-gray-400">
                      Enhance your experience with official event merchandise
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {event.merchandise.map(item => (
                        <div 
                          key={item._id}
                          onClick={() => toggleMerchandise(item)}
                          className={cn(
                            "flex justify-between items-center p-4 rounded-lg cursor-pointer transition-colors",
                            selectedMerchandise.some(m => m._id === item._id)
                              ? 'bg-purple-950/70 ring-1 ring-purple-500 border border-purple-800' 
                              : 'bg-gray-800 hover:bg-gray-800/80 border border-gray-700'
                          )}
                        >
                          <div className="flex items-center">
                            {item.itemImage && (
                              <div className="relative h-16 w-16 rounded-md overflow-hidden mr-4 border border-gray-700">
                                <Image
                                  src={item.itemImage}
                                  alt={item.itemName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-white">{item.itemName}</div>
                              <div className="text-purple-400 font-semibold">
                                {currencyMapping[event.country] || '$'}{item.price.toFixed(2)}
                              </div>
                            </div>
                          </div>
                          {selectedMerchandise.some(m => m._id === item._id) ? (
                            <div className="bg-purple-600 p-2 rounded-full">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 border-2 border-gray-500 rounded-full"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Order Summary */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="border-b border-gray-800">
                  <CardTitle className="text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {selectedTicket ? (
                    <div className="space-y-4">
                      <div className="flex justify-between py-2">
                        <span className="text-gray-400">{selectedTicket.name} Ticket</span>
                        <span className="font-medium text-white">{currencyMapping[event.country] || '$'}{selectedTicket.price.toFixed(2)}</span>
                      </div>
                      
                      {selectedMerchandise.length > 0 && (
                        <>
                          <Separator className="bg-gray-800" />
                          {selectedMerchandise.map(item => (
                            <div key={item._id} className="flex justify-between py-2">
                              <span className="text-gray-400">{item.itemName}</span>
                              <span className="font-medium text-white">{currencyMapping[event.country] || '$'}{item.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </>
                      )}
                      
                      <Separator className="bg-gray-800" />
                      <div className="flex justify-between py-2 font-bold">
                        <span className="text-white">Total</span>
                        <span className="text-purple-400 text-lg">
                          {currencyMapping[event.country] || '$'}{calculateTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-4 flex flex-col items-center">
                      <Info className="h-8 w-8 mb-2 text-gray-500" />
                      <p>Select a ticket to see your order summary</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-2">
                  <Button
                    onClick={handleAddToCart}
                    disabled={isEventOver || isSoldOut || !selectedTicket}
                    className="w-full py-6 text-lg bg-purple-600 hover:bg-purple-700 text-white"
                    size="lg"
                  >
                    {isEventOver 
                      ? 'Event Ended' 
                      : isSoldOut 
                        ? 'Sold Out' 
                        : !selectedTicket 
                          ? 'Select a Ticket' 
                          : 'Add to Cart'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <MiniCartDrawer 
        open={showMiniCart} 
        onClose={() => setShowMiniCart(false)} 
      />
    </>
  );
};

export default EventDetailsPage;
