import React, { useState } from 'react';
import RevealOnScroll from '../components/RevealOnScroll';
import principalPortrait from '../assets/principal-portrait.png';
import managingDirector from '../assets/managing-director.png';
import ComputerScience from '../assets/ComputerScience.jpeg';
// import chemistry from '../assets/chemistry.png';

const Faculty = () => {
  const [activeTab, setActiveTab] = useState('All');

  const departments = ['All', 'Computer Science', 'Science', 'Commerce', 'Humanities',];

  const facultyMembers = [
    {
      name: "Muhammad Ahmad Raza Watto",
      designation: "Principal/Director",
      department: "Administration",
      image: principalPortrait,
      qualification: "Ph.D. Education",
      experience: "25+ Years"
    },
    {
      name: "Arshad Bhutta",
      designation: "Managing Director",
      department: "Administration",
      image: managingDirector,
      qualification: "MBA Leadership",
      experience: "20+ Years"
    },
    {
      name: "Iftikhar Ahmad Zahid",
      designation: "Professor",
      department: "Computer Science",
      qualification: "MSC(CS)",
      image: ComputerScience,
      experience: "6 Years"
    },
    {
      name: "Muhammad Asif",
      designation: "Senior Lecturer",
      department: "Computer Science",
      qualification: "MS CS",
      experience: "8 Years"
    },
    {
      name: "Mrs. Zunaira Fatima",
      designation: "HOD Physics",
      department: "Science",
      qualification: "M.Phil Physics",
      experience: "12 Years"
    },
    {
      name: "Mr. Rizwan Ahmed",
      designation: "Lecturer Chemistry",
      department: "Science",
      qualification: "M.Sc Chemistry",
      experience: "6 Years"
    },
    {
      name: "Mr. Shan Ali",
      designation: "HOD Commerce",
      department: "Commerce",
      qualification: "M.Com, ACCA",
      experience: "10 Years"
    },
    {
      name: "Ms. Amna Bibi",
      designation: "Lecturer English",
      department: "Humanities",
      qualification: "MA English",
      experience: "5 Years"
    }
  ];

  const filteredFaculty = activeTab === 'All' 
    ? facultyMembers 
    : facultyMembers.filter(member => member.department === activeTab || member.department === 'Administration');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 bg-gradient-to-br from-primary-600 to-secondary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Faculty</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Meeting the mentors shaping the future generation.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <div className="flex space-x-2 md:justify-center min-w-max">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveTab(dept)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === dept
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

      {/* Faculty Grid */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFaculty.map((member, index) => (
              <RevealOnScroll key={index} animation="animate-fade-up" delay={`${index * 0.1}s`}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                  <div className="relative h-64 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    {member.image ? (
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400 to-secondary-400 text-white text-4xl font-bold">
                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-1">
                      {member.department}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {member.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 font-medium mb-4">
                      {member.designation}
                    </p>
                    
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2">
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
      </section>
    </div>
  );
};

export default Faculty;
