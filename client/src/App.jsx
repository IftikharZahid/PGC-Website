import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Admissions from './pages/Admissions';
import Courses from './pages/Courses';
import StudentLogin from './pages/StudentLogin';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Result from './pages/Result';
import About from './pages/About';
import Faculty from './pages/Faculty';
import CampusLife from './pages/CampusLife';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Accessibility from './pages/Accessibility';
import News from './pages/News';
import Events from './pages/Events';
import CareerServices from './pages/CareerServices';
import Library from './pages/Library';
import LibraryCatalog from './pages/LibraryCatalog';
import Research from './pages/Research';
import ResearchOpportunities from './pages/ResearchOpportunities';
import ContactResearch from './pages/ContactResearch';

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admissions" element={<Admissions />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/results" element={<Result />} />
                <Route path="/about" element={<About />} />
                <Route path="/faculty" element={<Faculty />} />
                <Route path="/campus-life" element={<CampusLife />} />
                <Route path="/login" element={<StudentLogin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/news" element={<News />} />
                <Route path="/events" element={<Events />} />
                <Route path="/career-services" element={<CareerServices />} />
                <Route path="/library" element={<Library />} />
                <Route path="/library/catalog" element={<LibraryCatalog />} />
                <Route path="/research" element={<Research />} />
                <Route path="/research/opportunities" element={<ResearchOpportunities />} />
                <Route path="/research/contact" element={<ContactResearch />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/accessibility" element={<Accessibility />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
