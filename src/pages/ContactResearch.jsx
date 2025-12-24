import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RevealOnScroll from '../components/RevealOnScroll';

const ContactResearch = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    department: '',
    message: ''
  });

  const departments = [
    'Computer Science & IT',
    'Natural Sciences',
    'Medical Sciences',
    'Social Sciences',
    'Business & Management',
    'Environmental Studies',
    'General Inquiry'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', department: '', message: '' });
  };

  const staff = [
    {
      name: "Principle Muhammad Ahmad Raza",
      position: "Principle",
      email: "Prof.FTAPCIT0033@pgc.edu.pk",
      phone: "+92 (307) 2280-505",
      image: "👨‍🔬"
    },
    {
      name: "Dr. Iftikhar Zahid",
      position: "Director of Research",
      email: "Prof.FTAPCIT0033@pgc.edu.pk",
      phone: "+92 (300) 7971-374",
      image: "👩‍🔬"
    }
  ];

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
            <h1 className="text-2xl md:text-4xl font-bold mt-20">Contact Research Office</h1>
            <p className="text-sm md:text-base text-white/90 max-w-2xl mx-auto">
              Get in touch with our research team for inquiries, collaborations, or support
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-8 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <RevealOnScroll animation="animate-fade-right">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="+92 XXX XXXXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Department/Area of Interest *
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select a department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Brief subject of your inquiry"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-lg font-bold text-lg transition-colors shadow-lg hover:shadow-xl"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </RevealOnScroll>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Office Details */}
              <RevealOnScroll animation="animate-fade-left">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Office Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <svg className="w-6 h-6 mr-3 text-primary-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Address</p>
                        <p className="text-gray-600 dark:text-gray-400">Research Office, 2nd Floor<br />Main Building, Punjab College<br />Fort Abbas, Punjab</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <svg className="w-6 h-6 mr-3 text-primary-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Phone</p>
                        <p className="text-gray-600 dark:text-gray-400">+92 (307) 2280-505</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <svg className="w-6 h-6 mr-3 text-primary-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Email</p>
                        <p className="text-gray-600 dark:text-gray-400">research@pgc.edu.pk</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <svg className="w-6 h-6 mr-3 text-primary-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Office Hours</p>
                        <p className="text-gray-600 dark:text-gray-400">Monday - Friday<br />9:00 AM - 5:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Staff */}
              <RevealOnScroll animation="animate-fade-left" delay="0.2s">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Research Staff</h3>
                  <div className="space-y-6">
                    {staff.map((member, index) => (
                      <div key={index} className="flex items-start space-x-4 pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
                        <div className="text-4xl">{member.image}</div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">{member.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{member.position}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            📧 {member.email}<br />
                            📞 {member.phone}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactResearch;
