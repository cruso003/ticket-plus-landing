"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export const HeroSection = () => (
  <section
    id="home"
    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-pink-900 pt-16 px-4"
  >
    <AnimatePresence>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0 text-white">
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
            Seamless ticketing, mobile payments, and cashless purchases at your
            fingertips
          </motion.p>
          <motion.div
            className="space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Join Beta Program
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </motion.div>
        </div>
        <div className="md:w-1/2">
          {/* Video container */}
          <div className="w-full h-auto bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
            <video className="w-full h-full" autoPlay loop muted >
              <source src="/videos/video1.mp4" type="video/mp4" />{" "}
              {/* Replace with your video path */}
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </AnimatePresence>
  </section>
);
