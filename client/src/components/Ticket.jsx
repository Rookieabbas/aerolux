import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Plane, Calendar, Users, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';
import { Button } from './Button';
import { formatCurrency, formatFlightDuration } from '../utils/haversine';

export function Ticket({ booking, jet, onDone }) {
  const ticketRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  if (!booking) return null;

  const jetDetails = jet || booking.jet;

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;
    setDownloading(true);
    const toastId = toast.loading('Generating VIP Boarding Pass PDF...');

    try {
      const element = ticketRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0f0f0f',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      const filename = `AeroLux-BoardingPass-${booking.booking_ref || 'CHARTER'}.pdf`;
      pdf.save(filename);

      toast.success('VIP Boarding Pass downloaded successfully.', { id: toastId });
    } catch (err) {
      console.error('PDF generation error:', err);
      toast.error('Failed to generate PDF. Please try again.', { id: toastId });
    } finally {
      setDownloading(false);
    }
  };

  // Derive 3-letter city codes
  const fromCode = (booking.from_city || 'DEP').substring(0, 3).toUpperCase();
  const toCode = (booking.to_city || 'ARR').substring(0, 3).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8"
    >
      {/* Visual Boarding Pass Container */}
      <div
        ref={ticketRef}
        className="w-full bg-[#121212] border-2 border-[#d4af37]/60 rounded-3xl overflow-hidden shadow-2xl relative text-white select-none"
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px -5px rgba(212, 175, 55, 0.25)',
        }}
      >
        {/* Subtle Luxury Pattern / Gold Watermark Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

        {/* Top Gold Header Band */}
        <div className="bg-gradient-to-r from-[#181818] via-[#242012] to-[#181818] px-8 py-4 border-b border-[#d4af37]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center text-black font-bold shadow-md">
              <Plane className="w-4 h-4 fill-current rotate-45" />
            </div>
            <div>
              <span className="font-serif tracking-widest text-lg font-bold text-gold-gradient">
                AEROLUX
              </span>
              <span className="text-[10px] tracking-[0.25em] text-muted-light block uppercase font-medium">
                Private Aviation VIP Pass
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-muted block">
                Booking Reference
              </span>
              <span className="text-base font-mono font-bold text-gold tracking-widest">
                {booking.booking_ref || 'AX-VIP001'}
              </span>
            </div>
          </div>
        </div>

        {/* Ticket Content: Main Pass & Stub */}
        <div className="grid grid-cols-1 md:grid-cols-12 relative">
          {/* Main Flight Manifest Section (8 cols) */}
          <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between gap-6 border-b md:border-b-0 md:border-r border-[#262626]">
            {/* Route & City Code Banner */}
            <div className="flex items-center justify-between gap-4 py-2">
              <div className="text-left">
                <span className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight">
                  {fromCode}
                </span>
                <span className="text-xs sm:text-sm text-gold block font-medium mt-1">
                  {booking.from_city}
                </span>
                <span className="text-[10px] text-muted uppercase tracking-wider block">
                  Departure Port
                </span>
              </div>

              <div className="flex-1 flex flex-col items-center px-4">
                <span className="text-[11px] text-muted font-medium mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gold" />
                  {formatFlightDuration(booking.flight_hours)}
                </span>
                <div className="w-full flex items-center gap-2">
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-[#d4af37]/60 to-[#d4af37]/20 relative">
                    <span className="w-2 h-2 rounded-full bg-gold absolute -top-[3px] left-0" />
                  </div>
                  <Plane className="w-5 h-5 text-gold transform rotate-90 shrink-0" />
                  <div className="h-[2px] flex-1 bg-gradient-to-l from-[#d4af37]/60 to-[#d4af37]/20 relative">
                    <span className="w-2 h-2 rounded-full bg-gold absolute -top-[3px] right-0" />
                  </div>
                </div>
                <span className="text-[10px] text-muted-dark mt-1">
                  Non-Stop Charter • {booking.distance_km?.toLocaleString()} km
                </span>
              </div>

              <div className="text-right">
                <span className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight">
                  {toCode}
                </span>
                <span className="text-xs sm:text-sm text-gold block font-medium mt-1">
                  {booking.to_city}
                </span>
                <span className="text-[10px] text-muted uppercase tracking-wider block">
                  Arrival Port
                </span>
              </div>
            </div>

            {/* Flight Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 px-5 bg-[#171717] rounded-2xl border border-[#2a2a2a]">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted block">
                  Flight Date
                </span>
                <span className="text-sm font-semibold text-white">
                  {new Date(booking.flight_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted block">
                  Passengers
                </span>
                <span className="text-sm font-semibold text-white">
                  {booking.passengers} VIP Guests
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted block">
                  Aircraft
                </span>
                <span className="text-sm font-semibold text-gold truncate block">
                  {jetDetails?.name || 'Private Jet'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted block">
                  Charter Class
                </span>
                <span className="text-sm font-semibold text-white">
                  {jetDetails?.category || 'Ultra VIP'}
                </span>
              </div>
            </div>

            {/* Passenger Info & Security Seal */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted block">
                  Primary Passenger
                </span>
                <span className="text-base font-serif font-bold text-white">
                  {booking.passenger_name}
                </span>
                <span className="text-xs text-muted-light block">
                  {booking.passenger_phone || 'VIP Concierge Verified'}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-[#211d10] border border-[#d4af37]/30 px-3.5 py-2 rounded-xl text-gold-light text-xs">
                <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                <span>Private Terminal Clearance (FBO)</span>
              </div>
            </div>
          </div>

          {/* Perforation Cutouts (Top and Bottom notches for ticket feel) */}
          <div className="hidden md:block absolute -top-4 left-[66.666%] -translate-x-1/2 w-8 h-8 rounded-full bg-background border-b border-[#d4af37]/40 z-20" />
          <div className="hidden md:block absolute -bottom-4 left-[66.666%] -translate-x-1/2 w-8 h-8 rounded-full bg-background border-t border-[#d4af37]/40 z-20" />

          {/* Tear-Off Stub (4 cols) */}
          <div className="md:col-span-4 p-6 sm:p-8 bg-[#151515] flex flex-col justify-between gap-6 border-dashed md:border-l border-[#d4af37]/30">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono tracking-widest text-gold uppercase">
                  BOARDING STUB
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/30">
                  CONFIRMED
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[10px] uppercase text-muted block">Route</span>
                  <span className="text-base font-bold text-white tracking-wide">
                    {fromCode} &rarr; {toCode}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-muted block">Aircraft</span>
                  <span className="text-sm font-semibold text-white">
                    {jetDetails?.manufacturer} {jetDetails?.name}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-muted block">Charter Investment</span>
                  <span className="text-lg font-serif font-bold text-gold">
                    {formatCurrency(booking.total_price)}
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative Luxury Barcode */}
            <div className="pt-4 border-t border-[#262626]">
              <div className="h-10 w-full flex items-center justify-between gap-[2px] opacity-80 py-1">
                {Array.from({ length: 48 }).map((_, i) => (
                  <span
                    key={i}
                    className={`bg-white h-full ${
                      i % 5 === 0
                        ? 'w-[3px]'
                        : i % 3 === 0
                        ? 'w-[2px]'
                        : i % 2 === 0
                        ? 'w-[1px]'
                        : 'w-[1.5px]'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono text-center block text-muted mt-1.5 tracking-widest">
                *{booking.booking_ref || 'AX-VIP999'}*
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          variant="primary"
          size="lg"
          onClick={handleDownloadPDF}
          loading={downloading}
          icon={Download}
          className="shadow-gold-glow-lg px-8"
        >
          Download VIP Boarding Pass (PDF)
        </Button>
        {onDone && (
          <Button
            variant="outline"
            size="lg"
            onClick={onDone}
            className="px-8"
          >
            View My Bookings
          </Button>
        )}
      </div>
    </motion.div>
  );
}
