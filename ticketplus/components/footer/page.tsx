import Image from "next/image";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export const Footer = () => (
  <footer id="contact" className="py-12 px-4 bg-black text-white">
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
        <p className="text-gray-400 mt-4">
          Tick8 Plus is a product of BITS, revolutionizing event ticketing and cashless payments.
        </p>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
        <ul className="space-y-2">
          <li>
            <a href="#" className="text-gray-400 hover:text-white">
              Home
            </a>
          </li>
          <li>
            <a href="#features" className="text-gray-400 hover:text-white">
              Features
            </a>
          </li>
          <li>
            <a href="#beta-program" className="text-gray-400 hover:text-white">
              Beta Program
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-4">Legal</h3>
        <ul className="space-y-2">
          <li>
            <a href="/privacy-policy" className="text-gray-400 hover:text-white">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="/terms" className="text-gray-400 hover:text-white">
              Terms of Service
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-4">Connect</h3>
        <div className="flex space-x-4 mb-4">
          <a
            href="https://www.facebook.com/profile.php?id=61559964784532&mibextid=ZbWKwL"
            className="text-gray-400 hover:text-white"
          >
            <FaFacebookF size={24} />
          </a>
          <a
            href="https://www.instagram.com/tick8plus"
            className="text-gray-400 hover:text-white"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="https://x.com/tick8plus"
            className="text-gray-400 hover:text-white"
          >
            <FaTwitter size={24} />
          </a>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <FaMapMarkerAlt size={18} className="mr-2" />
            <span className="text-gray-400">
              Duport Road Junction, Paynesville City, Liberia
            </span>
          </div>
          <div className="flex items-center">
            <FaPhoneAlt size={18} className="mr-2" />
            <a
              href="tel:+1234567890"
              className="text-gray-400 hover:text-white"
            >
              +231 (881) 158-457
            </a>
          </div>
          <div className="flex items-center">
            <FaEnvelope size={18} className="mr-2" />
            <a
              href="mailto:info@tick8plus.com"
              className="text-gray-400 hover:text-white"
            >
              tick8plus@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
    <div className="mt-8 text-center text-gray-400">
      &copy; 2024 Tick8 Plus, a product of BITS. All rights reserved.
    </div>
  </footer>
);
