"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const TermsOfServiceScreen = () => {
    const router = useRouter();
  return (
    <div className="bg-purple-50 min-h-screen">
      <header className="bg-gradient-to-br from-purple-900 via-black to-pink-900 text-white p-4 flex items-center">
        <button className="mr-4" aria-label="Go back" onClick={() => router.push('/')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Terms of Service</h1>
      </header>
      <div className="container mx-auto px-4 py-8 bg-black">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-3xl font-bold text-purple-800 mb-6">
            Tick8 Plus Terms of Service
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Last updated: September 27, 2024
          </p>
          <p className="mb-4">
            Welcome to Tick8 Plus, a product of BITS! By using Tick8 Plus,
            either through the mobile apps or the website, you agree to these
            Terms of Service.
          </p>

          <h3 className="text-xl font-semibold text-purple-700 mt-6 mb-3">
            1. Acceptance of Terms
          </h3>
          <p className="mb-4">
            If you do not agree to these terms, you must discontinue using our
            services.
          </p>

          <h3 className="text-xl font-semibold text-purple-700 mt-6 mb-3">
            2. Use of Tick8 Plus Mobile Apps
          </h3>
          <h4 className="text-lg font-medium text-purple-600 mt-4 mb-2">
            Attendees:
          </h4>
          <p className="mb-4">
            You agree to provide accurate information during registration and
            understand that any tickets purchased are non-transferable unless
            otherwise stated.
          </p>
          <h4 className="text-lg font-medium text-purple-600 mt-4 mb-2">
            Organizers:
          </h4>
          <p className="mb-4">
            You agree to use the platform for managing ticket sales, tracking
            event performance, and processing vendor settlements in accordance
            with local laws and regulations.
          </p>

          <h3 className="text-xl font-semibold text-purple-700 mt-6 mb-3">
            3. Use of the Website (Beta Testers)
          </h3>
          <ul className="list-disc pl-6 mb-4">
            <li>
              Beta testers must provide accurate information (name and email)
              when signing up for the program.
            </li>
            <li>
              You agree to provide constructive feedback to help us improve our
              platform.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-purple-700 mt-6 mb-3">
            4. Intellectual Property
          </h3>
          <p className="mb-4">
            All content and materials on the Tick8 Plus website and apps
            (including logos, designs, text, graphics, and software) are the
            intellectual property of Tick8 Plus or licensed to us. You may not
            copy, distribute, or modify any part of this content without written
            consent.
          </p>

          <h3 className="text-xl font-semibold text-purple-700 mt-6 mb-3">
            5. Limitation of Liability
          </h3>
          <p className="mb-4">Tick8 Plus is not liable for:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              Service Interruptions: Including any technical issues or
              downtimes.
            </li>
            <li>
              Data Loss: Resulting from the use of the beta program or mobile
              apps.
            </li>
            <li>
              Unauthorized Access: If a breach occurs due to circumstances
              beyond our control.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-purple-700 mt-6 mb-3">
            6. Governing Law
          </h3>
          <p className="mb-4">
            These Terms of Service are governed by the laws of Liberia. Any
            disputes arising from your use of Tick8 Plus will be resolved in
            accordance with Liberian law.
          </p>

          <h3 className="text-xl font-semibold text-purple-700 mt-6 mb-3">
            7. Contact Us
          </h3>
          <p className="mb-2">
            If you have any questions or concerns about our Terms of Service,
            please contact us at:
          </p>
          <p className="mb-1">
            <strong>Email:</strong> tick8plus@gmail.com
          </p>
          <p className="mb-1">
            <strong>Phone:</strong> +231 (881) 158-457
          </p>
          <p className="mb-4">
            <strong>Address:</strong> Duport Road Junction, Paynesville City,
            Liberia
          </p>

          <p className="text-sm text-gray-600 mt-8">
            By using Tick8 Plus, you acknowledge that you have read and
            understood these Terms of Service and agree to be bound by its
            terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServiceScreen;
