import React from 'react';
import RevealOnScroll from '../components/RevealOnScroll';
import collegeBuilding from '../assets/college-building.png';
import graduatingStudents from '../assets/graduating-students.png';

const CampusLife = () => {
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
      image: collegeBuilding // Placeholder
    },
    {
      title: "Science Labs",
      desc: "State-of-the-art physics, chemistry, and computer laboratories for practical learning.",
      image: graduatingStudents // Placeholder
    },
    {
      title: "Sports Complex",
      desc: "Facilities for cricket, football, badminton, and indoor games.",
      image: collegeBuilding // Placeholder
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 bg-gradient-to-br from-primary-600 to-secondary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Campus Life</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Beyond the classroom: A vibrant community of learners, leaders, and change-makers.
          </p>
        </div>
      </section>

      {/* Societies Grid */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Student Societies</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our diverse range of societies ensures that every student finds a platform to express their talents and pursue their passions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {societies.map((society, index) => (
              <RevealOnScroll key={index} animation="animate-fade-up" delay={`${index * 0.1}s`}>
                <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{society.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {society.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {society.description}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Life at Campus - Facilities with alternating layout */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-gray-100">
            World-Class Facilities
          </h2>
          
          <div className="space-y-20">
            {facilities.map((facility, index) => (
              <RevealOnScroll key={index} animation={index % 2 === 0 ? "animate-fade-right" : "animate-fade-left"}>
                <div className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="w-full md:w-1/2">
                    <img 
                      src={facility.image} 
                      alt={facility.title} 
                      className="w-full h-80 object-cover rounded-2xl shadow-lg transform hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{facility.title}</h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                      {facility.desc}
                    </p>
                    <button className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center group">
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
