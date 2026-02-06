import { useState, useEffect } from 'react';
import { addItem, STORAGE_KEYS } from '../utils/adminStorage';
import PageHero from '../components/PageHero';
import logo from '../assets/punjab-college-logo.png';
import { X, CheckCircle, FileText, AlertCircle } from 'lucide-react';

const Admissions = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
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

  const [admissionsOpen, setAdmissionsOpen] = useState(true);
  const [isCheckingAdmissions, setIsCheckingAdmissions] = useState(true);
  const [showRequirementsNotification, setShowRequirementsNotification] = useState(false);
  const [notificationData, setNotificationData] = useState(null);

  // Check if admissions are open (from API - global setting)
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/settings/admissionsOpen');
        const data = await response.json();
        if (data.success) {
          // If value is explicitly false, close admissions
          setAdmissionsOpen(data.data.value !== false);
        }
      } catch (error) {
        console.error('Failed to check admissions status:', error);
        // Fallback to localStorage if API fails
        const settings = localStorage.getItem('admin_settings');
        if (settings) {
          const parsed = JSON.parse(settings);
          setAdmissionsOpen(parsed.admissionsOpen !== false);
        }
      } finally {
        setIsCheckingAdmissions(false);
      }
    };
    checkStatus();

    // Fetch admission notification settings from API
    const fetchNotificationSettings = async () => {
      try {
        const response = await fetch('/api/admission-notification');
        const data = await response.json();
        if (data.success && data.data) {
          setNotificationData(data.data);
          // Show notification if enabled and not seen in this session
          const hasSeenRequirements = sessionStorage.getItem('has_seen_admission_requirements');
          if (!hasSeenRequirements && data.data.enabled !== false) {
            setTimeout(() => {
              setShowRequirementsNotification(true);
              sessionStorage.setItem('has_seen_admission_requirements', 'true');
            }, 1000);
          }
        }
      } catch (error) {
        console.error('Failed to fetch admission notification:', error);
        // Show default notification
        const hasSeenRequirements = sessionStorage.getItem('has_seen_admission_requirements');
        if (!hasSeenRequirements) {
          setTimeout(() => {
            setShowRequirementsNotification(true);
            sessionStorage.setItem('has_seen_admission_requirements', 'true');
          }, 1000);
        }
      }
    };
    fetchNotificationSettings();
  }, []);

  const requirements = [
    'Matriculation / O-Level Result Card',
    'Character Certificate',
    'CNIC / B-Form of Student',
    'CNIC of Father/Guardian',
    'Recent Photographs (Passport size)',
  ];

  const process = [
    { step: 1, title: 'Online Registration', desc: 'Complete the digital application portal.' },
    { step: 2, title: 'Submission', desc: 'Upload required documents for verification.' },
    { step: 3, title: 'Merit Assessment', desc: 'Evaluation based on academic record.' },
    { step: 4, title: 'Fee Deposit', desc: 'Pay dues to confirm your seat.' },
    { step: 5, title: 'Enrollment', desc: 'Receive roll number and ID card.' },
  ];

  const importantDates = [
    { event: 'Admissions Open', date: 'Jan 15, 2025' },
    { event: 'Deadline', date: 'Mar 31, 2025' },
    { event: 'Merit List', date: 'May 01, 2025' },
    { event: 'Classes Start', date: 'Jun 01, 2025' },
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
      // Create admission object matching backend schema
      const admissionData = {
        fullName: formData.fullName,
        fatherName: formData.fatherName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: {
          ...formData.address,
          country: formData.address.country || 'Pakistan',
          state: formData.address.state || 'Punjab'
        },
        academic: formData.academic,
        program: formData.program,
        documents: formData.documents,
        enrolledSubjects: enrolledBooks
      };

      const response = await fetch('/api/admissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(admissionData)
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Submission failed');
      }

      setSuccess(`Application submitted successfully! Your Application ID: ${data.data.applicationId}`);

      // Reset form
      setFormData({
        fullName: '',
        fatherName: '',
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
    <>
      {/* Requirements Notification Modal */}
      {showRequirementsNotification && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 xs:p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowRequirementsNotification(false)}
        >
          <div
            className="relative w-full max-w-[92vw] xs:max-w-[85vw] sm:max-w-md max-h-[85vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-700 flex flex-col mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowRequirementsNotification(false)}
              className="absolute right-2 top-2 sm:right-3 sm:top-3 p-2 sm:p-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white rounded-full transition-all z-20"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center p-4 xs:p-5 sm:p-6">
              {/* Logo */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 mb-3 relative">
                <div className="absolute inset-0 bg-white rounded-full ring-2 ring-primary-500 shadow-lg"></div>
                <img src={logo} alt="Punjab College Logo" className="w-full h-full object-contain relative z-10" />
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">
                Admission Requirements
              </h2>
              <span className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                {notificationData?.session || 'Session 2025-2027'}
              </span>

              {/* Requirements List */}
              <div className="w-full text-left space-y-2 mb-4">
                {(notificationData?.requirements || requirements).map((req, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{req}</span>
                  </div>
                ))}
              </div>

              {/* Important Note */}
              <div className="w-full p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 mb-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 dark:text-amber-300 text-left">
                    {notificationData?.importantNote || 'Please bring original documents along with photocopies to the admission office.'}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setShowRequirementsNotification(false)}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold text-sm py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                {notificationData?.buttonText || 'Continue to Application'}
              </button>
            </div>

            {/* Bottom Accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700"></div>
          </div>
        </div>
      )}
      {/* Loading while checking admissions status */}
      {isCheckingAdmissions ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : !admissionsOpen ? (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-5 sm:p-8 text-center border border-gray-200 dark:border-gray-700">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Admissions Closed
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
                We are not currently accepting admission applications.
              </p>

              {/* Contact Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4 mb-4">
                <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-200 font-semibold mb-2">
                  For Inquiries
                </p>
                <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300">
                  Email: <span className="font-semibold">admissions@punjabcollege.edu.pk</span>
                </p>
                <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300 mt-1">
                  Phone: <span className="font-semibold">+92-300-1234567</span>
                </p>
              </div>

              {/* PGC Branding */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-center mb-3">
                  <img src={logo} alt="Punjab College Logo" className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
                </div>
                <p className="text-sm sm:text-base font-bold text-primary-700 dark:text-primary-400">
                  Punjab Group of Colleges
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Excellence in Education
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="min-h-screen">
            {/* Hero Section */}
            <PageHero
              title="Admissions"
              subtitle="Start your journey towards academic excellence. Apply now and join our vibrant community of learners."
            />

            <div className="px-3 sm:px-4 py-4 sm:py-6 bg-gray-50 dark:bg-gray-900">
              <div className="max-w-7xl mx-auto">

                {/* Success View */}
                {success ? (
                  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 shadow-lg">
                      <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Submission Successful</h2>
                    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        Your admission form is submitted successfully. Please bring the <span className="font-bold text-gray-900 dark:text-white">original documents</span> and a set of their <span className="font-bold text-gray-900 dark:text-white">photocopies</span> to the college admission office.
                      </p>
                      <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-100 dark:border-primary-800">
                        <p className="text-sm font-semibold text-primary-800 dark:text-primary-300">
                          Admissions Office Hours: 08:00 AM - 04:00 PM (Mon-Sat)
                        </p>
                      </div>
                      <button
                        onClick={() => setSuccess(false)}
                        className="mt-8 px-8 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                      >
                        Submit Another Application
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Error Message */}
                    {/* Error Message */}
                    {error && (
                      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 sm:gap-3 text-red-700 dark:text-red-400 animate-fade-in text-sm">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Application Form */}
                    <section className="mb-8 sm:mb-12 card animate-slide-in">
                      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-gray-100">Apply Now</h2>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Section: Personal & Contact Details */}
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <span className="w-1 h-6 bg-primary-600 rounded-full"></span>
                            Personal Details
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="form-group">
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name *</label>
                              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-3 py-2 text-sm border focus:ring-1 focus:ring-primary-500 rounded-md bg-gray-50 dark:bg-gray-900 dark:border-gray-700 transition-colors outline-none" placeholder="Enter your name" />
                            </div>
                            <div className="form-group">
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Father's Name *</label>
                              <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required className="w-full px-3 py-2 text-sm border focus:ring-1 focus:ring-primary-500 rounded-md bg-gray-50 dark:bg-gray-900 dark:border-gray-700 transition-colors outline-none" placeholder="Father's Name" />
                            </div>
                            <div className="form-group">
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date of Birth *</label>
                              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className="w-full px-3 py-2 text-sm border focus:ring-1 focus:ring-primary-500 rounded-md bg-gray-50 dark:bg-gray-900 dark:border-gray-700 transition-colors outline-none" />
                            </div>
                            <div className="form-group">
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Gender *</label>
                              <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full px-3 py-2 text-sm border focus:ring-1 focus:ring-primary-500 rounded-md bg-gray-50 dark:bg-gray-900 dark:border-gray-700 transition-colors outline-none">
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</label>
                              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 text-sm border focus:ring-1 focus:ring-primary-500 rounded-md bg-gray-50 dark:bg-gray-900 dark:border-gray-700 transition-colors outline-none" placeholder="Enter Email" />
                            </div>
                            <div className="form-group">
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone *</label>
                              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-3 py-2 text-sm border focus:ring-1 focus:ring-primary-500 rounded-md bg-gray-50 dark:bg-gray-900 dark:border-gray-700 transition-colors outline-none" placeholder="+92..." />
                            </div>
                          </div>

                          {/* Address Compact */}
                          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Residential Address</label>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                              <input type="text" name="address.street" value={formData.address.street} onChange={handleChange} required className="md:col-span-2 w-full px-3 py-2 text-sm border focus:ring-1 focus:ring-primary-500 rounded-md bg-gray-50 dark:bg-gray-900 dark:border-gray-700 outline-none" placeholder="Street Address" />
                              <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} required className="w-full px-3 py-2 text-sm border focus:ring-1 focus:ring-primary-500 rounded-md bg-gray-50 dark:bg-gray-900 dark:border-gray-700 outline-none" placeholder="City" />
                              <input type="text" name="address.postalCode" value={formData.address.postalCode} onChange={handleChange} required className="w-full px-3 py-2 text-sm border focus:ring-1 focus:ring-primary-500 rounded-md bg-gray-50 dark:bg-gray-900 dark:border-gray-700 outline-none" placeholder="Postal Code" />
                            </div>
                          </div>
                        </div>

                        {/* Section: Academic & Program */}
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <span className="w-1 h-6 bg-secondary-600 rounded-full"></span>
                            Academic & Program
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="form-group md:col-span-2">
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Previous Institution *</label>
                              <input type="text" name="academic.previousSchool" value={formData.academic.previousSchool} onChange={handleChange} required className="w-full px-3 py-2 text-sm border focus:ring-1 focus:ring-primary-500 rounded-md bg-gray-50 dark:bg-gray-900 dark:border-gray-700 outline-none" placeholder="School/College Name" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Year *</label>
                                <input type="text" name="academic.graduationYear" value={formData.academic.graduationYear} onChange={handleChange} required className="w-full px-3 py-2 text-sm border focus:ring-1 focus:ring-primary-500 rounded-md bg-gray-50 dark:bg-gray-900 dark:border-gray-700 outline-none" placeholder="YYYY" />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Marks/GPA *</label>
                                <input type="text" name="academic.gpa" value={formData.academic.gpa} onChange={handleChange} required className="w-full px-3 py-2 text-sm border focus:ring-1 focus:ring-primary-500 rounded-md bg-gray-50 dark:bg-gray-900 dark:border-gray-700 outline-none" placeholder="e.g. 85%" />
                              </div>
                            </div>

                            {/* Program Selectors */}
                            <div>
                              <label className="block text-xs font-semibold text-primary-600 uppercase tracking-wider mb-1">Desired Program *</label>
                              <select name="program.desiredCourse" value={formData.program.desiredCourse} onChange={handleChange} required className="w-full px-3 py-2 text-sm font-semibold border-primary-200 border-2 focus:ring-1 focus:ring-primary-500 rounded-md bg-white dark:bg-gray-900 text-primary-700 outline-none">
                                <option value="">Select Program</option>
                                {courses.map(course => <option key={course} value={course}>{course}</option>)}
                              </select>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Session *</label>
                              <div className="flex gap-3">
                                {terms.map(term => (
                                  <label key={term} className={`flex-1 cursor-pointer border rounded-md p-2 text-center text-xs font-medium transition-all ${formData.program.preferredTerm === term ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                                    <input type="radio" name="program.preferredTerm" value={term} checked={formData.program.preferredTerm === term} onChange={handleChange} className="hidden" />
                                    {term}
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Enrolled Books Compact */}
                          {enrolledBooks.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 animate-fade-in">
                              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Subjects included in {formData.program.desiredCourse}:</p>
                              <div className="flex flex-wrap gap-2">
                                {enrolledBooks.map((book, index) => (
                                  <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-secondary-50 text-secondary-700 border border-secondary-100">
                                    {book}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Section: Documents Compact */}
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                            Required Documents
                          </h3>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                              { id: 'profilePicture', label: 'Profile Photo', icon: 'User' },
                              { id: 'matricResultCard', label: 'Matric Result', icon: 'FileText' },
                              { id: 'cnicPicture', label: 'B-Form / CNIC', icon: 'CreditCard' }
                            ].map((doc) => (
                              <div key={doc.id} className="relative">
                                <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-all ${previews[doc.id]
                                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                  : 'border-gray-300 hover:border-primary-400 bg-gray-50 hover:bg-white'
                                  }`}>
                                  {previews[doc.id] ? (
                                    <div className="relative w-full h-full p-1 group">
                                      <img src={previews[doc.id]} alt="Preview" className="w-full h-full object-cover rounded-md opacity-80 group-hover:opacity-100 transition-opacity" />
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                        <span className="text-white text-xs font-bold">Change</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center text-gray-400">
                                      <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                      <span className="text-xs font-semibold">{doc.label}</span>
                                    </div>
                                  )}
                                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, doc.id)} disabled={uploading} />
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>    {uploading && (
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-2 text-blue-700 dark:text-blue-400">
                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm">Uploading document...</span>
                          </div>
                        )}


                        {/* Submit Button */}
                        <div className="flex justify-center pt-2 sm:pt-4">
                          <button
                            type="submit"
                            disabled={loading || uploading}
                            className="btn-primary bg-primary-600 hover:bg-primary-700 active:bg-primary-800 px-8 sm:px-12 py-3 sm:py-4 text-sm sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
                          >
                            {loading ? 'Submitting...' : 'Submit Application'}
                          </button>
                        </div>
                      </form>
                    </section>


                    {/* Info Grid: Process, Requirements, Dates */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                      {/* Admission Process - Compact Vertical */}
                      <div className="lg:col-span-4 card animate-slide-in">
                        <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-2">Admission Process</h2>
                        <div className="space-y-4">
                          {process.map((item, index) => (
                            <div key={item.step} className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold ring-2 ring-white dark:ring-gray-800">
                                  {item.step}
                                </div>
                                {index < process.length - 1 && <div className="w-px h-full bg-gray-200 dark:bg-gray-700 my-1"></div>}
                              </div>
                              <div className="pb-2">
                                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.title}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{item.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Column: Requirements & Dates */}
                      <div className="lg:col-span-8 space-y-6">
                        {/* Requirements */}
                        <div className="card animate-slide-in p-4 sm:p-5">
                          <h2 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-2">Requirements</h2>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                            {requirements.map((req, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{req}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Important Dates */}
                        <div className="card animate-slide-in p-4 sm:p-5" style={{ animationDelay: '0.1s' }}>
                          <h2 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-2">Schedule</h2>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {importantDates.map((item, index) => (
                              <div key={index} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2 text-center border border-gray-100 dark:border-gray-700">
                                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-tighter mb-1">{item.event}</div>
                                <div className="text-sm font-bold text-primary-700 dark:text-primary-400">{item.date}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Need Help Compact */}
                        <div className="bg-secondary-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg animate-slide-in">
                          <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-2 rounded-lg">
                              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 9v4l3 3" /></svg>
                            </div>
                            <div>
                              <h4 className="font-bold text-sm">Need Assistance?</h4>
                              <p className="text-xs text-gray-300">Admissions Office is online.</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <a href="mailto:Prof.FTAPCIT0033@pgc.edu.pk" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-xs font-medium transition-colors">
                              Email Us
                            </a>
                            <a href="tel:+923072280505" className="px-3 py-1.5 bg-primary-600 hover:bg-primary-500 rounded text-xs font-bold transition-colors shadow-md">
                              Call Now
                            </a>
                          </div>
                        </div>

                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )
      }
    </>
  );
}; export default Admissions;
