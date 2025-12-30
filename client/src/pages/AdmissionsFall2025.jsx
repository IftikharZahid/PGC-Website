import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';
import collegeAdmissions from '../assets/college-admissions.jpg';
import graduatingStudents from '../assets/Meeting.jpg';
import { getItems, STORAGE_KEYS, initializeDemoData } from '../utils/adminStorage';

const AdmissionsFall2025 = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [gallery, setGallery] = useState({});

  useEffect(() => {
    try { initializeDemoData(); } catch (e) { }
    const items = getItems(STORAGE_KEYS.GALLERY);
    const map = {};
    if (items) items.forEach(i => map[i.id] = i.url);
    setGallery(map);
  }, []);

  const getImg = (id, fallback) => (gallery && gallery[id]) ? gallery[id] : fallback;

  const galleryImages = [
    { id: 1, src: getImg('adm-fall-1', collegeAdmissions), title: "Campus Overview", description: "Beautiful campus facilities" },
    { id: 2, src: getImg('adm-fall-2', graduatingStudents), title: "Student Life", description: "Vibrant student community" },
    { id: 3, src: getImg('adm-fall-3', collegeAdmissions), title: "Modern Classrooms", description: "State-of-the-art learning spaces" },
    { id: 4, src: getImg('adm-fall-4', graduatingStudents), title: "Student Activities", description: "Diverse extracurricular programs" },
    { id: 5, src: getImg('adm-fall-5', collegeAdmissions), title: "Campus Facilities", description: "World-class infrastructure" },
    { id: 6, src: getImg('adm-fall-6', graduatingStudents), title: "Student Success", description: "Excellence in education" }
  ];

  const posts = [
    {
      id: 1,
      title: "Application Deadline Extended",
      date: "January 10, 2025",
      content: "Great news! The application deadline for Fall 2025 admissions has been extended to February 15, 2025, giving prospective students more time to apply and join our academic community.",
      icon: "📅"
    },
    {
      id: 2,
      title: "New Programs Announced",
      date: "January 8, 2025",
      content: "We're excited to introduce new programs in Data Science, Environmental Studies, and Digital Marketing for Fall 2025, expanding opportunities for students to pursue cutting-edge fields.",
      icon: "🎓"
    },
    {
      id: 3,
      title: "Merit Scholarships Available",
      date: "January 5, 2025",
      content: "Punjab College is offering competitive merit-based scholarships for exceptional students. Applications are being reviewed on a rolling basis, with awards up to 100% tuition coverage.",
      icon: "💰"
    },
    {
      id: 4,
      title: "Virtual Campus Tours",
      date: "January 3, 2025",
      content: "Can't visit in person? Join our weekly virtual campus tours every Saturday at 10 AM. Explore facilities, meet faculty, and get all your questions answered from the comfort of your home.",
      icon: "🏛️"
    },
    {
      id: 5,
      title: "Application Workshop Series",
      date: "December 28, 2024",
      content: "Join our free application workshop series to get expert guidance on completing your application, writing essays, and preparing for interviews. Sessions held every Wednesday evening.",
      icon: "✍️"
    },
    {
      id: 6,
      title: "Early Decision Benefits",
      date: "December 20, 2024",
      content: "Apply early and receive your admission decision within two weeks! Early decision applicants also get priority consideration for scholarships and preferred housing options.",
      icon: "⚡"
    }
  ];

  const programs = [
    { name: "Pre-Engineering", icon: "⚙️", duration: "2 Years" },
    { name: "Pre-Medical", icon: "⚕️", duration: "2 Years" },
    { name: "Computer Science", icon: "💻", duration: "2 Years" },
    { name: "Commerce", icon: "💼", duration: "2 Years" },
    { name: "Arts & Humanities", icon: "📚", duration: "2 Years" },
    { name: "Data Science", icon: "📊", duration: "2 Years" }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero Section - Compact Style */}
      <section className="relative h-[200px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={getImg('adm-fall-hero', collegeAdmissions)}
            alt="Admissions Open Fall 2025"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-secondary-900/60 dark:bg-black/70 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-end pb-6 px-6 md:px-12">
          <RevealOnScroll animation="animate-fade-up">
            <div className="text-white mb-2 flex items-center gap-2 text-xs font-bold tracking-widest uppercase opacity-80">
              <Link to="/" className="hover:underline">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span>Admissions Fall 2025</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-serif font-bold text-white mb-2 shadow-md">
              Admissions Open Fall 2025
            </h1>
            <p className="text-white/80 text-lg max-w-2xl font-light">
              Applications are now being accepted & Start your journey to academic excellence.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Admissions Overview Section */}
      <section className="py-10 px-6 md:px-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll animation="animate-fade-up">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-gray-900 dark:text-gray-100">
                Begin Your Academic Journey
              </h2>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Punjab College is now accepting applications for Fall 2025 admissions across all undergraduate programs.
                Join a community of scholars, innovators, and leaders who are shaping the future through academic
                excellence and personal growth.
              </p>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                We offer comprehensive programs in Science, Arts, Commerce, and emerging fields like Data Science and
                Digital Marketing. Our admissions process is designed to identify talented, motivated students who will
                thrive in our rigorous academic environment and contribute to our vibrant campus community.
              </p>

              {/* Admissions Info Grid */}
              <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📝</div>
                  <div>
                    <h4 className="font-bold text-base mb-1 text-gray-900 dark:text-gray-100">Application Deadline</h4>
                    <p className="text-gray-600 dark:text-gray-400">February 15, 2025</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🎯</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 text-gray-900 dark:text-gray-100">Start Date</h4>
                    <p className="text-gray-600 dark:text-gray-400">September 1, 2025</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-3xl">💡</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 text-gray-900 dark:text-gray-100">Programs</h4>
                    <p className="text-gray-600 dark:text-gray-400">15+ Disciplines</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-6 text-center">
                <Link
                  to="/admissions"
                  className="inline-block bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-sm transition-colors shadow-lg hover:shadow-xl">
                  Apply Now
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Programs Offered */}
      <section className="py-12 px-6 md:px-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <RevealOnScroll animation="animate-fade-up">
              <span className="text-primary-700 dark:text-primary-400 font-bold uppercase tracking-widest text-xs mb-3 block">
                Academic Programs
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-3">
                Programs Offered
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base max-w-2xl mx-auto">
                Choose from a wide range of programs designed for your success
              </p>
            </RevealOnScroll>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <RevealOnScroll key={program.name} animation="animate-fade-up" delay={`${index * 0.1}s`}>
                <div className="bg-secondary-50 dark:bg-gray-800 rounded-xl p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-secondary-200 dark:border-gray-600">
                  <div className="text-4xl mb-3">{program.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {program.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Duration: {program.duration}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-12 px-6 md:px-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <RevealOnScroll animation="animate-fade-up">
              <span className="text-primary-700 dark:text-primary-400 font-bold uppercase tracking-widest text-xs mb-3 block">
                Campus Life
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-3">
                Experience Our Campus
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base max-w-2xl mx-auto">
                Discover what makes Punjab College a great place to learn and grow
              </p>
            </RevealOnScroll>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <RevealOnScroll key={image.id} animation="animate-fade-up" delay={`${index * 0.1}s`}>
                <div
                  className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-56 object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-lg font-bold mb-1">{image.title}</h3>
                      <p className="text-sm text-white/90">{image.description}</p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Admissions Posts Section */}
      <section className="py-12 px-6 md:px-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <RevealOnScroll animation="animate-fade-up">
              <span className="text-primary-700 dark:text-primary-400 font-bold uppercase tracking-widest text-xs mb-3 block">
                Latest Updates
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-3">
                Admissions News
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base max-w-2xl mx-auto">
                Stay informed about important dates and opportunities
              </p>
            </RevealOnScroll>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <RevealOnScroll key={post.id} animation="animate-fade-up" delay={`${index * 0.1}s`}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col border border-gray-100 dark:border-gray-700">
                  <div className="text-4xl mb-3">{post.icon}</div>
                  <div className="text-xs text-primary-600 dark:text-primary-400 font-semibold mb-2">
                    {post.date}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed flex-grow text-sm">
                    {post.content}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full">
            <button
              className="absolute -top-12 right-0 text-white text-4xl hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            <div className="mt-4 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h3>
              <p className="text-white/80">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionsFall2025;
