import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import TeacherProtectedRoute from './components/TeacherProtectedRoute';
import TeacherLayout from './components/teacher/TeacherLayout';
import Home from './pages/Home';
import Admissions from './pages/Admissions';
import Programs from './pages/Programs';
import StudentLogin from './pages/StudentLogin';
import Login from './pages/Login';

import AdminLogin from './pages/AdminLogin';
import Signup from './pages/Signup';
import StudentDashboard from './pages/StudentDashboard';
import AcademicCalendar from './pages/AcademicCalendar';
import Timetable from './pages/Timetable';
import CourseSyllabus from './pages/CourseSyllabus';
import Result from './pages/Result';
import VideoLectures from './pages/VideoLectures';
import DigitalLibrary from './pages/DigitalLibrary';
import About from './pages/About';
import Faculty from './pages/Faculty';
import CampusLife from './pages/CampusLife';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Accessibility from './pages/Accessibility';
import News from './pages/News';
import Events from './pages/Events';
import CareerServices from './pages/CareerServices';
import ContactResearch from './pages/ContactResearch';
import Seminars from './pages/Seminars';
import ResearchBreakthrough from './pages/ResearchBreakthrough';
import MaintenancePage from './pages/MaintenancePage';
import AdmissionsFall2025 from './pages/AdmissionsFall2025';
import PasswordReset from './pages/PasswordReset';
import DebugResults from './pages/DebugResults';
import NotFound from './pages/NotFound';

// Admin Pages - Lazy loaded for code splitting
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const StudentsPage = lazy(() => import('./pages/admin/StudentsPage'));
const TeachersPage = lazy(() => import('./pages/admin/TeachersPage'));
const CoursesPage = lazy(() => import('./pages/admin/CoursesPage'));
const ResultsPage = lazy(() => import('./pages/admin/ResultsPage'));
const AdmissionsPage = lazy(() => import('./pages/admin/AdmissionsPage'));
const AnnouncementsPage = lazy(() => import('./pages/admin/AnnouncementsPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const SalariesPage = lazy(() => import('./pages/admin/SalariesPage'));
const FeesPage = lazy(() => import('./pages/admin/FeesPage'));
const AdminVideoLectures = lazy(() => import('./pages/admin/AdminVideoLectures'));
const AdminGalleryPage = lazy(() => import('./pages/admin/AdminGalleryPage'));
const NotificationPage = lazy(() => import('./pages/admin/NotificationPage'));
const AdmissionNotificationPage = lazy(() => import('./pages/admin/AdmissionNotificationPage'));
const AttendancePage = lazy(() => import('./pages/admin/AttendancePage'));

// Teacher Pages - Lazy loaded for code splitting
const TeacherDashboard = lazy(() => import('./pages/teacher/TeacherDashboard'));
const TeacherClasses = lazy(() => import('./pages/teacher/TeacherClasses'));
const TeacherAttendance = lazy(() => import('./pages/teacher/TeacherAttendance'));
const TeacherAssignments = lazy(() => import('./pages/teacher/TeacherAssignments'));
const TeacherResults = lazy(() => import('./pages/teacher/TeacherResults'));
const TeacherProfile = lazy(() => import('./pages/teacher/TeacherProfile'));

import ScrollToTop from './components/ScrollToTop';
import PageLoader from './components/PageLoader';

function App() {
  // Check maintenance mode from API (global)
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isCheckingMaintenance, setIsCheckingMaintenance] = useState(true);

  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        const response = await fetch('/api/settings/maintenanceMode');
        const data = await response.json();
        if (data.success && data.data.value === true) {
          setIsMaintenanceMode(true);
        } else {
          setIsMaintenanceMode(false);
        }
      } catch (error) {
        console.error('Failed to check maintenance mode:', error);
        // Fallback to localStorage if API fails
        const savedSettings = localStorage.getItem('admin_settings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          setIsMaintenanceMode(settings.maintenanceMode || false);
        }
      } finally {
        setIsCheckingMaintenance(false);
      }
    };

    checkMaintenanceMode();
    // Re-check every 30 seconds
    const interval = setInterval(checkMaintenanceMode, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminProvider>
          <Router>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Admin routes - ALWAYS accessible regardless of maintenance mode */}
                <Route path="/admin" element={<><Navbar /><AdminLogin /><Footer /></>} />
                <Route element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/students" element={<StudentsPage />} />
                  <Route path="/admin/attendance" element={<AttendancePage />} />
                  <Route path="/admin/teachers" element={<TeachersPage />} />
                  <Route path="/admin/salaries" element={<SalariesPage />} />
                  <Route path="/admin/fees" element={<FeesPage />} />
                  <Route path="/admin/courses" element={<CoursesPage />} />
                  <Route path="/admin/video-lectures" element={<AdminVideoLectures />} />
                  <Route path="/admin/gallery" element={<AdminGalleryPage section="Home" />} />
                  <Route path="/admin/gallery/home" element={<AdminGalleryPage section="Home" />} />
                  <Route path="/admin/gallery/faculty" element={<AdminGalleryPage section="Faculty" />} />
                  <Route path="/admin/gallery/campus-life" element={<AdminGalleryPage section="Campus Life" />} />
                  <Route path="/admin/gallery/about" element={<AdminGalleryPage section="About" />} />
                  <Route path="/admin/gallery/seminars" element={<AdminGalleryPage section="Seminars" />} />
                  <Route path="/admin/gallery/research" element={<AdminGalleryPage section="Research" />} />
                  <Route path="/admin/results" element={<ResultsPage />} />
                  <Route path="/admin/admissions" element={<AdmissionsPage />} />
                  <Route path="/admin/announcements" element={<AnnouncementsPage />} />
                  <Route path="/admin/notification" element={<NotificationPage />} />
                  <Route path="/admin/admission-notification" element={<AdmissionNotificationPage />} />
                  <Route path="/admin/settings" element={<SettingsPage />} />
                </Route>

                {/* Teacher routes */}
                <Route element={<TeacherProtectedRoute><TeacherLayout /></TeacherProtectedRoute>}>
                  <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
                  <Route path="/teacher/classes" element={<TeacherClasses />} />
                  <Route path="/teacher/attendance" element={<TeacherAttendance />} />
                  <Route path="/teacher/assignments" element={<TeacherAssignments />} />
                  <Route path="/teacher/results" element={<TeacherResults />} />
                  <Route path="/teacher/profile" element={<TeacherProfile />} />
                </Route>

                {/* Public and Student routes - show maintenance page if enabled */}
                {isMaintenanceMode ? (
                  <Route path="*" element={<MaintenancePage />} />
                ) : (
                  <>
                    {/* Public Routes */}
                    <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
                    <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
                    <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
                    <Route path="/admissions" element={<><Navbar /><Admissions /><Footer /></>} />
                    <Route path="/programs" element={<><Navbar /><Programs /><Footer /></>} />
                    <Route path="/faculty" element={<><Navbar /><Faculty /><Footer /></>} />
                    <Route path="/campus-life" element={<><Navbar /><CampusLife /><Footer /></>} />
                    <Route path="/privacy" element={<><Navbar /><PrivacyPolicy /><Footer /></>} />
                    <Route path="/terms" element={<><Navbar /><TermsOfService /><Footer /></>} />
                    <Route path="/accessibility" element={<><Navbar /><Accessibility /><Footer /></>} />
                    <Route path="/news" element={<><Navbar /><News /><Footer /></>} />
                    <Route path="/events" element={<><Navbar /><Events /><Footer /></>} />
                    <Route path="/career-services" element={<><Navbar /><CareerServices /><Footer /></>} />
                    <Route path="/contact-research" element={<><Navbar /><ContactResearch /><Footer /></>} />
                    <Route path="/seminars" element={<><Navbar /><Seminars /><Footer /></>} />
                    <Route path="/research-breakthrough" element={<><Navbar /><ResearchBreakthrough /><Footer /></>} />
                    <Route path="/admissions-fall-2025" element={<><Navbar /><AdmissionsFall2025 /><Footer /></>} />
                    <Route path="/debug-results" element={<DebugResults />} />


                    {/* Auth Routes */}

                    <Route path="/student-login" element={<><Navbar /><StudentLogin /><Footer /></>} />

                    <Route path="/signup" element={<Signup />} />
                    <Route path="/password-reset" element={<PasswordReset />} />

                    {/* Protected Student Routes */}
                    <Route path="/student-dashboard" element={<ProtectedRoute><div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow"><StudentDashboard /></main><Footer /></div></ProtectedRoute>} />
                    <Route path="/academic-calendar" element={<ProtectedRoute><div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow"><AcademicCalendar /></main><Footer /></div></ProtectedRoute>} />
                    <Route path="/timetable" element={<ProtectedRoute><div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow"><Timetable /></main><Footer /></div></ProtectedRoute>} />
                    <Route path="/course-syllabus" element={<ProtectedRoute><div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow"><CourseSyllabus /></main><Footer /></div></ProtectedRoute>} />
                    <Route path="/result" element={<ProtectedRoute><div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow"><Result /></main><Footer /></div></ProtectedRoute>} />
                    <Route path="/results" element={<ProtectedRoute><div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow"><Result /></main><Footer /></div></ProtectedRoute>} />
                    <Route path="/digital-library/video-lectures" element={<ProtectedRoute><div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow"><VideoLectures /></main><Footer /></div></ProtectedRoute>} />
                    <Route path="/digital-library" element={<ProtectedRoute><div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow"><DigitalLibrary /></main><Footer /></div></ProtectedRoute>} />

                    {/* 404 Catch-All Route */}
                    <Route path="*" element={<NotFound />} />
                  </>
                )}
              </Routes>
            </Suspense>
          </Router>
        </AdminProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
