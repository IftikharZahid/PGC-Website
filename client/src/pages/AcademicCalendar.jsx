import { Link } from 'react-router-dom';
import { useState } from 'react';

const AcademicCalendar = () => {
  const [selectedSemester, setSelectedSemester] = useState('Fall 2024');

  const semesters = ['Fall 2024', 'Spring 2025', 'Summer 2025'];

  const calendarEvents = {
    'Fall 2024': [
      { date: 'Aug 15, 2024', event: 'Semester Begins', type: 'start' },
      { date: 'Aug 15-22, 2024', event: 'Late Registration', type: 'registration' },
      { date: 'Sep 2, 2024', event: 'Last Day to Add/Drop Courses', type: 'deadline' },
      { date: 'Oct 15-20, 2024', event: 'Mid-Term Examinations', type: 'exam' },
      { date: 'Nov 25-29, 2024', event: 'Fall Break', type: 'holiday' },
      { date: 'Dec 10-20, 2024', event: 'Final Examinations', type: 'exam' },
      { date: 'Dec 23, 2024', event: 'Semester Ends', type: 'end' },
      { date: 'Dec 28, 2024', event: 'Results Announcement', type: 'result' }
    ],
    'Spring 2025': [
      { date: 'Jan 15, 2025', event: 'Semester Begins', type: 'start' },
      { date: 'Jan 15-22, 2025', event: 'Late Registration', type: 'registration' },
      { date: 'Feb 5, 2025', event: 'Last Day to Add/Drop Courses', type: 'deadline' },
      { date: 'Mar 10-15, 2025', event: 'Mid-Term Examinations', type: 'exam' },
      { date: 'Apr 15-20, 2025', event: 'Spring Break', type: 'holiday' },
      { date: 'May 20-30, 2025', event: 'Final Examinations', type: 'exam' },
      { date: 'Jun 5, 2025', event: 'Semester Ends', type: 'end' },
      { date: 'Jun 10, 2025', event: 'Results Announcement', type: 'result' }
    ],
    'Summer 2025': [
      { date: 'Jun 15, 2025', event: 'Semester Begins', type: 'start' },
      { date: 'Jun 15-20, 2025', event: 'Late Registration', type: 'registration' },
      { date: 'Jul 1, 2025', event: 'Last Day to Add/Drop Courses', type: 'deadline' },
      { date: 'Jul 20-25, 2025', event: 'Mid-Term Examinations', type: 'exam' },
      { date: 'Aug 14, 2025', event: 'Independence Day Holiday', type: 'holiday' },
      { date: 'Aug 25-30, 2025', event: 'Final Examinations', type: 'exam' },
      { date: 'Sep 5, 2025', event: 'Semester Ends', type: 'end' },
      { date: 'Sep 10, 2025', event: 'Results Announcement', type: 'result' }
    ]
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'start':
      case 'end':
        return 'border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'exam':
        return 'border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'holiday':
        return 'border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20';
      case 'deadline':
        return 'border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'registration':
        return 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'result':
        return 'border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'border-l-4 border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/student-dashboard"
            className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="text-5xl">📅</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Academic Calendar
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Important dates and events for the academic year
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Semester Selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Select Semester
          </label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full md:w-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
          >
            {semesters.map(semester => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </select>
        </div>

        {/* Legend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Event Types</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-700 dark:text-gray-300">Start/End</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-gray-700 dark:text-gray-300">Examinations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-gray-700 dark:text-gray-300">Holidays</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-gray-700 dark:text-gray-300">Deadlines</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-gray-700 dark:text-gray-300">Registration</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-gray-700 dark:text-gray-300">Results</span>
            </div>
          </div>
        </div>

        {/* Calendar Events */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {selectedSemester} Events
          </h2>
          <div className="space-y-4">
            {calendarEvents[selectedSemester].map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${getEventTypeColor(item.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {item.event}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.date}</p>
                  </div>
                  <span className="text-xs font-semibold uppercase px-3 py-1 bg-white dark:bg-gray-900 rounded-full text-gray-700 dark:text-gray-300">
                    {item.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Download Button */}
        <div className="mt-6 text-center">
          <button className="btn-primary inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Calendar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcademicCalendar;
