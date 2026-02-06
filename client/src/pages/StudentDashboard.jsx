import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { getStudentData, setStudentData } from '../utils/studentStorage';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [portalData, setPortalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showProfilePictureModal, setShowProfilePictureModal] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState('');
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [uploadMessage, setUploadMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/student-login');
      return;
    }

    // Try to load from cache first for instant load
    const cachedData = getStudentData(user.email);
    if (cachedData) {
      setPortalData(cachedData);
      setLoading(false); // Immediate display
    }

    // Always fetch fresh data in background
    fetchPortalData(!!cachedData);
  }, [user, navigate]);

  const fetchPortalData = async (isBackgroundUpdate = false) => {
    try {
      if (!isBackgroundUpdate) {
        setLoading(true);
      }
      setError('');

      // Add timeout to prevent infinite loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`/api/student-portal/${user.email}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch portal data');
      }

      // Update state and cache
      setPortalData(data.data);
      setStudentData(user.email, data.data);

    } catch (err) {
      if (!isBackgroundUpdate) {
        if (err.name === 'AbortError') {
          setError('Request timed out. The server is taking too long to respond. Please check if the backend server is running.');
        } else if (err.message.includes('Failed to fetch')) {
          setError('Cannot connect to server. Please make sure the backend server is running on the correct port.');
        } else {
          setError(err.message);
        }
      }
      console.error('Portal fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 25KB)
    if (file.size > 25 * 1024) {
      setUploadMessage({ type: 'error', text: 'File size should be less than 25KB. Please compress your image.' });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadMessage({ type: 'error', text: 'Please upload an image file' });
      return;
    }

    setUploadMessage({ type: '', text: '' });
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setNewProfilePicture(base64String);
      setProfilePicturePreview(base64String);
    };
    reader.onerror = () => {
      setUploadMessage({ type: 'error', text: 'Failed to read image file' });
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfilePicture = async () => {
    if (!newProfilePicture) {
      setUploadMessage({ type: 'error', text: 'Please select an image first' });
      return;
    }

    setUploadingPicture(true);
    setUploadMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/students/update-profile-picture', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          profilePicture: newProfilePicture
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile picture');
      }

      setUploadMessage({ type: 'success', text: 'Profile picture updated successfully!' });

      // Refresh portal data to show new picture
      await fetchPortalData();

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowProfilePictureModal(false);
        setNewProfilePicture('');
        setProfilePicturePreview('');
        setUploadMessage({ type: '', text: '' });
      }, 2000);

    } catch (err) {
      setUploadMessage({ type: 'error', text: err.message });
    } finally {
      setUploadingPicture(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Skeleton Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 animate-pulse flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </div>
          {/* Skeleton Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse col-span-2"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !portalData) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Failed to Load Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">{error}</p>
          <button onClick={fetchPortalData} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { student, admission, courses, academics, grades, announcements, fees, resources } = portalData;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'admission', label: 'Admission', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'academics', label: 'Academics', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
    { id: 'resources', label: 'Resources', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: 'announcements', label: 'News', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Compact Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative group shrink-0">
              <div className="relative">
                {student.profilePicture || admission?.documents?.profilePicture ? (
                  <img
                    src={student.profilePicture || admission?.documents?.profilePicture}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700 group-hover:ring-primary-500 transition-all cursor-pointer"
                    onClick={() => setShowProfilePictureModal(true)}
                    title="Click to update picture"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xl font-bold border-2 border-white shadow-sm cursor-pointer hover:bg-primary-200 transition-all"
                    onClick={() => setShowProfilePictureModal(true)}
                  >
                    {student.name.charAt(0)}
                  </div>
                )}
                <button
                  onClick={() => setShowProfilePictureModal(true)}
                  className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-full p-1 shadow border border-gray-200 dark:border-gray-600 hover:text-primary-600"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">{student.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium truncate">{student.email}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">{student.studentId}</span>
                {student.class && <span className="text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded">{student.class}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-8 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {[
              { label: 'GPA', value: academics.currentGPA, icon: '🎓' },
              { label: 'Attendance', value: `${academics.attendancePercentage}%`, icon: '📊' },
              { label: 'Courses', value: courses.length, icon: '📚' }
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg min-w-[120px]">
                <div className="text-xl">{stat.icon}</div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">{stat.label}</div>
                  <div className="text-base font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
          <nav className="flex space-x-6 min-w-max" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all
                  ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'}
                `}
              >
                <svg className={`-ml-0.5 mr-2 h-5 w-5 ${activeTab === tab.id ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left Column: Announcements */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <span className="text-emerald-500">💳</span> Payment History
                    </h2>
                    <button className="text-xs font-semibold text-primary-600 hover:text-primary-700">View All</button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 dark:bg-gray-700/30 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                          <th className="px-4 py-3 rounded-l-lg">Date</th>
                          <th className="px-4 py-3">Description</th>
                          <th className="px-4 py-3">Ref ID</th>
                          <th className="px-4 py-3">Amount</th>
                          <th className="px-4 py-3 rounded-r-lg text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {[
                          { id: 1, date: '2024-01-15', description: 'Semester Spring 2024 Fee', amount: 45000, status: 'Paid', ref: 'INV-2024-001' },
                          { id: 2, date: '2023-12-01', description: 'Admission & Registration', amount: 15000, status: 'Paid', ref: 'INV-2023-099' },
                          { id: 3, date: '2024-02-10', description: 'Library Fine - Late Return', amount: 500, status: 'Pending', ref: 'INV-2024-005' },
                        ].map((payment) => (
                          <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                              {new Date(payment.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                              {payment.description}
                            </td>
                            <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                              {payment.ref}
                            </td>
                            <td className="px-4 py-3 font-bold text-gray-900 dark:text-gray-100">
                              Rs. {payment.amount.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                                ${payment.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                {payment.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quick Actions Grid */}
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-3 px-1">Quick Actions</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Video Lectures', icon: '🎥', link: '/digital-library/video-lectures', color: 'text-pink-600 bg-pink-50 hover:bg-pink-100' },
                      { label: 'Digital Library', icon: '📚', link: '/digital-library', color: 'text-blue-600 bg-blue-50 hover:bg-blue-100' },
                      { label: 'Exam Results', icon: '📊', link: '/results', color: 'text-purple-600 bg-purple-50 hover:bg-purple-100' },
                      { label: 'My Timetable', icon: '📅', link: '/timetable', color: 'text-orange-600 bg-orange-50 hover:bg-orange-100' }
                    ].map((action, idx) => (
                      <Link key={idx} to={action.link} className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${action.color} dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 border border-transparent dark:border-gray-700`}>
                        <span className="text-2xl mb-2">{action.icon}</span>
                        <span className="text-xs font-bold text-center">{action.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Fee Status & Info */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <span className="text-lg">💳</span> Fee Status
                  </h2>

                  <div className="text-center py-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-600 mb-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Total Payable</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">Rs. {fees.totalDue.toLocaleString()}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center mb-4">
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                      <div className="text-[10px] text-emerald-600 font-bold uppercase">Paid</div>
                      <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{fees.paid.toLocaleString()}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                      <div className="text-[10px] text-red-600 font-bold uppercase">Due</div>
                      <div className="text-sm font-bold text-red-700 dark:text-red-400">{fees.remaining.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg flex items-center justify-between text-xs font-bold
                     ${fees.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${fees.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                      Status: {fees.status}
                    </span>
                    <span className="opacity-75">Due: {fees.dueDate}</span>
                  </div>
                </div>

                {/* Compact Info Card */}
                <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-xl p-5 text-white shadow-lg overflow-hidden relative">
                  <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-1">Need Help?</h3>
                    <p className="text-primary-100 text-xs mb-4">Contact student affairs for any queries.</p>
                    <button className="w-full py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold transition-colors border border-white/10">
                      Contact Support
                    </button>
                  </div>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admission' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8 animate-fade-in">
              {admission ? (
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-gray-700 pb-5">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">Admission Record</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">Application ID:</span>
                        <span className="font-mono font-medium text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-900 dark:text-gray-200">{admission.applicationId}</span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                         ${admission.status === 'accepted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        admission.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {admission.status.replace('_', ' ')}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
                    <Section title="Personal Details">
                      <InfoRow label="Full Name" value={admission.fullName} />
                      <InfoRow label="Father's Name" value={admission.fatherName} />
                      <InfoRow label="Date of Birth" value={new Date(admission.dateOfBirth).toLocaleDateString()} />
                      <InfoRow label="Gender" value={admission.gender} />
                    </Section>

                    <Section title="Contact & Address">
                      <InfoRow label="Email" value={admission.email} />
                      <InfoRow label="Phone" value={admission.phone} />
                      <div className="grid grid-cols-2 gap-4">
                        <InfoRow label="City" value={admission.address.city} />
                        <InfoRow label="State" value={admission.address.state} />
                      </div>
                      <InfoRow label="Street" value={admission.address.street} />
                    </Section>

                    <Section title="Academic Info">
                      <InfoRow label="Program" value={admission.program.desiredCourse} />
                      <InfoRow label="Term" value={admission.program.preferredTerm} />
                      <InfoRow label="Previous School" value={admission.academic.previousSchool} />
                      <div className="grid grid-cols-2 gap-4">
                        <InfoRow label="Year" value={admission.academic.graduationYear} />
                        <InfoRow label="GPA/Marks" value={admission.academic.gpa} />
                      </div>
                    </Section>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Documents</h3>
                    <div className="flex flex-wrap gap-4">
                      {Object.entries(admission.documents).map(([key, url]) => url && (
                        <div key={key} className="group relative">
                          <a href={url} target="_blank" rel="noopener noreferrer" className="block w-24 h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 shadow-sm group-hover:shadow-md transition-all">
                            <img src={url} alt={key} className="w-full h-full object-cover" />
                          </a>
                          <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] py-1 text-center opacity-0 group-hover:opacity-100 transition-opacity truncate px-1">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-dashed border-gray-200 dark:border-gray-600">
                  <div className="text-4xl mb-3">📄</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No Admission Record</h3>
                  <p className="text-gray-500 text-sm mt-1">Contact administration if you believe this is an error.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'academics' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in">
              {/* Enrolled Courses */}
              <div className="xl:col-span-2 space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center sticky top-0">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <span className="text-blue-500">📚</span> Enrolled Courses
                    </h3>
                    <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded uppercase tracking-wide">
                      Fall 2024
                    </span>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {courses.length > 0 ? courses.map((course) => (
                      <div key={course.code} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm group-hover:text-blue-600 transition-colors">
                              {course.name}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500">
                              <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">
                                {course.code}
                              </span>
                              <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                {course.instructor}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full whitespace-nowrap">
                              {course.credits} Credits
                            </div>
                            <button className="text-gray-400 hover:text-blue-600 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="p-8 text-center text-gray-500 text-sm">No courses enrolled this semester.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Grades */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden h-fit">
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <span className="text-emerald-500">🏆</span> Recent Grades
                    </h3>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">CGPA: {academics.currentGPA}</span>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[500px] overflow-y-auto custom-scrollbar">
                    {grades.length > 0 ? grades.map((grade, idx) => (
                      <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="min-w-0 pr-4">
                          <div className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate" title={grade.course}>
                            {grade.course}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">{grade.semester}</div>
                        </div>
                        <div className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold shadow-sm border shrink-0
                                 ${grade.grade.startsWith('A') ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' :
                            grade.grade.startsWith('B') ? 'bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' :
                              'bg-gray-50 border-gray-100 text-gray-700 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-300'}`}>
                          {grade.grade}
                        </div>
                      </div>
                    )) : (
                      <div className="p-8 text-center text-gray-500 text-sm">No grades available yet.</div>
                    )}
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 text-center">
                    <Link to="/results" className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline">View Full Transcript</Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[
                  { title: 'Digital Library', icon: '📚', status: resources.libraryAccess, link: '/digital-library', desc: 'Access e-books, journals, and research papers from the college database.' },
                  { title: 'Video Lectures', icon: '🎥', status: 'active', link: '/digital-library/video-lectures', desc: 'Watch recorded lectures and supplementary video materials for your courses.' },
                  { title: 'Student Portal', icon: '💻', status: resources.onlinePortalAccess, link: '/student-dashboard', desc: 'Manage your profile, view attendance, and track fee status.' },
                  { title: 'Exam Results', icon: '📊', status: 'active', link: '/results', desc: 'Check your detailed academic performance, mid-terms, and final results.' },
                  { title: 'Class Timetable', icon: '📅', status: 'active', link: '/timetable', desc: 'View your weekly class schedule, room numbers, and timings.' },
                  { title: 'College Email', icon: '📧', status: resources.emailAccess, link: `mailto:${student.email}`, desc: 'Access your official college email account for communication.' },
                ].map((resource, idx) => (
                  <Link key={idx} to={resource.link.startsWith('mailto') ? '#' : resource.link}
                    onClick={resource.link.startsWith('mailto') ? (e) => { e.preventDefault(); window.location.href = resource.link; } : undefined}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-primary-100 dark:hover:border-primary-900 transition-all group h-full flex flex-col relative overflow-hidden">

                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                      <span className="text-6xl">{resource.icon}</span>
                    </div>

                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {resource.icon}
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                              ${(resource.status === 'active' || resource.status === true) ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                        {resource.status === true ? 'Active' : resource.status === false ? 'Inactive' : resource.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-600 transition-colors relative z-10">{resource.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1 relative z-10">{resource.desc}</p>

                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center text-xs font-semibold text-primary-600 dark:text-primary-400 relative z-10">
                      Access Now
                      <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="max-w-4xl mx-auto animate-fade-in">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Notice Board</h2>
                    <p className="text-sm text-gray-500 mt-1">Stay updated with the latest news and alerts.</p>
                  </div>
                  <div className="flex gap-2">
                    {['All', 'Exam', 'Facility', 'General'].map(filter => (
                      <button key={filter} className="hidden sm:block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <div className="shrink-0 flex sm:flex-col items-center gap-2 sm:gap-0 sm:w-16 text-center">
                          <span className="text-2xl font-bold text-gray-400 group-hover:text-primary-500 transition-colors">
                            {new Date(announcement.date).getDate()}
                          </span>
                          <span className="text-xs uppercase font-bold text-gray-400">
                            {new Date(announcement.date).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide
                                      ${announcement.type === 'exam' ? 'bg-red-100 text-red-700' :
                                announcement.type === 'facility' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {announcement.type}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-600 transition-colors">
                            {announcement.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            {announcement.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 text-center">
                  <button className="text-sm font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">Load More</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Picture Modal */}
      {showProfilePictureModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in relative">
            <button onClick={() => setShowProfilePictureModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">Update Profile Picture</h2>

            {uploadMessage.text && (
              <div className={`mb-4 p-3 rounded-lg text-sm border ${uploadMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                {uploadMessage.text}
              </div>
            )}

            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-700 mb-4 bg-gray-50 flex items-center justify-center">
                {profilePicturePreview ? (
                  <img src={profilePicturePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl text-gray-300">📷</span>
                )}
              </div>
              <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Choose Image
                <input type="file" className="hidden" accept="image/*" onChange={handleProfilePictureUpload} disabled={uploadingPicture} />
              </label>
              <p className="text-xs text-gray-400 mt-2">JPG, PNG (Max 25KB)</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowProfilePictureModal(false)} className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
              <button onClick={handleUpdateProfilePicture} disabled={!newProfilePicture || uploadingPicture} className="flex-1 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {uploadingPicture ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="space-y-4">
    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">{title}</h3>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase">{label}</p>
    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{value || '-'}</p>
  </div>
);

export default StudentDashboard;
