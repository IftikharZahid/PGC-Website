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

      {/* Societies Grid */}
      <section className="py-6 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-gray-100">Student Societies</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm">
              Our diverse range of societies ensures that every student finds a platform to express their talents and pursue their passions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {societies.map((society, index) => (
              <RevealOnScroll key={index} animation="animate-fade-up" delay={`${index * 0.1}s`}>
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                  <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">{society.icon}</div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-secondary-700 dark:group-hover:text-secondary-400 transition-colors">
                    {society.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">
                    {society.description}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Life at Campus - Facilities with alternating layout */}
      <section className="py-6 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900 dark:text-gray-100">
            World-Class Facilities
          </h2>

          <div className="space-y-12">
            {facilities.map((facility, index) => (
              <RevealOnScroll key={index} animation={index % 2 === 0 ? "animate-fade-right" : "animate-fade-left"}>
                <div className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="w-full md:w-1/2">
                    <img
                      src={facility.image}
                      alt={facility.title}
                      className="w-full h-56 object-cover rounded-2xl shadow-lg transform hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{facility.title}</h3>
                    <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                      {facility.desc}
                    </p>
                    <button className="text-primary-600 font-bold hover:text-primary-700 inline-flex items-center group transition-colors">
                      Learn More
                      <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
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
