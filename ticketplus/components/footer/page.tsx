import Image from "next/image";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

export const Footer = () => (
  <footer className="py-12 px-4 bg-black text-white">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <Image
          className="dark:invert"
          src="/images/tplogo.png"
          alt="Tick8 Plus Logo"
          width={180}
          height={38}
          priority
        />
        <p className="text-gray-400 mt-4">Revolutionizing event ticketing and cashless payments.</p>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
        <ul className="space-y-2">
          <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white">For Organizers</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white">Beta Program</a></li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-4">Legal</h3>
        <ul className="space-y-2">
          <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-4">Connect</h3>
        <div className="flex space-x-4 mb-4">
          <a href="#" className="text-gray-400 hover:text-white">
            <Facebook size={24} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <Instagram size={24} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <Twitter size={24} />
          </a>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <MapPin size={18} className="mr-2" />
            <span className="text-gray-400">123 Event St, City, Country</span>
          </div>
          <div className="flex items-center">
            <Phone size={18} className="mr-2" />
            <a href="tel:+1234567890" className="text-gray-400 hover:text-white">+1 (234) 567-890</a>
          </div>
          <div className="flex items-center">
            <Mail size={18} className="mr-2" />
            <a href="mailto:info@tick8plus.com" className="text-gray-400 hover:text-white">info@tick8plus.com</a>
          </div>
        </div>
      </div>
    </div>
    <div className="mt-8 text-center text-gray-400">
      &copy; 2024 Tick8 Plus. All rights reserved.
    </div>
  </footer>
);