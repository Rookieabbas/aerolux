import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Menu, X, User, LogOut, Compass, Calendar, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Fleet', path: '/jets', icon: Compass },
    { name: 'How It Works', path: '/#how-it-works' },
    ...(user ? [{ name: 'My Bookings', path: '/bookings', icon: Calendar }] : []),
  ];

  const isActive = (path) => {
    if (path.startsWith('/#')) return false;
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-[#0a0a0a]/85 backdrop-blur-md border-b border-border/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center text-black font-bold shadow-gold-glow group-hover:scale-105 transition-transform">
            <Plane className="w-5 h-5 fill-current rotate-45" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-white group-hover:text-gold transition-colors">
              AEROLUX
            </span>
            <span className="text-[9px] tracking-[0.28em] text-gold uppercase font-medium">
              Private Jet Charter
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium tracking-wide transition-colors relative py-1 flex items-center gap-1.5 ${
                isActive(link.path)
                  ? 'text-gold'
                  : 'text-muted-light hover:text-white'
              }`}
            >
              {link.icon && <link.icon className="w-3.5 h-3.5 opacity-70" />}
              <span>{link.name}</span>
              {isActive(link.path) && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold rounded-full"
                />
              )}
            </Link>
          ))}
        </div>

        {/* User Menu or Auth CTAs */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-surface border border-border hover:border-gold/40 text-sm transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gold/15 text-gold flex items-center justify-center font-medium text-xs border border-gold/30">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="text-left text-xs">
                  <div className="text-white font-medium truncate max-w-[130px]">
                    {profile?.full_name || 'VIP Member'}
                  </div>
                  <div className="text-[10px] text-gold font-medium">VIP Client</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted" />
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-52 bg-surface border border-border rounded-xl shadow-luxury py-1.5 z-50 text-xs"
                  >
                    <div className="px-3.5 py-2 border-b border-border text-muted">
                      <p className="text-[11px] font-medium text-white truncate">
                        {user.email}
                      </p>
                      <span className="text-[10px] uppercase text-gold font-medium">
                        VIP Charter Account
                      </span>
                    </div>

                    <Link
                      to="/bookings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2.5 hover:bg-surface-card text-muted-light hover:text-white"
                    >
                      <Calendar className="w-4 h-4 text-gold" />
                      <span>My Bookings</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3.5 py-2.5 text-red-400 hover:bg-red-950/20 text-left border-t border-border mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-xs">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm" className="text-xs px-4">
                  Join VIP Club
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-muted hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface border-b border-border overflow-hidden px-4 pt-3 pb-6 space-y-3"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 text-sm text-muted-light hover:text-white"
              >
                <span>{link.name}</span>
              </Link>
            ))}

            <div className="pt-4 border-t border-border">
              {user ? (
                <div className="space-y-3">
                  <div className="text-xs text-muted">
                    Logged in as <span className="text-white font-medium">{profile?.full_name || user.email}</span>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-center"
                    icon={LogOut}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="secondary" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">
                      Join VIP
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
