import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const BetaProgramSection = () => (
  <section className="py-20 px-4 bg-gradient-to-r from-purple-800 to-pink-800">
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-4xl font-bold mb-8">Be Part of the Future of Event Ticketing</h2>
      <p className="text-xl mb-8">
        Join our beta program and help shape the future of Tick8 Plus. Get early access to features and provide valuable feedback.
      </p>
      <form className="flex flex-col md:flex-row gap-4 justify-center">
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
        
        {/* Label for the select element */}
        <label htmlFor="role-select" className="sr-only">Select Role</label>
        <select 
          id="role-select" 
          className="bg-white bg-opacity-20 border-none text-white placeholder-gray-300 rounded-md"
          aria-label="Select Role" // Optional: additional accessible label
        >
          <option value="">Select Role</option>
          <option value="attendee">Attendee</option>
          <option value="organizer">Organizer</option>
        </select>
        
        <Button size="lg" className="bg-white text-purple-800 hover:bg-gray-100">
          Join Beta Program
        </Button>
      </form>
    </div>
  </section>
);
