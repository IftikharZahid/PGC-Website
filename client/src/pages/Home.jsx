import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import RevealOnScroll from '../components/RevealOnScroll';
import collegeBuilding from '../assets/college-building.png';
import graduatingStudents from '../assets/graduating-students.png';
import managingDirector from '../assets/managing-director.png';
import principalPortrait from '../assets/principal-portrait.png';
import studentPortrait from '../assets/student-portrait.png';

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Hero Section - University Style */}
      <section className="relative h-[600px] overflow-hidden">
         {/* Background Image with Overlay */}
         <div className="absolute inset-0">
           <img 
             src={collegeBuilding} 
             alt="University Campus" 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-primary-900/40 mix-blend-multiply"></div> 
           {/* Gradient Overlay for Text Readability */}
           <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
         </div>

         {/* Hero Content */}
         <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-end pb-24 px-6 md:px-12">
           <RevealOnScroll animation="animate-fade-up">
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight max-w-4xl tracking-tight shadow-md">
                Inquiry & Impact at Punjab College 
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl font-light leading-relaxed mb-8 drop-shadow-md">
                 Fostering a culture of rigorous inquiry and intellectual freedom to define the future.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/admissions" className="bg-white text-primary-900 hover:bg-gray-100 px-8 py-3 uppercase tracking-widest text-sm font-bold transition-all duration-300">
                  APPLY NOW
                </Link>
                <Link to="/about" className="border-2 border-white text-white hover:bg-white hover:text-primary-900 px-8 py-3 uppercase tracking-widest text-sm font-bold transition-all duration-300">
                  LEARN MORE
                </Link>
              </div>
           </RevealOnScroll>
         </div>
      </section>

      {/* Intro Block - Asymmetrical Layout */}
      <section className="py-24 px-6 md:px-12 bg-secondary-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5">
              <RevealOnScroll animation="animate-fade-right">
                 <span className="block text-primary-700 font-bold uppercase tracking-widest text-sm mb-4">Who We Are</span>
                 <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                   Where Great Minds Gather
                 </h2>
                 <p className="text-gray-700 text-lg leading-relaxed mb-6 font-serif">
                   Since our founding, we have been driven by a singular purpose: to define the fields of knowledge and prepare the next generation of leaders.
                 </p>
                 
                 <div className="space-y-6 mt-8 border-t border-gray-300 pt-8">
                    <div className="flex gap-4">
                       <span className="text-4xl font-bold text-primary-800">1</span>
                       <div>
                         <h4 className="font-bold text-lg uppercase tracking-wide mb-1">Rigorous Inquiry</h4>
                         <p className="text-gray-600 text-sm">Challenging assumptions and pushing boundaries.</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <span className="text-4xl font-bold text-primary-800">2</span>
                       <div>
                         <h4 className="font-bold text-lg uppercase tracking-wide mb-1">Global Impact</h4>
                         <p className="text-gray-600 text-sm">Making a difference in communities worldwide.</p>
                       </div>
                    </div>
                 </div>
              </RevealOnScroll>
            </div>
            <div className="md:col-span-7 relative">
               <RevealOnScroll animation="animate-fade-left">
                  <div className="relative">
                    <div className="absolute top-0 right-0 w-3/4 h-full bg-gray-200 -z-10 transform translate-x-8 -translate-y-8"></div>
                    <img src={graduatingStudents} alt="Students" className="w-full shadow-2xl" />
                  </div>
               </RevealOnScroll>
            </div>
        </div>
      </section>

      {/* News / Highlights Grid */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
           <div className="flex justify-between items-end mb-12">
             <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Latest News & Stories</h2>
             <Link to="/news" className="hidden md:block text-primary-700 font-bold uppercase tracking-widest text-sm hover:underline">View All News</Link>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Annual Convocation 2024", cat: "Events", img: principalPortrait, desc: "Celebrating the achievements of our graduating class with distinguished guests." },
                { title: "Research Breakthrough", cat: "Academics", img: managingDirector, desc: "Faculty members publish groundbreaking research in international journals." },
                { title: "Admissions Open Fall 2025", cat: "Admissions", img: studentPortrait, desc: "Applications are now being accepted for all undergraduate programs." }
              ].map((item, idx) => (
                <RevealOnScroll key={idx} animation="animate-fade-up" delay={`${idx * 0.2}s`}>
                   <div className="group cursor-pointer">
                      <div className="overflow-hidden mb-4">
                         <img src={item.img} alt={item.title} className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"/>
                      </div>
                      <div className="text-primary-700 text-xs font-bold uppercase tracking-widest mb-2">{item.cat}</div>
                      <h3 className="text-2xl font-serif font-bold mb-3 group-hover:text-primary-700 transition-colors leading-tight">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
                   </div>
                </RevealOnScroll>
              ))}
           </div>
        </div>
      </section>

      {/* High Impact Stats Bar */}
      <section className="bg-primary-900 text-white py-16 px-6 md:px-12">
         <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
            <RevealOnScroll animation="animate-fade-up" delay="0s">
               <div className="p-4">
                  <div className="text-5xl md:text-6xl font-serif font-bold mb-2">5k+</div>
                  <div className="text-sm uppercase tracking-widest font-semibold text-white/70">Students Enrolled</div>
               </div>
            </RevealOnScroll>
            <RevealOnScroll animation="animate-fade-up" delay="0.1s">
               <div className="p-4">
                  <div className="text-5xl md:text-6xl font-serif font-bold mb-2">200</div>
                  <div className="text-sm uppercase tracking-widest font-semibold text-white/70">Faculty Members</div>
               </div>
           </RevealOnScroll>
           <RevealOnScroll animation="animate-fade-up" delay="0.2s">
               <div className="p-4">
                  <div className="text-5xl md:text-6xl font-serif font-bold mb-2">30</div>
                  <div className="text-sm uppercase tracking-widest font-semibold text-white/70">Years of Legacy</div>
               </div>
           </RevealOnScroll>
           <RevealOnScroll animation="animate-fade-up" delay="0.3s">
               <div className="p-4">
                  <div className="text-5xl md:text-6xl font-serif font-bold mb-2">15</div>
                  <div className="text-sm uppercase tracking-widest font-semibold text-white/70">Cities</div>
               </div>
           </RevealOnScroll>
         </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 px-6 md:px-12 bg-gray-100 text-center">
         <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Join a Community of Leaders</h2>
         <p className="max-w-2xl mx-auto text-gray-600 mb-8 text-lg">
           Discover how Punjab College can help you achieve your academic and professional goals.
         </p>
         <Link to="/admissions" className="btn-primary inline-block bg-primary-800 text-white px-10 py-4 hover:bg-primary-900 transition-colors">
            START YOUR APPLICATION
         </Link>
      </section>
    </div>
  );
};

export default Home;
