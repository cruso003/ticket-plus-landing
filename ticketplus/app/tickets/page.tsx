// app/tickets/page.tsx
"use client";
import React, { useState } from "react";
import { Header } from "@/components/header/page";
import { Footer } from "@/components/footer/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Ticket, QrCode, Download, Search, Calendar, MapPin, AlertCircle, Mail, Smartphone } from "lucide-react";
import axios from "axios";
import { TICKETPLUS_API_URL } from "@/constants";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

interface MerchandiseItem {
  itemName: string;
  qty: number;
}

interface TicketItem {
  eventName: string;
  ticketName: string;
  quantity: number;
  startingTime: string;
  endingTime?: string;
  orderId: string;
  qrIdentifier?: string;
  pdfUrl?: string;
  eventLocation?: string;
  merchandise?: MerchandiseItem[];
  isUserOrder?: boolean;
}

const TicketsPage = () => {
  const [email, setEmail] = useState("");
  const [orderReference, setOrderReference] = useState("");
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState<{[key: string]: boolean}>({});
  const [hasSearched, setHasSearched] = useState(false);
  const [hasAppAccess, setHasAppAccess] = useState(false);

  const handleFindTickets = async () => {
    if (!email && !orderReference) {
      toast.error("Please enter your email or order reference");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const response = await axios.post(`${TICKETPLUS_API_URL}/tickets/find`, {
        email,
        orderReference
      });
      if (response.data.success) {
        setTickets(response.data.tickets);
        setHasAppAccess(response.data.hasAppAccess || false);
        
        if (response.data.tickets.length === 0) {
          toast.error("No tickets found");
        } else {
          toast.success(`Found ${response.data.tickets.length} ticket(s)`);
        }
      } else {
        toast.error(response.data.message || "Failed to find tickets");
        setTickets([]);
      }
    } catch (error) {
      console.error("Error finding tickets:", error);
      toast.error("Error finding tickets. Please try again.");
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTicket = async (ticket: TicketItem, index: number) => {
    // Set downloading state for this ticket
    setIsDownloading(prev => ({...prev, [index]: true}));
    
    try {
      // Create a direct URL to the download endpoint
      const downloadUrl = `${TICKETPLUS_API_URL}/tickets/download/${ticket.qrIdentifier}`;
      
      // Open the download URL in a new tab/window
      window.open(downloadUrl, '_blank');
      
      toast.success('Ticket download started');
    } catch (error) {
      console.error('Error downloading ticket:', error);
      toast.error('Failed to download ticket. Please try again.');
    } finally {
      setIsDownloading(prev => ({...prev, [index]: false}));
    }
  };

  // No tickets found state
  const NoTicketsFound = () => (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
      <div className="bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="h-8 w-8 text-amber-500" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No Tickets Found</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        We couldn&apos;t find any tickets associated with {email ? `the email "${email}"` : "this order reference"}. Please check your information and try again.
      </p>
      <div className="flex flex-col space-y-4 max-w-xs mx-auto">
        <Button
          onClick={() => {
            setEmail("");
            setOrderReference("");
            setHasSearched(false);
          }}
          variant="outline"
          className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
        >
          Try Different Details
        </Button>
        <Button
          onClick={() => window.location.href = `mailto:support@tick8plus.com?subject=Help with finding tickets&body=I'm having trouble finding my tickets. My email is: ${email}`}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Mail className="h-4 w-4 mr-2" />
          Contact Support
        </Button>
      </div>
    </div>
  );

  // App Access Banner
  const AppAccessBanner = () => (
    <div className="bg-purple-900/30 rounded-lg border border-purple-800 p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="bg-purple-900/50 rounded-full p-3 flex-shrink-0">
          <Smartphone className="h-6 w-6 text-purple-300" />
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-white mb-1">Access your tickets on mobile!</h3>
          <p className="text-gray-300 text-sm">
            We&apos;ve found that you have a Tick8+ account. You can also access these tickets and more through our mobile app for a better experience.
          </p>
        </div>
        <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2">
          <Link href="#" className="flex-1">
            <Image 
              src="/images/apple_badge.svg" 
              alt="Download on App Store" 
              width={130} 
              height={40} 
              className="h-auto"
            />
          </Link>
          <Link href="#" className="flex-1">
            <Image 
              src="/images/GetItOnGooglePlay_Badge_Web_color_English.png" 
              alt="Get it on Google Play" 
              width={130}
              height={40}
              className="h-auto" 
            />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Ticket className="h-8 w-8 text-purple-500 mr-3" />
            <h1 className="text-3xl font-bold text-white">Find Your Tickets</h1>
          </div>

          {/* Only show search form if no tickets found or hasn't searched yet */}
          {(tickets.length === 0 || !hasSearched) && (
            <Card className="bg-gray-900 border-gray-800 mb-8">
              <CardHeader>
                <CardTitle className="text-white">Enter Your Details</CardTitle>
                <CardDescription className="text-gray-400">
                  Find your tickets using the email you used for the purchase or your order reference number.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Email Address</label>
                    <Input
                      placeholder="Email used for purchase"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Order Reference (Optional)</label>
                    <Input
                      placeholder="Order reference number"
                      value={orderReference}
                      onChange={(e) => setOrderReference(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <Button 
                    onClick={handleFindTickets} 
                    disabled={isLoading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isLoading ? (
                      <>Searching...</>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Find My Tickets
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* No tickets found state */}
          {hasSearched && tickets.length === 0 && !isLoading && (
            <NoTicketsFound />
          )}

          {/* App access banner for registered users */}
          {hasAppAccess && tickets.length > 0 && (
            <AppAccessBanner />
          )}

          {/* Tickets list */}
          {tickets.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Your Tickets</h2>
                
                {/* Reset search button */}
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setEmail("");
                    setOrderReference("");
                    setHasSearched(false);
                    setHasAppAccess(false);
                  }}
                  className="text-gray-400 border-gray-700 hover:bg-gray-800"
                >
                  New Search
                </Button>
              </div>
              
              {tickets.map((ticket, index) => (
                <Card key={index} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{ticket.eventName}</h3>
                        <p className="text-gray-400 mb-2">{ticket.ticketName} (Qty: {ticket.quantity})</p>
                        
                        <div className="flex items-center text-gray-400 mb-2">
                          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>
                            {new Date(ticket.startingTime).toLocaleDateString()} at {new Date(ticket.startingTime).toLocaleTimeString()}
                          </span>
                        </div>
                        
                        {ticket.eventLocation && (
                          <div className="flex items-center text-gray-400 mb-2">
                            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>{ticket.eventLocation}</span>
                          </div>
                        )}
                        
                        <p className="text-gray-400 mb-3">Order #{ticket.orderId}</p>
                        
                        {ticket.isUserOrder && (
                          <div className="inline-flex items-center bg-purple-900/30 text-purple-300 text-xs px-2 py-1 rounded-full mb-3">
                            <Smartphone className="h-3 w-3 mr-1" />
                            Available in mobile app
                          </div>
                        )}
                        
                        {(ticket.merchandise ?? []).length > 0 && (
                          <div className="mt-3 bg-gray-800/50 p-3 rounded-md">
                            <p className="text-sm font-medium text-gray-300 mb-1">Merchandise:</p>
                            <ul className="text-sm text-gray-400">
                              {ticket.merchandise?.map((item, i) => (
                                <li key={i} className="flex justify-between">
                                  <span>• {item.itemName}</span>
                                  <span>x {item.qty}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-center justify-start">
                        <div className="bg-white p-3 rounded-md mb-3">
                          {ticket.qrIdentifier ? (
                            <Image 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.qrIdentifier}`}
                              alt="Ticket QR Code"
                              width={150}
                              height={150}
                            />
                          ) : (
                            <QrCode className="h-36 w-36 text-black" />
                          )}
                        </div>
                        <Button 
                          onClick={() => handleDownloadTicket(ticket, index)}
                          disabled={isDownloading[index]}
                          className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                        >
                          {isDownloading[index] ? (
                            "Downloading..."
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Download Ticket
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TicketsPage;
