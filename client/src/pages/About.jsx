import React from 'react';
import RevealOnScroll from '../components/RevealOnScroll';
import collegeBuilding from '../assets/college-building.png';
import principalPortrait from '../assets/principal-portrait.png';

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 bg-gradient-to-br from-primary-600 to-secondary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">About Us</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            A legacy of excellence, a future of innovation.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <RevealOnScroll animation="animate-fade-right">
              <img 
                src={collegeBuilding} 
                alt="College Campus" 
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </RevealOnScroll>
            
            <RevealOnScroll animation="animate-fade-left">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                  Our History & Mission
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  Established with a vision to provide world-class education, Punjab College has grown into a premier institution known for academic excellence and character building. Our journey began with a handful of students and a commitment to quality. Today, we are proud to have a vast network of campuses across the country.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our mission is to empower students with knowledge, skills, and values that enable them to succeed in their chosen fields and contribute positively to society. We believe in holistic development, fostering critical thinking, creativity, and leadership qualities in our students.
                </p>
              </div>
            </RevealOnScroll>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
             <RevealOnScroll animation="animate-fade-right">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                  Principal's Message
                </h2>
                <blockquote className="text-lg italic text-gray-600 dark:text-gray-300 border-l-4 border-primary-500 pl-4 mb-6">
                  "Education is not just about acquiring degrees; it's about igniting the mind and shaping the character. At Punjab College, we strive to create an environment where every student can discover their potential and achieve their dreams."
                </blockquote>
                <p className="font-bold text-gray-900 dark:text-white">Prof. Dr. Ahmad Raza</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Principal, Punjab College Fort Abbas</p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll animation="animate-fade-left">
              <img 
                src={principalPortrait} 
                alt="Principal" 
                className="w-full max-w-md mx-auto h-auto rounded-2xl shadow-xl"
              />
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Vision & Values */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Excellence", desc: "Striving for the highest standards in all endeavors." },
              { title: "Integrity", desc: "Upholding honesty and ethical conduct." },
              { title: "Innovation", desc: "Embracing new ideas and creative solutions." },
            ].map((value, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:-translate-y-2 transition-transform duration-300">
                <h3 className="text-xl font-bold mb-4 text-primary-600 dark:text-primary-400">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
