"use client";
import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="text-[#F3F4F6]" style={{ background: '#1F1F1F' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-lora font-bold">Freedom Life Center</h3>
            <p className="mt-4 text-[12px] font-work-sans max-w-xs text-[#F3F4F6]">
              “Bringing people closer to God through worship, teaching, and love.
              A place where broken lives find freedom and hope in Christ.”
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-lora font-semibold">Quick Links</h4>
            <nav className="mt-4 space-y-2 text-[16px] font-work-sans">
              <a href="#home" className="block hover:underline">Home</a>
              <a href="/whoarewe" className="block hover:underline">About Us</a>
              <a href="/services" className="block hover:underline">Services</a>
              <a href="/ministries" className="block hover:underline">Ministries</a>
              <a href="/sermons" className="block hover:underline">Sermons</a>
              <a href="#events" className="block hover:underline">Events</a>
              <a href="#give" className="block hover:underline">Give</a>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl font-lora font-semibold">Contact</h4>
            <div className="mt-4 space-y-4 text-[14px]">
              <div>
                <div className="inline-flex items-center gap-2">
                  <MapPin className="w-[22px] h-[22px]" />
                  <span className="text-[16px] font-semibold leading-6">Location</span>
                </div>
                <div className="mt-2 leading-[21px]">L - 16, South Extension II, Block L, New Delhi,<br />Delhi 110049</div>
              </div>
              <div>
                <div className="inline-flex items-center gap-2">
                  <Phone className="w-[22px] h-[22px]" />
                  <span className="text-[16px] font-semibold leading-6">Call Us</span>
                </div>
                <div className="mt-2 leading-[21px]">9876543210<br/>9876543210</div>
              </div>
              <div>
                <div className="inline-flex items-center gap-2">
                  <Mail className="w-[22px] h-[22px]" />
                  <span className="text-[16px] font-semibold leading-6">Mail Us</span>
                </div>
                <div className="mt-2 text-[16px]">freedomlifecenter@gmail.com</div>
              </div>
            </div>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-xl font-lora font-semibold">Follow Us</h4>
            <div className="mt-4 inline-flex items-center gap-4">
              <a href="https://www.facebook.com/freedomlifecenter.delhiag" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-[40px] h-[40px] rounded border border-[#F3F4F6]/20 hover:bg-[#F3F4F6]/10 flex items-center justify-center">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/freedom_life_center?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-[45px] h-[45px] rounded border border-[#F3F4F6]/20 hover:bg-[#F3F4F6]/10 flex items-center justify-center">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@freedomlifecenterdelhi" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-[50px] h-[50px] rounded border border-[#F3F4F6]/20 hover:bg-[#F3F4F6]/10 flex items-center justify-center">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-[#F3F4F6]/30" />

        {/* Copyright */}
        <div className="mt-6 text-center text-[14px] font-work-sans">
          © 2025 Freedom Life Centre. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
