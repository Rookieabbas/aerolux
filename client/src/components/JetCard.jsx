import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Gauge, Compass, ArrowRight, ShieldCheck } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';
import { formatCurrency } from '../utils/haversine';

export function JetCard({ jet, index = 0 }) {
  if (!jet) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="group relative bg-surface border border-border hover:border-gold/40 rounded-2xl overflow-hidden flex flex-col h-full shadow-lg transition-all duration-300 hover:shadow-gold-glow"
    >
      {/* Jet Image with Gradient Overlay */}
      <div className="relative h-56 w-full overflow-hidden bg-surface-card">
        <img
          src={jet.image_url}
          alt={`${jet.manufacturer} ${jet.name}`}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/30" />
        
        {/* Category Badge & Availability */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
          <Badge variant={jet.category}>{jet.category}</Badge>
          {jet.available ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Available
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/70 backdrop-blur-md text-zinc-400 border border-zinc-700">
              In Service
            </span>
          )}
        </div>
      </div>

      {/* Jet Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between gap-5">
        <div>
          <div className="text-xs uppercase tracking-widest text-gold font-medium mb-1">
            {jet.manufacturer}
          </div>
          <h3 className="font-serif text-2xl text-white font-medium group-hover:text-gold-light transition-colors">
            {jet.name}
          </h3>
          <p className="text-xs text-muted mt-2 line-clamp-2 leading-relaxed">
            {jet.description}
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 px-2 bg-surface-card/60 rounded-xl border border-border/60">
          <div className="flex flex-col items-center text-center">
            <span className="flex items-center gap-1 text-[11px] text-muted mb-0.5">
              <Users className="w-3.5 h-3.5 text-gold/80" />
              Capacity
            </span>
            <span className="text-sm font-semibold text-white">
              {jet.seats} <span className="text-[10px] text-muted font-normal">seats</span>
            </span>
          </div>

          <div className="flex flex-col items-center text-center border-x border-border/80">
            <span className="flex items-center gap-1 text-[11px] text-muted mb-0.5">
              <Compass className="w-3.5 h-3.5 text-gold/80" />
              Range
            </span>
            <span className="text-sm font-semibold text-white">
              {jet.range_km?.toLocaleString()} <span className="text-[10px] text-muted font-normal">km</span>
            </span>
          </div>

          <div className="flex flex-col items-center text-center">
            <span className="flex items-center gap-1 text-[11px] text-muted mb-0.5">
              <Gauge className="w-3.5 h-3.5 text-gold/80" />
              Cruise
            </span>
            <span className="text-sm font-semibold text-white">
              {jet.speed_kmh} <span className="text-[10px] text-muted font-normal">km/h</span>
            </span>
          </div>
        </div>

        {/* Price & Charter CTA */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-border/60">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-muted block">
              Charter Rate
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-serif font-bold text-white">
                {formatCurrency(jet.price_per_hour)}
              </span>
              <span className="text-xs text-muted">/ hr</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/jets/${jet.id}`}>
              <Button variant="ghost" size="sm" className="px-3 text-xs">
                Details
              </Button>
            </Link>
            <Link to={`/book/${jet.id}`}>
              <Button
                variant="primary"
                size="sm"
                disabled={!jet.available}
                icon={ArrowRight}
                className="text-xs px-4"
              >
                Charter
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
