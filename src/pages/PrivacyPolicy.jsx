import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 md:p-12 animate-fade-in">
        <h1 className="text-4xl font-serif font-bold text-primary-900 dark:text-white mb-8 border-b-2 border-primary-100 pb-4">
          Privacy Policy
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 font-sans">
          <p className="lead text-xl">
            At Punjab College, we value your privacy and are committed to protecting your personal information.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-8 mb-4">Information We Collect</h3>
          <p>
            We collect information primarily to provide better services to our students and faculty. 
            This typically includes student admission details, academic records, and contact information necessary for communication.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-8 mb-4">How We Use Your Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>To manage academic records and student progress.</li>
            <li>To communicate important college announcements and updates.</li>
            <li>To improve our website functionality and user experience.</li>
          </ul>

          <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-8 mb-4">Data Security</h3>
          <p>
            We implement appropriate technical and organizational security measures to protect your data against unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-8 mb-4">Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy, please contact the administration office.
          </p>
          
          <p className="text-sm text-gray-500 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
