import { useState } from 'react';

const Admissions = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    academic: {
      previousSchool: '',
      graduationYear: '',
      gpa: ''
    },
    program: {
      desiredCourse: '',
      preferredTerm: ''
    },
    documents: {
      profilePicture: '',
      matricResultCard: '',
      cnicPicture: ''
    }
  });

  const [enrolledBooks, setEnrolledBooks] = useState([]);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previews, setPreviews] = useState({
    profilePicture: '',
    matricResultCard: '',
    cnicPicture: ''
  });

  const requirements = [
    'High school diploma or equivalent',
    'Completed application form',
    'Academic transcripts',
    'Letter of recommendation',
    'Personal statement',
    'Valid ID proof',
  ];

  const process = [
    { step: 1, title: 'Submit Application', desc: 'Fill out the online application form with your details' },
    { step: 2, title: 'Document Verification', desc: 'Our team reviews your submitted documents' },
    { step: 3, title: 'Entrance Test', desc: 'Take the college entrance examination' },
    { step: 4, title: 'Interview', desc: 'Personal interview with admission committee' },
    { step: 5, title: 'Admission Offer', desc: 'Receive your admission decision' },
  ];

  const importantDates = [
    { event: 'Application Opens', date: 'January 15, 2025' },
    { event: 'Application Deadline', date: 'March 31, 2025' },
    { event: 'Entrance Test', date: 'April 15, 2025' },
    { event: 'Results Announcement', date: 'May 1, 2025' },
    { event: 'Classes Begin', date: 'June 1, 2025' },
  ];

  const courses = [
    'ICS',
    'FSc',
    'FA.IT',
    'FA'
  ];

  const terms = ['2025-2027', '2027-2029', '2029-2031'];

  // Course to Books mapping
  const courseBooks = {
    'ICS': [
      'English',
      'Computer Science',
      'Mathematics',
      'Physics',
      'Urdu',
      'Islamiyat',
      'Tarjuma tul Quran'
    ],
    'FSc': [
      'English',
      'Chemistry',
      'Physics',
      'Mathematics',
      'Urdu',
      'Islamiyat',
      'Tarjuma tul Quran'
    ],
    'FA.IT': [
      'English',
      'Information Technology',
      'Mathematics',
      'Urdu',
      'Islamiyat',
      'Tarjuma tul Quran'
    ],
    'FA': [
      'English',
      'Urdu',
      'Islamiyat',
      'Tarjuma tul Quran',
      'Pakistan Studies',
      'Economics'
    ]
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));

      // If the course is changed, update enrolled books
      if (name === 'program.desiredCourse') {
        const books = courseBooks[value] || [];
        setEnrolledBooks(books);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 25KB)
    if (file.size > 25 * 1024) {
      setError(`${fieldName} file size should be less than 25KB. Please compress your image.`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError(`Please upload an image file for ${fieldName}`);
      return;
    }

    setUploading(true);
    setError('');

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;

      // Update form data
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [fieldName]: base64String
        }
      }));

      // Update preview
      setPreviews(prev => ({
        ...prev,
        [fieldName]: base64String
      }));

      setUploading(false);
    };

    reader.onerror = () => {
      setError(`Failed to upload ${fieldName}`);
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/admissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          enrolledSubjects: enrolledBooks
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit application');
      }

      setSuccess(`Application submitted successfully! Your Application ID: ${data.data.applicationId}`);

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        },
        academic: {
          previousSchool: '',
          graduationYear: '',
          gpa: ''
        },
        program: {
          desiredCourse: '',
          preferredTerm: ''
        },
        documents: {
          profilePicture: '',
          matricResultCard: '',
          cnicPicture: ''
        }
      });

      // Reset enrolled books
      setEnrolledBooks([]);

      // Reset previews
      setPreviews({
        profilePicture: '',
        matricResultCard: '',
        cnicPicture: ''
      });

      // Scroll to success message
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Clear success message after 10 seconds
      setTimeout(() => setSuccess(''), 10000);

    } catch (err) {
      setError(err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 bg-secondary-700 text-white overflow-hidden h-[180px] md:h-[200px]">
        <div className="absolute inset-0 bg-black/25"></div>
        <div className="relative max-w-7xl mx-auto h-full flex items-center justify-center">
          <div className="text-center animate-fade-in w-full py-4">
            <h1 className="text-2xl md:text-4xl font-bold mt-20">Admissions</h1>
            <p className="text-sm md:text-base text-white/90 max-w-2xl mx-auto">
              Start your journey towards academic excellence. Apply now and join our vibrant community of learners.
            </p>
          </div>
        </div>
      </section>

      <div className="px-4 py-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3 text-green-700 dark:text-green-400 animate-fade-in">
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-700 dark:text-red-400 animate-fade-in">
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Application Form */}
          <section className="mb-12 card animate-slide-in">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Apply Now</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all outline-none"
                      placeholder="Zahid"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all outline-none"
                      placeholder="pgc@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all outline-none"
                      placeholder="+923001234567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all outline-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">Address</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all outline-none"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all outline-none"
                      placeholder="Fort Abbas"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all outline-none"
                      placeholder="Punjab"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address.postalCode"
                      value={formData.address.postalCode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all outline-none"
                      placeholder="62020"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all outline-none"
                      placeholder="Pakistan"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Background */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">Academic Background</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Previous School/Institution <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="academic.previousSchool"
                      value={formData.academic.previousSchool}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all outline-none"
                      placeholder="Govt High School Fort Abbas"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Graduation Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="academic.graduationYear"
                      value={formData.academic.graduationYear}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all outline-none"
                      placeholder="2025"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      GPA/Percentage <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="academic.gpa"
                      value={formData.academic.gpa}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all outline-none"
                      placeholder="85%"
                    />
                  </div>
                </div>
              </div>

              {/* Program Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">Program Selection</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Desired Course/Program <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="program.desiredCourse"
                      value={formData.program.desiredCourse}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all outline-none"
                    >
                      <option value="">Select Course</option>
                      {courses.map(course => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Preferred Start Term <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="program.preferredTerm"
                      value={formData.program.preferredTerm}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all outline-none"
                    >
                      <option value="">Select Term</option>
                      {terms.map(term => (
                        <option key={term} value={term}>{term}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Enrolled Books Section */}
              {enrolledBooks.length > 0 && (
                <div className="animate-fade-in">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">Enrolled Books</h3>
                  <div className="bg-secondary-50 dark:bg-secondary-900/20 p-6 rounded-lg border border-secondary-200 dark:border-secondary-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      The following books will be included in your <span className="font-semibold text-primary-600 dark:text-primary-400">{formData.program.desiredCourse}</span> program:
                    </p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {enrolledBooks.map((book, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="w-8 h-8 bg-secondary-700 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{book}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Document Uploads */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">Required Documents</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Profile Picture */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Profile Picture
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          {previews.profilePicture ? (
                            <div className="relative w-full h-full p-2">
                              <img src={previews.profilePicture} alt="Profile Preview" className="w-full h-full object-cover rounded-lg" />
                              <div className="absolute top-3 right-3 bg-primary-500 text-white p-1 rounded-full">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG (MAX. 25KB)</p>
                            </div>
                          )}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'profilePicture')}
                            disabled={uploading}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Matric Result Card */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Matric Result Card <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          {previews.matricResultCard ? (
                            <div className="relative w-full h-full p-2">
                              <img src={previews.matricResultCard} alt="Matric Card Preview" className="w-full h-full object-cover rounded-lg" />
                              <div className="absolute top-3 right-3 bg-primary-500 text-white p-1 rounded-full">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG (MAX. 25KB)</p>
                            </div>
                          )}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'matricResultCard')}
                            disabled={uploading}
                            required
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* CNIC Picture */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      CNIC Picture <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          {previews.cnicPicture ? (
                            <div className="relative w-full h-full p-2">
                              <img src={previews.cnicPicture} alt="CNIC Preview" className="w-full h-full object-cover rounded-lg" />
                              <div className="absolute top-3 right-3 bg-primary-500 text-white p-1 rounded-full">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                              </svg>
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG (MAX. 25KB)</p>
                            </div>
                          )}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'cnicPicture')}
                            disabled={uploading}
                            required
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {uploading && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Uploading document...</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="btn-primary bg-primary-600 hover:bg-primary-700 px-12 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </section>

          {/* Admission Process */}
          <section className="mb-12 animate-slide-in">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Admission Process</h2>
            <div className="relative">
              {process.map((item, index) => (
                <div key={item.step} className="flex gap-6 mb-8 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-secondary-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {item.step}
                    </div>
                    {index < process.length - 1 && (
                      <div className="w-0.5 h-16 bg-secondary-700 mt-2"></div>
                    )}
                  </div>
                  <div className="card flex-1 hover:scale-105 transition-transform">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Requirements & Important Dates */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Requirements */}
            <div className="card animate-slide-in">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Requirements</h2>
              <ul className="space-y-3">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-secondary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Important Dates */}
            <div className="card animate-slide-in" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Important Dates</h2>
              <div className="space-y-4">
                {importantDates.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{item.event}</span>
                    <span className="text-secondary-700 dark:text-secondary-400 font-medium">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <section className="mt-16 card text-center animate-slide-in bg-secondary-50 dark:bg-secondary-900/20">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Need Help?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Our admissions team is here to assist you throughout the process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:Prof.FTAPCIT0033@pgc.edu.pk" className="btn-primary bg-primary-600 hover:bg-primary-700 px-8 py-3 rounded-lg text-white font-bold transition-colors">
                Email Us
              </a>
              <a href="tel:+923072280505" className="btn-secondary border-2 border-secondary-700 text-secondary-700 hover:bg-secondary-700 hover:text-white px-8 py-3 rounded-lg font-bold transition-colors">
                Call:  (+92)307-2280505
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Admissions;
