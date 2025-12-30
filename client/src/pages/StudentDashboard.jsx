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
      // Only show visible error if we don't have any data (no cache, fail fetch)
      // If we have cached data (isBackgroundUpdate=true), we might want to just log it or show a toast, 
      // but for now let's only set Error state if we have nothing to show.
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
      <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Skeleton Header */}
          <div className="mb-8 animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
          </div>

          {/* Skeleton Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              </div>
            </div>
          </div>

          {/* Skeleton Tab Navigation */}
          <div className="flex gap-2 mb-6 overflow-x-auto animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-32"></div>
            ))}
          </div>

          {/* Skeleton Content Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 animate-pulse">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            ))}
          </div>

          {/* Loading hint */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading your portal data... This may take a few seconds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !portalData) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8">
            <svg className="w-16 h-16 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-red-900 dark:text-red-200 mb-2">Error Loading Portal</h2>
            <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
            <button onClick={fetchPortalData} className="btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { student, admission, courses, academics, grades, announcements, fees, resources } = portalData;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl shadow-xl p-4 md:p-6 mb-6 text-white relative overflow-hidden ring-1 ring-white/10">
          {/* Decorative Elements - Modern & Subtle */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-500/10 rounded-full blur-2xl transform -translate-x-1/3 translate-y-1/3" />

          <div className="flex flex-col gap-5 relative z-10">
            {/* Top Row: Profile & Info */}
            <div className="flex flex-row items-center gap-4 md:gap-6">
              {/* Profile Picture */}
              <div className="relative group shrink-0">
                <div className="relative">
                  {student.profilePicture || admission?.documents?.profilePicture ? (
                    <img
                      src={student.profilePicture || admission?.documents?.profilePicture}
                      alt="Profile"
                      className="w-16 h-16 md:w-24 md:h-24 rounded-full border-[3px] border-white/90 shadow-lg object-cover ring-2 ring-primary-500/30"
                    />
                  ) : (
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-[3px] border-white/90 shadow-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-8 h-8 md:w-12 md:h-12 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  {/* Edit Button */}
                  <button
                    onClick={() => setShowProfilePictureModal(true)}
                    className="absolute bottom-0 right-0 bg-secondary-500 hover:bg-secondary-600 text-white rounded-full p-1.5 md:p-2 shadow-lg transition-all transform hover:scale-110 border-2 border-primary-900"
                    title="Update profile picture"
                  >
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Student Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl md:text-3xl font-bold mb-1.5 truncate">{student.name}</h1>
                <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-white/90">
                  <span className="bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 truncate max-w-[150px] md:max-w-none">
                    {student.studentId}
                  </span>
                  {student.class && (
                    <span className="bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 hidden md:inline-block">
                      {student.class}
                    </span>
                  )}
                  <span className="text-white/60 hidden md:inline">•</span>
                  <span className="text-white/80 truncate hidden md:inline">{student.email}</span>
                </div>
                {/* Mobile only extra info line */}
                <div className="md:hidden mt-2 flex items-center gap-2 text-[11px] text-white/70">
                  <span className="truncate">{student.class}</span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              {/* GPA Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 md:p-4 border border-white/10 shadow-lg hover:bg-white/15 transition-all group">
                <div className="flex flex-col items-center">
                  <div className="text-2xl md:text-4xl font-bold text-white mb-0.5 tracking-tight group-hover:scale-110 transition-transform">{academics.currentGPA}</div>
                  <div className="text-[10px] md:text-xs font-medium text-white/80 uppercase tracking-wider">GPA</div>
                </div>
              </div>

              {/* Attendance Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 md:p-4 border border-white/10 shadow-lg hover:bg-white/15 transition-all group">
                <div className="flex flex-col items-center">
                  <div className="text-2xl md:text-4xl font-bold text-white mb-0.5 tracking-tight group-hover:scale-110 transition-transform">{academics.attendancePercentage}%</div>
                  <div className="text-[10px] md:text-xs font-medium text-white/80 uppercase tracking-wider">Attendance</div>
                </div>
              </div>

              {/* Courses Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 md:p-4 border border-white/10 shadow-lg hover:bg-white/15 transition-all group">
                <div className="flex flex-col items-center">
                  <div className="text-2xl md:text-4xl font-bold text-white mb-0.5 tracking-tight group-hover:scale-110 transition-transform">{courses.length}</div>
                  <div className="text-[10px] md:text-xs font-medium text-white/80 uppercase tracking-wider">Courses</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 overflow-x-auto">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'overview', label: 'Overview', icon: '🏠' },
              { id: 'admission', label: 'Admission Record', icon: '📄' },
              { id: 'academics', label: 'Academics', icon: '📚' },
              { id: 'resources', label: 'Resources', icon: '🔧' },
              { id: 'announcements', label: 'Announcements', icon: '📢' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${activeTab === tab.id
                  ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Animation Styles */}
          <style>{`
            @keyframes scrollUp {
              0% { transform: translateY(0); }
              100% { transform: translateY(-100%); }
            }
            .announcement-scroll-container {
              animation: scrollUp 20s linear infinite;
            }
            .announcement-scroll-container:hover {
              animation-play-state: paused;
            }
          `}</style>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Announcements Section - Main Feature */}
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-gradient-to-br from-indigo-900 to-primary-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden h-full">
                    {/* Decorative BG */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                          <span className="bg-white/20 p-1.5 rounded-lg text-lg">📢</span>
                          Latest Announcements
                        </h2>
                        <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">{announcements.length} New</span>
                      </div>

                      <div className="relative h-48 overflow-hidden mask-gradient-b flex-1">
                        <div className="announcement-scroll-container space-y-2">
                          {[...announcements, ...announcements].map((announcement, idx) => (
                            <div
                              key={`${announcement.id}-${idx}`}
                              onClick={() => setSelectedAnnouncement(announcement)}
                              className="bg-white/5 hover:bg-white/10 border-b border-white/5 p-2 rounded-lg cursor-pointer transition-all duration-300 group flex items-start gap-3"
                            >
                              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${announcement.type === 'exam' ? 'bg-red-400' :
                                announcement.type === 'facility' ? 'bg-blue-400' : 'bg-emerald-400'
                                }`}></div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm text-white/90 group-hover:text-amber-300 transition-colors truncate">{announcement.title}</h3>
                                <p className="text-white/50 text-[10px] truncate">{announcement.message}</p>
                              </div>
                              <span className="text-[9px] text-white/40 whitespace-nowrap">{new Date(announcement.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Fee & Quick Actions */}
                <div className="space-y-4">
                  {/* Fee Status Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700/50 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-15 -mr-8 -mt-8 ${fees.status === 'Paid' ? 'bg-emerald-500' : 'bg-red-500'
                      }`}></div>

                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2 relative z-10">
                      <span className="text-xl">💳</span> Fee Status
                    </h2>

                    <div className="space-y-2 relative z-10">
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 flex justify-between items-center">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Total Payable</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">Rs. {fees.totalDue.toLocaleString()}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center">
                          <p className="text-[9px] text-emerald-600 dark:text-emerald-400 uppercase font-bold">Paid</p>
                          <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{fees.paid.toLocaleString()}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-center">
                          <p className="text-[9px] text-red-600 dark:text-red-400 uppercase font-bold">Remaining</p>
                          <p className="text-sm font-bold text-red-700 dark:text-red-300">{fees.remaining.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className={`flex items-center justify-between p-2 rounded-lg border ${fees.status === 'Paid'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-amber-50 border-amber-200 text-amber-700'
                        }`}>
                        <span className="font-bold text-xs flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${fees.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                          {fees.status}
                        </span>
                        <span className="text-[10px] font-medium opacity-80">Due: {fees.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions Grid */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700/50">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <span>⚡</span> Quick Actions
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Video Lectures', icon: '🎥', link: '/digital-library/video-lectures', color: 'pink' },
                        { label: 'Digital Library', icon: '📚', link: '/digital-library', color: 'blue' },
                        { label: 'Exam Results', icon: '📊', link: '/results', color: 'purple' },
                        { label: 'My Timetable', icon: '📅', link: '/timetable', color: 'orange' }
                      ].map((action, idx) => (
                        <Link
                          key={idx}
                          to={action.link}
                          className={`flex flex-col items-center justify-center p-2.5 rounded-lg bg-${action.color}-50 dark:bg-${action.color}-900/20 hover:bg-${action.color}-100 dark:hover:bg-${action.color}-900/40 transition-colors group`}
                        >
                          <span className="text-xl mb-0.5 group-hover:scale-110 transition-transform">{action.icon}</span>
                          <span className={`text-[10px] font-bold text-${action.color}-700 dark:text-${action.color}-300 text-center leading-tight`}>{action.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admission Record Tab */}
          {activeTab === 'admission' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 animate-fade-in relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              {admission ? (
                <>
                  {/* Modern Header Ticket Style */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-700/50">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Admission Record</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Application ID: <span className="font-mono text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded">{admission.applicationId}</span></p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right hidden md:block">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Submission Date</p>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{new Date(admission.submittedAt).toLocaleDateString()}</p>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide shadow-sm ${admission.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : admission.status === 'pending'
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                        {admission.status.replace('_', ' ')}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    {/* Column 1: Personal & Contact */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span> Personal Details
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 space-y-3 border border-gray-100 dark:border-gray-700">
                          <div><p className="text-xs text-gray-500 uppercase">Full Name</p><p className="font-semibold text-gray-900 dark:text-gray-100">{admission.fullName}</p></div>
                          <div><p className="text-xs text-gray-500 uppercase">Father's Name</p><p className="font-medium text-gray-900 dark:text-gray-100">{admission.fatherName}</p></div>
                          <div><p className="text-xs text-gray-500 uppercase">Date of Birth</p><p className="font-medium text-gray-900 dark:text-gray-100">{new Date(admission.dateOfBirth).toLocaleDateString()}</p></div>
                          <div><p className="text-xs text-gray-500 uppercase">Gender</p><p className="font-medium text-gray-900 dark:text-gray-100 capitalize">{admission.gender}</p></div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Contact Info
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 space-y-3 border border-gray-100 dark:border-gray-700">
                          <div><p className="text-xs text-gray-500 uppercase">Email</p><p className="font-medium text-gray-900 dark:text-gray-100 truncate">{admission.email}</p></div>
                          <div><p className="text-xs text-gray-500 uppercase">Phone</p><p className="font-medium text-gray-900 dark:text-gray-100">{admission.phone}</p></div>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Address & Program */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Address
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 space-y-3 border border-gray-100 dark:border-gray-700">
                          <div><p className="text-xs text-gray-500 uppercase">Street</p><p className="font-medium text-gray-900 dark:text-gray-100">{admission.address.street}</p></div>
                          <div className="grid grid-cols-2 gap-2">
                            <div><p className="text-xs text-gray-500 uppercase">City</p><p className="font-medium text-gray-900 dark:text-gray-100">{admission.address.city}</p></div>
                            <div><p className="text-xs text-gray-500 uppercase">State</p><p className="font-medium text-gray-900 dark:text-gray-100">{admission.address.state || '-'}</p></div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div><p className="text-xs text-gray-500 uppercase">Postal Code</p><p className="font-medium text-gray-900 dark:text-gray-100">{admission.address.postalCode}</p></div>
                            <div><p className="text-xs text-gray-500 uppercase">Country</p><p className="font-medium text-gray-900 dark:text-gray-100">{admission.address.country}</p></div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Selected Program
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 space-y-3 border border-gray-100 dark:border-gray-700">
                          <div><p className="text-xs text-gray-500 uppercase">Course</p><p className="font-bold text-primary-700 dark:text-primary-400">{admission.program.desiredCourse}</p></div>
                          <div><p className="text-xs text-gray-500 uppercase">Term</p><p className="font-medium text-gray-900 dark:text-gray-100">{admission.program.preferredTerm}</p></div>
                        </div>
                      </div>
                    </div>

                    {/* Column 3: Academic History & Docs */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span> Academic History
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 space-y-3 border border-gray-100 dark:border-gray-700">
                          <div><p className="text-xs text-gray-500 uppercase">Previous School</p><p className="font-medium text-gray-900 dark:text-gray-100">{admission.academic.previousSchool}</p></div>
                          <div className="flex justify-between">
                            <div><p className="text-xs text-gray-500 uppercase">Year</p><p className="font-medium text-gray-900 dark:text-gray-100">{admission.academic.graduationYear}</p></div>
                            <div className="text-right"><p className="text-xs text-gray-500 uppercase">GPA/Marks</p><p className="font-bold text-gray-900 dark:text-gray-100">{admission.academic.gpa}</p></div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Documents
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                          {admission.documents.profilePicture && (
                            <div className="aspect-square rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden relative group cursor-pointer border border-gray-200 dark:border-gray-600">
                              <img src={admission.documents.profilePicture} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            </div>
                          )}
                          {admission.documents.matricResultCard && (
                            <div className="aspect-square rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden relative group cursor-pointer border border-gray-200 dark:border-gray-600">
                              <img src={admission.documents.matricResultCard} alt="Result" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            </div>
                          )}
                          {admission.documents.cnicPicture && (
                            <div className="aspect-square rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden relative group cursor-pointer border border-gray-200 dark:border-gray-600">
                              <img src={admission.documents.cnicPicture} alt="CNIC" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-center">Click to view document</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Application Found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">Start your journey with Punjab Group of Colleges today.</p>
                  <Link to="/admissions" className="btn-primary px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                    Start New Application
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Academics Tab */}
          {activeTab === 'academics' && (
            <div className="space-y-6 animate-fade-in">
              {/* Stats - Compact Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Current GPA', value: academics.currentGPA, color: 'from-purple-500 to-indigo-600', icon: '🎓' },
                  { label: 'Credits', value: academics.totalCredits, color: 'from-blue-500 to-cyan-600', icon: '📈' },
                  { label: 'Attendance', value: `${academics.attendancePercentage}%`, color: 'from-emerald-500 to-teal-600', icon: '📅' },
                  { label: 'Semester', value: academics.semester, color: 'from-orange-500 to-amber-600', icon: '⏳' }
                ].map((stat, idx) => (
                  <div key={idx} className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-white shadow-lg relative overflow-hidden group`}>
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10 text-center">
                      <div className="text-2xl font-bold tracking-tight mb-0.5">{stat.value}</div>
                      <div className="text-[10px] font-bold text-white/80 uppercase tracking-wider flex items-center justify-center gap-1.5">
                        <span className="opacity-80">{stat.icon}</span> {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Two Column Layout for Lists */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Enrolled Courses */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700/50 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-5 bg-blue-500 rounded-full"></span>
                      Enrolled Courses
                    </h3>
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-md uppercase tracking-wide">Fall 2024</span>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700/50 max-h-[300px] overflow-y-auto">
                    {courses.map((course, i) => (
                      <div key={course.code} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate group-hover:text-blue-600 transition-colors">{course.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                              <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded text-[10px]">{course.code}</span>
                              <span className="truncate">{course.instructor}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded whitespace-nowrap ml-2">{course.credits} Cr</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Grades */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700/50 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-5 bg-emerald-500 rounded-full"></span>
                      Recent Grades
                    </h3>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md uppercase tracking-wide">GPA: {academics.currentGPA}</span>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700/50 max-h-[300px] overflow-y-auto">
                    {grades.map((grade, index) => {
                      const gradeColor = grade.grade.startsWith('A') ? 'text-emerald-700 bg-emerald-50 border-emerald-100' :
                        grade.grade.startsWith('B') ? 'text-blue-700 bg-blue-50 border-blue-100' :
                          grade.grade.startsWith('C') ? 'text-yellow-700 bg-yellow-50 border-yellow-100' : 'text-red-700 bg-red-50 border-red-100';
                      return (
                        <div key={index} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors flex items-center justify-between">
                          <div className="min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">{grade.course}</h4>
                            <p className="text-[10px] text-gray-500 mt-0.5">{grade.semester} • {grade.credits} Credits</p>
                          </div>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm border ${gradeColor} ml-2 shrink-0`}>
                            {grade.grade}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-8 animate-fade-in">
              {/* Main Access Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Library Access', icon: '📚', status: resources.libraryAccess, desc: 'Digital & physical library resources', link: '/digital-library', color: 'blue' },
                  { title: 'Online Portal', icon: '💻', status: resources.onlinePortalAccess, desc: 'Student portal & online services', link: '/student-dashboard', color: 'purple' },
                  { title: 'Results', icon: '📊', status: 'active', desc: 'Check academic performance', link: '/results', color: 'emerald' },
                  { title: 'Email Access', icon: '📧', status: resources.emailAccess, desc: 'Official college email account', link: `mailto:${student.email}`, color: 'orange' },
                  { title: 'WiFi Access', icon: '📡', status: resources.wifiAccess, desc: 'Campus-wide internet connectivity', link: '#', color: 'cyan' },
                ].map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.link}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col"
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-${resource.color}-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>

                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className={`w-14 h-14 rounded-2xl bg-${resource.color}-50 dark:bg-${resource.color}-900/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300`}>
                        {resource.icon}
                      </div>
                      {resource.status && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${resource.status === 'active' || resource.status === true
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                          {resource.status === true ? 'Active' : resource.status === false ? 'Inactive' : resource.status}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-600 transition-colors relative z-10">{resource.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm relative z-10">{resource.desc}</p>
                  </a>
                ))}
              </div>

              {/* Downloads Section */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <span className="p-2 bg-white/10 rounded-lg">📥</span> Quick Downloads
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { title: 'Academic Calendar', icon: '📅', link: '/academic-calendar' },
                      { title: 'Class Timetable', icon: '🕐', link: '/timetable' },
                      { title: 'Course Syllabus', icon: '📄', link: '/course-syllabus' }
                    ].map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.link}
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 transition-all duration-300 border border-white/5 hover:border-white/20"
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <span className="font-semibold">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">All Announcements</h2>
              <div className="space-y-4">
                {announcements.map(announcement => (
                  <div
                    key={announcement.id}
                    className="border-l-4 border-primary-500 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-r-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{announcement.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${announcement.type === 'exam'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : announcement.type === 'facility'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                        {announcement.type}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{announcement.message}</p>
                    <div className="text-sm text-gray-500 dark:text-gray-500">
                      📅 {new Date(announcement.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Picture Update Modal */}
      {
        showProfilePictureModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Update Profile Picture</h2>
                <button
                  onClick={() => {
                    setShowProfilePictureModal(false);
                    setNewProfilePicture('');
                    setProfilePicturePreview('');
                    setUploadMessage({ type: '', text: '' });
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Success/Error Messages */}
              {uploadMessage.text && (
                <div className={`mb-4 p-4 rounded-lg border ${uploadMessage.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-400'
                  }`}>
                  <div className="flex items-center gap-2">
                    {uploadMessage.type === 'success' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className="text-sm">{uploadMessage.text}</span>
                  </div>
                </div>
              )}

              {/* Preview */}
              <div className="mb-6">
                <div className="flex justify-center mb-4">
                  {profilePicturePreview ? (
                    <img
                      src={profilePicturePreview}
                      alt="Preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary-500 shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full border-4 border-gray-300 dark:border-gray-600 border-dashed flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* File Input */}
                <label className="block">
                  <span className="sr-only">Choose profile photo</span>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG (MAX. 25KB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                        disabled={uploadingPicture}
                      />
                    </label>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfilePictureModal(false);
                    setNewProfilePicture('');
                    setProfilePicturePreview('');
                    setUploadMessage({ type: '', text: '' });
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  disabled={uploadingPicture}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateProfilePicture}
                  disabled={uploadingPicture || !newProfilePicture}
                  className="flex-1 px-4 py-3 bg-primary-800 text-white rounded-md font-semibold hover:bg-primary-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploadingPicture ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    'Update Picture'
                  )}
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

// Helper Components
const InfoField = ({ label, value }) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">{label}</div>
    <div className="text-gray-900 dark:text-gray-100 font-medium">{value}</div>
  </div>
);

const DocumentPreview = ({ title, imageUrl }) => (
  <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
    <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 font-semibold text-sm text-gray-900 dark:text-gray-100">
      {title}
    </div>
    <div className="p-2">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => window.open(imageUrl, '_blank')}
      />
    </div>
  </div>
);

const ResourceCard = ({ title, icon, status, description, link }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="text-4xl">{icon}</div>
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status
        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}>
        {status ? 'Active' : 'Inactive'}
      </span>
    </div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
    {link && link !== '#' && (
      <Link to={link} className="text-primary-600 dark:text-primary-400 text-sm font-semibold hover:underline">
        Access Now →
      </Link>
    )}
  </div>
);

const DownloadCard = ({ title, icon, link }) => (
  <Link to={link} className="bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center transition-colors block">
    <div className="text-3xl mb-2">{icon}</div>
    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</div>
  </Link>
);

export default StudentDashboard;
