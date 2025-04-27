"use client";
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from "next/navigation";

const PrivacyPolicyScreen = () => {
    const router = useRouter();
  return (
    <div className="bg-purple-50 min-h-screen">
      <header className="bg-gradient-to-br from-purple-900 via-black to-pink-900 text-white p-4 flex items-center">
      <button className="mr-4" aria-label="Go back" onClick={() => router.back()}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Privacy Policy</h1>
      </header>
      <div className="container mx-auto px-4 py-8 bg-black">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-3xl font-bold text-purple-800 mb-6">Tick8 Plus Privacy Policy</h2>
          <p className="text-sm text-gray-600 mb-4">Last updated: September 27, 2024</p>
          <p className="mb-4">Welcome to Tick8 Plus, a product of BITS! We value your privacy and are committed to ensuring that your personal information is secure.</p>
          
          <h3 className="text-xl font-semibold text-purple-700 mt-6 mb-3">1. Information We Collect</h3>
          <h4 className="text-lg font-medium text-purple-600 mt-4 mb-2">Mobile App Users (Attendees and Organizers):</h4>
          <ul className="list-disc pl-6 mb-4">
            <li>Personal Information: Name, email address, and contact details when signing up.</li>
            <li>Payment Information: Details related to ticket purchases, wallet integration, and NFC-based transactions.</li>
            <li>Usage Data: Information about how you interact with the app, including ticket purchases and event participation.</li>
          </ul>
          <h4 className="text-lg font-medium text-purple-600 mt-4 mb-2">Website Users (Beta Testers):</h4>
          <ul className="list-disc pl-6 mb-4">
            <li>Personal Information: Name and email address when signing up for the beta program.</li>
            <li>Feedback: Feedback provided to help us improve our services.</li>
          </ul>

          <h3 className="text-xl font-semibold text-purple-700 mt-6 mb-3">2. How We Use Your Information</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Facilitate Transactions: For attendees, this includes ticket purchases and NFC payments. For organizers, this includes managing event ticket sales and vendor settlements.</li>
            <li>Improve the Service: Your feedback helps us refine our platform for a better user experience.</li>
            <li>Communicate Updates: We may use your email to inform you of any important updates, upcoming events, or changes to our platform.</li>
          </ul>

          <h3 className="text-xl font-semibold text-purple-700 mt-6 mb-3">3. How We Protect Your Information</h3>
          <p className="mb-4">We implement strong security measures to protect your personal and financial data from unauthorized access, alteration, or disclosure. This includes encryption protocols and secure storage systems for sensitive information.</p>

          <h3 className="text-xl font-semibold text-purple-700 mt-6 mb-3">4. Contact Us</h3>
          <p className="mb-2">If you have any questions or concerns about our Privacy Policy, please contact us at:</p>
          <p className="mb-1"><strong>Email:</strong> info@bits-innovate.com</p>
          <p className="mb-1"><strong>Phone:</strong> +231 (881) 158-457</p>
          <p className="mb-4"><strong>Address:</strong> Duport Road Junction, Paynesville City, Liberia</p>

          <p className="text-sm text-gray-600 mt-8">By using Tick8 Plus, you acknowledge that you have read and understood this Privacy Policy and agree to be bound by its terms.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyScreen;
