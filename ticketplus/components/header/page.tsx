// components/header/page.tsx
"use client";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import useEventStore from '@/store/eventStore';
import { useState, useEffect } from 'react';

export const Header = () => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const cart = useEventStore((state) => state.cart);
  const cartItemCount = cart.length;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Close menu when clicking outside or changing route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Navigation items
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Find Tickets', path: '/tickets' }, // Added Find Tickets
    { name: 'Features', path: isHomePage ? '#features' : '/#features' },
    { name: 'Beta Program', path: isHomePage ? '#beta-program' : '/#beta-program' },
    { name: 'Download App', path: isHomePage ? '#download-app' : '/#download-app' },
    { name: 'Contact', path: isHomePage ? '#contact' : '/#contact' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-black bg-opacity-100 z-50 py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/">
          <Image
            className="dark:invert"
            src="/images/tplogo.png"
            alt="Tick8 Plus Logo"
            width={120}
            height={38}
            priority
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.path}
              className="text-white hover:text-purple-400 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative">
            <Button variant="ghost" className="text-white p-2">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-purple-600 h-5 w-5 flex items-center justify-center p-0">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </Link>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          
          <Link href={isHomePage ? "#beta-program" : "/#beta-program"} className="hidden md:block">
            <Button className="bg-purple-600 hover:bg-purple-700">Sign Up for Beta</Button>
          </Link>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gray-900 border-t border-gray-800 px-6 py-4 shadow-lg">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.path}
                className="text-white hover:text-purple-400 py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link href={isHomePage ? "#beta-program" : "/#beta-program"}>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 mt-2">Sign Up for Beta</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
