import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import RevealOnScroll from '../components/RevealOnScroll';
import AnnouncementBox from '../components/AnnouncementBox';
import { useTheme } from '../context/ThemeContext';
import collegeBuilding from '../assets/College-Building.png';
import studentsCollaboration from '../assets/students-collaboration.jpg';
import convocationCeremony from '../assets/convocation-ceremony.png';
import researchLaboratory from '../assets/research-laboratory.jpg';
import collegeAdmissions from '../assets/college-admissions.jpg';
import Meeting from '../assets/Meeting.jpg';
import Notification from '../components/Notification';
import { getItems, STORAGE_KEYS, initializeDemoData } from '../utils/adminStorage';

const Home = () => {
  const { heroStyle } = useTheme();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationData, setNotificationData] = useState(null);
  const [gallery, setGallery] = useState({});

  useEffect(() => {
    // Initialize data once on mount
    try {
      initializeDemoData();
    } catch (error) {
      console.error("Failed to initialize demo data:", error);
    }

    // Load gallery data
    try {
      const galleryItems = getItems(STORAGE_KEYS.GALLERY);
      const galleryMap = {};
      if (galleryItems && galleryItems.length > 0) {
        galleryItems.forEach(item => {
          galleryMap[item.id] = item.url;
        });
      }
      setGallery(galleryMap);
    } catch (error) {
      console.error("Failed to load gallery:", error);
    }

    // Fetch notification from API
    const fetchNotification = async () => {
      try {
        const response = await fetch('/api/notifications');
        const data = await response.json();

        if (data.success && data.data) {
          setNotificationData(data.data);

          // Show notification logic (only if enabled)
          const hasSeenNotification = sessionStorage.getItem('has_seen_notification');
          const isEnabled = data.data.enabled !== false;

          if (!hasSeenNotification && isEnabled) {
            setTimeout(() => {
              setIsNotificationOpen(true);
              sessionStorage.setItem('has_seen_notification', 'true');
            }, 500);
          }
        }
      } catch (error) {
        console.error("Failed to fetch notification:", error);
      }
    };

    fetchNotification();
  }, []);

  // Helper to get image or fallback
  const getImg = (id, fallback) => (gallery && gallery[id]) || fallback;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans overflow-x-hidden">
      <Notification
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notificationData={notificationData}
        logoSrc={getImg('notif-logo', null)} // Component handles null fallback
      />

      {/* Mobile Announcement Ticker - Visible only on mobile */}
      <div className="block sm:hidden pt-[3.5rem] bg-secondary-900 relative z-20 shadow-md">
        <AnnouncementBox />
      </div>

      {/* Hero Section - University Style */}
      <section className="relative h-[450px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={getImg('hero-bg', collegeBuilding)}
            alt="University Campus"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className={`absolute inset-0 mix-blend-multiply ${heroStyle === 'modern' ? 'bg-primary-800/40' : 'bg-secondary-900/40'}`}></div>
          {/* Gradient Overlay for Text Readability */}
          <div className={`absolute inset-0 ${heroStyle === 'modern' ? 'bg-gradient-to-t from-primary-900/90 via-primary-900/40 to-transparent' : 'bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent'}`}></div>
        </div>


        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto h-full flex items-end justify-between pb-12 px-6 md:px-12 gap-8">
          <RevealOnScroll animation="animate-fade-up" className="flex-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-5 leading-tight max-w-7xl tracking-tight shadow-md">
              Inquiry & Impact at <br /> Punjab College
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-5xl font-light leading-relaxed mb-5 drop-shadow-md">
              Fostering a culture of rigorous inquiry and intellectual freedom to define the future.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/admissions" className="bg-primary-600 text-white hover:bg-primary-700 px-5 py-2 uppercase tracking-widest text-xs font-bold transition-all duration-300">
                APPLY NOW
              </Link>
              <Link to="/about" className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-6 py-2 uppercase tracking-widest text-xs font-bold transition-all duration-300">
                LEARN MORE
              </Link>
            </div>
          </RevealOnScroll>


          {/* Recent Announcements Box - Right Center */}
          <div className="self-center mt-20 hidden md:block animate-in fade-in slide-in-from-right-10 duration-700">
            <AnnouncementBox />
          </div>
        </div>

        {/* Custom Scrollbar Styles */}
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
          }
        `}</style>
      </section>

      {/* Intro Block - Asymmetrical Layout */}
      <section className={`py-16 px-6 md:px-12 overflow-hidden ${heroStyle === 'modern' ? 'bg-[#f4f1ea] dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800'}`}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 relative">
            {/* Decorative watermark/accent */}
            <div className="absolute -top-10 -left-10 text-9xl font-serif text-gray-200 dark:text-gray-700 opacity-50 select-none -z-10">“</div>
            <RevealOnScroll animation="animate-fade-right">
              <span className="block text-primary-600 dark:text-primary-400 font-bold uppercase tracking-[0.2em] text-xs mb-4">Values & Vision</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight border-l-4 border-primary-600 pl-6 py-1">
                Where Great Minds <br /> Gather
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6 font-serif">
                Since our founding, we have been driven by a singular purpose: to define the fields of knowledge and prepare the next generation of leaders.
              </p>

              <div className="space-y-6 mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
                <div className="flex gap-4 items-start">
                  <div className="bg-primary-100 dark:bg-gray-700 p-2 rounded-lg text-primary-600 dark:text-primary-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide mb-1 text-gray-900 dark:text-gray-100">Global Perspective</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Making a difference in communities worldwide through actionable research.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-primary-100 dark:bg-gray-700 p-2 rounded-lg text-primary-600 dark:text-primary-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide mb-1 text-gray-900 dark:text-gray-100">Rigorous Inquiry</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Challenging assumptions and pushing boundaries in every discipline.</p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
          <div className="md:col-span-7">
            <RevealOnScroll animation="animate-fade-left">
              <div className="relative">
                <div className="absolute -inset-4 border border-gray-200 dark:border-gray-700 rounded-xl -z-10 translate-x-4 translate-y-4"></div>
                <img src={getImg('intro-img', studentsCollaboration)} alt="Students Collaborating" className="rounded-lg shadow-xl w-full h-auto object-cover aspect-video" />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* News / Highlights Grid */}
      <section className={`py-16 px-6 md:px-12 ${heroStyle === 'modern' ? 'bg-white dark:bg-gray-900' : 'bg-white dark:bg-gray-900'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="mb-4 md:mb-0">
              <span className="text-primary-600 dark:text-primary-400 font-bold uppercase tracking-[0.2em] text-xs mb-2 block">Latest Updates</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-gray-100">News & Stories</h2>
            </div>
            <Link to="/news" className="group flex items-center gap-2 text-primary-600 dark:text-secondary-400 font-bold uppercase tracking-widest text-xs hover:text-primary-800 transition-colors">
              View All News
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Seminars 2025", cat: "Events", img: getImg('news-1', convocationCeremony), desc: "Expert speakers and industry leaders sharing knowledge on cutting-edge topics." },
              { title: "Research Breakthrough", cat: "Academics", img: getImg('news-2', researchLaboratory), desc: "Faculty members publish groundbreaking research in international journals." },
              { title: "Admissions Open Fall 2025", cat: "Admissions", img: getImg('news-3', collegeAdmissions), desc: "Applications are now being accepted for all undergraduate programs." }
            ].map((item, idx) => (
              <RevealOnScroll key={idx} animation="animate-fade-up" delay={`${idx * 0.2}s`}>
                <Link to={idx === 0 ? "/seminars" : idx === 1 ? "/research-breakthrough" : "/admissions-fall-2025"} className="block group h-full">
                  <div className="bg-white dark:bg-gray-800 h-full flex flex-col hover:shadow-2xl transition-all duration-300 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
                    <div className="overflow-hidden relative h-56">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-4 left-4 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-700 dark:text-primary-400 rounded-sm shadow-sm">
                        {item.cat}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-serif font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm mb-4 flex-1">
                        {item.desc}
                      </p>
                      <span className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center gap-2 mt-auto">
                        Read Story
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* High Impact Stats Bar */}
      <section className={`py-12 px-6 md:px-12 overflow-hidden ${heroStyle === 'modern' ? 'bg-[#f4f1ea] dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700' : 'bg-secondary-900 dark:bg-secondary-950'}`}>
        {heroStyle === 'modern' ? (
          <div className="max-w-7xl mx-auto relative">
            {/* Decorative elements for modern style */}
            <div className="hidden md:block absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="hidden md:block absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-primary-500/10 to-transparent rounded-full translate-x-1/2 translate-y-1/2"></div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-gray-300 dark:divide-gray-700">
              {[
                { val: "5k+", label: "Students Enrolled", icon: (<svg className="w-8 h-8 mx-auto mb-3 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>) },
                { val: "200", label: "Faculty Members", icon: (<svg className="w-8 h-8 mx-auto mb-3 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>) },
                { val: "30", label: "Years of Legacy", icon: (<svg className="w-8 h-8 mx-auto mb-3 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>) },
                { val: "15", label: "Cities", icon: (<svg className="w-8 h-8 mx-auto mb-3 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>) }
              ].map((stat, i) => (
                <RevealOnScroll key={i} animation="animate-fade-up" delay={`${i * 0.1}s`}>
                  <div className="p-4 flex flex-col items-center">
                    {stat.icon}
                    <div className="text-4xl md:text-5xl font-serif font-bold mb-2 text-gray-900 dark:text-white">{stat.val}</div>
                    <div className="text-xs uppercase tracking-[0.15em] font-bold text-gray-500 dark:text-gray-400">{stat.label}</div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-white/20 text-white">
            {/* Simpler layout for classic theme (kept similar but spaced better) */}
            <RevealOnScroll animation="animate-fade-up" delay="0s">
              <div className="p-3">
                <div className="text-4xl md:text-5xl font-serif font-bold mb-1.5">5k+</div>
                <div className="text-sm uppercase tracking-widest font-semibold text-white/70">Students Enrolled</div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll animation="animate-fade-up" delay="0.1s">
              <div className="p-3">
                <div className="text-4xl md:text-5xl font-serif font-bold mb-1.5">200</div>
                <div className="text-sm uppercase tracking-widest font-semibold text-white/70">Faculty Members</div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll animation="animate-fade-up" delay="0.2s">
              <div className="p-3">
                <div className="text-4xl md:text-5xl font-serif font-bold mb-1.5">30</div>
                <div className="text-sm uppercase tracking-widest font-semibold text-white/70">Years of Legacy</div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll animation="animate-fade-up" delay="0.3s">
              <div className="p-3">
                <div className="text-4xl md:text-5xl font-serif font-bold mb-1.5">15</div>
                <div className="text-sm uppercase tracking-widest font-semibold text-white/70">Cities</div>
              </div>
            </RevealOnScroll>
          </div>
        )}
      </section>

      {/* Footer CTA */}
      <section className={`py-8 px-6 md:px-12 text-center ${heroStyle === 'modern' ? 'bg-[#f4f1ea] dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-800'}`}>
        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-gray-900 dark:text-gray-100">Join a Community of Leaders</h2>
        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 mb-6 text-base">
          Discover how Punjab College can help you achieve your academic and professional goals.
        </p>
        <Link
          to="/admissions"
          className="relative inline-flex items-center gap-2 px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white hover:!text-white font-bold text-sm uppercase tracking-wide rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group overflow-hidden"
        >
          {/* Animated background pulse */}
          <span className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse"></span>

          {/* Icon */}
          <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>

          <span className="relative z-10">START YOUR APPLICATION</span>

          {/* Badge/Dot indicator */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
          </span>
        </Link>
      </section>
    </div>
  );
};

export default Home;
