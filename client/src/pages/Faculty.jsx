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

      {/* Filter Tabs */}
      <section className="py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-14 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <div className="flex space-x-2 md:justify-center min-w-max">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveTab(dept)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === dept
                  ? 'bg-primary-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Grid Section */}
      <section className="py-6 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFaculty.map((member, index) => (
              <RevealOnScroll key={index} animation="animate-fade-up" delay={`${index * 0.1}s`}>
                <div
                  onClick={() => setSelectedFaculty(member)}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group hover:-translate-y-2 transition-transform duration-300 cursor-pointer"
                >
                  <div className="relative h-56 bg-gray-200 dark:bg-gray-700 overflow-hidden">
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
                      {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">

                    </div>
                  </div>

                  <div className="p-4">
                    <div className="text-xs font-semibold text-secondary-700 dark:text-secondary-400 mb-1">
                      {member.department}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 font-medium mb-3 text-sm">
                      {member.designation}
                    </p>

                    <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-1.5">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-2 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                        {member.qualification}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-2 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Experience: {member.experience}
                      </div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section >

      {/* Faculty Details Modal */}
      {
        selectedFaculty && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedFaculty(null)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header with Image */}
              <div className="relative">
                <div className="h-48 bg-secondary-700 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <div className="absolute top-24 left-1/2 transform -translate-x-1/2">
                  {selectedFaculty.image ? (
                    <img
                      src={selectedFaculty.image}
                      alt={selectedFaculty.name}
                      className="w-40 h-40 rounded-full border-4 border-white dark:border-gray-800 object-cover object-top shadow-xl"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center bg-secondary-700 text-white text-5xl font-bold shadow-xl">
                      {selectedFaculty.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedFaculty(null)}
                  className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="pt-24 pb-8 px-8">
                {/* Name and Title */}
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-3 text-base mb-2">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">
                      {selectedFaculty.designation}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="px-4 py-1 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 rounded-full font-semibold">
                      {selectedFaculty.department}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedFaculty.name}
                  </h2>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {/* Qualification */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-secondary-600 rounded-lg p-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Qualification</h3>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedFaculty.qualification}</p>
                      </div>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-secondary-600 rounded-lg p-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Experience</h3>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedFaculty.experience}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <div className="text-center">
                  <button
                    onClick={() => setSelectedFaculty(null)}
                    className="btn-primary bg-primary-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-primary-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default Faculty;
