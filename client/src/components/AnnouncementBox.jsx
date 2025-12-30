import { useState, useEffect } from 'react';
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
        <RevealOnScroll animation="animate-fade-left" className="hidden lg:block relative z-50">
            {/* Announcement List Box */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-2xl w-64 mt-28">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/30">
                    <span className="text-xl">📢</span>
                    <h3 className="text-base font-bold text-white">Announcements</h3>
                </div>
                <div className="overflow-hidden max-h-[275px]">
                    <div className="announcement-scroll space-y-2">
                        {[...Array(2)].map((_, setIdx) => (
                            announcements.map((announcement, idx) => (
                                <div
                                    key={`${setIdx}-${idx}`}
                                    onClick={() => setSelectedAnnouncement(announcement)}
                                    className="block bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/20 hover:bg-white/20 transition-all cursor-pointer text-left"
                                >
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h4 className="text-xs font-semibold text-white line-clamp-1">{announcement.title}</h4>
                                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase whitespace-nowrap ${announcement.type === 'exam' ? 'bg-red-500/80 text-white' :
                                            announcement.type === 'event' ? 'bg-blue-500/80 text-white' :
                                                announcement.type === 'facility' ? 'bg-green-500/80 text-white' :
                                                    'bg-gray-500/80 text-white'
                                            }`}>{announcement.type}</span>
                                    </div>
                                    <p className="text-[10px] text-white/70">{announcement.date}</p>
                                </div>
                            ))
                        ))}
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedAnnouncement && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setSelectedAnnouncement(null)}>
                    <div
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="relative h-32 bg-gradient-to-r from-primary-600 to-primary-800 p-6 flex flex-col justify-end">
                            <button
                                onClick={() => setSelectedAnnouncement(null)}
                                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-white/10 p-1 rounded-full hover:bg-white/20"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                            <span className={`self-start px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 ${selectedAnnouncement.type === 'exam' ? 'bg-red-500 text-white' :
                                selectedAnnouncement.type === 'event' ? 'bg-blue-500 text-white' :
                                    selectedAnnouncement.type === 'facility' ? 'bg-green-500 text-white' :
                                        'bg-gray-500 text-white'
                                }`}>
                                {selectedAnnouncement.type}
                            </span>
                            <h2 className="text-xl font-bold text-white leading-tight">{selectedAnnouncement.title}</h2>
                            <p className="text-white/80 text-xs mt-1 font-medium">{selectedAnnouncement.date}</p>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                                <p className="whitespace-pre-wrap">{selectedAnnouncement.content || "No additional details available for this announcement."}</p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                                <Link
                                    to={selectedAnnouncement.link}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    Read Full Page
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
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
        .announcement-scroll {
          animation: scrollUp 25s linear infinite;
        }
        .announcement-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
        </RevealOnScroll>
    );
};

export default AnnouncementBox;
