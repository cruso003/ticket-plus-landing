// store/eventStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { TICKETPLUS_API_URL } from '@/constants';

export interface Event {
  _id: string;
  name: string;
  description: string;
  aboutOrganizer: string;
  imageUrl: string;
  location: string;
  country: string;
  startingTime: string;
  endingTime: string;
  category: string;
  quantity: number;
  tickets: Ticket[];
  merchandise?: MerchandiseItem[];
}

export interface Ticket {
  _id: string;
  name: string;
  price: number;
  qrIdentifier?: string;
}

export interface MerchandiseItem {
  _id: string;
  itemName: string;
  itemImage: string;
  price: number;
}

interface CartItem {
  _id: string;
  event: Event;
  ticketId: string;
  ticketName: string;
  salePrice: number;
  qty: number;
  country: string;
  merchandise: {
    _id: string;
    itemName: string;
    price: number;
    qty: number;
  }[];
}

interface EventState {
  events: Event[];
  filteredEvents: Event[];
  selectedCountry: string;
  isLoading: boolean;
  error: string | null;
  
  // Methods
  fetchAllEvents: () => Promise<void>;
  filterEventsByCountry: (country: string) => void;
  getEventById: (id: string) => Promise<Event | null>;
  getUpcomingEvents: (country: string, days: number) => Event[];
  
  // Cart
  cart: CartItem[];
  addToCart: (cartItem: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, type: 'more' | 'less', maxQty?: number) => void;
  updateMerchandiseQuantity: (cartIndex: number, merchIndex: number, type: 'more' | 'less') => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
}

const useEventStore = create<EventState>()(
    persist(
      (set, get) => ({
        events: [],
        filteredEvents: [],
        selectedCountry: 'Nigeria',
        isLoading: false,
        error: null,
        cart: [],
        
        fetchAllEvents: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await axios.get(`${TICKETPLUS_API_URL}/events`);
            const allEvents = response.data.events || response.data || []; // Handle different response formats
            set({ events: allEvents, isLoading: false });
            
            // Also filter events by the currently selected country
            const { selectedCountry } = get();
            get().filterEventsByCountry(selectedCountry);
          } catch (error) {
            console.error('Error fetching events:', error);
            set({ 
              error: 'Failed to fetch events', 
              isLoading: false,
              // Keep existing events in case this is a refresh failure
              filteredEvents: get().selectedCountry ? 
                get().events.filter(e => e.country === get().selectedCountry) : 
                []
            });
          }
        },
        
        filterEventsByCountry: (country: string) => {
          const { events } = get();
          const filtered = events.filter(event => event.country === country);
          set({ filteredEvents: filtered, selectedCountry: country });
        },
        
        getEventById: async (id: string) => {
          const { events } = get();
          const event = events.find(e => e._id === id);
          
          if (event) return event;
          
          try {
            const response = await axios.get(`${TICKETPLUS_API_URL}/events/${id}`);
            return response.data.event || response.data; 
          } catch (error) {
            console.error('Error fetching event details:', error);
            return null;
          }
        },
        
        getUpcomingEvents: (country, days) => {
          const { events } = get();
          const now = new Date();
          const futureDate = new Date();
          futureDate.setDate(now.getDate() + days);
          
          return events.filter(event => {
            const eventDate = new Date(event.startingTime);
            return event.country === country && eventDate >= now && eventDate <= futureDate;
          }).sort((a, b) => new Date(a.startingTime).getTime() - new Date(b.startingTime).getTime());
        },
      
      addToCart: (cartItem) => {
        const { cart } = get();
        const existingItemIndex = cart.findIndex(item => 
          item.event._id === cartItem.event._id && item.ticketId === cartItem.ticketId
        );
        
        if (existingItemIndex >= 0) {
          const updatedCart = [...cart];
          updatedCart[existingItemIndex].qty += cartItem.qty;
          set({ cart: updatedCart });
        } else {
          set({ cart: [...cart, cartItem] });
        }
      },
      
      removeFromCart: (index) => {
        const { cart } = get();
        const newCart = [...cart];
        newCart.splice(index, 1);
        set({ cart: newCart });
      },
      
      updateQuantity: (index, type, maxQty = Infinity) => {
        const { cart } = get();
        const newCart = [...cart];
        
        if (type === 'more' && newCart[index].qty < maxQty) {
          newCart[index].qty += 1;
        } else if (type === 'less' && newCart[index].qty > 1) {
          newCart[index].qty -= 1;
        }
        
        set({ cart: newCart });
      },
      
      updateMerchandiseQuantity: (cartIndex, merchIndex, type) => {
        const { cart } = get();
        const newCart = [...cart];
        
        if (type === 'more') {
          newCart[cartIndex].merchandise[merchIndex].qty += 1;
        } else if (type === 'less' && newCart[cartIndex].merchandise[merchIndex].qty > 1) {
          newCart[cartIndex].merchandise[merchIndex].qty -= 1;
        }
        
        set({ cart: newCart });
      },
      
      clearCart: () => set({ cart: [] }),
      
      getCartSubtotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => {
          // Tickets total
          const ticketTotal = item.salePrice * item.qty;
          
          // Merchandise total
          const merchTotal = item.merchandise.reduce(
            (sum, merch) => sum + (merch.price * merch.qty), 0
          );
          
          return total + ticketTotal + merchTotal;
        }, 0);
      }
    }),
    {
      name: 'event-storage',
      partialize: (state) => ({ cart: state.cart, selectedCountry: state.selectedCountry }),
    }
  )
);

export default useEventStore;
