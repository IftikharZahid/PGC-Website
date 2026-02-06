import RevealOnScroll from '../components/RevealOnScroll';
import PageHero from '../components/PageHero';
import { getItems, STORAGE_KEYS, initializeDemoData } from '../utils/adminStorage';

import scienceLaboratory from '../assets/science-laboratory.JPG';
import modernLibrary from '../assets/modern-library.png';
import sportsComplex from '../assets/sports-complex.jpg';

const CampusLife = () => {
  // Initialize data immediately without loading delay
  const gallery = (() => {
    initializeDemoData();
    const galleryItems = getItems(STORAGE_KEYS.GALLERY);
    const galleryMap = {};
    if (galleryItems && galleryItems.length > 0) {
      galleryItems.forEach(item => {
        galleryMap[item.id] = item.url;
      });
    }
    return galleryMap;
  })();

  const getImg = (id, fallback) => gallery[id] || fallback;

  const societies = [
    {
      title: "Debating Society",
      description: "Honing public speaking and critical thinking skills through parliamentary debates and declamation contests.",
      icon: "🎤"
    },
    {
      title: "Dramatic Club",
      description: "Unleashing creativity through performing arts, theater productions, and cultural skits.",
      icon: "🎭"
    },
    {
      title: "Literary Circle",
      description: "Fostering love for literature, poetry, and creative writing through workshops and publications.",
      icon: "✍️"
    },
    {
      title: "Science Club",
      description: "Promoting scientific inquiry and innovation through science fairs, exhibitions, and research projects.",
      icon: "🔬"
    },
    {
      title: "Sports Club",
      description: "Organizing inter-collegiate tournaments and promoting physical fitness and sportsmanship.",
      icon: "🏆"
    },
    {
      title: "Social Welfare Society",
      description: "Engaging students in community service, blood donation drives, and charitable activities.",
      icon: "🤝"
    }
  ];

  const facilities = [
    {
      title: "Modern Library",
      desc: "A vast collection of books, journals, and digital resources to support academic research.",
      image: getImg('cl-lib', modernLibrary)
    },
    {
      title: "Science Labs",
      desc: "State-of-the-art physics, chemistry, and computer laboratories for practical learning.",
      image: getImg('cl-lab', scienceLaboratory)
    },
    {
      title: "Sports Complex",
      desc: "Facilities for cricket, football, badminton, and indoor games.",
      image: getImg('cl-sports', sportsComplex)
    }
  ];

  return (
    <div className="min-h-screen">
      <PageHero
        title="Campus Life"
        subtitle="A vibrant community of learners, leaders, and change-makers."
      />

      {/* Societies Grid - Compact */}
      <section className="py-8 px-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Student Societies</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl">
                Explore your passions with our diverse range of student-led organizations.
              </p>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              6 Active Clubs
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {societies.map((society, index) => (
              <RevealOnScroll key={index} animation="animate-fade-up" delay={`${index * 0.05}s`}>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-md transition-all duration-300 flex gap-4 h-full group">
                  <div className="text-2xl bg-white dark:bg-gray-800 w-12 h-12 flex items-center justify-center rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                    {society.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                      {society.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {society.description}
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities - Compact Grid */}
      <section className="py-10 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">World-Class Facilities</h2>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {facilities.map((facility, index) => (
              <RevealOnScroll key={index} animation="animate-fade-up" delay={`${index * 0.1}s`}>
                <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full flex flex-col">
                  <div className="h-40 overflow-hidden relative">
                    <img
                      src={facility.image}
                      alt={facility.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    <h3 className="absolute bottom-3 left-3 text-lg font-bold text-white shadow-sm z-10">{facility.title}</h3>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                      {facility.desc}
                    </p>
                    <button className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wide hover:underline self-start">
                      View Details
                    </button>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CampusLife;
