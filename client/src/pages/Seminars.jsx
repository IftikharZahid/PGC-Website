import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';
import collegeBuilding from '../assets/College-Building.png';
import convocationCeremony01 from '../assets/Seminar01.png';
import convocationCeremony02 from '../assets/Seminar02.jpg';
import convocationCeremony03 from '../assets/Seminar03.jpg';
import convocationCeremony04 from '../assets/Seminar04.jpg';
import convocationCeremony05 from '../assets/Seminar05.png';
import convocationCeremony06 from '../assets/Seminar06.png';

const Seminars = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    { id: 1, src: convocationCeremony01, title: "Seminar Session", description: "Expert speakers sharing knowledge and insights" },
    { id: 2, src: convocationCeremony02, title: "Engaged Audience", description: "Students actively participating in seminar sessions" },
    { id: 3, src: convocationCeremony03, title: "Distinguished Guests", description: "Renowned speakers and industry experts" },
    { id: 4, src: convocationCeremony04, title: "Workshop Activities", description: "Hands-on learning in interactive workshops" },
    { id: 5, src: convocationCeremony05, title: "Networking Sessions", description: "Attendees connecting and sharing ideas" },
    { id: 6, src: convocationCeremony06, title: "Memorable Moments", description: "Highlights from the seminar series" }
  ];

  const posts = [
    {
      id: 1,
      title: "Welcome Address by Principal",
      date: "January 15, 2025",
      content: "The Principal welcomed all attendees, faculty, and guest speakers, highlighting the importance of continuous learning and professional development through seminar participation.",
      icon: "🎓"
    },
    {
      id: 2,
      title: "Keynote Speaker Session",
      date: "January 15, 2025",
      content: "Dr. Ahmad Hassan, renowned industry expert and former Vice-Chancellor, delivered an inspiring keynote on 'Innovation in the Digital Age' and the importance of adapting to technological advancements.",
      icon: "🎤"
    },
    {
      id: 3,
      title: "Interactive Workshop Sessions",
      date: "January 15, 2025",
      content: "Engaging hands-on workshops were conducted across multiple tracks including Technology, Business Innovation, Research Methodologies, and Career Development, providing practical skills to participants.",
      icon: "🏆"
    },
    {
      id: 4,
      title: "Panel Discussion Forum",
      date: "January 15, 2025",
      content: "A thought-provoking panel discussion brought together industry leaders, academicians, and successful alumni to share their perspectives on emerging trends and future career opportunities.",
      icon: "📜"
    },
    {
      id: 5,
      title: "Student Q&A Session",
      date: "January 15, 2025",
      content: "An interactive Q&A session allowed students to engage directly with expert speakers, gaining valuable insights and career guidance. The session fostered meaningful dialogue about industry expectations and opportunities.",
      icon: "💬"
    },
    {
      id: 6,
      title: "Networking and Refreshments",
      date: "January 15, 2025",
      content: "The seminar series featured engaging panel discussions and networking sessions, providing students with valuable insights into industry trends and career opportunities.",
      icon: "🎭"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero Section - Compact Style matching VideoLectures */}
      <section className="relative h-[200px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={collegeBuilding}
            alt="Seminars"
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
              <span>Seminars</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-serif font-bold text-white mb-2 shadow-md">
              Seminars & Events
            </h1>
            <p className="text-white/80 text-lg max-w-2xl font-light">
              Industry experts, thought leaders, and interactive sessions to inspire and educate.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="py-10 px-6 md:px-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll animation="animate-fade-up">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-gray-900 dark:text-gray-100">
                About the Event
              </h2>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                The Seminars 2025 series marked a significant initiative in the history of Punjab College,
                bringing together industry experts, thought leaders, and students to explore cutting-edge topics
                across various disciplines. These engaging sessions provided valuable insights, networking opportunities,
                and practical knowledge to enhance academic learning.
              </p>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                This prestigious event featured keynote presentations from renowned speakers, interactive panel
                discussions, and hands-on workshops covering diverse subjects. The seminar series served as a
                bridge between theoretical knowledge and practical application, inspiring students to stay updated
                with industry trends and innovations.
              </p>

              {/* Event Info Grid */}
              <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📅</div>
                  <div>
                    <h4 className="font-bold text-base mb-1 text-gray-900 dark:text-gray-100">Date</h4>
                    <p className="text-gray-600 dark:text-gray-400">January 15, 2025</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-3xl">📍</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 text-gray-900 dark:text-gray-100">Venue</h4>
                    <p className="text-gray-600 dark:text-gray-400">Main Auditorium</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-3xl">👥</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 text-gray-900 dark:text-gray-100">Graduates</h4>
                    <p className="text-gray-600 dark:text-gray-400">300+ Attendees</p>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-12 px-6 md:px-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <RevealOnScroll animation="animate-fade-up">
              <span className="text-primary-700 dark:text-primary-400 font-bold uppercase tracking-widest text-xs mb-3 block">
                Memories
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-3">
                Photo Gallery
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base max-w-2xl mx-auto">
                Capturing the most memorable moments from our Seminars 2025
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

      {/* Posts & Highlights Section */}
      <section className="py-12 px-6 md:px-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <RevealOnScroll animation="animate-fade-up">
              <span className="text-primary-700 dark:text-primary-400 font-bold uppercase tracking-widest text-xs mb-3 block">
                Highlights
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-3">
                Seminar Highlights
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base max-w-2xl mx-auto">
                Key moments and highlights from the seminar series
              </p>
            </RevealOnScroll>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <RevealOnScroll key={post.id} animation="animate-fade-up" delay={`${index * 0.1}s`}>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-5 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
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

export default Seminars;
