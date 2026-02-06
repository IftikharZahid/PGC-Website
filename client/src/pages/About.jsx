import { useState, useEffect } from 'react';
import RevealOnScroll from '../components/RevealOnScroll';
import PageHero from '../components/PageHero';
import { getItems, STORAGE_KEYS, initializeDemoData } from '../utils/adminStorage';
import collegeBuilding from '../assets/College-Building.png';
import Principal from '../assets/staff/SirAhamdRaza.png';

const About = () => {
  const [gallery, setGallery] = useState({});

  useEffect(() => {
    initializeDemoData();
    const galleryItems = getItems(STORAGE_KEYS.GALLERY);
    const galleryMap = {};
    if (galleryItems && galleryItems.length > 0) {
      galleryItems.forEach(item => {
        galleryMap[item.id] = item.url;
      });
    }
    setGallery(galleryMap);
  }, []);

  const getImg = (id, fallback) => gallery[id] || fallback;
  return (
    <div className="min-h-screen">
      <PageHero
        title="About Us"
        subtitle="A legacy of excellence, a future of innovation."
      />

      {/* Main Content - Compact & Professional */}
      <section className="py-10 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* History & Mission */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <RevealOnScroll animation="animate-fade-right">
              <div className="relative">
                <img
                  src={getImg('about-campus', collegeBuilding)}
                  alt="College Campus"
                  className="w-full h-64 object-cover rounded-xl shadow-md"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl flex items-end p-6">
                  <h3 className="text-white text-xl font-bold">A Legacy of Excellence</h3>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll animation="animate-fade-left">
              <div>
                <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span className="w-8 h-1 bg-primary-600 rounded-full"></span>
                  History & Mission
                </h2>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  <p>
                    Established with a vision to provide world-class education, <strong className="text-primary-700 dark:text-primary-400">Punjab College</strong> has grown into a premier institution. From humble beginnings, we have expanded into a vast network, committed to academic excellence and character building.
                  </p>
                  <p>
                    Our mission is to empower students with knowledge, skills, and values. We believe in holistic development, fostering critical thinking, creativity, and leadership to prepare students for a dynamic future.
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Principal's Message & Core Values Grid */}
          <div className="grid md:grid-cols-12 gap-8">
            {/* Principal's Message - Compact Card */}
            <div className="md:col-span-5">
              <RevealOnScroll animation="animate-fade-right">
                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg className="w-24 h-24 text-primary-600" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.096 14.808 15.345 15.689 15.345C16.969 15.345 17.516 16.634 18.252 16.634C19.349 16.634 20.25 15.539 20.25 14.054C20.25 12.146 18.598 10.758 16.593 10.758C14.396 10.758 12.515 12.545 12.515 15.019C12.515 16.291 13.042 17.398 13.626 18.252L14.017 21ZM5.097 21L5.097 18C5.097 16.096 5.888 15.345 6.769 15.345C8.049 15.345 8.596 16.634 9.332 16.634C10.429 16.634 11.33 15.539 11.33 14.054C11.33 12.146 9.678 10.758 7.673 10.758C5.476 10.758 3.595 12.545 3.595 15.019C3.595 16.291 4.122 17.398 4.706 18.252L5.097 21Z" /></svg>
                  </div>

                  <div className="relative z-10 flex gap-4 items-start">
                    <img
                      src={getImg('about-principal', Principal)}
                      alt="Principal"
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary-500 shadow-sm"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Principal's Message</h3>
                      <p className="text-xs text-primary-600 dark:text-primary-400 font-bold mb-2">Ahmad Raza Watto</p>
                      <blockquote className="text-xs text-gray-600 dark:text-gray-300 italic leading-relaxed">
                        "Education is about igniting the mind and shaping character. We strive to create an environment where every student can discover their potential."
                      </blockquote>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>

            {/* Core Values - Horizontal Grid */}
            <div className="md:col-span-7">
              <RevealOnScroll animation="animate-fade-left">
                <div className="h-full flex flex-col justify-center">
                  <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Our Core Values</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { title: "Excellence", icon: "⭐", desc: "Striving for highest standards." },
                      { title: "Integrity", icon: "🛡️", desc: "Upholding honesty & ethics." },
                      { title: "Innovation", icon: "💡", desc: "Embracing creative solutions." },
                    ].map((value, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800 transition-colors">
                        <div className="text-2xl mb-2">{value.icon}</div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">{value.title}</h4>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">{value.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
