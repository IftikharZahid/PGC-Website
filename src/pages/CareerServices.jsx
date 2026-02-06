import React from 'react';
import RevealOnScroll from '../components/RevealOnScroll';

const CareerServices = () => {
  const services = [
    {
      icon: "💼",
      title: "Career Counseling",
      description: "One-on-one guidance sessions with experienced career counselors to help you identify your strengths, interests, and career goals."
    },
    {
      icon: "📝",
      title: "Resume Building",
      description: "Professional assistance in creating compelling resumes and cover letters that stand out to employers."
    },
    {
      icon: "🎤",
      title: "Interview Preparation",
      description: "Mock interviews and coaching sessions to build confidence and improve your interview skills."
    },
    {
      icon: "🌐",
      title: "Job Portal Access",
      description: "Exclusive access to our job portal featuring opportunities from leading companies and organizations."
    },
    {
      icon: "🤝",
      title: "Industry Connections",
      description: "Networking events and alumni meetups to connect with professionals in your field of interest."
    },
    {
      icon: "🎓",
      title: "Higher Education Guidance",
      description: "Comprehensive support for students pursuing higher education, including application assistance and scholarship information."
    }
  ];

  const careerPaths = [
    {
      field: "Computer Science & IT",
      opportunities: ["Software Developer", "Data Scientist", "Network Engineer", "Cybersecurity Analyst", "Web Developer"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      field: "Medical & Health Sciences",
      opportunities: ["Doctor", "Pharmacist", "Medical Researcher", "Healthcare Administrator", "Physiotherapist"],
      color: "from-green-500 to-emerald-500"
    },
    {
      field: "Business & Commerce",
      opportunities: ["Accountant", "Financial Analyst", "Business Manager", "Entrepreneur", "Marketing Specialist"],
      color: "from-purple-500 to-pink-500"
    },
    {
      field: "Engineering",
      opportunities: ["Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "Chemical Engineer", "Architect"],
      color: "from-orange-500 to-red-500"
    }
  ];

  const resources = [
    {
      title: "Career Assessment Tools",
      description: "Take online assessments to discover careers that match your personality and skills.",
      icon: "📊"
    },
    {
      title: "Workshop Series",
      description: "Regular workshops on professional development, soft skills, and industry trends.",
      icon: "🎯"
    },
    {
      title: "Internship Programs",
      description: "Connect with companies offering internship opportunities to gain practical experience.",
      icon: "🏢"
    },
    {
      title: "Career Library",
      description: "Access to books, guides, and online resources about various career paths and industries.",
      icon: "📚"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 bg-secondary-700 text-white overflow-hidden h-[150px]">
        <div className="absolute inset-0 bg-black/25"></div>
        <div className="relative max-w-7xl mx-auto h-full flex items-center justify-center">
          <div className="text-center animate-fade-in w-full py-4">
            <h1 className="text-2xl md:text-3xl font-bold mt-20">Career Services</h1>
            <p className="text-sm md:text-base text-white/90 max-w-3xl mx-auto">
              Empowering students to discover, develop, and achieve their career aspirations
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-8 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white">Our Services</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive career support services designed to help you succeed in your professional journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, index) => (
              <RevealOnScroll key={index} animation="animate-fade-up" delay={`${index * 0.1}s`}>
                <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                  <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {service.description}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Career Paths */}
      <section className="py-8 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white">Explore Career Paths</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover diverse career opportunities available in different fields
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {careerPaths.map((path, index) => (
              <RevealOnScroll key={index} animation="animate-fade-up" delay={`${index * 0.15}s`}>
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className={`h-1.5 bg-gradient-to-r ${path.color}`}></div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                      {path.field}
                    </h3>
                    <div className="space-y-1.5">
                      {path.opportunities.map((opportunity, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <svg className="w-4 h-4 mr-2 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{opportunity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-8 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white">Additional Resources</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Tools and programs to support your career development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {resources.map((resource, index) => (
              <RevealOnScroll key={index} animation="animate-fade-up" delay={`${index * 0.1}s`}>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="text-3xl mb-2">{resource.icon}</div>
                  <h4 className="text-base font-bold mb-2 text-gray-900 dark:text-white">{resource.title}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{resource.description}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-6 px-4 bg-secondary-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <RevealOnScroll animation="animate-fade-up">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Plan Your Future?</h2>
            <p className="text-base mb-6 text-white/90">
              Schedule an appointment with our career counselors today and take the first step towards your dream career.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="bg-white text-primary-700 px-6 py-3 rounded-lg font-bold text-base hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Book Appointment
              </button>
              <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-bold text-base hover:bg-white/10 transition-colors">
                Download Career Guide
              </button>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
};

export default CareerServices;
