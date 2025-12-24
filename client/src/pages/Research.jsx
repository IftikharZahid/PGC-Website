import React from 'react';
import { Link } from 'react-router-dom';
import RevealOnScroll from '../components/RevealOnScroll';

const Research = () => {
  const researchAreas = [
    {
      icon: "💻",
      title: "Computer Science & IT",
      description: "Artificial Intelligence, Machine Learning, Cybersecurity, and Software Engineering research projects.",
      projects: 5
    },
    {
      icon: "🔬",
      title: "Natural Sciences",
      description: "Physics, Chemistry, and Biology research in collaboration with leading institutions.",
      projects: 8
    },
    {
      icon: "🧪",
      title: "Medical Sciences",
      description: "Healthcare innovation, pharmaceutical research, and medical technology development.",
      projects: 6
    },
    {
      icon: "📊",
      title: "Social Sciences",
      description: "Psychology, Economics, Sociology, and behavioral studies research initiatives.",
      projects: 4
    },
    {
      icon: "🏢",
      title: "Business & Management",
      description: "Entrepreneurship, marketing strategies, and organizational behavior research.",
      projects: 3
    },
    {
      icon: "🌍",
      title: "Environmental Studies",
      description: "Climate change, sustainability, and environmental conservation research.",
      projects: 4
    }
  ];

  const ongoingProjects = [
    {
      title: "AI-Powered Educational Tools",
      department: "Computer Science",
      lead: "Dr. Hassan Ahmed",
      description: "Developing intelligent tutoring systems using machine learning to personalize student learning experiences.",
      status: "In Progress",
      year: "2024-2025"
    },
    {
      title: "Renewable Energy Solutions",
      department: "Environmental Studies",
      lead: "Dr. Fatima Khan",
      description: "Research on solar panel efficiency and sustainable energy alternatives for rural Punjab.",
      status: "In Progress",
      year: "2024-2026"
    },
    {
      title: "Mental Health Awareness",
      department: "Psychology",
      lead: "Dr. Ali Raza",
      description: "Study on student mental health challenges and development of campus wellness programs.",
      status: "Completed",
      year: "2023-2024"
    }
  ];

  const facilities = [
    {
      title: "Research Labs",
      description: "Well-equipped laboratories for conducting scientific experiments and research",
      icon: "🔬"
    },
    {
      title: "Computer Labs",
      description: "High-performance computing systems for data analysis and simulations",
      icon: "💻"
    },
    {
      title: "Library Resources",
      description: "Access to academic journals, research databases, and digital archives",
      icon: "📚"
    },
    {
      title: "Collaboration Spaces",
      description: "Dedicated areas for research teams to collaborate and brainstorm",
      icon: "🤝"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 bg-secondary-700 text-white overflow-hidden h-[180px] md:h-[200px]">
        <div className="absolute inset-0 bg-black/25"></div>
        <div className="relative max-w-7xl mx-auto h-full flex items-center justify-center">
          <div className="text-center animate-fade-in w-full py-4">
            <h1 className="text-2xl md:text-4xl font-bold mt-20">Research & Innovation</h1>
            <p className="text-sm md:text-base text-white/90 max-w-3xl mx-auto">
              Advancing knowledge through cutting-edge research and innovation
            </p>
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-10 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Research Areas</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore our diverse research areas contributing to scientific advancement and societal development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {researchAreas.map((area, index) => (
              <RevealOnScroll key={index} animation="animate-fade-up" delay={`${index * 0.1}s`}>
                <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {area.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {area.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {area.description}
                  </p>
                  <div className="flex items-center text-primary-600 dark:text-primary-400 font-semibold">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {area.projects} Active Projects
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Ongoing Projects */}
      <section className="py-10 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Featured Projects</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Highlighting some of our most impactful research initiatives
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ongoingProjects.map((project, index) => (
              <RevealOnScroll key={index} animation="animate-fade-up" delay={`${index * 0.15}s`}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-3 py-1 rounded-full">
                        {project.department}
                      </span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${project.status === 'In Progress'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        }`}>
                        {project.status}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {project.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {project.description}
                    </p>

                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Lead: {project.lead}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{project.year}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Research Facilities */}
      <section className="py-10 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Research Facilities</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              State-of-the-art infrastructure supporting innovative research
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((facility, index) => (
              <RevealOnScroll key={index} animation="animate-fade-up" delay={`${index * 0.1}s`}>
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="text-4xl mb-3">{facility.icon}</div>
                  <h4 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{facility.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{facility.description}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 px-4 bg-secondary-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <RevealOnScroll animation="animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Get Involved in Research</h2>
            <p className="text-xl mb-8 text-white/90">
              Join our research community and contribute to groundbreaking discoveries
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/research/opportunities" className="bg-white text-primary-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-block text-center">
                Explore Opportunities
              </Link>
              <Link to="/research/contact" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors inline-block text-center">
                Contact Research Office
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
};

export default Research;
