// components/ticket-actions/page.tsx
"use client";
import React from 'react';
import { Ticket, ShoppingBag, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const TicketActionsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get Started with Tick8+</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Whether you&apos;re looking to attend an event or retrieve your tickets, we&apos;ve got you covered.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Browse Events Card */}
          <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl transition-transform hover:scale-105">
            <div className="p-6">
              <div className="bg-purple-900/30 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <ShoppingBag className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Browse Events</h3>
              <p className="text-gray-400 mb-6">
                Discover and purchase tickets for upcoming events in your area. From concerts to conferences, find it all in one place.
              </p>
              <Link href="/events">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Explore Events
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Find Tickets Card */}
          <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl transition-transform hover:scale-105">
            <div className="p-6">
              <div className="bg-purple-900/30 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Ticket className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Find Your Tickets</h3>
              <p className="text-gray-400 mb-6">
                Already purchased tickets? Easily retrieve them using your email address. Download or view your tickets anytime.
              </p>
              <Link href="/tickets">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Find My Tickets
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Download App Card */}
          <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl transition-transform hover:scale-105">
            <div className="p-6">
              <div className="bg-purple-900/30 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Smartphone className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Get the Mobile App</h3>
              <p className="text-gray-400 mb-6">
                Experience Tick8+ on the go! Download our mobile app for a seamless ticket buying and management experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="#" className="flex-1">
                  <Image 
                    src="/images/apple_badge.svg" 
                    alt="Download on App Store" 
                    width={160} 
                    height={48} 
                    className="w-full h-auto"
                  />
                </Link>
                <Link href="#" className="flex-1">
                  <Image 
                    src="/images/GetItOnGooglePlay_Badge_Web_color_English.png" 
                    alt="Get it on Google Play" 
                    width={160} 
                    height={48}
                    className="w-full h-auto" 
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Alternative Action Banner */}
        <div className="mt-16 bg-purple-900/30 rounded-xl p-8 border border-purple-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:max-w-lg">
              <h3 className="text-2xl font-bold text-white mb-2">
                Lost your tickets?
              </h3>
              <p className="text-gray-300">
                No worries! Easily recover your purchased tickets using just your email address. 
                View, download or resend them to your inbox in a few clicks.
              </p>
            </div>
            <Link href="/tickets">
              <Button size="lg" className="bg-white hover:bg-gray-100 text-purple-800">
                Recover Tickets
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TicketActionsSection;
