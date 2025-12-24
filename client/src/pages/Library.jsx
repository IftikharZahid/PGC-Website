import React from 'react';
import { Link } from 'react-router-dom';
import RevealOnScroll from '../components/RevealOnScroll';

const Library = () => {
  const features = [
    {
      icon: "📚",
      title: "Extensive Collection",
      description: "Over 10,000 books covering diverse subjects including science, literature, history, and technology."
    },
    {
      icon: "💻",
      title: "Digital Resources",
      description: "Access to e-books, online journals, research databases, and digital archives."
    },
    {
      icon: "📖",
      title: "Reading Spaces",
      description: "Quiet study areas, group discussion rooms, and comfortable reading corners."
    },
    {
      icon: "🔍",
      title: "Research Assistance",
      description: "Dedicated librarians to help with research projects and resource discovery."
    },
    {
      icon: "⏰",
      title: "Extended Hours",
      description: "Open daily from 8:00 AM to 8:00 PM, including weekends during exam season."
    },
    {
      icon: "🖨️",
      title: "Printing & Scanning",
      description: "Modern printing, scanning, and photocopying facilities for students."
    }
  ];

  const collections = [
    {
      category: "Science & Technology",
      count: "3,500+",
      subjects: ["Physics", "Chemistry", "Biology", "Computer Science", "Mathematics"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      category: "Literature & Languages",
      count: "2,800+",
      subjects: ["English Literature", "Urdu", "Arabic", "Poetry", "World Classics"],
      color: "from-purple-500 to-pink-500"
    },
    {
      category: "Social Sciences",
      count: "2,200+",
      subjects: ["History", "Geography", "Economics", "Psychology", "Sociology"],
      color: "from-green-500 to-emerald-500"
    },
    {
      category: "Business & Commerce",
      count: "1,500+",
      subjects: ["Accounting", "Finance", "Marketing", "Business Management", "Economics"],
      color: "from-orange-500 to-red-500"
    }
  ];

  const services = [
    {
      title: "Book Borrowing",
      description: "Students can borrow up to 5 books for 2 weeks",
      icon: "📤"
    },
    {
      title: "Reference Section",
      description: "In-library reference materials including encyclopedias and dictionaries",
      icon: "📕"
    },
    {
      title: "Journals & Magazines",
      description: "Current issues of academic journals and popular magazines",
      icon: "📰"
    },
    {
      title: "Study Rooms",
      description: "Bookable group study rooms for collaborative learning",
      icon: "🚪"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 bg-secondary-700 text-white overflow-hidden h-[180px] md:h-[200px]">
        <div className="absolute inset-0 bg-black/25"></div>
        <div className="relative max-w-7xl mx-auto h-full flex items-center justify-center">
          <div className="text-center animate-fade-in w-full py-4">
            <h1 className="text-2xl md:text-4xl font-bold mt-20">College Library</h1>
            <p className="text-sm md:text-base text-white/90 max-w-2xl mx-auto">
              Your gateway to knowledge, research, and academic excellence
            </p>
          </div>
        </div>
      </section>

      {/* Library Features */}
      <section className="py-6 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white">Library Features</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm">
              A modern learning environment equipped with resources and facilities to support your academic journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <RevealOnScroll key={index} animation="animate-fade-up" delay={`${index * 0.1}s`}>
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                  <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature.description}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="py-6 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white">Our Collections</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm">
              Browse our extensive collection organized by subject categories
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {collections.map((collection, index) => (
              <RevealOnScroll key={index} animation="animate-fade-up" delay={`${index * 0.15}s`}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className={`h-2 bg-gradient-to-r ${collection.color}`}></div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {collection.category}
                      </h3>
                      <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {collection.count}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {collection.subjects.map((subject, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-6 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white">Library Services</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <RevealOnScroll key={index} animation="animate-fade-up" delay={`${index * 0.1}s`}>
                <div className="text-center p-5 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="text-3xl mb-2">{service.icon}</div>
                  <h4 className="text-base font-bold mb-2 text-gray-900 dark:text-white">{service.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{service.description}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Operating Hours & Contact */}
      <section className="py-6 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Operating Hours */}
              <RevealOnScroll animation="animate-fade-right">
                <div className="p-6 border-r border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                    <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Operating Hours
                  </h3>
                  <div className="space-y-3 text-gray-600 dark:text-gray-300">
                    <div className="flex justify-between">
                      <span className="font-semibold">Monday - Saturday:</span>
                      <span>8:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Friday:</span>
                      <span>8:00 AM - 12:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Sunday:</span>
                      <span>Closed</span>
                    </div>
                    <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <p className="text-sm text-primary-800 dark:text-primary-200 font-semibold">
                        📅 Extended hours during exam weeks
                      </p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Contact Info */}
              <RevealOnScroll animation="animate-fade-left">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                    <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Library
                  </h3>
                  <div className="space-y-4 text-gray-600 dark:text-gray-300">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 mr-3 text-primary-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="font-semibold">Phone</p>
                        <p>+92 (307) 2280-505</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 mr-3 text-primary-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="font-semibold">Email</p>
                        <p>Prof.FTAPCIT0033@pgc.edu.pk</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 mr-3 text-primary-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="font-semibold">Location</p>
                        <p>Haronabad Road, 2 KM Main Road.
                          Fort Abbas, Punjab</p>
                      </div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 px-4 bg-secondary-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <RevealOnScroll animation="animate-fade-up">
            <h2 className="text-xl md:text-2xl font-bold mb-2">Visit Our Library Today</h2>
            <p className="text-base mb-5 text-white/90">
              Discover a world of knowledge and resources waiting for you
            </p>
            <Link to="/library/catalog" className="inline-flex items-center gap-2 bg-white text-secondary-700 px-8 py-3 rounded-lg font-bold text-base hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              View Library Catalog
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
};

export default Library;
