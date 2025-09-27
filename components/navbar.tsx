"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [overHero, setOverHero] = useState(false);

  useEffect(() => {
    const computeStates = () => {
      const navHeight = 64; // ~h-16
      setScrolled(window.scrollY > 20);
      const hero = document.getElementById('home');
      if (hero) {
        const rect = hero.getBoundingClientRect();
        // Navbar overlaps hero if hero spans across the top area (0..navHeight)
        const overlaps = rect.top < navHeight && rect.bottom > 0;
        setOverHero(overlaps);
      } else {
        setOverHero(false);
      }
    };
    computeStates();
    window.addEventListener('scroll', computeStates);
    window.addEventListener('resize', computeStates);
    return () => {
      window.removeEventListener('scroll', computeStates);
      window.removeEventListener('resize', computeStates);
    };
  }, []);

  const navItems = [
    { label: '#Whoarewe', href: '/whoarewe' },
    { label: 'Ministries', href: '/ministries' },
    { label: 'Services', href: '/services' },
    { label: 'Sermons', href: '/sermons' },
    { label: 'Gallery', href: '/gallery' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10">
                <Image src="/FLC_logo.png" alt="FLC Delhi logo" width={52} height={52} className="rounded-lg object-contain w-8 h-8" />
              </div>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item, index) => (
                <motion.div key={item.href} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * (index + 1) }} whileHover={{ y: -2 }}>
                  <Link
                    href={item.href}
                    className={`${scrolled ? 'text-slate-700 hover:text-green-600' : (overHero ? 'text-white hover:text-green-300' : 'text-slate-700 hover:text-green-600')} px-3 py-2 text-sm font-medium transition-colors duration-200`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <motion.div 
            className="hidden md:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg">
                Give Online
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none transition-colors duration-200 ${scrolled ? 'text-slate-700 hover:text-green-600' : (overHero ? 'text-white hover:text-green-300' : 'text-slate-700 hover:text-green-600')}`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isMenuOpen ? 'auto' : 0,
          opacity: isMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 overflow-hidden"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item, index) => (
            <motion.div key={item.href} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: isMenuOpen ? 0.1 * index : 0 }}>
              <Link href={item.href} className="block px-3 py-2 text-slate-700 hover:text-green-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                {item.label}
              </Link>
            </motion.div>
          ))}
          <motion.div
            className="px-3 py-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: isMenuOpen ? 0.4 : 0 }}
          >
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              Get Started
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
