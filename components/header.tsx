"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LifeBuoy, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"

const navLinks = [
  { href: 'https://solmarestays.com', label: 'Home' },
  { href: 'https://solmarestays.com/collection', label: 'The Collection' },
  { href: 'https://solmarestays.com/philosophy', label: 'Philosophy' },
  { href: 'https://solmarestays.com/management', label: 'Management' },
  { href: 'https://solmarestays.com/experiences', label: 'Experiences' },
  { href: 'https://solmarestays.com/contact', label: 'Contact' },
];

interface HeaderProps {
  contactPhone?: string
}

export function Header({ contactPhone = "+18052426411" }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false)
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/95 backdrop-blur-md shadow-sm py-2`}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex flex-col items-center group">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Solmaré Stays"
                  draggable="false"
                  className="w-20 h-20 md:w-28 md:h-28 object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10 absolute left-1/2 transform -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative group text-sm font-normal tracking-wide transition-colors duration-200 hover:text-primary ${pathname === link.href
                    ? 'text-primary'
                    : 'text-foreground/70'
                    }`}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 w-0 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Help Button */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="default"
                className="hidden md:flex border-foreground/30 text-foreground hover:bg-foreground hover:text-white rounded-lg px-6"
                onClick={() => setHelpOpen(true)}
              >
                Help
              </Button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-background shadow-elevated p-6 pt-28"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-2 text-lg font-medium transition-colors hover:text-primary ${pathname === link.href
                      ? 'text-primary'
                      : 'text-foreground'
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-8 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-foreground/20"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setHelpOpen(true);
                    }}
                  >
                    Help
                  </Button>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Need Assistance?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-gray-600 text-base">
              For general questions, please contact your host on the platform you booked on (Airbnb/VRBO).
            </p>
            <a
              href={`tel:${contactPhone}`}
              className="flex items-center justify-center gap-2 w-full py-4 px-5 bg-blue-600 text-white font-medium text-base rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Phone className="w-5 h-5" strokeWidth={1.5} />
              Call Management {contactPhone === "+18052426411" ? "(805) 242-6411" : contactPhone}
            </a>
          </div>
          <DialogClose asChild>
            <Button variant="outline" className="w-full h-11 text-base bg-transparent">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}
