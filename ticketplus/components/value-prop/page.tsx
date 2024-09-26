"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Smartphone, Shield, Globe } from 'lucide-react';

// Define the props interface
interface ValuePropProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const ValueProp: React.FC<ValuePropProps> = ({ icon: Icon, title, description }) => (
  <AnimatePresence>
    <motion.div 
      className="flex flex-col items-center text-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="w-16 h-16 mb-4 text-purple-500" />
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  </AnimatePresence>
);

const ValuePropositionSection = () => (
  <section className="py-20 px-4 bg-black">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold mb-12 text-center text-white">Why Choose Tick8 Plus?</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <ValueProp 
          icon={Globe}
          title="Accessibility"
          description="Purchase tickets anytime, anywhere"
        />
        <ValueProp 
          icon={Shield}
          title="Security"
          description="Cashless transactions for safer events"
        />
        <ValueProp 
          icon={Smartphone}
          title="Efficiency"
          description="Streamlined process for attendees and organizers"
        />
        <ValueProp 
          icon={Wallet}
          title="Innovation"
          description="NFC band technology for seamless in-event purchases"
        />
      </div>
    </div>
  </section>
);

export default ValuePropositionSection;
