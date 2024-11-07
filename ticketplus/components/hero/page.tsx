"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleWatchDemoClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section
      id="home"
      className="min-h-screen mt-4  flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-pink-900 pt-16 px-4"
    >
      <AnimatePresence>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2  text-center md:text-left mb-8 md:mb-0 text-white">
            <motion.h1
              className="text-lg md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Revolutionizing Event Ticketing and Cashless Payments
            </motion.h1>
            <motion.p
              className="text-xl mb-8 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Seamless ticketing, mobile payments, and cashless purchases at
              your fingertips
            </motion.p>
            <motion.div
              className="space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="#beta-program">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Join Beta Program
                </Button>
              </Link>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleWatchDemoClick}
              >
                Watch Demo
              </Button>
            </motion.div>
          </div>
          <div className="md:w-1/2">
            {/* Video container */}
            <div className="w-full h-auto bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
              <video className="w-full h-full" autoPlay loop muted>
                <source src="/videos/video1.mp4" type="video/mp4" />{" "}
                {/* Replace with your video path */}
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-75">
            <div className="relative w-3/4 max-w-2xl h-3/4 max-h-screen bg-white rounded-lg overflow-hidden">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
                onClick={handleCloseModal}
              >
                ×
              </button>
              <iframe
                className="w-full h-full"
                src="https://youtu.be/1JyZfpbkF0I?si=vvICcoVMRAEqZpXR"
                title="Demo Video"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
