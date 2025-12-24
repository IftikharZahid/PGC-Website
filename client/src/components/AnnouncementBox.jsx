import { Link } from 'react-router-dom';
import RevealOnScroll from './RevealOnScroll';

const AnnouncementBox = () => {
    // Announcements data - Easy to manage in one place
    const announcements = [
        { title: "Mid-Term Exams Schedule", date: "Dec 20, 2024", type: "exam", link: "/news" },
        { title: "Winter Break Notice", date: "Dec 18, 2024", type: "general", link: "/news" },
        { title: "Sports Day Registration", date: "Dec 15, 2024", type: "event", link: "/seminars" },
        { title: "Library Extended Hours", date: "Dec 12, 2024", type: "facility", link: "/library" }
    ];

    return (
        <RevealOnScroll animation="animate-fade-left" className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-2xl w-64 mt-28">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/30">
                    <span className="text-xl">📢</span>
                    <h3 className="text-base font-bold text-white">Announcements</h3>
                </div>
                <div className="overflow-hidden max-h-[275px]">
                    <div className="announcement-scroll space-y-2">
                        {/* Duplicate announcements for seamless loop */}
                        {[...Array(2)].map((_, setIdx) => (
                            announcements.map((announcement, idx) => (
                                <Link
                                    key={`${setIdx}-${idx}`}
                                    to={announcement.link}
                                    className="block bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
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
                                </Link>
                            ))
                        ))}
                    </div>
                </div>
            </div>

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
