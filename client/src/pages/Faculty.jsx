import { useState, useEffect } from 'react';
import RevealOnScroll from '../components/RevealOnScroll';
import PageHero from '../components/PageHero';
import { getItems, STORAGE_KEYS, initializeDemoData } from '../utils/adminStorage';

// Static fallbacks (keep them for safety or initial load)
import Principal from '../assets/staff/SirAhamdRaza.png';
import ComputerScience from '../assets/staff/IftikharSahab.png';
import Chemistry from '../assets/staff/ArshadSahab.png';
import Physics from '../assets/staff/JavedSahab.png';
import Biology from '../assets/staff/SyedSultanSahab.png';
import Islamiat from '../assets/staff/SaleemSahab.png';
import Urdu from '../assets/staff/SohaibSahab.png';
import IslamicStudies from '../assets/staff/BilalSahab.png';
import HaseebJalal from '../assets/staff/HaseebJalal.png';
import Farzana from '../assets/staff/FemaleUserProfile.png';
import Zainab from '../assets/staff/FemaleUserProfile.png';
import Aqsa from '../assets/staff/FemaleUserProfile.png';

const Faculty = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [gallery, setGallery] = useState({});
  const [facultyMembers, setFacultyMembers] = useState([]);

  // Load data immediately on mount
  useEffect(() => {
    const currentTeachers = getItems(STORAGE_KEYS.TEACHERS);
    const hasNewData = currentTeachers.some(t => t.designation === "Principal/Director" || t.designation === "HOD Physics");

    if (!hasNewData || currentTeachers.length === 0) {
      initializeDemoData();
    }

    const teachers = getItems(STORAGE_KEYS.TEACHERS);
    const galleryItems = getItems(STORAGE_KEYS.GALLERY);

    const activeFaculty = teachers.filter(t => t.status === 'Active');
    setFacultyMembers(activeFaculty);

    const galleryMap = {};
    if (galleryItems && galleryItems.length > 0) {
      galleryItems.forEach(item => {
        galleryMap[item.id] = item.url;
      });
    }
    setGallery(galleryMap);
  }, []);

  // Helper to get image or fallback
  const getImg = (id, fallback) => gallery[id] || fallback;

  const departments = ['All', 'Administration', 'Computer Science', 'Science', 'Commerce', 'Humanities', 'Islamic Studies'];

  const filteredFaculty = activeTab === 'All'
    ? facultyMembers
    : facultyMembers.filter(member => member.department === activeTab || member.department === 'Administration');

  return (
    <div className="min-h-screen">
      <PageHero
        title="Our Faculty"
        subtitle="Meeting the mentors shaping the future generation."
      />



      {/* Filter Tabs - Sticky & Modern */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto hide-scrollbar">
          <div className="flex space-x-2">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveTab(dept)}
                className={`
                  px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all duration-200 border
                  ${activeTab === dept
                    ? 'bg-primary-600 border-primary-600 text-white shadow-md scale-105'
                    : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400'
                  }
                `}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Faculty Grid Section - Compact 4cols */}
      <section className="py-8 px-4 bg-gray-50 dark:bg-gray-900 min-h-[60vh]">
        <div className="max-w-7xl mx-auto">
          {filteredFaculty.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-400 text-lg">No faculty members found in this department.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredFaculty.map((member, index) => (
                <RevealOnScroll key={index} animation="animate-fade-up" delay={`${index * 0.05}s`}>
                  <div
                    onClick={() => setSelectedFaculty(member)}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden group hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col"
                  >
                    <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-full h-full flex items-center justify-center bg-secondary-700 text-white text-4xl font-bold ${member.image ? 'hidden' : 'flex'}`}
                      >
                        {member.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                      </div>
                      {/* Quick View Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/30">
                          View Profile
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-1">
                        {member.department}
                      </div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight mb-1 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                        {member.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-3 line-clamp-1">
                        {member.designation}
                      </p>

                      <div className="mt-auto pt-3 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                        <span className="truncate max-w-[60%]" title={member.qualification}>{member.qualification}</span>
                        <span className="flex items-center gap-1 flex-shrink-0">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {member.experience}
                        </span>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Faculty Details Modal - Professional & Compact */}
      {
        selectedFaculty && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedFaculty(null)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button (Absolute) */}
              <button
                onClick={() => setSelectedFaculty(null)}
                className="absolute top-3 right-3 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header Banner */}
              <div className="h-32 bg-gradient-to-r from-secondary-800 to-secondary-600 relative">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              </div>

              {/* Profile Image & Basic Info */}
              <div className="px-6 relative flex flex-col items-center -mt-16">
                <div className="relative">
                  {selectedFaculty.image ? (
                    <img
                      src={selectedFaculty.image}
                      alt={selectedFaculty.name}
                      className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center bg-secondary-700 text-white text-4xl font-bold shadow-lg">
                      {selectedFaculty.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                    </div>
                  )}
                </div>

                <div className="text-center mt-3 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {selectedFaculty.name}
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-primary-600 dark:text-primary-400">{selectedFaculty.designation}</span>
                    <span>•</span>
                    <span>{selectedFaculty.department}</span>
                  </div>
                </div>

                {/* Details List */}
                <div className="w-full bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mb-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase">Qualification</div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{selectedFaculty.qualification}</div>
                    </div>
                  </div>

                  <div className="h-px bg-gray-200 dark:bg-gray-700"></div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase">Experience</div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{selectedFaculty.experience}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default Faculty;
