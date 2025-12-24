import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 md:p-12 animate-fade-in">
        <h1 className="text-4xl font-serif font-bold text-primary-900 dark:text-white mb-8 border-b-2 border-primary-100 pb-4">
          Terms of Service
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 font-sans">
          <p className="lead text-xl">
            Welcome to the Punjab College website. By accessing this website, you agree to comply with these terms.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-8 mb-4">1. Acceptance of Terms</h3>
          <p>
            By using our website and student portal, you agree to be bound by these Terms of Service and all applicable laws and regulations.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-8 mb-4">2. Educational Use</h3>
          <p>
            This website is intended for educational purposes, including student admissions, result checking, and academic resource distribution.
            Misuse of student accounts or unauthorized access to academic records is strictly prohibited.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-8 mb-4">3. Intellectual Property</h3>
          <p>
            All content on this website, including course materials, logos, and text, is the property of Punjab College and is protected by copyright laws.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-8 mb-4">4. Student Conduct</h3>
          <p>
            Students are expected to adhere to the college's code of conduct when using online resources. abusive behavior or falsification of information will face disciplinary action.
          </p>

          <p className="text-sm text-gray-500 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
