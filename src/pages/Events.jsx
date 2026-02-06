import React, { useState } from 'react';
import RevealOnScroll from '../components/RevealOnScroll';

const Events = () => {
  const [activeTab, setActiveTab] = useState('All');

  const categories = ['All', 'Academic', 'Cultural', 'Sports', 'Workshops', 'Seminars', 'Competitions'];

  const eventsData = [
    {
      id: 1,
      title: "Annual Science Exhibition",
      category: "Academic",
      date: "2025-01-15",
      time: "10:00 AM - 4:00 PM",
      location: "Main Auditorium",
      description: "Showcase innovative science projects and experiments from students across all departments. Join us for a day of discovery and learning.",
      status: "upcoming",
      image: "🔬"
    },
    {
      id: 2,
      title: "Inter-College Sports Festival",
      category: "Sports",
      date: "2025-01-20",
      time: "8:00 AM - 6:00 PM",
      location: "College Sports Ground",
      description: "Annual sports competition featuring cricket, football, basketball, and athletics. Students from various colleges will compete for the championship trophy.",
      status: "upcoming",
      image: "🏆"
    },
    {
      id: 3,
      title: "Cultural Night 2025",
      category: "Cultural",
      date: "2025-02-01",
      time: "6:00 PM - 10:00 PM",
      location: "Open Air Theater",
      description: "A vibrant evening celebrating diversity through music, dance, drama, and traditional performances from students.",
      status: "upcoming",
      image: "🎭"
    },
    {
      id: 4,
      title: "Career Counseling Workshop",
      category: "Workshops",
      date: "2025-01-25",
      time: "2:00 PM - 5:00 PM",
      location: "Conference Hall",
      description: "Expert guidance on career paths, higher education opportunities, and professional development for FSc and BSc students.",
      status: "upcoming",
      image: "💼"
    },
    {
      id: 5,
      title: "Computer Science Olympiad",
      category: "Competitions",
      date: "2025-02-10",
      time: "9:00 AM - 3:00 PM",
      location: "Computer Lab",
      description: "Programming competition testing problem-solving skills, algorithms, and coding expertise. Prizes for top performers.",
      status: "upcoming",
      image: "💻"
    },
    {
      id: 6,
      title: "Guest Lecture: Future of AI",
      category: "Seminars",
      date: "2025-01-28",
      time: "11:00 AM - 1:00 PM",
      location: "Seminar Hall",
      description: "Distinguished speaker Dr. Hassan Ahmed will discuss the latest developments in Artificial Intelligence and Machine Learning.",
      status: "upcoming",
      image: "🎓"
    },
    {
      id: 7,
      title: "Annual Debate Competition",
      category: "Academic",
      date: "2025-02-05",
      time: "10:00 AM - 4:00 PM",
      location: "Main Hall",
      description: "Inter-class debate competition on contemporary topics. Sharpen your public speaking and critical thinking skills.",
      status: "upcoming",
      image: "🎤"
    },
    {
      id: 8,
      title: "Blood Donation Camp",
      category: "Social",
      date: "2025-01-18",
      time: "9:00 AM - 2:00 PM",
      location: "College Premises",
      description: "Save lives by donating blood. Organized in collaboration with local blood bank. All healthy students are encouraged to participate.",
      status: "upcoming",
      image: "❤️"
    },
    {
      id: 9,
      title: "Photography Workshop",
      category: "Workshops",
      date: "2025-02-08",
      time: "3:00 PM - 6:00 PM",
      location: "Art Room",
      description: "Learn the basics of photography, composition, and editing from professional photographers. Bring your cameras!",
      status: "upcoming",
      image: "📸"
    }
  ];

  const filteredEvents = activeTab === 'All'
    ? eventsData
    : eventsData.filter(event => event.category === activeTab);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 bg-secondary-700 text-white overflow-hidden h-[180px] md:h-[200px]">
        <div className="absolute inset-0 bg-black/25"></div>
        <div className="relative max-w-7xl mx-auto h-full flex items-center justify-center">
          <div className="text-center animate-fade-in w-full py-4">
            <h1 className="text-2xl md:text-4xl font-bold mt-20">Campus Events</h1>
            <p className="text-sm md:text-base text-white/90 max-w-2xl mx-auto">
              Stay connected with exciting activities, competitions, and learning opportunities
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <div className="flex space-x-2 md:justify-center min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === category
                    ? 'bg-primary-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Count */}
      <section className="bg-gray-50 dark:bg-gray-900 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Showing <span className="font-semibold text-primary-600 dark:text-primary-400">{filteredEvents.length}</span> {activeTab !== 'All' ? activeTab.toLowerCase() : ''} events
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-8 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <RevealOnScroll key={event.id} animation="animate-fade-up" delay={`${index * 0.1}s`}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                  {/* Event Icon/Image */}
                  <div className="relative h-48 bg-secondary-700 flex items-center justify-center text-7xl overflow-hidden">
                    <div className="transform transition-transform duration-500 group-hover:scale-125">
                      {event.image}
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest bg-white dark:bg-gray-900 text-primary-700 dark:text-primary-400 rounded-full shadow-lg">
                        {event.category}
                      </span>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {event.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="mt-4 w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg">
                      Learn More
                    </button>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <section className="py-8 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto text-center">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xl text-gray-600 dark:text-gray-400">No events found in this category</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default Events;
