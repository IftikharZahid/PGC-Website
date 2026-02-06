import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import RevealOnScroll from '../components/RevealOnScroll';
import AnnouncementBox from '../components/AnnouncementBox';
import collegeBuilding from '../assets/College-Building.png';
import studentsCollaboration from '../assets/students-collaboration.jpg';
import convocationCeremony from '../assets/convocation-ceremony.png';
import researchLaboratory from '../assets/research-laboratory.jpg';
import collegeAdmissions from '../assets/college-admissions.jpg';
import Meeting from '../assets/Meeting.jpg';
const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      {/* Hero Section - University Style */}
      <section className="relative h-[450px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={collegeBuilding}
            alt="University Campus"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-secondary-900/40 mix-blend-multiply"></div>
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
        </div>


        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto h-full flex items-end justify-between pb-12 px-6 md:px-12 gap-8">
          <RevealOnScroll animation="animate-fade-up" className="flex-1">
            <h1 className="text-6xl md:text-7xl font-serif font-bold text-white mb-5 leading-tight max-w-7xl tracking-tight shadow-md">
              Inquiry & Impact at Punjab College
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
          <div className="self-center">
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
      <section className="py-6 px-6 md:px-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5">
            <RevealOnScroll animation="animate-fade-right">
              <span className="block text-primary-600 dark:text-primary-400 font-bold uppercase tracking-widest text-xs mb-2">Who We Are</span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight">
                Where Great Minds Gather
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3 font-serif">
                Since our founding, we have been driven by a singular purpose: to define the fields of knowledge and prepare the next generation of leaders.
              </p>

              <div className="space-y-3 mt-4 border-t border-gray-300 dark:border-gray-600 pt-4">
                <div className="flex gap-3">
                  <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">1</span>
                  <div>
                    <h4 className="font-bold text-base uppercase tracking-wide mb-1 text-gray-900 dark:text-gray-100">Rigorous Inquiry</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">Challenging assumptions and pushing boundaries.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">2</span>
                  <div>
                    <h4 className="font-bold text-base uppercase tracking-wide mb-1 text-gray-900 dark:text-gray-100">Global Impact</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">Making a difference in communities worldwide.</p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
          <div className="md:col-span-7">
            <RevealOnScroll animation="animate-fade-left">
              <img src={studentsCollaboration} alt="Students Collaborating" className="rounded-xl shadow-xl w-full h-auto max-h-[400px] object-cover" />
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* News / Highlights Grid */}
      <section className="py-6 px-6 md:px-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">Latest News & Stories</h2>
            <Link to="/news" className="hidden md:block text-primary-600 dark:text-secondary-400 font-bold uppercase tracking-widest text-xs hover:underline">View All News</Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Seminars 2025", cat: "Events", img: convocationCeremony, desc: "Expert speakers and industry leaders sharing knowledge on cutting-edge topics." },
              { title: "Research Breakthrough", cat: "Academics", img: researchLaboratory, desc: "Faculty members publish groundbreaking research in international journals." },
              { title: "Admissions Open Fall 2025", cat: "Admissions", img: collegeAdmissions, desc: "Applications are now being accepted for all undergraduate programs." }
            ].map((item, idx) => (
              <RevealOnScroll key={idx} animation="animate-fade-up" delay={`${idx * 0.2}s`}>
                {idx === 0 ? (
                  <Link to="/seminars" className="block">
                    <div className="group cursor-pointer">
                      <div className="overflow-hidden mb-4 rounded-lg">
                        <img src={item.img} alt={item.title} className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-lg" />
                      </div>
                      <div className="text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-widest mb-1.5">{item.cat}</div>
                      <h3 className="text-xl font-serif font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{item.desc}</p>
                    </div>
                  </Link>
                ) : idx === 1 ? (
                  <Link to="/research-breakthrough" className="block">
                    <div className="group cursor-pointer">
                      <div className="overflow-hidden mb-4 rounded-lg">
                        <img src={item.img} alt={item.title} className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-lg" />
                      </div>
                      <div className="text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-widest mb-1.5">{item.cat}</div>
                      <h3 className="text-xl font-serif font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{item.desc}</p>
                    </div>
                  </Link>
                ) : (
                  <Link to="/admissions-fall-2025" className="block">
                    <div className="group cursor-pointer">
                      <div className="overflow-hidden mb-4 rounded-lg">
                        <img src={item.img} alt={item.title} className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-lg" />
                      </div>
                      <div className="text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-widest mb-1.5">{item.cat}</div>
                      <h3 className="text-xl font-serif font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{item.desc}</p>
                    </div>
                  </Link>
                )}
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* High Impact Stats Bar */}
      <section className="bg-secondary-900 dark:bg-secondary-950 text-white py-6 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-white/20">
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
      </section>

      {/* Footer CTA */}
      <section className="py-8 px-6 md:px-12 bg-gray-100 dark:bg-gray-800 text-center">
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
