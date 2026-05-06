

import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PageRoute, TeamMember } from './types';
import { 
  ArrowRight, Mail, MapPin, Phone, Play, 
  Facebook, Twitter, Linkedin, CheckCircle2,
  BookOpen, FileText, Presentation, Mic, Globe, Instagram, Calendar, Clock, MapPin as MapPinIcon, AlertCircle, CalendarPlus,
  ChevronLeft, ChevronRight, Search, Loader2, ExternalLink, Book, GraduationCap, Palette, HeartHandshake
} from 'lucide-react';

// --- Helper: SEO Component ---

const SITE_ORIGIN = 'https://bitsresearch.github.io';
const SITE_NAME = 'BITS | Building Identity through Stories';
const SITE_AUTHOR = 'Charlie Tak Hei Kwong 鄺德希';
const OG_IMAGE = `${SITE_ORIGIN}/og-image.jpg`;
const routeSlugs = ['about', 'what-we-care', 'research-update', 'output-resources', 'team', 'get-involved', 'contact', 'privacy-policy', 'terms-of-use', 'accessibility', 'research-ethics', 'upcomingworkshops', 'upcomingworkshop'].flatMap(slug => [slug, `${slug}.html`]);

const personSchema = {
  "@type": "Person",
  "name": "Charlie Tak Hei Kwong",
  "alternateName": "鄺德希",
  "jobTitle": "Doctoral Researcher",
  "knowsAbout": [
    "Transmedia storytelling",
    "Inclusive education",
    "Creative media",
    "Arts-based research",
    "Higher education transition",
    "Identity exploration",
    "Student agency"
  ],
  "affiliation": [
    { "@type": "CollegeOrUniversity", "name": "Falmouth University" },
    { "@type": "CollegeOrUniversity", "name": "University of the Arts London" }
  ],
  "url": `${SITE_ORIGIN}/team/`
};

const researchProjectSchema = {
  "@type": "ResearchProject",
  "name": "Building Identity Through Stories",
  "alternateName": "BITS",
  "author": personSchema,
  "about": [
    "Transmedia storytelling",
    "Identity exploration",
    "Student transition",
    "Higher education transition",
    "Students with diverse learning journeys",
    "Inclusive education",
    "Arts-based educational research"
  ],
  "funder": [
    { "@type": "CollegeOrUniversity", "name": "Falmouth University" },
    { "@type": "CollegeOrUniversity", "name": "University of the Arts London" }
  ],
  "url": `${SITE_ORIGIN}/`
};

const organisationSchemas = [
  { "@type": "CollegeOrUniversity", "name": "Falmouth University", "url": "https://www.falmouth.ac.uk/" },
  { "@type": "CollegeOrUniversity", "name": "University of the Arts London", "alternateName": "UAL", "url": "https://www.arts.ac.uk/" }
];

const getStaticBasePath = () => {
  const baseUrl = import.meta.env.BASE_URL || '/';
  if (baseUrl && baseUrl !== '/' && baseUrl !== './') return baseUrl.replace(/\/$/, '');
  const parts = window.location.pathname.split('/').filter(Boolean);
  const routeIndex = parts.findIndex(part => routeSlugs.includes(part));
  return routeIndex > 0 ? '/' + parts.slice(0, routeIndex).join('/') : '';
};

const toCanonicalPath = (pathname: string) => {
  const cleanPath = pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '/');
  const parts = cleanPath.split('/').filter(Boolean);
  const routeIndex = parts.findIndex(part => routeSlugs.includes(part));
  const routeParts = routeIndex >= 0 ? parts.slice(routeIndex) : [];
  if (routeParts.length === 0) return '/';
  return `/${routeParts.join('/')}/`;
};


interface SEOProps {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalPath?: string;
  noindex?: boolean;
}

const SEO: React.FC<SEOProps> = ({ title, description, ogTitle, ogDescription, canonicalPath, noindex = false }) => {
  const location = useLocation();

  useEffect(() => {
    document.title = title;
    const cleanCanonicalPath = canonicalPath || toCanonicalPath(location.pathname);
    const canonicalUrl = `${SITE_ORIGIN}${cleanCanonicalPath}`;

    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('author', SITE_AUTHOR);
    updateMeta('robots', noindex ? 'noindex, follow' : 'index, follow');
    updateMeta('og:site_name', SITE_NAME, true);
    updateMeta('og:type', 'website', true);
    updateMeta('og:url', canonicalUrl, true);
    updateMeta('og:title', ogTitle || title, true);
    updateMeta('og:description', ogDescription || description, true);
    updateMeta('og:image', OG_IMAGE, true);

    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', ogTitle || title);
    updateMeta('twitter:description', ogDescription || description);
    updateMeta('twitter:image', OG_IMAGE);

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

  }, [title, description, ogTitle, ogDescription, canonicalPath, noindex, location.pathname]);

  return null;
};

const JSONLD: React.FC<{ data: any }> = ({ data }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [data]);
  return null;
};

// --- Helper: Video Fetching ---

interface VideoData {
  order: string;
  area: string;
  link: string;
  embedUrl: string | null;
}

const getEmbedUrl = (url: string) => {
  if (!url) return null;
  // Handle various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
};

const useVideoSheet = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vSHQGTMTLaBAyxMZYxyjG1JrhOtHwvzZmDCgJ_3jaBJnCg81qmtRuN3Mj4toSFcPgJQ113wI1qyi7cS/pub?output=csv`);
        if (!response.ok) throw new Error('Network response was not ok');
        const text = await response.text();
        const rows = text.split(/\r?\n/).filter(row => row.trim() !== "");
        
        if (rows.length <= 1) {
            setVideos([]);
            return;
        }

        const dataRows = rows.slice(1);
        const parsedData = dataRows.map(row => {
            const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
            const cols = row.split(regex).map(col => col.replace(/^"|"$/g, '').trim());
            // Columns: Order (0), Area (1), Link (2)
            if (cols.length < 3) return null;
            return {
                order: cols[0],
                area: cols[1],
                link: cols[2],
                embedUrl: getEmbedUrl(cols[2])
            };
        }).filter((item): item is VideoData => item !== null);

        setVideos(parsedData);
      } catch (err) {
        console.error("Failed to load videos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  return { videos, loading };
};

// --- Helper: Linkify Text ---
const linkify = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a 
          key={i} 
          href={part} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sage-600 dark:text-sage-400 hover:underline break-all"
          onMouseDown={(e) => e.stopPropagation()} // Prevent drag/swipe interference
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

const ensureAbsoluteUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};

// --- Helper: Workshop Interface & Component ---

interface Workshop {
  title: string;
  date: string;
  time: string;
  venue: string;
  remarks: string;
  link: string;
  parsedDate: Date;
}

const WorkshopSection: React.FC = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Carousel State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Swipe/Drag State
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState<number>(0);

  // Responsive Carousel Logic
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth >= 1024) {
            setItemsPerPage(3); // Desktop: Row of three
        } else if (window.innerWidth >= 768) {
            setItemsPerPage(2); // Tablet: Two items
        } else {
            setItemsPerPage(1); // Mobile: One slide
        }
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset index if out of bounds (e.g., resizing window)
  useEffect(() => {
     if (workshops.length > 0) {
         const maxIndex = Math.max(0, workshops.length - itemsPerPage);
         if (currentIndex > maxIndex) {
             setCurrentIndex(maxIndex);
         }
     }
  }, [itemsPerPage, workshops.length]);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setLoading(true);
        // Using the published CSV link with cache-busting timestamp
        // Sheet ID: 2PACX-1vSLAX_TguHx2FXd0pxNxM5ViTiTnGnbZPsdrO7KGm98aekIxu4kkHHhAVwM2_W1xiB_WJTbPfSZLet2
        const response = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vSLAX_TguHx2FXd0pxNxM5ViTiTnGnbZPsdrO7KGm98aekIxu4kkHHhAVwM2_W1xiB_WJTbPfSZLet2/pub?output=csv`);
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const text = await response.text();
        
        // Robust CSV Splitting handling \r\n and empty lines
        const rows = text.split(/\r?\n/).filter(row => row.trim() !== "");
        
        if (rows.length <= 1) {
          setWorkshops([]);
          setLoading(false);
          return;
        }

        const dataRows = rows.slice(1); // Skip header
        
        const parsedData: Workshop[] = dataRows.map(row => {
          // Regex to split by comma but ignore commas inside quotes
          const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
          const cols = row.split(regex).map(col => col.replace(/^"|"$/g, '').trim());
          
          if (cols.length < 2) return null;

          // Mapping: Title, Date (DD/MM/YYYY or similar), Time, Venue, Remarks, Registration Link
          const title = cols[0] || "Untitled Workshop";
          const dateStr = cols[1] || "";
          const time = cols[2] || "";
          const venue = cols[3] || "";
          const remarks = cols[4] || "";
          const link = cols[5] || "";
          
          // Date Parsing Logic (Prioritizing DD/MM/YYYY for UK context)
          let dateObj: Date | null = null;
          const cleanDateStr = dateStr.trim();
          
          // Check for DD/MM/YYYY or DD-MM-YYYY (Common in UK/HK)
          // Matches 02/03/2026 or 2-3-2026
          const ddmmyyyy = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/;
          const match = cleanDateStr.match(ddmmyyyy);
          
          if (match) {
             const d = parseInt(match[1], 10);
             const m = parseInt(match[2], 10);
             const y = parseInt(match[3], 10);
             if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
                 // Month is 0-indexed in JS Date
                 dateObj = new Date(y, m - 1, d);
             }
          } 
          
          // Fallback if regex didn't match (e.g. "Oct 12, 2025" or ISO)
          if (!dateObj || isNaN(dateObj.getTime())) {
              const timestamp = Date.parse(cleanDateStr);
              if (!isNaN(timestamp)) {
                  dateObj = new Date(timestamp);
              }
          }

          // Final validation: skip if we still have no valid date
          if (!dateObj || isNaN(dateObj.getTime())) return null;

          return {
            title,
            date: dateStr,
            time,
            venue,
            remarks,
            link,
            parsedDate: dateObj
          };
        }).filter((item): item is Workshop => item !== null);

        // Filter: Only future dates (including today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const futureWorkshops = parsedData.filter(ws => ws.parsedDate >= today);

        // Sort: Soonest first
        futureWorkshops.sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

        setWorkshops(futureWorkshops);
        setError(false);
      } catch (err) {
        console.error("Failed to load workshops", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  const downloadICS = (ws: Workshop) => {
    // Generate floating time string YYYYMMDDTHHMMSS
    const formatDate = (date: Date) => {
        const pad = (n: number) => n < 10 ? '0' + n : n;
        return '' + date.getFullYear() + pad(date.getMonth() + 1) + pad(date.getDate()) +
               'T' + pad(date.getHours()) + pad(date.getMinutes()) + '00';
    };

    const year = ws.parsedDate.getFullYear();
    const month = ws.parsedDate.getMonth();
    const day = ws.parsedDate.getDate();

    let startHour = 9;
    let startMin = 0;
    let endHour = 10;
    let endMin = 0;

    const timeMatches = ws.time.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/gi);
    
    if (timeMatches && timeMatches.length > 0) {
        const startParts = timeMatches[0].match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
        if (startParts) {
            let h = parseInt(startParts[1]);
            const m = startParts[2] ? parseInt(startParts[2]) : 0;
            const mer = startParts[3] ? startParts[3].toLowerCase() : null;
            if (mer === 'pm' && h < 12) h += 12;
            if (mer === 'am' && h === 12) h = 0;
            startHour = h;
            startMin = m;
            endHour = h + 1;
            endMin = m;
        }
        if (timeMatches.length > 1) {
             const endParts = timeMatches[1].match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
             if (endParts) {
                let h = parseInt(endParts[1]);
                const m = endParts[2] ? parseInt(endParts[2]) : 0;
                const mer = endParts[3] ? endParts[3].toLowerCase() : null;
                if (mer === 'pm' && h < 12) h += 12;
                if (mer === 'am' && h === 12) h = 0;
                endHour = h;
                endMin = m;
             }
        }
    }

    // Create dates based on local components (using the parsed date)
    const startDate = new Date(year, month, day, startHour, startMin);
    const endDate = new Date(year, month, day, endHour, endMin);

    const event = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//bits(~) Studio//Workshop//EN',
        'BEGIN:VEVENT',
        `UID:${Date.now()}@bitsstudio.com`,
        `DTSTAMP:${formatDate(new Date())}`, // Created TS is fine in local time context or UTC, usually not critical
        `DTSTART:${formatDate(startDate)}`,
        `DTEND:${formatDate(endDate)}`,
        `SUMMARY:${ws.title}`,
        `DESCRIPTION:${ws.remarks || 'Join our workshop!'}`,
        `LOCATION:${ws.venue}`,
        `URL:${ws.link}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([event], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${ws.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const nextSlide = () => {
    if (currentIndex < workshops.length - itemsPerPage) {
        setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
    }
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextSlide();
    if (distance < -minSwipeDistance) prevSlide();
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const onMouseUp = (e: React.MouseEvent) => {
      if (!isDragging) return;
      setIsDragging(false);
      const distance = dragStartX - e.clientX;
      if (distance > minSwipeDistance) nextSlide();
      if (distance < -minSwipeDistance) prevSlide();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  if (loading) return (
    <div className="py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-sage-600" size={32} />
        <p className="text-earth-700 text-sm font-medium">Checking for upcoming workshops...</p>
    </div>
  );

  return (
    <section 
      id="upcoming-workshops"
      className="py-16 px-4 max-w-7xl mx-auto select-none" 
      aria-label="Upcoming Workshops Carousel"
    >
        <div className="flex flex-col items-center justify-center mb-10 gap-6 px-2">
            <div className="flex items-center gap-4">
                <span className="h-px w-12 bg-sage-600"></span>
                <h2 className="text-3xl font-serif text-center text-earth-900 dark:text-earth-50">Upcoming Workshops</h2>
                <span className="h-px w-12 bg-sage-600"></span>
            </div>
            
            {workshops.length > itemsPerPage && (
                <div className="flex gap-2">
                    <button 
                        onClick={prevSlide} 
                        disabled={currentIndex === 0}
                        className="p-3 rounded-full border border-earth-300 dark:border-earth-600 text-earth-700 dark:text-earth-300 hover:bg-earth-100 dark:hover:bg-earth-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-sage-500"
                        aria-label="Previous workshop slide"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button 
                        onClick={nextSlide} 
                        disabled={currentIndex >= workshops.length - itemsPerPage}
                        className="p-3 rounded-full border border-earth-300 dark:border-earth-600 text-earth-700 dark:text-earth-300 hover:bg-earth-100 dark:hover:bg-earth-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-sage-500"
                        aria-label="Next workshop slide"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>

        {workshops.length === 0 || error ? (
            <div className="bg-white dark:bg-earth-800 rounded-3xl p-10 text-center border border-earth-200 dark:border-earth-700 shadow-sm max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-sage-100 dark:bg-sage-900/50 text-sage-700 dark:text-sage-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar size={32} />
                </div>
                <h3 className="text-xl font-serif text-earth-900 dark:text-earth-50 mb-4">No workshops scheduled right now</h3>
                <p className="text-earth-700 dark:text-earth-300 mb-8 leading-relaxed">
                    Coming soon – stay tuned! If you have any questions, feel free to reach out to us through our contact form. We’d love to hear from you!
                </p>
                <Link 
                    to={PageRoute.CONTACT}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-earth-800 dark:bg-earth-200 text-white dark:text-earth-900 rounded-full text-sm font-medium hover:bg-sage-700 dark:hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-sage-500"
                >
                    Contact Us <ArrowRight size={16} />
                </Link>
            </div>
        ) : (
            <div 
                className="overflow-hidden -mx-4 px-4 py-4 cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-sage-500 rounded-xl"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseLeave={() => setIsDragging(false)}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="region"
                aria-roledescription="carousel"
                aria-live="polite"
                ref={carouselRef}
            >
                <div 
                    className={`flex transition-transform duration-500 ease-out will-change-transform motion-reduce:transition-none ${workshops.length <= itemsPerPage ? 'justify-center' : 'justify-start'}`} 
                    style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
                >
                    {workshops.map((ws, idx) => (
                        <div 
                            key={idx} 
                            style={{ width: `${100 / itemsPerPage}%` }} 
                            className="flex-shrink-0 px-3"
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`${idx + 1} of ${workshops.length}`}
                        >
                            <div className="bg-white dark:bg-earth-800 rounded-3xl p-6 md:p-8 shadow-sm border border-earth-200 dark:border-earth-700 hover:shadow-lg hover:border-sage-400 transition-all duration-300 flex flex-col h-full group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="px-4 py-2 bg-sage-100 dark:bg-sage-900/50 text-sage-800 dark:text-sage-200 text-xs font-bold uppercase tracking-widest rounded-full">
                                        {ws.parsedDate.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </div>

                                <h3 className="text-xl font-serif font-bold text-earth-900 dark:text-earth-50 mb-4 leading-tight group-hover:text-sage-700 dark:group-hover:text-sage-300 transition-colors line-clamp-2">
                                    {ws.title}
                                </h3>

                                <div className="space-y-3 mb-6 flex-grow">
                                    <div className="flex items-start gap-3 text-earth-700 dark:text-earth-400 text-sm">
                                        <Clock size={16} className="mt-0.5 flex-shrink-0 text-sage-600" />
                                        <span>{ws.time}</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-earth-700 dark:text-earth-400 text-sm">
                                        <MapPinIcon size={16} className="mt-0.5 flex-shrink-0 text-sage-600" />
                                        <span>{ws.venue}</span>
                                    </div>
                                    {ws.remarks && (
                                        <div className="flex items-start gap-3 text-earth-700 dark:text-earth-400 text-sm italic mt-2 p-3 bg-earth-50 dark:bg-earth-700/30 rounded-xl">
                                            <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-earth-500" />
                                            <span>{linkify(ws.remarks)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2 mt-auto">
                                    {ws.link ? (
                                        <a 
                                            href={ensureAbsoluteUrl(ws.link)} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="w-full py-3 bg-sage-600 text-white rounded-xl font-medium text-center hover:bg-sage-700 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-500"
                                            onMouseDown={(e) => e.stopPropagation()}
                                        >
                                            Register Now <ArrowRight size={16} />
                                        </a>
                                    ) : (
                                        <button disabled className="w-full py-3 bg-earth-200 text-earth-600 rounded-xl font-medium text-center cursor-not-allowed">
                                            Registration Closed
                                        </button>
                                    )}
                                    
                                    <button
                                        onClick={() => downloadICS(ws)}
                                        className="w-full py-3 bg-transparent border border-earth-300 dark:border-earth-600 text-earth-700 dark:text-earth-300 rounded-xl font-medium text-center hover:bg-earth-100 dark:hover:bg-earth-700 transition-colors flex items-center justify-center gap-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-earth-500"
                                        onMouseDown={(e) => e.stopPropagation()}
                                    >
                                        <CalendarPlus size={16} /> Add to My Calendar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </section>
  );
};


// --- Page Components ---

// 1. Home Page
const ResearchUpdate: React.FC = () => {
  const { videos, loading } = useVideoSheet();
  const [researchVideos, setResearchVideos] = useState<VideoData[]>([]);

  useEffect(() => {
    if (!loading) {
      const filtered = videos
        .filter(v => v.area === 'Research Update' && v.embedUrl)
        .sort((a, b) => (parseInt(a.order) || 0) - (parseInt(b.order) || 0));
      setResearchVideos(filtered);
    }
  }, [videos, loading]);

  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO
        title="Research Updates | Building Identity through Stories"
        description="Watch research update videos from the BITS doctoral research project on transmedia storytelling, identity exploration, student transition, and inclusive education."
        canonicalPath="/research-update/"
        ogTitle="Research Updates | Building Identity through Stories"
        ogDescription="Video updates from a doctoral research project exploring transmedia storytelling, identity exploration, and student transition into higher education."
      />
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-earth-900 dark:text-earth-50 mb-6">Research Update</h1>
        <p className="text-xl text-earth-600 dark:text-earth-400 max-w-2xl mx-auto font-light">
          Video updates loaded from the published research playlist.
        </p>
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-sage-500" size={40} /></div>
      ) : researchVideos.length === 0 ? (
        <div className="text-center py-12 text-earth-600 dark:text-earth-400">No updates available at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {researchVideos.map((video, idx) => (
            <div key={`${video.order}-${idx}`} className="group relative aspect-video w-full bg-sage-600 rounded-3xl overflow-hidden shadow-xl transform transition-transform hover:-translate-y-2">
              <iframe className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity" src={video.embedUrl!} title={`Research Update ${idx + 1}`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


const Home: React.FC = () => {
  const location = useLocation();
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    if (location.pathname === PageRoute.WORKSHOPS || location.pathname === '/upcomingworkshops.html' || location.pathname === '/upcomingworkshop' || location.pathname === '/upcomingworkshop.html') {
      const element = document.getElementById('upcoming-workshops');
      if (element) {
        // Small delay to ensure component is rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.pathname]);

  const heroImages = [
    "https://charliekwong.myblog.arts.ac.uk/files/2026/02/IMG_20260213_144250-1-scaled.jpg",
    "https://charliekwong.myblog.arts.ac.uk/files/2026/02/IMG_20260213_151557-scaled.jpg",
    "https://charliekwong.myblog.arts.ac.uk/files/2026/02/IMG_20260216_161600.jpg",
    "https://charliekwong.myblog.arts.ac.uk/files/2026/02/IMG_1771258966984.jpg",
    "https://charliekwong.myblog.arts.ac.uk/files/2026/02/IMG_20260213_145913-scaled.jpg"
  ];

  const { videos, loading: videosLoading } = useVideoSheet();
  const [researchVideos, setResearchVideos] = useState<VideoData[]>([]);

  // Carousel State for Research Videos
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const minSwipeDistance = 50;
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videosLoading) {
        const filtered = videos.filter(v => v.area === 'Research Update' && v.embedUrl);
        // Sort by Order (numeric)
        filtered.sort((a, b) => {
            const orderA = parseInt(a.order) || 0;
            const orderB = parseInt(b.order) || 0;
            return orderA - orderB;
        });
        setResearchVideos(filtered);
    }
  }, [videos, videosLoading]);

  // Responsive Carousel Logic (similar to WorkshopSection)
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth >= 1024) {
            setItemsPerPage(2); // Desktop: 2 videos per row as requested
        } else {
            setItemsPerPage(1); // Tablet & Mobile: 1 video
        }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset index if out of bounds
  useEffect(() => {
     if (researchVideos.length > 0) {
         const maxIndex = Math.max(0, researchVideos.length - itemsPerPage);
         if (currentIndex > maxIndex) {
             setCurrentIndex(maxIndex);
         }
     }
  }, [itemsPerPage, researchVideos.length]);

  const nextSlide = () => {
    if (currentIndex < researchVideos.length - itemsPerPage) {
        setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextSlide();
    if (distance < -minSwipeDistance) prevSlide();
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const onMouseUp = (e: React.MouseEvent) => {
      if (!isDragging) return;
      setIsDragging(false);
      const distance = dragStartX - e.clientX;
      if (distance > minSwipeDistance) nextSlide();
      if (distance < -minSwipeDistance) prevSlide();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="w-full">
      <SEO 
        title="Home | Building Identity through Stories"
        description="Building Identity Through Stories is doctoral research by Charlie Tak Hei Kwong 鄺德希, exploring how transmedia storytelling may support identity exploration for students with diverse learning journeys during the transition into higher education."
        canonicalPath={location.pathname === PageRoute.WORKSHOPS || location.pathname === "/upcomingworkshops.html" ? "/upcomingworkshops/" : "/"}
        ogTitle="Home | Building Identity through Stories"
        ogDescription="A doctoral research project by Charlie Tak Hei Kwong 鄺德希 exploring transmedia storytelling, identity exploration, and student transition into higher education."
      />
      <JSONLD 
        data={{
          "@context": "https://schema.org",
          "@graph": [
            researchProjectSchema,
            personSchema,
            ...organisationSchemas,
            {
              "@type": "WebSite",
              "name": SITE_NAME,
              "url": `${SITE_ORIGIN}/`
            }
          ]
        }}
      />
      {/* Cover Banner */}
      <section className="relative min-h-[85vh] py-24 w-full bg-earth-200 dark:bg-earth-800 overflow-hidden flex items-center justify-center rounded-b-4xl mx-auto">
        <div className="absolute inset-0">
            {heroImages.map((src, index) => (
              <img 
                key={src}
                src={src} 
                alt={`Studio Background ${index + 1}`} 
                className={`absolute inset-0 w-full h-full object-cover select-none transition-opacity duration-1000 ease-in-out blur-[6px] scale-105 ${bgIndex === index ? 'opacity-100' : 'opacity-0'}`}
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
              />
            ))}
            <div className="absolute inset-0 bg-white/50 dark:bg-black/50 z-10"></div>
        </div>
        <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-8xl font-serif font-medium mb-8 leading-tight text-earth-900 dark:text-earth-50">
                Building Identity <br /> Through Stories
            </h1>
            
            <div className="bg-white/80 dark:bg-earth-800/80 backdrop-blur-md p-6 md:p-8 rounded-4xl border border-white/20 dark:border-earth-700 shadow-xl max-w-3xl mx-auto mb-12 transform hover:scale-[1.01] transition-transform duration-500">
                <p className="text-lg md:text-xl text-earth-900 dark:text-earth-50 leading-relaxed font-light">
                    We co-develop creative storytelling activities to explore how transmedia storytelling may support the identity exploration of students with diverse learning journeys during the transition into higher education.
                </p>
            </div>

            <a 
                href={PageRoute.ABOUT} 
                className="inline-flex items-center gap-2 px-10 py-5 bg-earth-800 text-earth-50 rounded-full text-sm uppercase tracking-widest hover:bg-earth-900 hover:scale-105 transition-all duration-300 shadow-lg"
            >
                Read More
            </a>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-24 my-8 mx-4 md:mx-8 rounded-4xl bg-sage-500 text-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 md:mb-16 border-b border-sage-400 pb-8">
                <div className="w-full md:w-auto">
                    <div className="flex md:hidden items-center justify-center gap-4 w-full">
                         <span className="h-px w-12 bg-sage-300"></span>
                         <h2 className="text-3xl font-serif text-center">Research Update</h2>
                         <span className="h-px w-12 bg-sage-300"></span>
                    </div>
                    <h2 className="hidden md:block text-5xl font-serif mb-4">Research Update</h2>
                </div>
                <div className="flex gap-4 mt-4 md:mt-0">
                    {researchVideos.length > itemsPerPage && (
                        <div className="flex gap-2">
                            <button 
                                onClick={prevSlide} 
                                disabled={currentIndex === 0}
                                className="p-3 rounded-full border border-sage-300 text-earth-50 hover:bg-sage-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                                aria-label="Previous research video"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button 
                                onClick={nextSlide} 
                                disabled={currentIndex >= researchVideos.length - itemsPerPage}
                                className="p-3 rounded-full border border-sage-300 text-earth-50 hover:bg-sage-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                                aria-label="Next research video"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                    <a href="https://www.youtube.com/@bits-research" target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex items-center gap-2 text-earth-50 hover:text-white px-6 py-3 border border-sage-300 rounded-full hover:bg-sage-600 transition-colors focus:outline-none focus:ring-2 focus:ring-white">
                        Visit YouTube Channel <ArrowRight size={16} />
                    </a>
                </div>
            </div>
            
            {videosLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-earth-50" size={32} />
                </div>
            ) : researchVideos.length === 0 ? (
                <div className="text-center py-12 text-earth-100">No updates available at the moment.</div>
            ) : (
                <div 
                    className={`overflow-hidden -mx-4 px-4 py-4 ${researchVideos.length > itemsPerPage ? 'cursor-grab active:cursor-grabbing' : ''} focus:outline-none focus:ring-2 focus:ring-white rounded-xl`}
                    onTouchStart={researchVideos.length > itemsPerPage ? onTouchStart : undefined}
                    onTouchMove={researchVideos.length > itemsPerPage ? onTouchMove : undefined}
                    onTouchEnd={researchVideos.length > itemsPerPage ? onTouchEnd : undefined}
                    onMouseDown={researchVideos.length > itemsPerPage ? onMouseDown : undefined}
                    onMouseUp={researchVideos.length > itemsPerPage ? onMouseUp : undefined}
                    onMouseLeave={() => setIsDragging(false)}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                    role="region"
                    aria-roledescription="carousel"
                    aria-live="polite"
                    ref={carouselRef}
                    aria-label="Research Update Videos"
                >
                    <div 
                        className={`flex transition-transform duration-500 ease-out will-change-transform motion-reduce:transition-none ${researchVideos.length <= itemsPerPage ? 'justify-center' : 'justify-start'}`}
                        style={{ 
                            transform: researchVideos.length > itemsPerPage ? `translateX(-${currentIndex * (100 / itemsPerPage)}%)` : 'none'
                        }}
                    >
                        {researchVideos.length <= 2 ? (
                             // Grid Layout for <= 2 items
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full">
                                {researchVideos.map((video, idx) => (
                                    <div key={idx} className="group relative aspect-video w-full bg-sage-600 rounded-3xl overflow-hidden shadow-xl transform transition-transform hover:-translate-y-2">
                                        <iframe className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity" src={video.embedUrl!} title={`Research Update ${idx + 1}`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                    </div>
                                ))}
                             </div>
                        ) : (
                            // Carousel Layout for > 2 items
                            researchVideos.map((video, idx) => (
                                <div 
                                    key={idx} 
                                    style={{ width: `${100 / itemsPerPage}%` }} 
                                    className="flex-shrink-0 px-4"
                                    role="group"
                                    aria-roledescription="slide"
                                    aria-label={`${idx + 1} of ${researchVideos.length}`}
                                >
                                    <div className="group relative aspect-video w-full bg-sage-600 rounded-3xl overflow-hidden shadow-xl transform transition-transform hover:-translate-y-2">
                                        <iframe className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity" src={video.embedUrl!} title={`Research Update ${idx + 1}`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
      </section>

      {/* Upcoming Workshops Section */}
      <WorkshopSection />

      {/* Institutional Affiliation Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto text-center border-t border-earth-200 dark:border-earth-800 pt-16">
            <p className="text-earth-600 dark:text-earth-400 text-lg md:text-xl mb-12 font-light leading-relaxed">
                This doctoral research is registered at the <span className="font-medium text-earth-800 dark:text-earth-200">University of the Arts London</span> and <span className="font-medium text-earth-800 dark:text-earth-200">Falmouth University</span> in the United Kingdom. This study received ethical approval from the Research Integrity & Ethics Committee (Ref: RIEC 25-222) and will be conducted from 1 January 2026 to 31 December 2028.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 transition-all duration-500">
                <a href="https://www.arts.ac.uk/" target="_blank" rel="noopener noreferrer">
                    <img src="https://journal.falmouth.ac.uk/transitmedia/files/2025/11/ual.png" alt="University of the Arts London Logo" className="h-16 md:h-24 w-auto object-contain mix-blend-multiply dark:mix-blend-screen dark:invert transition-all hover:scale-105 select-none" onContextMenu={(e) => e.preventDefault()} draggable={false} />
                </a>
                <a href="https://www.falmouth.ac.uk/" target="_blank" rel="noopener noreferrer">
                    <img src="https://journal.falmouth.ac.uk/transitmedia/files/2025/11/falmouth.png" alt="Falmouth University Logo" className="h-16 md:h-24 w-auto object-contain mix-blend-multiply dark:mix-blend-screen dark:invert transition-all hover:scale-105 select-none" onContextMenu={(e) => e.preventDefault()} draggable={false} />
                </a>
            </div>
        </div>
      </section>

      {/* Hidden SEO Keywords for Indexing */}
      <section className="sr-only" aria-hidden="true">
        <h2>Falmouth University Learning Support and University Transition</h2>
        <p>
          BITS (Building Identity Through Stories) is a research project based at Falmouth University and UAL. 
          We focus on learning support, university transition, and supporting students with diverse learning journeys 
          through transmedia storytelling.
        </p>
      </section>
    </div>
  );
};

// 2. About Page
const About: React.FC = () => {
  const { videos, loading } = useVideoSheet();
  const [aboutVideo, setAboutVideo] = useState<VideoData | null>(null);

  useEffect(() => {
    if (!loading) {
        const video = videos.find(v => v.order === 'About' && v.embedUrl);
        if (video) setAboutVideo(video);
    }
  }, [videos, loading]);

  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        title="About | Building Identity through Stories"
        description="Learn about Charlie Tak Hei Kwong’s doctoral research on transmedia storytelling as an educational intervention to support identity exploration for students with diverse learning journeys entering higher education."
        canonicalPath="/about/"
        ogTitle="About | Building Identity through Stories"
        ogDescription="A doctoral research project exploring how creative storytelling can support students with diverse learning journeys during the transition into higher education."
      />
      <JSONLD
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "AboutPage", "name": "About the Research", "url": `${SITE_ORIGIN}/about/` },
            researchProjectSchema
          ]
        }}
      />
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-earth-900 dark:text-earth-50 mb-6">About the Research</h1>
        <p className="text-xl text-earth-600 dark:text-earth-400 max-w-2xl mx-auto font-light">
          Supporting transition through transmedia storytelling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <div className="w-full sticky top-24">
            <div className="group relative aspect-video w-full bg-sage-600 rounded-3xl overflow-hidden shadow-xl transform transition-transform hover:-translate-y-2">
                {loading ? (
                    <div className="w-full h-full flex items-center justify-center bg-sage-200 dark:bg-sage-800">
                        <Loader2 className="animate-spin text-sage-500" size={32} />
                    </div>
                ) : (
                    <iframe 
                        className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity" 
                        src={aboutVideo?.embedUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"} 
                        title="About Us Video" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                    ></iframe>
                )}
            </div>
        </div>

        <div className="space-y-8 text-lg text-earth-700 dark:text-earth-300 leading-relaxed bg-white dark:bg-earth-800/50 p-8 rounded-3xl shadow-sm">
          <p>
            This research study explores how students with diverse learning journeys make sense of who they are and who they want to be when entering higher education. The research focuses on how students experience changes in identity, confidence, and learning expectations during the early stages of university life, especially if they have previously encountered learning difficulties or engaged with academic or accessibility support services.
          </p>
          <p>
            The research examines transmedia storytelling as an educational intervention to help students build their sense of self during their transition to university by sharing personal stories across creative formats, like journal writing or simple digital creations on their own devices.
          </p>
          <div className="pt-4 border-t border-earth-200 dark:border-earth-700">
             <h3 className="font-serif text-2xl mb-4 text-earth-900 dark:text-earth-100">Keywords</h3>
             <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Transmedia Storytelling', 'Identity', 'Student Transition', 'Educational Intervention', 'Arts-based Educational Research'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-medium text-earth-600 dark:text-earth-400">
                        <span className="w-2 h-2 mt-1.5 flex-shrink-0 bg-sage-500 rounded-full"></span>
                        <span>{item}</span>
                    </li>
                ))}
             </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-16 bg-earth-100 dark:bg-earth-800 rounded-4xl p-10 md:p-16 border border-earth-200 dark:border-earth-700">
          <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                  <h3 className="font-serif text-3xl md:text-4xl text-earth-900 dark:text-earth-50 mb-4">Research Objectives</h3>
                  <p className="text-earth-600 dark:text-earth-400">Our core goals driving this study forward.</p>
              </div>
              <div className="grid grid-cols-1 gap-6">
                  {[
                      "Look at problems and good points in current university transition programs for students with learning differences.",
                      "Design and prototype transmedia storytelling interventions utilising participants’ personal devices, grounded in students’ lived transition experiences.",
                      "Evaluate and position this intervention as a participatory, student agency-driven framework to foster identity exploration during higher education transition, thereby addressing the limitations of top-down institutional approach."
                  ].map((obj, i) => (
                      <div key={i} className="flex items-start gap-6 bg-white dark:bg-earth-700/50 p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-md hover:border-sage-400 dark:hover:border-sage-500 border border-transparent transition-all">
                          <div className="flex-shrink-0 w-10 h-10 bg-sage-500 rounded-full flex items-center justify-center text-white font-serif font-bold text-lg">{i + 1}</div>
                          <p className="text-lg text-earth-800 dark:text-earth-200 leading-relaxed font-light">{obj}</p>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      <div className="mt-16 bg-earth-100 dark:bg-earth-800 rounded-4xl p-10 md:p-16 border border-earth-200 dark:border-earth-700">
          <div className="max-w-4xl mx-auto text-center">
              <h3 className="font-serif text-3xl md:text-4xl text-earth-900 dark:text-earth-50 mb-10">How This Project Brings Different Ideas Together</h3>
              <div className="mb-10 flex justify-center">
                  <img 
                      src="http://charliekwong.myblog.arts.ac.uk/files/2026/03/Transmedia-Storytelling-Workshop.png" 
                      alt="Diagram showing the research framework of the BITS project. At the centre are Transmedia Storytelling Workshops. Surrounding layers show the project as an Educational Intervention, situated within Inclusive Education and Practice, and informed by Participatory Arts Practice." 
                      className="max-w-md w-full h-auto select-none"
                      onContextMenu={(e) => e.preventDefault()}
                      draggable={false}
                      referrerPolicy="no-referrer"
                  />
              </div>
              <p className="text-lg text-earth-700 dark:text-earth-300 leading-relaxed font-light text-left">
                  This research connects participatory arts practice with inclusive education to develop transmedia storytelling workshops for students with diverse learning journeys transitioning into higher education. Through transmedia storytelling, students will explore identity, belonging, and their learning journeys in different ways.
              </p>
          </div>
      </div>
      
      <div className="mt-12 bg-sage-500 text-earth-50 rounded-3xl p-8 flex items-start gap-4 shadow-sm mx-auto max-w-4xl">
           <CheckCircle2 size={32} className="flex-shrink-0 mt-1" />
           <div>
               <h4 className="font-serif text-xl font-bold mb-2">Ethical Approval</h4>
               <p className="opacity-90 leading-relaxed">
                   This research project has been reviewed and approved by the institutional ethics committee. All procedures meet the required ethical standards.
               </p>
           </div>
      </div>

      <div className="mt-16 text-center">
          <a 
              href={PageRoute.INVOLVED} 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-sage-600 text-white rounded-full font-bold hover:bg-sage-700 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-300 text-center"
          >
              Get Involved!
          </a>
      </div>
    </div>
  );
};

// 3. Team Page (People)
const Team: React.FC = () => {
  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Researcher and Advisory Team | Building Identity through Stories"
        description="Meet Charlie Tak Hei Kwong 鄺德希, the doctoral researcher of Building Identity Through Stories, a fully funded project on transmedia storytelling, inclusive education, and transition into higher education."
        canonicalPath="/team/"
        ogTitle="Researcher and Advisory Team | Building Identity through Stories"
        ogDescription="Meet Charlie Tak Hei Kwong 鄺德希, doctoral researcher for a fully funded project on transmedia storytelling, inclusive education, and transition into higher education."
      />
      <JSONLD 
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "ProfilePage", "name": "Charlie Tak Hei Kwong 鄺德希", "url": `${SITE_ORIGIN}/team/`, "mainEntity": personSchema },
            personSchema,
            researchProjectSchema
          ]
        }}
      />
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-serif text-earth-900 dark:text-earth-50 mb-6">Team</h1>
        <p className="text-xl text-earth-600 dark:text-earth-400 max-w-2xl mx-auto font-light">Researcher, Supervisors & Advisors</p>
      </div>

      <div className="bg-white dark:bg-earth-800/50 rounded-4xl p-8 md:p-12 shadow-sm border border-earth-100 dark:border-earth-700">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
              <div className="md:col-span-5 relative">
                  <div className="relative rounded-3xl overflow-hidden shadow-lg group">
                      <img src="https://journal.falmouth.ac.uk/transitmedia/files/2025/11/profilepic.jpg" alt="Charlie Tak Hei Kwong" className="w-full h-auto object-cover select-none" onContextMenu={(e) => e.preventDefault()} draggable={false} />
                  </div>
                  <div className="absolute top-6 left-6 bg-white text-sage-600 px-5 py-2 rounded-full shadow-lg text-sm font-medium tracking-wide z-20">Doctoral Researcher</div>
              </div>

              <div className="md:col-span-7 space-y-8">
                  <div>
                      <h2 className="text-4xl font-serif text-earth-900 dark:text-earth-50 mb-2">Charlie Tak Hei Kwong 鄺德希</h2>
                      <p className="text-earth-500 dark:text-earth-400 font-medium tracking-wide uppercase text-sm">Doctoral Researcher</p>
                  </div>
                  <p className="text-lg text-earth-700 dark:text-earth-300 leading-relaxed font-light">
                      Charlie is a doctoral researcher and registered teacher passionate about the intersection of creative media and inclusive education. His fully funded research explores how transmedia storytelling can create supportive spaces for students with diverse needs as they navigate their journey into higher education.
                  </p>
                  <div className="flex gap-4">
                      <a href="https://thkwong.uk" target="_blank" rel="noopener noreferrer" className="p-3 bg-earth-100 dark:bg-earth-700 rounded-full hover:bg-sage-500 hover:text-white transition-colors" title="Website"><Globe size={20} /></a>
                      <a href="mailto:c.kwong1220251@arts.ac.uk,tk290331@falmouth.ac.uk" className="p-3 bg-earth-100 dark:bg-earth-700 rounded-full hover:bg-sage-500 hover:text-white transition-colors" title="Email"><Mail size={20} /></a>
                  </div>
                  <div>
                      <h2 className="font-serif text-2xl text-earth-900 dark:text-earth-50 mb-6">Experience and Research Focus</h2>
                      <div className="bg-earth-50 dark:bg-earth-900/50 p-8 rounded-3xl border border-earth-100 dark:border-earth-700">
                          <p className="text-earth-700 dark:text-earth-300 leading-relaxed mb-4">Charlie’s journey began as a school teacher in Hong Kong. Between his early research assistantships in education, and his time living in Hong Kong, Canada, UK, and the Netherlands, he developed an interest in the way people learn and handle the move into new chapters of their lives.</p>
                          <p className="text-earth-700 dark:text-earth-300 leading-relaxed">After spending over eight years shaping blended learning and academic projects, Charlie has turned his focus toward making higher education more inclusive. These days, he’s exploring how arts-based research and creative practice can empower and support people with diverse backgrounds.</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      
      <div className="mt-20 relative overflow-hidden bg-earth-100/50 dark:bg-earth-800/30 rounded-4xl border border-earth-200 dark:border-earth-700 p-8 md:p-16 text-center">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sage-300 via-earth-300 to-sage-300"></div>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-earth-700 rounded-full mb-6 shadow-sm text-sage-600 dark:text-sage-300"><GraduationCap size={32} /></div>
          <h3 className="font-serif text-3xl md:text-4xl text-earth-900 dark:text-earth-50 mb-4">Doctoral Research Supervision</h3>
          <p className="text-earth-600 dark:text-earth-400 mb-12 max-w-2xl mx-auto leading-relaxed">This research is developed under the guidance of an interdisciplinary supervisory team:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[{name: "Dr Jennifer Young", role: <>Director of Studies<br/>Dean, Faculty of Business & Design</>}, {name: "Prof. Neil Fox", role: "Professor of Film Practice and Pedagogy"}, {name: "Prof. Russell Crawford", role: "Deputy Vice-Chancellor (Interim)"}].map((sup, i) => (
                  <div key={i} className="bg-white dark:bg-earth-900/60 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all border border-transparent hover:border-sage-400 dark:hover:border-sage-500 group">
                      <h4 className="font-serif font-bold text-xl text-earth-900 dark:text-earth-100 mb-2">{sup.name}</h4>
                      <div className="h-px w-8 bg-sage-300 mx-auto mb-3"></div>
                      <p className="text-sm text-earth-600 dark:text-earth-400 font-medium leading-snug">{sup.role}</p>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

// 4. What We Care Page
const WhatWeCare: React.FC = () => {
  const values = [
    { title: "Identity Exploration", description: "Supporting the non-linear self-discovery of students with diverse learning journeys through transmedia storytelling during transition." },
    { title: "Bottom-up Empowerment", description: "Prioritising student agency and lived narratives to overcome limitations." },
    { title: "Community-based Practice", description: "Co-creation with participants and community advisors." },
    { title: "Ethical Safety", description: "Ensuring trauma-informed care and privacy." }
  ];

  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        title="What We Care About | Building Identity through Stories"
        description="Explore the values behind Building Identity Through Stories: identity exploration, student agency, community-based practice, ethical safety, and inclusive transition into higher education."
        canonicalPath="/what-we-care/"
        ogTitle="What We Care About | Building Identity through Stories"
        ogDescription="The core values of BITS: identity exploration, student agency, community-based practice, ethical safety, and inclusive higher education transition."
      />
      <JSONLD
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebPage", "name": "What We Care About", "url": `${SITE_ORIGIN}/what-we-care/` },
            researchProjectSchema
          ]
        }}
      />
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-serif text-earth-900 dark:text-earth-50 mb-6">What We Care About</h1>
        <p className="text-xl text-earth-600 dark:text-earth-400 max-w-3xl mx-auto font-light">Our core values drive every aspect of the project.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {values.map((item, index) => (
          <div key={index} className="group bg-white dark:bg-earth-800/50 p-10 rounded-4xl shadow-sm hover:shadow-xl border border-transparent hover:border-sage-300 transition-all duration-300">
            <div className="w-12 h-12 bg-earth-100 dark:bg-earth-700 rounded-full flex items-center justify-center mb-6 group-hover:bg-sage-500 transition-colors">
               <span className="font-serif text-xl font-bold group-hover:text-white">{index + 1}</span>
            </div>
            <h3 className="text-2xl font-serif text-earth-900 dark:text-earth-50 mb-4">{item.title}</h3>
            <p className="text-lg text-earth-600 dark:text-earth-300 leading-relaxed font-light">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
          <a 
              href={PageRoute.INVOLVED} 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-sage-600 text-white rounded-full font-bold hover:bg-sage-700 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-300 text-center"
          >
              Get Involved!
          </a>
      </div>
    </div>
  );
};

// 5. Output Page
interface ResourceItem {
  category: 'Community' | 'Academic';
  title: string;
  type: string;
  year: string;
  publication: string;
  link: string;
  image?: string;
}

const Output: React.FC = () => {
  const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTqnqjMFiQ3G6ehRg-Zh8GdjbbcpbeaEsp4CpgmHNcsdJR0-SgcrXkSDF8Hnypub4Jz4zII4zCL8-Ue/pub?output=csv';
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [academicFilter, setAcademicFilter] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth >= 1024) setItemsPerPage(3);
        else if (window.innerWidth >= 768) setItemsPerPage(2);
        else setItemsPerPage(1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        const text = await response.text();
        const rows = text.split(/\r?\n/).filter(r => r.trim() !== "").slice(1);
        const parsed: ResourceItem[] = rows.map((row): ResourceItem | null => {
          const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
          const cols = row.split(regex).map(col => col.replace(/^"|"$/g, '').trim());
          if (cols.length < 6) return null;
          return { category: cols[0] as 'Community' | 'Academic', title: cols[1], type: cols[2], year: cols[3], publication: cols[4], link: cols[5], image: cols[6] };
        }).filter((item): item is ResourceItem => item !== null);
        setResources(parsed);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load resources", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const communityItems = resources.filter(r => r.category === 'Community');
  const academicItems = resources.filter(r => r.category === 'Academic');
  const filteredAcademic = academicFilter === 'All' ? academicItems : academicItems.filter(r => r.type === academicFilter);

  // --- Carousel Logic ---
  const nextSlide = () => { if (currentIndex < communityItems.length - itemsPerPage) setCurrentIndex(p => p + 1); };
  const prevSlide = () => { if (currentIndex > 0) setCurrentIndex(p => p - 1); };
  const onTouchStart = (e: React.TouchEvent) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => { if (!touchStart || !touchEnd) return; const dist = touchStart - touchEnd; if (dist > 50) nextSlide(); if (dist < -50) prevSlide(); };
  const onMouseDown = (e: React.MouseEvent) => { setIsDragging(true); setDragStartX(e.clientX); };
  const onMouseUp = (e: React.MouseEvent) => { if(!isDragging) return; setIsDragging(false); if(dragStartX - e.clientX > 50) nextSlide(); if(dragStartX - e.clientX < -50) prevSlide(); };

  const getIcon = (type: string) => {
      const t = type.toLowerCase();
      if (t.includes('journal')) return <BookOpen size={18} />;
      if (t.includes('presentation')) return <Presentation size={18} />;
      if (t.includes('chapter')) return <Book size={18} />;
      return <FileText size={18} />;
  };

  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SEO 
            title="Output and Resources | Building Identity through Stories"
            description="Explore academic outputs, community resources, research findings, journal articles, book chapters, conference papers, and presentations from Building Identity Through Stories."
            canonicalPath="/output-resources/"
            ogTitle="Output and Resources | Building Identity through Stories"
            ogDescription="Explore academic outputs, community resources, and research findings from the BITS doctoral research project."
        />
        <JSONLD
            data={{
              "@context": "https://schema.org",
              "@graph": [
                { "@type": "CollectionPage", "name": "Outputs and Resources", "url": `${SITE_ORIGIN}/output-resources/` },
                { "@type": "ItemList", "name": "BITS research outputs and resources", "itemListElement": [] },
                researchProjectSchema
              ]
            }}
        />
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif text-earth-900 dark:text-earth-50 mb-6">Outputs and Resources</h1>
            <p className="text-xl text-earth-600 dark:text-earth-400 max-w-2xl mx-auto font-light">Explore our community resources and research findings.</p>
        </div>
        {loading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-sage-500" size={40} /></div> : (
            <div className="space-y-24">
                {communityItems.length > 0 && (
                    <section>
                         <div className="flex items-center justify-between mb-8 px-2">
                             <h3 className="text-2xl font-serif text-earth-900 dark:text-earth-50">Community Resources</h3>
                             <div className="flex gap-2">
                                <button onClick={prevSlide} disabled={currentIndex === 0} className="p-2 rounded-full border border-earth-300 hover:bg-earth-100 disabled:opacity-30 dark:border-earth-600 dark:text-earth-300 dark:hover:bg-earth-800"><ChevronLeft size={20} /></button>
                                <button onClick={nextSlide} disabled={currentIndex >= communityItems.length - itemsPerPage} className="p-2 rounded-full border border-earth-300 hover:bg-earth-100 disabled:opacity-30 dark:border-earth-600 dark:text-earth-300 dark:hover:bg-earth-800"><ChevronRight size={20} /></button>
                             </div>
                         </div>
                         <div className="overflow-hidden -mx-4 px-4 py-4 cursor-grab active:cursor-grabbing" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={() => setIsDragging(false)}>
                            <div className={`flex transition-transform duration-500 ease-out`} style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}>
                                {communityItems.map((item, idx) => (
                                    <div key={idx} style={{ width: `${100 / itemsPerPage}%` }} className="flex-shrink-0 px-3">
                                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="block bg-white dark:bg-earth-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-earth-100 dark:border-earth-700 h-full group relative">
                                            <div className="aspect-[3/2] bg-earth-200 dark:bg-earth-700 relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-sage-500 dark:bg-earth-800 mix-blend-color opacity-100 group-hover:opacity-0 transition-opacity duration-500 z-10 pointer-events-none"></div>
                                                {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none pointer-events-none" /> : <div className="w-full h-full flex items-center justify-center text-earth-400"><FileText size={40} /></div>}
                                            </div>
                                            <div className="p-6">
                                                <div className="text-xs font-bold uppercase tracking-widest text-sage-600 dark:text-sage-400 mb-2">{item.type}</div>
                                                <h4 className="text-xl font-sans font-bold text-earth-900 dark:text-earth-50 mb-2">{item.title}</h4>
                                                <div className="flex items-center gap-2 text-earth-500 text-sm font-medium mt-4 group-hover:text-sage-600 transition-colors">Access Resource <ArrowRight size={16} /></div>
                                            </div>
                                        </a>
                                    </div>
                                ))}
                            </div>
                         </div>
                    </section>
                )}
                <section>
                    <h2 className="text-2xl font-serif text-earth-900 dark:text-earth-50 mb-8 px-2">Academic Output</h2>
                    <div className="flex flex-wrap gap-2 mb-8 px-2">
                        {['All', 'Journal Article', 'Book Chapter', 'Conference Paper', 'Conference Presentation'].map(f => (
                            <button key={f} onClick={() => setAcademicFilter(f)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${academicFilter === f ? 'bg-sage-500 text-white shadow-md' : 'bg-earth-100 dark:bg-earth-800 text-earth-600 dark:text-earth-300 hover:bg-earth-200 dark:hover:bg-earth-700'}`}>{f}</button>
                        ))}
                    </div>
                    <div className="bg-white dark:bg-earth-800/50 rounded-4xl border border-earth-100 dark:border-earth-700 overflow-hidden">
                        {filteredAcademic.length > 0 ? (
                            <div className="divide-y divide-earth-100 dark:divide-earth-700">
                                {filteredAcademic.map((item, idx) => (
                                    <div key={idx} className="p-6 md:p-8 hover:bg-sage-50 dark:hover:bg-earth-700/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 p-3 bg-earth-100 dark:bg-earth-700 rounded-xl text-sage-600 dark:text-sage-300 group-hover:bg-sage-200 dark:hover:bg-sage-800 transition-colors">{getIcon(item.type)}</div>
                                            <div>
                                                <h4 className="text-lg font-sans font-bold text-earth-900 dark:text-earth-50 mb-1">{item.title}</h4>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-earth-600 dark:text-earth-400"><span>{item.year}</span><span className="w-1 h-1 bg-earth-400 rounded-full"></span><span>{item.type}</span>{item.publication && <><span className="w-1 h-1 bg-earth-400 rounded-full"></span><span className="italic">Published in {item.publication}</span></>}</div>
                                            </div>
                                        </div>
                                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="self-start md:self-center px-5 py-2.5 border border-earth-200 dark:border-earth-600 rounded-full text-sm font-medium text-earth-700 dark:text-earth-300 hover:bg-sage-500 hover:text-white hover:border-sage-500 transition-all flex items-center gap-2">View <ExternalLink size={14} /></a>
                                    </div>
                                ))}
                            </div>
                        ) : <div className="p-12 text-center text-earth-500 dark:text-earth-400">No academic outputs found for this category.</div>}
                    </div>
                </section>
            </div>
        )}
    </div>
  );
};

// 6. Get Involved Page
const GetInvolved: React.FC = () => {
  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SEO 
            title="Get Involved | Building Identity through Stories"
            description="Join Building Identity Through Stories workshops or collaborate as a Community Advisor to support research on identity, belonging, and university transition."
            canonicalPath="/get-involved/"
            ogTitle="Get Involved | Building Identity through Stories"
            ogDescription="Take part in creative workshops or collaborate as a Community Advisor to help shape inclusive support for students in transition."
        />
        <JSONLD
            data={{
              "@context": "https://schema.org",
              "@graph": [
                { "@type": "WebPage", "name": "Join the Research", "url": `${SITE_ORIGIN}/get-involved/` },
                { "@type": "Event", "name": "Creative storytelling workshops", "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode", "eventStatus": "https://schema.org/EventScheduled", "organizer": personSchema },
                researchProjectSchema
              ]
            }}
        />
        <h1 className="text-4xl md:text-5xl font-serif mb-6">Join the Research</h1>
        <p className="text-xl text-earth-600 dark:text-earth-400 mb-12 max-w-3xl mx-auto">Every story matters. Join our workshops to co-create support for your journey. You do not need to be good at art to take part. You can write, draw, reflect, use simple digital tools, or respond in a way that feels comfortable for you.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-earth-800 p-8 rounded-4xl shadow-sm flex flex-col justify-between">
              <div>
                  <div className="mb-4 text-sage-600 dark:text-sage-400">
                      <Palette size={40} strokeWidth={1.5} />
                  </div>
                  <h2 className="text-2xl font-serif mb-4">Join a Creative Workshop</h2>
                  <p className="text-earth-700 dark:text-earth-300 mb-6 text-sm leading-relaxed">
                      Are you settling into uni and still figuring things out? Join our creative workshops to explore identity, belonging, and your learning journey at your own pace.
                  </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                      href="https://charliekwong.myblog.arts.ac.uk/2026/02/01/upcoming-workshop/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block px-8 py-4 bg-sage-600 text-white rounded-full font-bold hover:bg-sage-700 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-300 text-center"
                  >
                      Learn More
                  </a>
                  <a 
                      href="https://forms.office.com/e/FPSgmUxEhD" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block px-8 py-4 bg-earth-800 text-white rounded-full font-bold hover:bg-earth-900 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-300 text-center"
                  >
                      Register Interest
                  </a>
              </div>
          </div>
          <div className="bg-earth-200 dark:bg-earth-800 p-8 rounded-4xl flex flex-col justify-between">
              <div>
                  <div className="mb-4 text-earth-600 dark:text-earth-400">
                      <HeartHandshake size={40} strokeWidth={1.5} />
                  </div>
                  <h2 className="text-2xl font-serif mb-4">Collaborate as a Community Advisor</h2>
                  <p className="text-earth-700 dark:text-earth-300 mb-6 text-sm leading-relaxed">
                      Join us as a Community Advisor [Remote/On-site] and help shape workshop design, delivery, safeguarding, and ethical practice to better support students in transition!
                  </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                      href="https://charliekwong.myblog.arts.ac.uk/2026/02/01/community-advisors-wanted-supporting-identity-transition-in-higher-education/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block px-8 py-4 bg-sage-600 text-white rounded-full font-bold hover:bg-sage-700 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-300 text-center"
                  >
                      Learn More
                  </a>
                  <Link 
                      to={PageRoute.CONTACT} 
                      className="inline-block px-8 py-4 bg-earth-800 text-white rounded-full font-bold hover:bg-earth-900 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-300 text-center"
                  >
                      Get in Touch
                  </Link>
              </div>
          </div>
        </div>
    </div>
  );
};

// 7. Contact Page
const Contact: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzoAqYltv9zlFk5LeoNhy-p1rp7rjD6i7GGtw19osIYGI2abGPLwqJaQ1-kJXq7OVMeew/exec';
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = new URLSearchParams();
    formData.forEach((v, k) => data.append(k, v as string));
    
    // Attempting to send data
    fetch(scriptURL, { method: 'POST', body: data, mode: 'no-cors' })
      .then(() => { 
        setStatus('success'); 
        form.reset();
      })
      .catch(() => setStatus('error'));
  };

  return (
    <div className="py-24 max-w-3xl mx-auto px-4">
      <SEO 
        title="Contact | Building Identity through Stories"
        description="Contact Building Identity Through Stories for research enquiries, workshop participation, collaboration, accessibility support, or questions about the doctoral research project."
        canonicalPath="/contact/"
        ogTitle="Contact | Building Identity through Stories"
        ogDescription="Get in touch about research participation, collaboration, accessibility, or enquiries related to Building Identity Through Stories."
      />
      <JSONLD
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "ContactPage", "name": "Contact Us", "url": `${SITE_ORIGIN}/contact/` },
            { "@type": "ContactPoint", "contactType": "Research enquiries", "email": "c.kwong1220251@arts.ac.uk" },
            researchProjectSchema
          ]
        }}
      />
      <h1 className="text-4xl text-center font-serif mb-6 text-earth-900 dark:text-earth-50">Contact Us</h1>
      <p className="text-center text-earth-600 dark:text-earth-400 mb-12 leading-relaxed">Use this form or email to contact Building Identity Through Stories about research participation, workshop interest, collaboration, accessibility needs, or general enquiries.</p>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-earth-800 p-8 rounded-4xl shadow-sm border border-earth-100 dark:border-earth-700">
        
        <div>
           <label htmlFor="name" className="sr-only">Name</label>
           <input name="Name" id="name" placeholder="Name" required className="w-full p-4 bg-earth-50 dark:bg-earth-900 rounded-xl border-none focus:ring-2 focus:ring-sage-500 transition-all placeholder-earth-400 text-earth-900 dark:text-earth-100" />
        </div>

        <div>
           <label htmlFor="role" className="sr-only">Role</label>
           <div className="relative">
             <select name="Role" id="role" required defaultValue="" className="w-full p-4 bg-earth-50 dark:bg-earth-900 rounded-xl border-none focus:ring-2 focus:ring-sage-500 transition-all text-earth-900 dark:text-earth-100 appearance-none cursor-pointer">
                <option value="" disabled>Select your role</option>
                <option value="Student / Potential Participant">Student / Potential Participant</option>
                <option value="Community Advisor">Community Advisor</option>
                <option value="Academic / Researcher">Academic / Researcher</option>
                <option value="University Staff">University Staff</option>
                <option value="Accessibility or Student Support Staff">Accessibility or Student Support Staff</option>
                <option value="General Enquiry">General Enquiry</option>
                <option value="Other">Other</option>
             </select>
             <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-earth-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
             </div>
           </div>
        </div>

        <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input name="Email" id="email" type="email" placeholder="Email" required className="w-full p-4 bg-earth-50 dark:bg-earth-900 rounded-xl border-none focus:ring-2 focus:ring-sage-500 transition-all placeholder-earth-400 text-earth-900 dark:text-earth-100" />
        </div>

        <div>
            <label htmlFor="message" className="sr-only">Message</label>
            <textarea name="Message" id="message" placeholder="Message" required rows={4} className="w-full p-4 bg-earth-50 dark:bg-earth-900 rounded-xl border-none focus:ring-2 focus:ring-sage-500 transition-all placeholder-earth-400 text-earth-900 dark:text-earth-100" />
        </div>

        <button 
            type="submit" 
            disabled={status === 'submitting'}
            className="w-full py-4 bg-sage-500 text-white rounded-xl font-bold text-lg hover:bg-sage-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex justify-center items-center gap-2"
        >
            {status === 'submitting' ? (
                <>
                   <Loader2 className="animate-spin" size={20} /> Sending...
                </>
            ) : 'Send Message'}
        </button>

        {status === 'success' && (
            <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-xl flex items-center gap-3 animate-fade-in">
                <CheckCircle2 size={20} />
                <p>Thank you! Your message has been sent successfully.</p>
            </div>
        )}

        {status === 'error' && (
            <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-xl flex items-center gap-3 animate-fade-in">
                <AlertCircle size={20} />
                <p>Something went wrong. Please try again later.</p>
            </div>
        )}
      </form>
    </div>
  );
};

// 8. Privacy & Terms (Placeholders)
const PrivacyPolicy: React.FC = () => {
  return (
    <div className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Privacy Policy | Building Identity through Stories"
        description="Read the Privacy Policy for Building Identity Through Stories, including information about research data, contact forms, third-party services, hosting, and data protection."
        canonicalPath="/privacy-policy/"
        ogTitle="Privacy Policy | Building Identity through Stories"
        ogDescription="Information about how the BITS research website handles personal data, research enquiries, external forms, third-party services, and hosting."
      />
      <JSONLD
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebPage", "name": "Privacy Policy", "url": `${SITE_ORIGIN}/privacy-policy/` },
            researchProjectSchema
          ]
        }}
      />
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-earth-900 dark:text-earth-50 mb-4">Privacy Policy</h1>
        <p className="text-earth-600 dark:text-earth-400">Revision Date: 11 March 2026</p>
      </div>

      <div className="bg-white dark:bg-earth-800 p-8 md:p-12 rounded-4xl shadow-sm border border-earth-100 dark:border-earth-700 space-y-10">
        
        <section className="space-y-4">
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                This website is maintained by Charlie Tak Hei Kwong, a doctoral researcher registered with the University of the Arts London (UAL) and Falmouth University. The website is used for academic communication and research dissemination purposes only.
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                This site is a static website hosted on GitHub and deployed via Netlify.
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                The website itself does not use analytics, tracking scripts, or advertising technologies.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-serif text-earth-900 dark:text-earth-50 mb-4">1. Information You May Provide</h2>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                Visitors may voluntarily provide personal information (for example, name, email address, or information about learning experiences) through external contact or participation forms, such as Microsoft Forms or Google Forms.
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                Any information provided will be used only for the specific purpose stated at the point of collection, such as:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-earth-700 dark:text-earth-300 leading-relaxed">
                <li>communication regarding the research project</li>
                <li>participation in workshops or studies</li>
                <li>providing feedback about the project</li>
            </ul>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                Personal information collected for research purposes will not be shared with third parties, except:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-earth-700 dark:text-earth-300 leading-relaxed">
                <li>the supervisory team and research degree committees at Falmouth University and the University of the Arts London,</li>
                <li>where required by law, or</li>
                <li>where participants have provided explicit consent.</li>
            </ul>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                Where external services such as Microsoft Forms or Google Forms are used, personal data may be processed and stored by those providers in accordance with their respective privacy policies and data protection practices.
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                Users should consult the relevant platform policies for further information.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-serif text-earth-900 dark:text-earth-50 mb-4">2. Third-Party Content and Services</h2>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                This website may contain links to, or embedded content from, third-party platforms such as:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-earth-700 dark:text-earth-300 leading-relaxed">
                <li>YouTube (for research information videos)</li>
                <li>university webpages</li>
                <li>external participation or contact forms</li>
            </ul>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                These third-party services may use their own cookies, tracking technologies, or data processing systems which are outside the control of this website.
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                Visitors should review the privacy policies of those services when accessing their content.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-serif text-earth-900 dark:text-earth-50 mb-4">3. Hosting and Infrastructure</h2>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                The website is hosted through Netlify, which may generate limited server logs for security and operational purposes.
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                These logs are managed by the hosting provider and are not used by the researcher for tracking or profiling visitors.
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                No analytics tools, advertising systems, or behavioural tracking technologies are implemented on this website.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-serif text-earth-900 dark:text-earth-50 mb-4">4. Data Protection and Legal Compliance</h2>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                Research data collected through this project will be handled in accordance with relevant data protection laws, including:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-earth-700 dark:text-earth-300 leading-relaxed">
                <li>UK General Data Protection Regulation (UK GDPR)</li>
                <li>Data Protection Act 2018 (UK)</li>
                <li>Personal Information Protection and Electronic Documents Act (PIPEDA) – Canada</li>
                <li>Personal Data (Privacy) Ordinance (Cap. 486) – Hong Kong</li>
            </ul>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                Personal data will be stored securely and retained only for as long as necessary for the purposes of the research project or as required by research ethics, institutional policies, or applicable law.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-serif text-earth-900 dark:text-earth-50 mb-4">5. Your Rights</h2>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                Depending on your jurisdiction, you may have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-earth-700 dark:text-earth-300 leading-relaxed">
                <li>request access to personal data held about you</li>
                <li>request correction of inaccurate information</li>
                <li>request deletion of your personal data where appropriate</li>
                <li>withdraw consent for participation in the research project</li>
                <li>lodge a complaint with your relevant data protection authority</li>
            </ul>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                Please note that some research data may be retained where required by research integrity, ethics approval, or institutional record-keeping requirements.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-serif text-earth-900 dark:text-earth-50 mb-4">6. Contact</h2>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                If you have any questions about this Privacy Policy or how personal data may be handled in relation to this research project, you may contact the researcher using the <Link to={PageRoute.CONTACT} className="text-sage-600 dark:text-sage-400 font-medium underline hover:text-earth-900 dark:hover:text-earth-100 transition-colors">contact form</Link> provided on this website.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-serif text-earth-900 dark:text-earth-50 mb-4">7. Updates</h2>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                This Privacy Policy may be updated from time to time to reflect changes in legal requirements, institutional policies, or the development of the research project.
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                The most recent revision date will be displayed on this page.
            </p>
        </section>

      </div>
    </div>
  );
};
const TermsOfUse: React.FC = () => {
  return (
    <div className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Terms of Use | Building Identity through Stories"
        description="Read the Terms of Use for Building Identity Through Stories, including research use, intellectual property, CC BY-NC 4.0 licence, third-party content, and disclaimers."
        canonicalPath="/terms-of-use/"
        ogTitle="Terms of Use | Building Identity through Stories"
        ogDescription="Terms covering research use, intellectual property, Creative Commons licensing, third-party content, and disclaimers for the BITS website."
      />
      <JSONLD
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebPage", "name": "Terms of Use", "url": `${SITE_ORIGIN}/terms-of-use/` },
            researchProjectSchema
          ]
        }}
      />
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-earth-900 dark:text-earth-50 mb-4">Terms of Use</h1>
      </div>

      <div className="bg-white dark:bg-earth-800 p-8 md:p-12 rounded-4xl shadow-sm border border-earth-100 dark:border-earth-700 space-y-10">
        
        <section className="space-y-4">
            <h2 className="text-2xl font-serif text-earth-900 dark:text-earth-50 mb-4">Research Use Statement</h2>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                This website is provided for research communication and educational purposes in connection with a doctoral research project co-registered at the University of the Arts London (UAL) and Falmouth University.
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                Use of this website does not require participation in the research project.
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                If you choose to register for a research activity, participation is entirely voluntary and subject to the Participant Information Sheet and consent procedures provided during the registration process.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-serif text-earth-900 dark:text-earth-50 mb-4">Intellectual Property & Licence</h2>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                Unless otherwise stated, original text, images, and materials on this website are © Charlie Tak Hei Kwong 鄺德希 / Building Identity Through Stories Research Project and are licensed under the <a href="https://creativecommons.org/licenses/by-nc/4.0/deed.en" target="_blank" rel="noopener noreferrer" className="text-sage-600 dark:text-sage-400 font-medium underline hover:text-earth-900 dark:hover:text-earth-100 transition-colors">Creative Commons Attribution-NonCommercial 4.0 International Licence (CC BY-NC 4.0)</a>.
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                Some visual materials on this website are constructed representations created to communicate the themes, atmosphere, and pedagogical context of the research project. These images are illustrative rather than documentary and do not depict actual participants or research sessions.
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                This approach is used to protect participant privacy and avoid the staging of authenticity, particularly given the project’s focus on students navigating identity, transition, and learning differences.
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                You may copy, share, and adapt the licensed content for non-commercial purposes, provided that appropriate credit is given and any changes are clearly indicated.
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                This licence does not apply to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-earth-700 dark:text-earth-300 leading-relaxed">
                <li>third-party content</li>
                <li>participant creative work</li>
                <li>institutional logos or trademarks</li>
            </ul>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                These materials remain all rights reserved and may not be reused without permission.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-serif text-earth-900 dark:text-earth-50 mb-4">Third-Party Content and Links</h2>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                This website may contain links to or embedded content from third-party platforms (for example YouTube, university webpages, or external forms).
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                These services operate under their own terms, privacy policies, and cookie practices, which are outside the control of this website. Accessing such services is done at the user’s own discretion.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-serif text-earth-900 dark:text-earth-50 mb-4">Disclaimer</h2>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                The content provided on this website is intended for research dissemination and general informational purposes only.
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                It does not constitute medical, therapeutic, legal, or professional advice.
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                While reasonable care is taken to ensure that the information presented is accurate and up to date, no warranty or guarantee is given regarding completeness, reliability, or suitability for any particular purpose.
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                To the fullest extent permitted by law, the project and the website maintainer accept no liability for any loss or damage arising from reliance on information provided on this website or from the use of linked third-party services.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-serif text-earth-900 dark:text-earth-50 mb-4">Changes to These Terms</h2>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                These Terms of Use may be updated from time to time to reflect changes in the research project, legal requirements, or institutional policies. Continued use of the website indicates acceptance of the most recent version of these terms.
            </p>
        </section>

      </div>
    </div>
  );
};

const Accessibility: React.FC = () => {
  return (
    <div className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Accessibility | Building Identity through Stories"
        description="Read the accessibility statement for Building Identity Through Stories, including clear language, readable design, text-to-speech, dyslexic-friendly fonts, and support options."
        canonicalPath="/accessibility/"
        ogTitle="Accessibility | Building Identity through Stories"
        ogDescription="Accessibility information for the BITS website, including readable design, display options, text-to-speech, and support requests."
      />
      <JSONLD
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebPage", "name": "Accessibility Statement", "url": `${SITE_ORIGIN}/accessibility/` },
            researchProjectSchema
          ]
        }}
      />
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-earth-900 dark:text-earth-50 mb-4">Accessibility</h1>
      </div>

      <div className="bg-white dark:bg-earth-800 p-8 md:p-12 rounded-4xl shadow-sm border border-earth-100 dark:border-earth-700 space-y-10">
        
        <section className="space-y-4">
            <h2 className="text-2xl font-serif text-earth-900 dark:text-earth-50 mb-4">Commitment to Accessibility</h2>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                This website aims to be accessible to as many users as possible. Efforts have been made to design the website in a way that supports a wide range of users, including those with diverse learning needs and accessibility preferences.
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                Where possible, the website uses clear language, a simple layout, and readable design to improve usability and accessibility.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-serif text-earth-900 dark:text-earth-50 mb-4">Accessibility Features</h2>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                To support accessibility, the site includes features that allow visitors to adjust how content is displayed and read, including:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-earth-700 dark:text-earth-300 leading-relaxed">
                <li>dyslexic-friendly fonts</li>
                <li>adjustable text spacing</li>
                <li>enlarged text</li>
                <li>text-to-speech functionality</li>
                <li>light and dark display modes</li>
            </ul>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                These options allow users to customise the reading experience according to their individual needs and preferences.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-serif text-earth-900 dark:text-earth-50 mb-4">Use of External Platforms</h2>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                Some information related to the research activities (such as workshop details or event pages) may be hosted on external institutional platforms.
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                This approach allows participants to access content through systems that provide established accessibility tools and professional support services, which may include advanced reading tools, translation options, or assistive technologies designed for diverse learners.
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                Using these platforms helps ensure that participants can access workshop information through environments designed to support inclusive access and diverse learning needs.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-serif text-earth-900 dark:text-earth-50 mb-4">Third-Party Content</h2>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                This website may also link to external services (such as YouTube or university webpages). Accessibility features on those platforms are managed by the respective service providers and are outside the control of this website.
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                While efforts are made to ensure that content is accessible, some third-party content or tools may not fully meet all accessibility standards.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-serif text-earth-900 dark:text-earth-50 mb-4">Feedback and Support</h2>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                If you experience any accessibility difficulties when using this website, you are welcome to contact the researcher through the <Link to={PageRoute.CONTACT} className="text-sage-600 dark:text-sage-400 font-medium underline hover:text-earth-900 dark:hover:text-earth-100 transition-colors">contact page</Link> so that alternative formats or additional support can be considered.
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                Reasonable efforts will be made to respond to accessibility requests within 14 days.
            </p>
        </section>

      </div>
    </div>
  );
};

const ResearchEthics: React.FC = () => {
  return (
    <div className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Research Ethics | Building Identity through Stories"
        description="Read about the ethical approval, voluntary participation, consent, privacy, confidentiality, and participant safety procedures for Building Identity Through Stories."
        canonicalPath="/research-ethics/"
        ogTitle="Research Ethics | Building Identity through Stories"
        ogDescription="Ethical approval, consent, privacy, confidentiality, and participant protection information for the BITS doctoral research project."
      />
      <JSONLD
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebPage", "name": "Research Ethics", "url": `${SITE_ORIGIN}/research-ethics/` },
            researchProjectSchema
          ]
        }}
      />
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-earth-900 dark:text-earth-50 mb-4">Research Ethics</h1>
      </div>

      <div className="bg-white dark:bg-earth-800 p-8 md:p-12 rounded-4xl shadow-sm border border-earth-100 dark:border-earth-700 space-y-10">
        
        <section className="space-y-4">
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                This research is developed with the commitment to ethical and caring practice and has received formal approval from the Research Integrity and Ethics Committee (Ref: RIEC 25-222).
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                We believe in a person-centered practice: participation is entirely voluntary, and you are welcome to choose how you engage with the activities. Your comfort and privacy are our priorities. All information shared is treated with strict confidentiality and managed in line with applicable data protection requirements.
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                You retain full control over your participation and may withdraw from the research at any time without any need for explanation.
            </p>
            <p className="text-earth-700 dark:text-earth-300 leading-relaxed">
                Further information about the project’s research ethics and data protection procedures can be found here:
            </p>
            <div className="pt-4 flex justify-center">
                <a 
                    href="https://charliekwong.myblog.arts.ac.uk/doctoral-research/research-ethics/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-white bg-sage-600 hover:bg-sage-700 transition-colors shadow-sm hover:shadow-md"
                >
                    Read the Full Research Ethics
                </a>
            </div>
        </section>

      </div>
    </div>
  );
};

const NotFound: React.FC = () => {
  return (
    <div className="py-24 max-w-3xl mx-auto px-4 text-center">
      <SEO
        title="Page Not Found | Building Identity through Stories"
        description="The page you are looking for could not be found. Return to the Building Identity Through Stories research website."
        canonicalPath="/404.html"
        ogTitle="Page Not Found | Building Identity through Stories"
        ogDescription="The page you are looking for could not be found. Return to the Building Identity Through Stories research website."
        noindex
      />
      <JSONLD
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Page Not Found",
          "url": `${SITE_ORIGIN}/404.html`
        }}
      />
      <h1 className="text-4xl md:text-5xl font-serif text-earth-900 dark:text-earth-50 mb-6">Page Not Found</h1>
      <p className="text-xl text-earth-600 dark:text-earth-400 mb-10">The page you are looking for could not be found.</p>
      <Link to={PageRoute.HOME} className="inline-flex items-center gap-2 px-8 py-4 bg-sage-600 text-white rounded-full font-bold hover:bg-sage-700 transition-colors">
        Return to Home <ArrowRight size={16} />
      </Link>
    </div>
  );
};


const App: React.FC = () => {
  return (
    <BrowserRouter basename={getStaticBasePath()}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path={PageRoute.ABOUT} element={<About />} />
          <Route path={PageRoute.TEAM} element={<Team />} />
          <Route path={PageRoute.CARE} element={<WhatWeCare />} />
          <Route path={PageRoute.RESEARCH} element={<ResearchUpdate />} />
          <Route path={PageRoute.OUTPUT} element={<Output />} />
          <Route path={PageRoute.INVOLVED} element={<GetInvolved />} />
          <Route path={PageRoute.CONTACT} element={<Contact />} />
          <Route path={PageRoute.WORKSHOPS} element={<Home />} />
          <Route path={PageRoute.PRIVACY} element={<PrivacyPolicy />} />
          <Route path={PageRoute.TERMS} element={<TermsOfUse />} />
          <Route path={PageRoute.ACCESSIBILITY} element={<Accessibility />} />
          <Route path={PageRoute.ETHICS} element={<ResearchEthics />} />
          <Route path="/about.html" element={<About />} />
          <Route path="/team.html" element={<Team />} />
          <Route path="/what-we-care.html" element={<WhatWeCare />} />
          <Route path="/research-update.html" element={<ResearchUpdate />} />
          <Route path="/output-resources.html" element={<Output />} />
          <Route path="/get-involved.html" element={<GetInvolved />} />
          <Route path="/contact.html" element={<Contact />} />
          <Route path="/upcomingworkshops.html" element={<Home />} />
          <Route path="/upcomingworkshop" element={<Navigate to={PageRoute.WORKSHOPS} replace />} />
          <Route path="/upcomingworkshop.html" element={<Navigate to={PageRoute.WORKSHOPS} replace />} />
          <Route path="/privacy-policy.html" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use.html" element={<TermsOfUse />} />
          <Route path="/accessibility.html" element={<Accessibility />} />
          <Route path="/research-ethics.html" element={<ResearchEthics />} />
          <Route path="/404.html" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
