import { useState } from 'react';
import RevealOnScroll from '../components/RevealOnScroll';
import researchLaboratory from '../assets/research-laboratory.jpg';
import scienceLaboratory from '../assets/science-laboratory.JPG';

const ResearchBreakthrough = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    { id: 1, src: researchLaboratory, title: "Research Laboratory", description: "State-of-the-art research facilities" },
    { id: 2, src: scienceLaboratory, title: "Science Laboratory", description: "Advanced scientific equipment" },
    { id: 3, src: researchLaboratory, title: "Research Team", description: "Faculty conducting experiments" },
    { id: 4, src: scienceLaboratory, title: "Lab Equipment", description: "Modern research instruments" },
    { id: 5, src: researchLaboratory, title: "Data Analysis", description: "Analyzing research results" },
    { id: 6, src: scienceLaboratory, title: "Innovation Hub", description: "Collaborative research space" }
  ];

  const posts = [
    {
      id: 1,
      title: "Publication in Nature Journal",
      date: "December 10, 2024",
      content: "Dr. Sarah Ahmed and her team published groundbreaking research on renewable energy solutions in the prestigious Nature journal, highlighting innovative approaches to sustainable power generation.",
      icon: "📚"
    },
    {
      id: 2,
      title: "International Research Collaboration",
      date: "December 8, 2024",
      content: "Punjab College faculty members partnered with universities from three countries to conduct cutting-edge research in biotechnology, fostering global academic connections.",
      icon: "🌍"
    },
    {
      id: 3,
      title: "Nanotechnology Breakthrough",
      date: "December 5, 2024",
      content: "Professor Hassan Ali's research team achieved a significant breakthrough in nanotechnology applications for medical diagnostics, potentially revolutionizing early disease detection.",
      icon: "🔬"
    },
    {
      id: 4,
      title: "Research Grant Award",
      date: "December 1, 2024",
      content: "The college received a substantial research grant from the National Science Foundation to continue pioneering work in artificial intelligence and machine learning applications.",
      icon: "💰"
    },
    {
      id: 5,
      title: "Student Research Excellence",
      date: "November 28, 2024",
      content: "Undergraduate students presented their research findings at the National Research Symposium, winning top honors for their innovative projects in environmental science.",
      icon: "🏆"
    },
    {
      id: 6,
      title: "New Research Center Launch",
      date: "November 25, 2024",
      content: "The college inaugurated a new Center for Advanced Research, equipped with cutting-edge technology and facilities to support faculty and student research initiatives.",
      icon: "🏛️"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={researchLaboratory}
            alt="Research Breakthrough"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary-900/60 mix-blend-multiply"></div>
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-end pb-12 px-6 md:px-12">
          <RevealOnScroll animation="animate-fade-up">
            <div className="inline-block mb-4">
              <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest">
                Academics
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight max-w-4xl tracking-tight">
              Research Breakthrough
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl font-light leading-relaxed">
              Faculty members publish groundbreaking research in international journals, advancing knowledge and innovation.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Research Overview Section */}
      <section className="py-10 px-6 md:px-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll animation="animate-fade-up">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-gray-900 dark:text-gray-100">
                Pioneering Academic Excellence
              </h2>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Punjab College faculty members have achieved remarkable success in publishing groundbreaking research
                across multiple disciplines in prestigious international journals. Our research initiatives span from
                renewable energy and biotechnology to artificial intelligence and nanotechnology.
              </p>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                These achievements reflect our commitment to advancing knowledge, fostering innovation, and contributing
                to global academic discourse. Our researchers collaborate with international institutions, secure
                significant grants, and mentor students in cutting-edge research methodologies.
              </p>

              {/* Research Stats Grid */}
              <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📝</div>
                  <div>
                    <h4 className="font-bold text-base mb-1 text-gray-900 dark:text-gray-100">Publications</h4>
                    <p className="text-gray-600 dark:text-gray-400">50+ Research Papers</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-3xl">💡</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 text-gray-900 dark:text-gray-100">Research Areas</h4>
                    <p className="text-gray-600 dark:text-gray-400">15+ Disciplines</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🤝</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 text-gray-900 dark:text-gray-100">Collaborations</h4>
                    <p className="text-gray-600 dark:text-gray-400">International Partners</p>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-12 px-6 md:px-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <RevealOnScroll animation="animate-fade-up">
              <span className="text-primary-700 dark:text-primary-400 font-bold uppercase tracking-widest text-xs mb-3 block">
                Research Facilities
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-3">
                Our Research Labs
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base max-w-2xl mx-auto">
                State-of-the-art facilities supporting groundbreaking research
              </p>
            </RevealOnScroll>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <RevealOnScroll key={image.id} animation="animate-fade-up" delay={`${index * 0.1}s`}>
                <div
                  className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-56 object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-lg font-bold mb-1">{image.title}</h3>
                      <p className="text-sm text-white/90">{image.description}</p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Research Posts Section */}
      <section className="py-12 px-6 md:px-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <RevealOnScroll animation="animate-fade-up">
              <span className="text-primary-700 dark:text-primary-400 font-bold uppercase tracking-widest text-xs mb-3 block">
                Latest Updates
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-3">
                Research Highlights
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base max-w-2xl mx-auto">
                Recent achievements and breakthroughs from our research community
              </p>
            </RevealOnScroll>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <RevealOnScroll key={post.id} animation="animate-fade-up" delay={`${index * 0.1}s`}>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-5 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                  <div className="text-4xl mb-3">{post.icon}</div>
                  <div className="text-xs text-primary-600 dark:text-primary-400 font-semibold mb-2">
                    {post.date}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed flex-grow text-sm">
                    {post.content}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full">
            <button
              className="absolute -top-12 right-0 text-white text-4xl hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            <div className="mt-4 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h3>
              <p className="text-white/80">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchBreakthrough;
