import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RevealOnScroll from '../components/RevealOnScroll';

const ResearchOpportunities = () => {
  const [selectedType, setSelectedType] = useState('All');

  const types = ['All', 'Undergraduate', 'Graduate', 'Faculty', 'Internships'];

  const opportunities = [
    {
      title: "Undergraduate Research Assistant",
      type: "Undergraduate",
      department: "Computer Science",
      duration: "1 Semester",
      description: "Assist faculty in AI and Machine Learning research projects. Gain hands-on experience with cutting-edge technologies.",
      requirements: ["Enrolled in FSc/BSc Computer Science", "Strong programming skills", "GPA 3.0+"],
      stipend: "Available"
    },
    {
      title: "Graduate Research Fellowship",
      type: "Graduate",
      department: "Environmental Studies",
      duration: "2 Years",
      description: "Full-time research position focusing on climate change impacts in Punjab region.",
      requirements: ["MSc in Environmental Science", "Research experience preferred", "Strong analytical skills"],
      stipend: "PKR 40,000/month"
    },
    {
      title: "Summer Research Internship",
      type: "Internships",
      department: "Medical Sciences",
      duration: "3 Months",
      description: "Summer internship program in pharmaceutical research and drug development.",
      requirements: ["BSc in relevant field", "Interest in medical research", "Available full-time in summer"],
      stipend: "PKR 15,000/month"
    },
    {
      title: "Faculty Research Collaboration",
      type: "Faculty",
      department: "Social Sciences",
      duration: "Ongoing",
      description: "Collaborative research opportunities in psychology and behavioral studies.",
      requirements: ["PhD or equivalent", "Published research preferred", "Teaching experience"],
      stipend: "Competitive"
    },
    {
      title: "Lab Assistant Position",
      type: "Undergraduate",
      department: "Chemistry",
      duration: "1 Year",
      description: "Support ongoing chemistry research projects and maintain laboratory equipment.",
      requirements: ["FSc Pre-Medical or equivalent", "Laboratory safety training", "Available 15 hrs/week"],
      stipend: "PKR 10,000/month"
    },
    {
      title: "Data Analysis Internship",
      type: "Internships",
      department: "Business & Commerce",
      duration: "6 Months",
      description: "Analyze market trends and consumer behavior data for research publications.",
      requirements: ["Strong Excel/SPSS skills", "Statistics background", "BSc in relevant field"],
      stipend: "PKR 20,000/month"
    }
  ];

  const filteredOpportunities = selectedType === 'All'
    ? opportunities
    : opportunities.filter(opp => opp.type === selectedType);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 bg-secondary-700 text-white overflow-hidden h-[200px] md:h-[220px]">
        <div className="absolute inset-0 bg-black/25"></div>
        <div className="relative max-w-7xl mx-auto h-full flex items-center justify-center">
          <div className="text-center animate-fade-in w-full py-4">
            <div className="mb-4">
              <Link to="/research" className="text-white/80 hover:text-white transition-colors inline-flex items-center text-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Research
              </Link>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold mt-20">Research Opportunities</h1>
            <p className="text-sm md:text-base text-white/90 max-w-2xl mx-auto">
              Discover positions available for students and faculty to engage in meaningful research
            </p>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${selectedType === type
                  ? 'bg-primary-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results Count */}
      <section className="py-4 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Showing <span className="font-semibold text-primary-600 dark:text-primary-400">{filteredOpportunities.length}</span> opportunities
          </p>
        </div>
      </section>

      {/* Opportunities List */}
      <section className="py-12 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {filteredOpportunities.map((opportunity, index) => (
              <RevealOnScroll key={index} animation="animate-fade-up" delay={`${index * 0.1}s`}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-3 py-1 rounded-full">
                        {opportunity.type}
                      </span>
                      <span className="text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full">
                        {opportunity.duration}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {opportunity.title}
                    </h3>

                    <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold mb-3">
                      {opportunity.department}
                    </p>

                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {opportunity.description}
                    </p>

                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Requirements:</h4>
                      <ul className="space-y-1">
                        {opportunity.requirements.map((req, idx) => (
                          <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                            <svg className="w-4 h-4 mr-2 text-primary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">Stipend: </span>
                        {opportunity.stipend}
                      </div>
                      <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-8 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <RevealOnScroll animation="animate-fade-up">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Have Questions?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Contact our Research Office for more information about available opportunities
            </p>
            <Link to="/research/contact" className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Contact Research Office
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
};

export default ResearchOpportunities;
