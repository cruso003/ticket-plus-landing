import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Ticket, Wallet, Smartphone, Globe, ChevronDown, ArrowRight } from 'lucide-react';

// Define the props interface
interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
  }

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
    <Card className="bg-gray-800">
      <CardContent className="p-6">
        <Icon className="w-12 h-12 mb-4 text-purple-500" />
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </CardContent>
    </Card>
  );
  
  const FeaturesSection = () => (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-900 via-black to-pink-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-br from-purple-900 via-black to-pink-900 text-white">Features Showcase</h2>
        <Tabs defaultValue="attendees">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="attendees">For Attendees</TabsTrigger>
            <TabsTrigger value="organizers">For Organizers</TabsTrigger>
          </TabsList>
          <TabsContent value="attendees">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard icon={Ticket} title="Mobile Ticketing" description="Purchase and store tickets on your smartphone" />
              <FeatureCard icon={Wallet} title="Wallet Integration" description="Seamlessly connect to your preferred payment method" />
              <FeatureCard icon={Smartphone} title="NFC Band Payments" description="Make cashless purchases at events with ease" />
              {/* Add more attendee features */}
            </div>
          </TabsContent>
          <TabsContent value="organizers">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard icon={Globe} title="Sales Management" description="Track and manage ticket sales in real-time" />
              <FeatureCard icon={ChevronDown} title="Real-time Analytics" description="Get instant insights on event performance" />
              <FeatureCard icon={ArrowRight} title="Vendor Settlement" description="Easily process payments to event vendors" />
              {/* Add more organizer features */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );

  export default FeaturesSection;