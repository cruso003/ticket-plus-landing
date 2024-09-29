import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Image from 'next/image';

const AppDownloadSection = () => {
  return (
    <section id='download-app' className="py-20 px-4 bg-gradient-to-br from-purple-900 via-black to-pink-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center text-white">Download Our App</h2>
        <Tabs defaultValue="attendee" className="w-full max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="attendee">For Attendees</TabsTrigger>
            <TabsTrigger value="organizer">For Organizers</TabsTrigger>
          </TabsList>
          <TabsContent value="attendee" className="text-center">
            <h3 className="text-2xl font-semibold mb-6 text-white">Attendee App</h3>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Image 
                  src="/images/apple_badge.svg" 
                  alt="Download on the App Store" 
                  width={200} 
                  height={60} 
                />
                <span className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">Coming Soon</span>
              </div>
              <div className="relative">
                <Image 
                  src="/images/GetItOnGooglePlay_Badge_Web_color_English.png" 
                  alt="Get it on Google Play" 
                  width={200} 
                  height={60} 
                />
                <span className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">Coming Soon</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="organizer" className="text-center">
            <h3 className="text-2xl font-semibold mb-6 text-white">Organizer App</h3>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Image 
                  src="/images/apple_badge.svg" 
                  alt="Download on the App Store" 
                  width={200} 
                  height={60} 
                />
                <span className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">Coming Soon</span>
              </div>
              <div className="relative">
                <Image 
                  src="/images/GetItOnGooglePlay_Badge_Web_color_English.png" 
                  alt="Get it on Google Play" 
                  width={200} 
                  height={60} 
                />
                <span className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">Coming Soon</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default AppDownloadSection;