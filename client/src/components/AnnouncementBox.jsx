import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import RevealOnScroll from './RevealOnScroll';
import { getItems, STORAGE_KEYS } from '../utils/adminStorage';

const AnnouncementBox = () => {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        // Load announcements from localStorage, fallback to default data
        const storedAnnouncements = getItems(STORAGE_KEYS.ANNOUNCEMENTS);
        if (storedAnnouncements && storedAnnouncements.length > 0) {
            setAnnouncements(storedAnnouncements);
        } else {
            // Default announcements if none in localStorage
            setAnnouncements([
                { title: "Mid-Term Exams Schedule", date: "Dec 20, 2024", type: "exam", link: "/news" },
                { title: "Winter Break Notice", date: "Dec 18, 2024", type: "general", link: "/news" },
                { title: "Sports Day Registration", date: "Dec 15, 2024", type: "event", link: "/seminars" },
                { title: "Library Extended Hours", date: "Dec 12, 2024", type: "facility", link: "/digital-library" }
            ]);
        }
    }, []);

    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    // ... useEffect ...

    if (announcements.length === 0) {
        return null;
    }

    return (
        <RevealOnScroll animation="animate-fade-left" className="relative z-50">
            {/* == DESKTOP VIEW == */}
            <div className="hidden md:block bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-5 shadow-2xl w-80 transform transition-all hover:scale-[1.02]">
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/20">
                    <span className="text-2xl">📢</span>
                    <h3 className="text-lg font-bold text-white tracking-wide">Announcements</h3>
                </div>
                <div className="overflow-hidden max-h-[260px]">
                    <div className="announcement-scroll space-y-3">
                        {[...Array(2)].map((_, setIdx) => (
                            announcements.map((announcement, idx) => (
                                <div
                                    key={`desktop-${setIdx}-${idx}`}
                                    onClick={() => setSelectedAnnouncement(announcement)}
                                    className="block bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/20 active:bg-white/30 transition-all cursor-pointer text-left group"
                                >
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h4 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-primary-200 transition-colors">{announcement.title}</h4>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider whitespace-nowrap flex-shrink-0 ${announcement.type === 'exam' ? 'bg-red-500 text-white' :
                                            announcement.type === 'event' ? 'bg-blue-500 text-white' :
                                                announcement.type === 'facility' ? 'bg-green-500 text-white' :
                                                    'bg-gray-500 text-white'
                                            }`}>{announcement.type}</span>
                                    </div>
                                    <p className="text-xs text-white/70">{announcement.date}</p>
                                </div>
                            ))
                        ))}
                    </div>
                </div>
            </div>

            {/* == MOBILE VIEW == */}
            <div className="sm:hidden w-full bg-secondary-900 border-b border-white/10 py-2">
                <div className="flex items-center overflow-hidden">
                    <div className="bg-red-600 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider rounded-r-full absolute left-0 z-10 shadow-md">
                        Latest
                    </div>
                    <div className="animate-text-scroll flex items-center gap-6 pl-20">
                        {[...Array(2)].map((_, setIdx) => (
                            announcements.map((announcement, idx) => (
                                <div
                                    key={`mobile-${setIdx}-${idx}`}
                                    onClick={() => setSelectedAnnouncement(announcement)}
                                    className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
                                >
                                    <span className={`w-2 h-2 rounded-full ${announcement.type === 'exam' ? 'bg-red-500' :
                                        announcement.type === 'event' ? 'bg-blue-500' :
                                            announcement.type === 'facility' ? 'bg-green-500' : 'bg-gray-500'
                                        }`}></span>
                                    <span className="text-xs font-medium text-white/90 group-hover:text-white transition-colors whitespace-nowrap">
                                        {announcement.title}
                                    </span>
                                    <span className="text-[10px] text-white/50 border-l border-white/20 pl-2 ml-1">
                                        {announcement.date}
                                    </span>
                                </div>
                            ))
                        ))}
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedAnnouncement && createPortal(
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setSelectedAnnouncement(null)}>
                    <div
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-[90%] max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in duration-200 relative scrollbar-hide"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="relative h-32 sm:h-40 bg-gradient-to-r from-primary-600 to-primary-800 p-6 flex flex-col justify-end">
                            <button
                                onClick={() => setSelectedAnnouncement(null)}
                                className="absolute top-4 right-4 text-white/80 hover:text-white active:text-white transition-colors bg-white/10 p-1.5 rounded-full hover:bg-white/20 z-10"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                            <span className={`self-start px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-2 ${selectedAnnouncement.type === 'exam' ? 'bg-red-500 text-white' :
                                selectedAnnouncement.type === 'event' ? 'bg-blue-500 text-white' :
                                    selectedAnnouncement.type === 'facility' ? 'bg-green-500 text-white' :
                                        'bg-gray-500 text-white'
                                }`}>
                                {selectedAnnouncement.type}
                            </span>
                            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">{selectedAnnouncement.title}</h2>
                            <p className="text-white/80 text-xs sm:text-sm mt-1 font-medium">{selectedAnnouncement.date}</p>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                                <p className="whitespace-pre-wrap text-base">{selectedAnnouncement.content || "No additional details available for this announcement."}</p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                                <Link
                                    to={selectedAnnouncement.link}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors shadow-sm"
                                >
                                    Read Full Page
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Animation Styles */}
            <style>{`
        @keyframes scrollUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        @keyframes textScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .announcement-scroll {
          animation: scrollUp 35s linear infinite;
        }
        .announcement-scroll:hover {
          animation-play-state: paused;
        }
        .animate-text-scroll {
            animation: textScroll 30s linear infinite;
            display: flex;
            width: max-content;
        }
        .animate-text-scroll:hover {
            animation-play-state: paused;
        }
      `}</style>
        </RevealOnScroll>
    );
};

export default AnnouncementBox;
