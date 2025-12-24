import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
      navigate('/login');
      return;
    }

    fetchPortalData();
  }, [user, navigate]);

  const fetchPortalData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/student-portal/${user.email}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch portal data');
      }

      setPortalData(data.data);
    } catch (err) {
      setError(err.message);
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
      <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your portal...</p>
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
        <div className="bg-primary-900 rounded-xl shadow-lg p-8 mb-8 text-white relative overflow-hidden">
          {/* Decorative Circles - Mobile Only */}
          <div className="absolute top-0 left-0 w-32 h-32 md:hidden">
            <div className="absolute top-0 left-0 w-32 h-32 border-4 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 md:hidden">
            <div className="absolute top-0 right-0 w-32 h-32 border-4 border-white rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            {/* Profile Picture */}
            <div className="relative group">
              {student.profilePicture || admission?.documents?.profilePicture ? (
                <img
                  src={student.profilePicture || admission?.documents?.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white/20 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              {/* Edit Button */}
              <button
                onClick={() => setShowProfilePictureModal(true)}
                className="absolute bottom-0 right-0 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-2 shadow-lg transition-all transform hover:scale-110"
                title="Update profile picture"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>

            {/* Student Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{student.name}</h1>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  📧 {student.email}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  🎓 {student.studentId}
                </span>
                {student.class && (
                  <span className="bg-white/20 px-3 py-1 rounded-full">
                    📚 {student.class}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Stats - Modern Design */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {/* GPA Card */}
              <div className="bg-gradient-to-br from-purple-400/30 to-pink-500/30 backdrop-blur-sm rounded-xl p-4 border-2 border-purple-300/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-1 tracking-tight">{academics.currentGPA}</div>
                  <div className="text-xs md:text-sm font-semibold text-white/90 uppercase tracking-wider">GPA</div>
                </div>
              </div>
              {/* Attendance Card */}
              <div className="bg-gradient-to-br from-orange-400/30 to-amber-500/30 backdrop-blur-sm rounded-xl p-4 border-2 border-orange-300/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-1 tracking-tight">{academics.attendancePercentage}%</div>
                  <div className="text-xs md:text-sm font-semibold text-white/90 uppercase tracking-wider">Attendance</div>
                </div>
              </div>
              {/* Courses Card */}
              <div className="bg-gradient-to-br from-cyan-400/30 to-teal-500/30 backdrop-blur-sm rounded-xl p-4 border-2 border-cyan-300/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-1 tracking-tight">{courses.length}</div>
                  <div className="text-xs md:text-sm font-semibold text-white/90 uppercase tracking-wider">Courses</div>
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
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Current Courses */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span>📚</span> Current Courses
                </h2>
                <div className="space-y-3">
                  {courses.map(course => (
                    <div key={course.code} className="border-l-4 border-primary-500 pl-4 py-2 bg-gray-50 dark:bg-gray-700/50">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">{course.code} - {course.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {course.instructor} • {course.schedule}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Announcements - Auto Scroll */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 overflow-hidden">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span>📢</span> Recent Announcements
                </h2>
                <style>{`
                  @keyframes scrollUp {
                    0% {
                      transform: translateY(0);
                    }
                    100% {
                      transform: translateY(-100%);
                    }
                  }
                  .announcement-scroll-container {
                    animation: scrollUp 20s linear infinite;
                  }
                  .announcement-scroll-container:hover {
                    animation-play-state: paused;
                  }
                `}</style>
                <div className="relative h-64 overflow-hidden">
                  <div className="announcement-scroll-container">
                    {/* Duplicate announcements for seamless loop */}
                    {[...announcements, ...announcements].map((announcement, idx) => (
                      <div
                        key={`${announcement.id}-${idx}`}
                        onClick={() => setSelectedAnnouncement(announcement)}
                        className="mb-3 border-l-4 border-primary-500 pl-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{announcement.title}</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{announcement.message}</p>
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{announcement.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Announcement Modal */}
              {selectedAnnouncement && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedAnnouncement(null)}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    {/* Modal Header */}
                    <div className="sticky top-0 bg-secondary-700 px-6 py-4 flex items-center justify-between rounded-t-xl">
                      <h3 className="text-xl font-bold text-white">📢 Announcement Details</h3>
                      <button
                        onClick={() => setSelectedAnnouncement(null)}
                        className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{selectedAnnouncement.title}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedAnnouncement.type === 'exam'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : selectedAnnouncement.type === 'facility'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                          {selectedAnnouncement.type}
                        </span>
                      </div>

                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        📅 {new Date(selectedAnnouncement.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>

                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed whitespace-pre-line">
                          {selectedAnnouncement.message}
                        </p>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600 rounded-b-xl">
                      <button
                        onClick={() => setSelectedAnnouncement(null)}
                        className="btn-secondary w-full"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Fee Status */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span>💰</span> Fee Status
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Total Fee:</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">Rs. {fees.totalDue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Paid:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">Rs. {fees.paid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Remaining:</span>
                    <span className="font-bold text-red-600 dark:text-red-400">Rs. {fees.remaining.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${fees.status === 'Paid'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                      {fees.status}
                    </span>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Due Date: {fees.dueDate}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span>⚡</span> Quick Actions
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/library" className="btn-secondary text-center py-3">
                    📚 Library
                  </Link>
                  <Link to="/results" className="btn-secondary text-center py-3">
                    📊 Results
                  </Link>
                  <Link to="/timetable" className="btn-secondary text-center py-3">
                    🕐 Timetable
                  </Link>
                  <Link to="/courses" className="btn-secondary text-center py-3">
                    📖 Courses
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Admission Record Tab */}
          {activeTab === 'admission' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                Admission Application Record
              </h2>

              {admission ? (
                <div className="space-y-8">
                  {/* Application Status */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 border-l-4 border-green-500">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Application ID</h3>
                        <p className="text-xl font-mono text-primary-600 dark:text-primary-400">{admission.applicationId}</p>
                      </div>
                      <div className="text-right">
                        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Status</h3>
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold uppercase mt-1 ${admission.status === 'accepted'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                          : admission.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                            : admission.status === 'under_review'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                          }`}>
                          {admission.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100 border-b-2 border-primary-500 pb-2">
                      Personal Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      <InfoField label="Full Name" value={admission.fullName} />
                      <InfoField label="Email" value={admission.email} />
                      <InfoField label="Phone" value={admission.phone} />
                      <InfoField label="Date of Birth" value={new Date(admission.dateOfBirth).toLocaleDateString()} />
                      <InfoField label="Gender" value={admission.gender.charAt(0).toUpperCase() + admission.gender.slice(1)} />
                    </div>
                  </div>

                  {/* Address Information */}
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100 border-b-2 border-primary-500 pb-2">
                      Address
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      <InfoField label="Street" value={admission.address.street} />
                      <InfoField label="City" value={admission.address.city} />
                      <InfoField label="State/Province" value={admission.address.state || 'N/A'} />
                      <InfoField label="Postal Code" value={admission.address.postalCode} />
                      <InfoField label="Country" value={admission.address.country} />
                    </div>
                  </div>

                  {/* Academic Background */}
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100 border-b-2 border-primary-500 pb-2">
                      Academic Background
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      <InfoField label="Previous School" value={admission.academic.previousSchool} />
                      <InfoField label="Graduation Year" value={admission.academic.graduationYear} />
                      <InfoField label="GPA/Percentage" value={admission.academic.gpa} />
                    </div>
                  </div>

                  {/* Program Selection */}
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100 border-b-2 border-primary-500 pb-2">
                      Program Selection
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      <InfoField label="Desired Course" value={admission.program.desiredCourse} />
                      <InfoField label="Preferred Term" value={admission.program.preferredTerm} />
                    </div>
                  </div>

                  {/* Uploaded Documents */}
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100 border-b-2 border-primary-500 pb-2">
                      Submitted Documents
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {admission.documents.profilePicture && (
                        <DocumentPreview
                          title="Profile Picture"
                          imageUrl={admission.documents.profilePicture}
                        />
                      )}
                      {admission.documents.matricResultCard && (
                        <DocumentPreview
                          title="Matric Result Card"
                          imageUrl={admission.documents.matricResultCard}
                        />
                      )}
                      {admission.documents.cnicPicture && (
                        <DocumentPreview
                          title="CNIC Picture"
                          imageUrl={admission.documents.cnicPicture}
                        />
                      )}
                    </div>
                  </div>

                  {/* Submission Info */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-sm text-gray-600 dark:text-gray-400">
                    <p><strong>Submitted on:</strong> {new Date(admission.submittedAt).toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    No Admission Record Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    You haven't submitted an admission application yet.
                  </p>
                  <Link to="/admissions" className="btn-primary">
                    Apply Now
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Academics Tab */}
          {activeTab === 'academics' && (
            <div className="space-y-6">
              {/* Academic Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">{academics.currentGPA}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Current GPA</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">{academics.totalCredits}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Credits</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{academics.attendancePercentage}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Attendance</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{academics.semester}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Current Semester</div>
                </div>
              </div>

              {/* Enrolled Courses & Recent Grades - Minimalized in One Row */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Enrolled Courses - Compact */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <span className="text-blue-500">📚</span>
                      Enrolled Courses
                    </h3>
                  </div>
                  <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
                    {courses.map(course => (
                      <div
                        key={course.code}
                        className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs text-gray-900 dark:text-gray-100 truncate">
                            {course.code}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {course.name}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 ml-2">
                          {course.credits} cr
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Grades - Compact */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <span className="text-emerald-500">📊</span>
                      Recent Grades
                    </h3>
                  </div>
                  <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
                    {grades.map((grade, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs text-gray-900 dark:text-gray-100 truncate">
                            {grade.course}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {grade.semester} • {grade.credits} cr
                          </p>
                        </div>
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 ml-2">
                          {grade.grade}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Access Cards */}
              <ResourceCard
                title="Library Access"
                icon="📚"
                status={resources.libraryAccess}
                description="Access to physical and digital library resources"
                link="/library"
              />
              <ResourceCard
                title="Online Portal"
                icon="💻"
                status={resources.onlinePortalAccess}
                description="Access to student portal and online services"
                link="/student-dashboard"
              />
              <ResourceCard
                title="Results"
                icon="📊"
                status="active"
                description="Check your exam results and academic performance"
                link="/results"
              />
              <ResourceCard
                title="Email Access"
                icon="📧"
                status={resources.emailAccess}
                description="College email account for official communication"
                link={`mailto:${student.email}`}
              />
              <ResourceCard
                title="WiFi Access"
                icon="📡"
                status={resources.wifiAccess}
                description="On-campus wireless internet connectivity"
                link="#"
              />

              {/* Downloads Section */}
              <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Downloads</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <DownloadCard title="Academic Calendar" icon="📅" link="/academic-calendar" />
                  <DownloadCard title="Timetable" icon="🕐" link="/timetable" />
                  <DownloadCard title="Course Syllabus" icon="📄" link="/course-syllabus" />
                </div>
              </div>
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">All Announcements</h2>
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
      {showProfilePictureModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Update Profile Picture</h2>
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
      )}
    </div>
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
