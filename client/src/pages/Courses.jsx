import { useState, useEffect } from 'react';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/courses');
      
      if (!response.ok) {
        // Handle different HTTP error codes
        if (response.status === 404) {
          throw new Error('Courses endpoint not found. Please check the API configuration.');
        } else if (response.status >= 500) {
          throw new Error('Server error occurred. Please try again later.');
        } else if (response.status === 401 || response.status === 403) {
          throw new Error('You are not authorized to view courses.');
        } else {
          throw new Error(`Failed to fetch courses (Error ${response.status})`);
        }
      }
      
      const data = await response.json();
      
      // Validate response data structure
      if (!data || !data.data) {
        throw new Error('Invalid response format from server.');
      }
      
      setCourses(data.data);
      setError(null);
    } catch (err) {
      // Provide specific error messages based on error type
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Cannot connect to server. Please ensure the backend server is running on port 5000.');
      } else if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
        setError('Network error: Unable to reach the server. Please check your internet connection and ensure the backend server is running.');
      } else {
        setError(err.message);
      }
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const isServerError = error.includes('backend server') || error.includes('Cannot connect');
    
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="card max-w-2xl">
          <div className="text-center mb-6">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Error Loading Courses</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          </div>

          {/* Troubleshooting tips for server errors */}
          {isServerError && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Troubleshooting Steps
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700 dark:text-blue-300">
                <li>Open a terminal and navigate to the server directory</li>
                <li>Run: <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">cd server && npm run dev</code></li>
                <li>Ensure the server starts on port 5000</li>
                <li>Look for the message: "🚀 Server running on port 5000"</li>
                <li>Click "Try Again" below once the server is running</li>
              </ol>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 justify-center">
            <button onClick={fetchCourses} className="btn-primary">
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
            <button 
              onClick={() => window.location.href = '/'} 
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Our Courses</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover our wide range of programs designed to help you achieve your academic and career goals.
          </p>
        </div>

        {/* Course Count */}
        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Showing <span className="font-semibold text-primary-600 dark:text-primary-400">{courses.length}</span> available courses
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="card group hover:scale-105 transition-all duration-300 animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Course Icon */}
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>

              {/* Course Title */}
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {course.title}
              </h3>

              {/* Course Description */}
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {course.description}
              </p>

              {/* Course Details */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Duration:</span> {course.duration}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Instructor:</span> {course.instructor}
                  </span>
                </div>
              </div>

              {/* Enroll Button */}
              <button className="w-full mt-4 btn-primary">
                Learn More
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {courses.length === 0 && !loading && !error && (
          <div className="text-center py-16">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl text-gray-600 dark:text-gray-400">No courses available at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
