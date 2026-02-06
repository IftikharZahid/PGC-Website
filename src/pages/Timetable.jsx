import { Link } from 'react-router-dom';
import { useState } from 'react';
import collegeLogo from '../assets/punjab-college-logo.png';

const Timetable = () => {
  const [selectedClass, setSelectedClass] = useState('Current Semester');

  const classes = ['Current Semester', 'Next Semester'];

  const timetableData = {
    'Current Semester': {
      semester: 'Fall 2024',
      class: 'BS Computer Science - Semester 3',
      timeSlots: [
        '08:30-09:20',
        '09:20-10:10',
        '10:10-11:00',
        '11:00-11:50',
        'Break',
        '12:50-01:40',
        '01:40-02:30',
        '02:30-03:20'
      ],
      schedule: {
        'Monday': [
          'CS101\nIntro to CS',
          'CS101\nIntro to CS',
          'MATH201\nCalculus II',
          'MATH201\nCalculus II',
          'Break',
          'ENG102\nEnglish',
          'Free',
          'Free'
        ],
        'Tuesday': [
          'PHY101\nPhysics I',
          'PHY101\nPhysics I',
          'CS102\nProgramming',
          'CS102\nProgramming',
          'Break',
          'MATH201\nCalculus II',
          'Free',
          'Free'
        ],
        'Wednesday': [
          'CS101\nIntro to CS',
          'CS101\nIntro to CS',
          'ENG102\nEnglish',
          'Free',
          'Break',
          'CS Lab\nComputer Lab',
          'CS Lab\nComputer Lab',
          'Free'
        ],
        'Thursday': [
          'PHY101\nPhysics I',
          'PHY101\nPhysics I',
          'MATH201\nCalculus II',
          'CS102\nProgramming',
          'Break',
          'Free',
          'Free',
          'Free'
        ],
        'Friday': [
          'Free',
          'Free',
          'ENG102\nEnglish',
          'ENG102\nEnglish',
          'Break',
          'CS102\nProgramming',
          'PHY Lab\nPhysics Lab',
          'PHY Lab\nPhysics Lab'
        ],
        'Saturday': [
          'Free',
          'Free',
          'Free',
          'Free',
          'Break',
          'Free',
          'Free',
          'Free'
        ]
      }
    },
    'Next Semester': {
      semester: 'Spring 2025',
      class: 'BS Computer Science - Semester 4',
      timeSlots: [
        '08:30-09:20',
        '09:20-10:10',
        '10:10-11:00',
        '11:00-11:50',
        'Break',
        '12:50-01:40',
        '01:40-02:30',
        '02:30-03:20'
      ],
      schedule: {
        'Monday': [
          'CS201\nData Structures',
          'CS201\nData Structures',
          'MATH301\nDiscrete Math',
          'MATH301\nDiscrete Math',
          'Break',
          'CS203\nWeb Dev',
          'Free',
          'Free'
        ],
        'Tuesday': [
          'CS202\nDatabase',
          'CS202\nDatabase',
          'MATH301\nDiscrete Math',
          'ENG201\nTech Writing',
          'Break',
          'Free',
          'Free',
          'Free'
        ],
        'Wednesday': [
          'CS201\nData Structures',
          'CS201\nData Structures',
          'CS203\nWeb Dev',
          'CS203\nWeb Dev',
          'Break',
          'DB Lab\nDatabase Lab',
          'DB Lab\nDatabase Lab',
          'Free'
        ],
        'Thursday': [
          'CS202\nDatabase',
          'CS202\nDatabase',
          'ENG201\nTech Writing',
          'Free',
          'Break',
          'MATH301\nDiscrete Math',
          'Free',
          'Free'
        ],
        'Friday': [
          'Free',
          'Free',
          'CS203\nWeb Dev',
          'Free',
          'Break',
          'Web Lab\nWeb Dev Lab',
          'Web Lab\nWeb Dev Lab',
          'Free'
        ],
        'Saturday': [
          'Free',
          'Free',
          'Free',
          'Free',
          'Break',
          'Free',
          'Free',
          'Free'
        ]
      }
    }
  };

  const selectedData = timetableData[selectedClass];

  return (
    <>
      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 15mm;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          /* Hide navigation and footer */
          nav, footer {
            display: none !important;
          }
          
          /* Hide everything except timetable */
          .print\\:hidden {
            display: none !important;
          }
          
          /* Reset page styles for print */
          .min-h-screen {
            min-height: auto !important;
            padding: 0 !important;
            background: white !important;
          }
          
          /* Ensure table prints properly */
          table {
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Header - Minimal */}
          <div className="mb-6 print:hidden">
          <Link
            to="/student-dashboard"
            className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline mb-4 text-sm"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🕐</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Class Timetable
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your weekly class schedule
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Semester Selector - Compact */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:hidden">
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Schedule:
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
            >
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div className="bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-lg">
            <span className="text-xs font-bold text-primary-900 dark:text-primary-300">
              {selectedData.semester}
            </span>
          </div>
        </div>

        {/* Timetable - Professional Grid Format */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-gray-300 dark:border-gray-600 overflow-hidden relative">
          {/* Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0" style={{ opacity: 0.05 }}>
            <img 
              src={collegeLogo} 
              alt="Punjab College Logo" 
              className="w-96 h-96 object-contain"
            />
          </div>

          {/* College Header with Logo */}
          <div className="bg-primary-600 dark:bg-primary-700 text-white py-3 px-4 border-b-2 border-gray-800 relative z-10">
            <div className="flex items-center justify-between">
              <img 
                src={collegeLogo} 
                alt="Punjab College Logo" 
                className="w-12 h-12 object-contain rounded-lg bg-white p-1"
              />
              <div className="text-center flex-1">
                <h2 className="text-lg font-bold">Punjab College Fort Abbas</h2>
                <p className="text-sm">{selectedData.class} - {selectedData.semester}</p>
              </div>
              <div className="w-12"></div> {/* Spacer for balance */}
            </div>
          </div>

          <div className="overflow-x-auto relative z-10">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-2 border-gray-400 dark:border-gray-500 bg-gray-200 dark:bg-gray-700 px-3 py-2 text-xs font-bold text-gray-900 dark:text-gray-100 text-center">
                    Day / Period
                  </th>
                  {selectedData.timeSlots.map((time, idx) => (
                    <th 
                      key={idx} 
                      className={`border-2 border-gray-400 dark:border-gray-500 px-3 py-2 text-xs font-bold text-center min-w-[100px] ${
                        time === 'Break' 
                          ? 'bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      {time}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(selectedData.schedule).map(([day, periods]) => (
                  <tr key={day}>
                    <td className="border-2 border-gray-400 dark:border-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-3 text-xs font-bold text-gray-900 dark:text-gray-100 text-center">
                      {day}
                    </td>
                    {periods.map((subject, idx) => {
                      const isBreak = selectedData.timeSlots[idx] === 'Break';
                      const isFree = subject === 'Free' || subject === '';
                      
                      return (
                        <td 
                          key={idx} 
                          className={`border-2 border-gray-400 dark:border-gray-500 px-2 py-3 text-center ${
                            isBreak 
                              ? 'bg-gray-200 dark:bg-gray-600 font-bold text-gray-900 dark:text-gray-100' 
                              : isFree
                              ? 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                          }`}
                        >
                          {isBreak ? (
                            <span className="text-sm font-bold">BREAK</span>
                          ) : (
                            <div className="text-xs font-medium whitespace-pre-line leading-tight">
                              {subject}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Download Button Only - Compact */}
        <div className="mt-4 flex justify-center print:hidden">
          <button 
            onClick={() => window.print()}
            className="btn-primary inline-flex items-center gap-2 text-sm px-4 py-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Timetable
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Timetable;
