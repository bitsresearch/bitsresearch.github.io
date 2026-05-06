

import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Menu, X, Moon, Sun, Volume2, VolumeX, ArrowUp, 
  Instagram, Youtube, Type, Check, MoveHorizontal, ZoomIn
} from 'lucide-react';
import { PageRoute } from '../types';

// Custom Accessibility Icon (Universal Access Symbol)
const AccessibilityIcon = ({ size = 24, className }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="7.5" r="1.5" fill="currentColor" className="stroke-none" />
    <path d="M7 11.5h10" />
    <path d="M12 11.5v3.5" />
    <path d="m9 19 3-4 3 4" />
  </svg>
);

export const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTTSActive, setIsTTSActive] = useState(false);
  const [isDyslexic, setIsDyslexic] = useState(false);
  const [isTextSpacing, setIsTextSpacing] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [isAccessMenuOpen, setIsAccessMenuOpen] = useState(false);
  
  const location = useLocation();
  const accessMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileBtnRef = useRef<HTMLButtonElement>(null);

  // Auto scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Handle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle Dyslexic Font
  useEffect(() => {
    if (isDyslexic) {
      document.body.classList.add('font-dyslexic');
    } else {
      document.body.classList.remove('font-dyslexic');
    }
  }, [isDyslexic]);

  // Handle Text Spacing
  useEffect(() => {
    if (isTextSpacing) {
      document.body.classList.add('spacing-enhanced');
    } else {
      document.body.classList.remove('spacing-enhanced');
    }
  }, [isTextSpacing]);

  // Handle Enlarged Text
  useEffect(() => {
    if (isEnlarged) {
      document.documentElement.classList.add('text-enlarged');
    } else {
      document.documentElement.classList.remove('text-enlarged');
    }
  }, [isEnlarged]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Desktop Accessibility Menu
      if (
        isAccessMenuOpen &&
        accessMenuRef.current && 
        !accessMenuRef.current.contains(event.target as Node)
      ) {
        setIsAccessMenuOpen(false);
      }

      // Mobile Menu
      if (
        isMenuOpen &&
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target as Node) &&
        mobileBtnRef.current &&
        !mobileBtnRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAccessMenuOpen, isMenuOpen]);

  // Handle Scroll to Top Button Visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Text-to-Speech
  const toggleTTS = () => {
    if (isTTSActive) {
      window.speechSynthesis.cancel();
      setIsTTSActive(false);
    } else {
      setIsTTSActive(true);
      speakContent();
    }
  };

  const speakContent = () => {
    window.speechSynthesis.cancel();
    // Simple heuristic: read the main content
    const mainContent = document.querySelector('main')?.innerText;
    if (mainContent) {
      const utterance = new SpeechSynthesisUtterance(mainContent);
      utterance.onend = () => setIsTTSActive(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Stop speaking when route changes
  useEffect(() => {
    window.speechSynthesis.cancel();
    if (isTTSActive) {
        // Slight delay to allow DOM to update
        setTimeout(() => speakContent(), 500);
    }
  }, [location.pathname]);

  const navLinks = [
    { name: 'About', path: PageRoute.ABOUT },
    { name: 'What We Care About', path: PageRoute.CARE },
    { name: 'People', path: PageRoute.TEAM },
    { name: 'Output', path: PageRoute.OUTPUT },
    { name: 'Get Involved', path: PageRoute.INVOLVED },
    { name: 'Contact', path: PageRoute.CONTACT },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailStatus('submitting');
    const form = e.currentTarget;
    // URL provided by user
    const scriptURL = 'https://script.google.com/macros/s/AKfycbymxKunnSr9kHmSx-ClxRjudSQwdgJkg48V0w8dk6F6Jd9D8y6FrxQ8_1HTqVj6lEQN/exec';

    // Convert FormData to URLSearchParams to send as x-www-form-urlencoded
    // This allows Google Apps Script to correctly parse parameters even in no-cors mode
    const formData = new FormData(form);
    const data = new URLSearchParams();
    formData.forEach((value, key) => {
        data.append(key, value as string);
    });

    fetch(scriptURL, { 
        method: 'POST', 
        body: data, 
        mode: 'no-cors'
    })
    .then(response => {
        setEmailStatus('success');
        form.reset();
        // Reset status after 5 seconds so they can submit again if needed, or just leave it 'success'
        setTimeout(() => setEmailStatus('idle'), 5000);
    })
    .catch(error => {
        console.error('Error!', error.message);
        setEmailStatus('error');
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-500 bg-earth-50 dark:bg-earth-900">
      {/* Header */}
      <header className="sticky top-4 z-50 w-full px-4 max-w-7xl mx-auto">
        <div className="bg-white/80 dark:bg-earth-800/80 backdrop-blur-md rounded-full shadow-sm border border-earth-100 dark:border-earth-700 px-6 sm:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <NavLink to={PageRoute.HOME} className="flex items-center gap-3 group" aria-label="bits(~) Home">
                <img 
                    src="https://raw.githubusercontent.com/thkwong/images/refs/heads/main/logo.png" 
                    alt="bits(~) Logo" 
                    className="h-12 w-auto md:h-16 block dark:invert transition-all select-none"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                />
              </NavLink>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-2">
              <nav className="flex items-center bg-earth-100 dark:bg-earth-900 rounded-full px-1 py-1 mr-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                      `px-4 py-2 text-xs uppercase tracking-widest rounded-full transition-all duration-300 ${
                        isActive 
                        ? 'bg-earth-800 text-white shadow-md font-bold' 
                        : 'text-earth-600 dark:text-earth-300 hover:text-earth-900 dark:hover:text-earth-50 hover:bg-earth-200 dark:hover:bg-earth-800'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </nav>

              <div className="flex items-center space-x-2">
                {/* Accessibility Dropdown */}
                <div className="relative" ref={accessMenuRef}>
                    <button
                        onClick={() => setIsAccessMenuOpen(!isAccessMenuOpen)}
                        className={`p-2 rounded-full transition-all ${
                            isAccessMenuOpen 
                            ? 'bg-earth-200 dark:bg-earth-700 text-earth-900 dark:text-earth-100' 
                            : 'hover:bg-earth-100 dark:hover:bg-earth-700 text-earth-600 dark:text-earth-300'
                        }`}
                        aria-label="Accessibility Options"
                        title="Accessibility Options"
                    >
                        <AccessibilityIcon size={20} />
                    </button>

                    {isAccessMenuOpen && (
                        <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-earth-800 rounded-3xl shadow-xl border border-earth-100 dark:border-earth-700 overflow-hidden z-50 transform origin-top-right transition-all">
                             <div className="flex items-center justify-between px-4 py-3 border-b border-earth-100 dark:border-earth-700 bg-earth-50/50 dark:bg-earth-900/30">
                                <h3 className="font-serif text-lg text-earth-900 dark:text-earth-50">Accessibility</h3>
                                <button 
                                  onClick={() => setIsAccessMenuOpen(false)}
                                  className="p-1.5 rounded-full hover:bg-earth-200 dark:hover:bg-earth-700 text-earth-500 hover:text-earth-900 dark:hover:text-earth-100 transition-colors"
                                  aria-label="Close Accessibility Menu"
                                >
                                  <X size={18} />
                                </button>
                             </div>
                             <div className="p-3 space-y-1">
                                <button 
                                    onClick={() => setIsDyslexic(!isDyslexic)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-colors ${
                                        isDyslexic 
                                        ? 'bg-sage-100 dark:bg-sage-900/40 text-sage-700 dark:text-sage-200' 
                                        : 'hover:bg-earth-50 dark:hover:bg-earth-700 text-earth-700 dark:text-earth-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Type size={18} />
                                        <span className="text-sm font-medium">Dyslexic Font</span>
                                    </div>
                                    {isDyslexic && <Check size={16} />}
                                </button>

                                <button 
                                    onClick={() => setIsTextSpacing(!isTextSpacing)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-colors ${
                                        isTextSpacing 
                                        ? 'bg-sage-100 dark:bg-sage-900/40 text-sage-700 dark:text-sage-200' 
                                        : 'hover:bg-earth-50 dark:hover:bg-earth-700 text-earth-700 dark:text-earth-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <MoveHorizontal size={18} />
                                        <span className="text-sm font-medium">Text Spacing</span>
                                    </div>
                                    {isTextSpacing && <Check size={16} />}
                                </button>

                                <button 
                                    onClick={() => setIsEnlarged(!isEnlarged)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-colors ${
                                        isEnlarged 
                                        ? 'bg-sage-100 dark:bg-sage-900/40 text-sage-700 dark:text-sage-200' 
                                        : 'hover:bg-earth-50 dark:hover:bg-earth-700 text-earth-700 dark:text-earth-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <ZoomIn size={18} />
                                        <span className="text-sm font-medium">Enlarge Text</span>
                                    </div>
                                    {isEnlarged && <Check size={16} />}
                                </button>
                                
                                <button 
                                    onClick={toggleTTS}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-colors ${
                                        isTTSActive 
                                        ? 'bg-sage-100 dark:bg-sage-900/40 text-sage-700 dark:text-sage-200' 
                                        : 'hover:bg-earth-50 dark:hover:bg-earth-700 text-earth-700 dark:text-earth-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {isTTSActive ? <Volume2 size={18} /> : <VolumeX size={18} />}
                                        <span className="text-sm font-medium">Text to Speech</span>
                                    </div>
                                    {isTTSActive && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                                </button>

                                <div className="h-px bg-earth-100 dark:bg-earth-700 my-1 mx-2"></div>

                                <button 
                                    onClick={() => setIsDarkMode(false)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-colors ${
                                        !isDarkMode 
                                        ? 'bg-sage-100 dark:bg-sage-900/40 text-sage-700 dark:text-sage-200' 
                                        : 'hover:bg-earth-50 dark:hover:bg-earth-700 text-earth-700 dark:text-earth-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Sun size={18} />
                                        <span className="text-sm font-medium">Light Theme</span>
                                    </div>
                                    {!isDarkMode && <Check size={16} />}
                                </button>

                                <button 
                                    onClick={() => setIsDarkMode(true)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-colors ${
                                        isDarkMode 
                                        ? 'bg-sage-100 dark:bg-sage-900/40 text-sage-700 dark:text-sage-200' 
                                        : 'hover:bg-earth-50 dark:hover:bg-earth-700 text-earth-700 dark:text-earth-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Moon size={18} />
                                        <span className="text-sm font-medium">Dark Theme</span>
                                    </div>
                                    {isDarkMode && <Check size={16} />}
                                </button>
                             </div>
                        </div>
                    )}
                </div>

                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-full hover:bg-earth-100 dark:hover:bg-earth-700 transition-colors text-earth-600 dark:text-earth-300"
                  aria-label="Toggle Dark Mode"
                  title="Toggle Dark Mode"
                >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                ref={mobileBtnRef}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-earth-800 dark:text-earth-200"
                aria-label="Toggle navigation menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="md:hidden absolute top-24 left-4 right-4 bg-white dark:bg-earth-800 rounded-3xl shadow-xl border border-earth-100 dark:border-earth-700 overflow-hidden z-40"
          >
            <div className="p-4 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-base font-medium rounded-xl text-earth-800 dark:text-earth-200 hover:bg-sage-50 dark:hover:bg-sage-900/50 hover:text-sage-600 transition-colors"
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-earth-100 dark:border-earth-700">
                 <button 
                    onClick={() => setIsDyslexic(!isDyslexic)} 
                    className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-sm font-medium transition-colors ${isDyslexic ? 'bg-sage-100 dark:bg-sage-900 text-sage-700 dark:text-sage-200' : 'bg-earth-50 dark:bg-earth-900 text-earth-800 dark:text-earth-200'}`}
                    aria-label="Dyslexic Font"
                 >
                    <Type size={20} />
                 </button>
                 <button 
                    onClick={() => setIsTextSpacing(!isTextSpacing)} 
                    className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-sm font-medium transition-colors ${isTextSpacing ? 'bg-sage-100 dark:bg-sage-900 text-sage-700 dark:text-sage-200' : 'bg-earth-50 dark:bg-earth-900 text-earth-800 dark:text-earth-200'}`}
                    aria-label="Text Spacing"
                 >
                    <MoveHorizontal size={20} />
                 </button>
                 <button 
                    onClick={() => setIsEnlarged(!isEnlarged)} 
                    className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-sm font-medium transition-colors ${isEnlarged ? 'bg-sage-100 dark:bg-sage-900 text-sage-700 dark:text-sage-200' : 'bg-earth-50 dark:bg-earth-900 text-earth-800 dark:text-earth-200'}`}
                    aria-label="Enlarge Text"
                 >
                    <ZoomIn size={20} />
                 </button>
                 <button 
                    onClick={toggleTTS} 
                    className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-sm font-medium transition-colors ${isTTSActive ? 'bg-sage-100 dark:bg-sage-900 text-sage-700 dark:text-sage-200' : 'bg-earth-50 dark:bg-earth-900 text-earth-800 dark:text-earth-200'}`}
                    aria-label="Text to Speech"
                 >
                    {isTTSActive ? <Volume2 size={20} /> : <VolumeX size={20} />}
                 </button>
              </div>
              
              {/* Extra row for Theme and Spacer/Layout balance if needed */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                 <button 
                    onClick={() => setIsDarkMode(false)} 
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors ${!isDarkMode ? 'bg-sage-100 text-sage-700' : 'bg-earth-50 dark:bg-earth-900 text-earth-800 dark:text-earth-200'}`}
                    aria-label="Light Theme"
                 >
                    <Sun size={20} />
                    <span>Light Theme</span>
                 </button>
                 <button 
                    onClick={() => setIsDarkMode(true)} 
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors ${isDarkMode ? 'bg-sage-100 dark:bg-sage-900 text-sage-700 dark:text-sage-200' : 'bg-earth-50 dark:bg-earth-900 text-earth-800 dark:text-earth-200'}`}
                    aria-label="Dark Theme"
                 >
                    <Moon size={20} />
                    <span>Dark Theme</span>
                 </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Back to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-sage-500 text-white rounded-full shadow-lg z-50 hover:bg-sage-600 transition-all duration-300 hover:-translate-y-1"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Footer */}
      <footer className="bg-earth-100 dark:bg-earth-800 py-16 mt-12 rounded-t-4xl mx-2">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Brand Column */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-2 mb-6">
                <img 
                    src="https://raw.githubusercontent.com/thkwong/images/refs/heads/main/logo.png" 
                    alt="bits(~) Logo" 
                    className="h-14 w-auto block dark:invert select-none"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                />
              </div>
              <p className="text-earth-600 dark:text-earth-400 max-w-sm text-sm leading-loose">
                Every story, every one matters in transition. Join our workshops to co-create support for your journey and others’ as students with diverse learning journey.
              </p>
            </div>

            {/* Social Column */}
            <div className="lg:col-span-2">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-earth-900 dark:text-earth-100">Social</h3>
              <div className="flex flex-col space-y-4">
                <a 
                  href="https://www.instagram.com/bits.research#" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 text-earth-700 dark:text-earth-300 hover:text-sage-700 dark:hover:text-sage-300 transition-colors group"
                  aria-label="Follow us on Instagram"
                >
                  <span className="p-2 bg-white dark:bg-earth-900 rounded-full group-hover:bg-sage-100 dark:group-hover:bg-sage-900 transition-colors">
                    <Instagram size={16} />
                  </span>
                  Instagram
                </a>
                <a 
                  href="https://www.youtube.com/@bits-research" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 text-earth-700 dark:text-earth-300 hover:text-sage-700 dark:hover:text-sage-300 transition-colors group"
                  aria-label="Subscribe to our YouTube Channel"
                >
                  <span className="p-2 bg-white dark:bg-earth-900 rounded-full group-hover:bg-sage-100 dark:group-hover:bg-sage-900 transition-colors">
                    <Youtube size={16} />
                  </span>
                  YouTube Channel
                </a>
              </div>
            </div>

            {/* Legal Column */}
            <div className="lg:col-span-2">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-earth-900 dark:text-earth-100">Legal</h3>
              <div className="flex flex-col space-y-3">
                <Link to={PageRoute.ETHICS} className="text-earth-700 dark:text-earth-300 hover:text-sage-700 dark:hover:text-sage-300 text-sm">Research Ethics</Link>
                <Link to={PageRoute.ACCESSIBILITY} className="text-earth-700 dark:text-earth-300 hover:text-sage-700 dark:hover:text-sage-300 text-sm">Accessibility</Link>
                <Link to={PageRoute.PRIVACY} className="text-earth-700 dark:text-earth-300 hover:text-sage-700 dark:hover:text-sage-300 text-sm">Privacy Policy</Link>
                <Link to={PageRoute.TERMS} className="text-earth-700 dark:text-earth-300 hover:text-sage-700 dark:hover:text-sage-300 text-sm">Terms of Use</Link>
              </div>
            </div>

            {/* Newsletter Column */}
            <div className="lg:col-span-4">
               <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-earth-900 dark:text-earth-100">Newsletter</h3>
               <div className="">
                   <p className="text-sm text-earth-700 dark:text-earth-300 mb-4 leading-relaxed">
                       Receive project updates, transition tips, and teaching resources on transmedia storytelling.
                   </p>
                   <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-4">
                        {/* Hidden Inputs for Google Script Compatibility */}
                       <input type="hidden" name="name" value="Newsletter Subscriber" />
                       <input type="hidden" name="role" value="Subscriber" />
                       <input type="hidden" name="message" value="Footer Subscription" />
                       
                       <label htmlFor="newsletter-email" className="sr-only">Your Email Address</label>
                       <input 
                          id="newsletter-email"
                          type="email" 
                          name="email" 
                          placeholder="Your Email Address" 
                          required
                          pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                          title="Please enter a valid email address (e.g. user@example.com)"
                          className="w-full px-0 py-3 bg-transparent border-b border-earth-300 dark:border-earth-700 focus:outline-none focus:border-sage-500 dark:focus:border-sage-400 text-earth-900 dark:text-earth-100 placeholder-earth-500 text-sm transition-all rounded-none"
                       />
                       <button 
                          type="submit" 
                          disabled={emailStatus === 'submitting'}
                          className="w-full py-3 bg-sage-600 text-white rounded-xl font-medium hover:bg-sage-700 transition-colors text-sm disabled:opacity-70 shadow-sm mt-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-500"
                       >
                          {emailStatus === 'submitting' ? 'Subscribing...' : 'Subscribe Now'}
                       </button>
                   </form>
                   <div aria-live="polite">
                       {emailStatus === 'success' && <p className="mt-3 text-xs text-sage-700 dark:text-sage-300 font-medium" role="status">Thank you! You are subscribed.</p>}
                       {emailStatus === 'error' && <p className="mt-3 text-xs text-red-600 font-medium" role="alert">Error! Please try again.</p>}
                   </div>
               </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-earth-200 dark:border-earth-700 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-earth-500 dark:text-earth-500">
              © {new Date().getFullYear()} bits(~) Research Project. All rights reserved.
            </p>
            <a 
                href="https://creativecommons.org/licenses/by-nc/4.0/deed.en"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-earth-500 font-medium hover:text-sage-600 dark:hover:text-sage-400 transition-colors"
            >
                Attribution-NonCommercial (CC BY-NC 4.0)
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};