"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const BetaProgramSection = () => {
  const [role, setRole] = useState('');
  
  const downloadBeta = () => {
    if (role === 'attendee') {
      window.open('https://expo.dev/artifacts/eas/qsfLh6ou4DRPJ3fiGQ5exj.apk', '_blank');
    } else if (role === 'organizer') {
      window.open('https://expo.dev/accounts/truthserum/projects/ticket-plus-organizers-client/builds/97179bd0-4e55-4bef-86e6-1bcc9f251c4f', '_blank');
    } else {
      alert('Please select a role to download the appropriate app.');
    }
  };

  return (
    <section id='beta-program' className="py-20 px-4 bg-gradient-to-r from-purple-800 to-pink-800">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8">Be Part of the Future of Event Ticketing</h2>
        <p className="text-xl mb-8">
          Join our beta program and help shape the future of Tick8 Plus. Get early access to features and provide valuable feedback.
        </p>
        <form 
          onSubmit={(e) => { e.preventDefault(); downloadBeta(); }} 
          className="flex flex-col md:flex-row gap-4 justify-center"
        >
          <Input 
            type="text" 
            placeholder="Name" 
            className="bg-white bg-opacity-20 border-none text-white placeholder-gray-300"
          />
          <Input 
            type="email" 
            placeholder="Email" 
            className="bg-white bg-opacity-20 border-none text-white placeholder-gray-300"
          />
          
          {/* Role Selection */}
          <label htmlFor="role-select" className="sr-only">Select Role</label>
          <select 
            id="role-select" 
            className="bg-white bg-opacity-20 border-none text-white placeholder-gray-300 rounded-md"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            aria-label="Select Role" 
          >
            <option value="">Select Role</option>
            <option value="attendee">Attendee</option>
            <option value="organizer">Organizer</option>
          </select>

          <Button type="submit" size="lg" className="bg-white text-purple-800 hover:bg-gray-100">
            Join Beta Program
          </Button>
        </form>
      </div>
    </section>
  );
};
