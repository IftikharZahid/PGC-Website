import React from 'react';

const Accessibility = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 md:p-12 animate-fade-in">
        <h1 className="text-4xl font-serif font-bold text-primary-900 dark:text-white mb-8 border-b-2 border-primary-100 pb-4">
          Accessibility Statement
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 font-sans">
          <p className="lead text-xl">
            Punjab College is committed to ensuring digital accessibility for people with disabilities. 
            We are continually improving the user experience for everyone and applying the relevant accessibility standards.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-8 mb-4">Measures to Support Accessibility</h3>
          <p>
            We take the following measures to ensure accessibility of the Punjab College website:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Include accessibility as part of our mission statement.</li>
            <li>Ensure high color contrast for readability (e.g., our Maroon & White theme).</li>
            <li>Support keyboard navigation across the site.</li>
            <li>Provide text alternatives for images and non-text content.</li>
            <li>Support screen reader compatibility.</li>
          </ul>

          <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-8 mb-4">Feedback</h3>
          <p>
            We welcome your feedback on the accessibility of our website. Please let us know if you encounter accessibility barriers:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Phone:</strong> +92 (300) 1234567</li>
            <li><strong>Email:</strong> accessibility@college.edu</li>
            <li><strong>Visit:</strong> IT Department, Main Block</li>
          </ul>

          <p className="text-sm text-gray-500 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;
