import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, ShieldCheck, Award, PhoneCall, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-[#080808] border-t border-border/80 pt-16 pb-12 text-muted text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-border/60">
          {/* Col 1: Brand & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center text-black font-bold shadow-md">
                <Plane className="w-4 h-4 fill-current rotate-45" />
              </div>
              <span className="font-serif text-xl tracking-widest text-white font-bold">
                AEROLUX
              </span>
            </Link>
            <p className="text-muted leading-relaxed max-w-sm">
              The premier bespoke private aviation charter network. Connecting global leaders,
              executives, and discerning travelers to over 5,000 private airports worldwide
              with absolute discretion, punctuality, and uncompromised safety.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-[11px] text-muted-light">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>ARGUS Platinum Certified</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-[11px] text-muted-light">
                <Award className="w-3.5 h-3.5 text-gold" />
                <span>IS-BAO Stage 3</span>
              </div>
            </div>
          </div>

          {/* Col 2: Fleet Links */}
          <div className="space-y-3">
            <h4 className="text-white font-serif tracking-wider uppercase text-xs font-semibold">
              Fleet Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/jets?category=Light" className="hover:text-gold transition-colors">
                  Light Executive Jets
                </Link>
              </li>
              <li>
                <Link to="/jets?category=Midsize" className="hover:text-gold transition-colors">
                  Super-Midsize Jets
                </Link>
              </li>
              <li>
                <Link to="/jets?category=Heavy" className="hover:text-gold transition-colors">
                  Heavy Cabin Aircraft
                </Link>
              </li>
              <li>
                <Link to="/jets?category=Ultra+Long+Range" className="hover:text-gold transition-colors">
                  Ultra Long Range Fleet
                </Link>
              </li>
              <li>
                <Link to="/jets" className="hover:text-gold transition-colors">
                  View Full Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="space-y-3">
            <h4 className="text-white font-serif tracking-wider uppercase text-xs font-semibold">
              VIP Services
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#how-it-works" className="hover:text-gold transition-colors">
                  On-Demand Charter
                </a>
              </li>
              <li>
                <span className="hover:text-gold transition-colors cursor-pointer">
                  Private Terminal FBO Access
                </span>
              </li>
              <li>
                <span className="hover:text-gold transition-colors cursor-pointer">
                  Bespoke In-Flight Dining
                </span>
              </li>
              <li>
                <span className="hover:text-gold transition-colors cursor-pointer">
                  VIP Helicopter Transfers
                </span>
              </li>
              <li>
                <span className="hover:text-gold transition-colors cursor-pointer">
                  Corporate Jet Card Membership
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: 24/7 Concierge */}
          <div className="space-y-3">
            <h4 className="text-white font-serif tracking-wider uppercase text-xs font-semibold">
              Global Concierge
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-muted-light">
                <PhoneCall className="w-3.5 h-3.5 text-gold" />
                <span>+1 (800) 728-LUX-VIP</span>
              </div>
              <div className="flex items-center gap-2 text-muted-light">
                <Mail className="w-3.5 h-3.5 text-gold" />
                <span>concierge@aerolux.vip</span>
              </div>
              <div className="flex items-center gap-2 text-muted-light">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                <span>London • New York • Dubai • Mumbai</span>
              </div>
              <p className="text-[11px] text-muted-dark pt-2">
                Available 24 hours a day, 365 days a year for immediate flight dispatch.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-dark">
          <p>© {new Date().getFullYear()} AeroLux Global Aviation Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Charter</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Carriage</span>
            <span className="hover:text-white transition-colors cursor-pointer">Aviation Security</span>
            <span className="hover:text-white transition-colors cursor-pointer">Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
