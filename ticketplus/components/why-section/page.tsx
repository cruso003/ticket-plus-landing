import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";

export const HowItWorksSection = () => (
  <section id="overview" className="py-20 px-4 bg-black">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold mb-12 text-center text-purple-600">How It Works</h2>
      <Tabs defaultValue="attendees">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="attendees">For Attendees</TabsTrigger>
          <TabsTrigger value="organizers">For Organizers</TabsTrigger>
        </TabsList>
        <TabsContent value="attendees">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-white">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-purple-600">Attendee Process</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Browse and select events</li>
                <li>Purchase tickets using mobile payment</li>
                <li>Receive digital tickets in the app</li>
                <li>Use NFC band for cashless purchases at the event</li>
              </ol>
            </div>
            <div className="bg-gray-800 rounded-lg">
              <Image
                className="dark:invert object-contain"
                src="/images/image2.png"
                alt="Attendee Process Mockup"
                width={1000}
                height={900}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="organizers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-white">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-purple-600">Organizer Process</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Create and set up event on Tick8 Plus platform</li>
                <li>Manage ticket sales and attendee data</li>
                <li>Monitor real-time analytics during the event</li>
                <li>Process vendor settlements post-event</li>
              </ol>
            </div>
            <div className="bg-gray-800 rounded-lg">
            <Image
                className="dark:invert object-contain"
                src="/images/image3.png"
                alt="Organizer Process Mockup"
                width={1000}
                height={900}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </section>
);
