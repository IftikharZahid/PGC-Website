import { useState, useEffect } from 'react';
import logo from '../assets/punjab-college-logo.png';
import { getItems, STORAGE_KEYS } from '../utils/adminStorage';

const Result = () => {
  const [roll, setRoll] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPortalEnabled, setIsPortalEnabled] = useState(true);
  const [debugResults, setDebugResults] = useState([]);

  // Refresh debug results from localStorage
  const refreshDebugData = () => {
    const results = getItems(STORAGE_KEYS.RESULTS);
    console.log('DEBUG - Raw results from localStorage:', results);
    setDebugResults(results);
  };

  // Load debug data on mount and when result changes
  useEffect(() => {
    refreshDebugData();
  }, [result]);

  // Set document title to roll number for print filename
  useEffect(() => {
    // Check if result portal is enabled
    const checkPortalStatus = () => {
      const savedSettings = localStorage.getItem('admin_settings');
      console.log('Checking portal status...', savedSettings);

      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          console.log('Settings object:', settings);
          console.log('resultPortalEnabled value:', settings.resultPortalEnabled);

          // Default to true if not set
          const portalEnabled = settings.resultPortalEnabled !== false;
          console.log('Setting portal enabled to:', portalEnabled);
          setIsPortalEnabled(portalEnabled);
        } catch (error) {
          console.error('Error parsing settings:', error);
          setIsPortalEnabled(true); // Default to enabled on error
        }
      } else {
        console.log('No settings found, defaulting to enabled');
        setIsPortalEnabled(true);
      }
    };

    // Initial check
    checkPortalStatus();

    // Check every 3 seconds for changes
    const interval = setInterval(checkPortalStatus, 3000);

    if (result && result.roll) {
      document.title = `Result-${result.roll}`;
    } else {
      document.title = 'Student Results - Punjab College Fort Abbas';
    }

    // Cleanup: reset title when component unmounts
    return () => {
      document.title = 'Punjab College Fort Abbas';
      clearInterval(interval);
    };
  }, [result]);

  const fetchResult = (rollNo) => {
    try {
      console.log('=== Fetching result for roll number:', rollNo);

      // Fetch from local storage instead of API
      const allResults = getItems(STORAGE_KEYS.RESULTS);
      const allSubjects = getItems(STORAGE_KEYS.SUBJECTS);

      console.log('All results from storage:', allResults);
      console.log('Total results found:', allResults.length);

      // Debug: Log all results with their published status
      allResults.forEach(r => {
        console.log(`Result: ${r.rollNo}, isPublished: ${r.isPublished}, type: ${typeof r.isPublished}`);
      });

      // Find the student's result (case-insensitive match)
      const searchRollNo = rollNo.trim().toLowerCase();
      const foundResult = allResults.find(r => {
        const resultRollNo = (r.rollNo || '').trim().toLowerCase();
        // More lenient isPublished check - check for truthy value
        const isPublished = r.isPublished === true || r.isPublished === 'true' || r.isPublished === 1 || r.isPublished === '1';
        console.log(`Comparing: "${resultRollNo}" vs "${searchRollNo}", isPublished: ${r.isPublished} (${typeof r.isPublished}), computed: ${isPublished}`);
        return resultRollNo === searchRollNo && isPublished;
      });

      // If no published result, check if result exists but is unpublished
      if (!foundResult) {
        const unpublishedResult = allResults.find(r => {
          const resultRollNo = (r.rollNo || '').trim().toLowerCase();
          return resultRollNo === searchRollNo;
        });
        if (unpublishedResult) {
          console.log('Found result but it is NOT published:', unpublishedResult);
        }
      }

      console.log('Found result:', foundResult);

      if (foundResult) {
        // Map subject IDs to Names with their respective max marks
        const mappedMarks = {};
        const mappedMaxMarks = {};

        Object.entries(foundResult.marks || {}).forEach(([subjectId, mark]) => {
          const subject = allSubjects.find(s => s.id === subjectId);
          const subjectName = subject ? subject.subjectName : 'Unknown Subject';
          mappedMarks[subjectName] = mark;
          // Get max marks from saved result or fallback to subject default or 100
          mappedMaxMarks[subjectName] = foundResult.maxMarks?.[subjectId] || subject?.totalMarks || 100;
        });

        // Calculate position among all results in the same course
        const courseResults = allResults
          .filter(r => r.course === foundResult.course && (r.isPublished === true || r.published === true))
          .sort((a, b) => (b.percentage || 0) - (a.percentage || 0));

        const position = courseResults.findIndex(r => r.rollNo === foundResult.rollNo) + 1;
        const positionSuffix = position === 1 ? 'st' : position === 2 ? 'nd' : position === 3 ? 'rd' : 'th';

        // Return formatted object with all calculated data
        const formattedResult = {
          name: foundResult.studentName,
          roll: foundResult.rollNo,
          class: foundResult.course,
          session: foundResult.semester,
          marks: mappedMarks,
          maxMarks: mappedMaxMarks,
          totalMarks: foundResult.totalMarks || 0,
          obtainedMarks: foundResult.obtainedMarks || 0,
          percentage: foundResult.percentage || 0,
          grade: foundResult.grade || 'N/A',
          position: `${position}${positionSuffix}`,
          totalStudents: courseResults.length
        };

        console.log('Returning formatted result:', formattedResult);
        return formattedResult;
      }

      console.log('No published result found for roll number:', rollNo);
      return null;
    } catch (err) {
      console.error("Error fetching result:", err);
      return null;
    }
  };

  const handleSearch = () => {
    if (!roll.trim()) {
      setError("Please enter a Roll Number");
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    // Simulate network delay for better UX
    setTimeout(() => {
      const data = fetchResult(roll.trim());

      if (!data) {
        setError("Result not found for this Roll Number.");
        setResult(null);
      } else {
        setResult(data);
      }
      setLoading(false);
    }, 800);
  };

  const calculateTotal = (marks) =>
    Object.values(marks).reduce((acc, v) => acc + v, 0);

  const calculatePercentage = (total, numSubjects) => {
    if (numSubjects === 0) return "0.00";
    const maxMarks = numSubjects * 100;
    return ((total / maxMarks) * 100).toFixed(2);
  }

  const calculateGrade = (percentage) => {
    const p = parseFloat(percentage);
    if (p >= 90) return "A+";
    if (p >= 80) return "A";
    if (p >= 70) return "B";
    if (p >= 60) return "C";
    if (p >= 50) return "D";
    if (p >= 40) return "E";
    return "F";
  };

  return (
    <>
      {/* If portal is disabled, show closed page */}
      {!isPortalEnabled ? (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 text-center border border-gray-200 dark:border-gray-700">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-3">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              {/* Heading */}
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                Portal Closed
              </h1>

              {/* Message */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                The result viewing portal is temporarily unavailable.
              </p>

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-3">
                <p className="text-xs text-blue-900 dark:text-blue-200 font-semibold mb-1">
                  Notice
                </p>
                <p className="text-xs text-blue-800 dark:text-blue-300">
                  Results are currently being updated. Please verify with the administration office.
                </p>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2 mb-3">
                <p className="text-[10px] text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-0.5">For assistance</p>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  admin@punjabcollege.edu.pk
                </p>
              </div>

              {/* PGC Branding */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-center mb-2">
                  <img src={logo} alt="Punjab College Logo" className="w-10 h-10 object-contain" />
                </div>
                <p className="text-sm font-bold text-primary-700 dark:text-primary-400">
                  Punjab Group of Colleges
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  Excellence in Education
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Normal result page when portal is enabled
        <>
          {/* Print Styles */}
          <style>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            background: white !important;
          }
          
          /* Hide everything except result card */
          nav, footer, .print\\:hidden, .no-print {
            display: none !important;
          }
          
          /* Hide search card in print view */
          .min-h-screen > .max-w-5xl > div:first-child {
            display: none !important;
          }
          
          /* Reset page styles for print */
          .min-h-screen {
            min-height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
          }
          
          .max-w-5xl {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Ensure result card prints properly - Override dark mode */
          .card {
            background: white !important;
            box-shadow: none !important;
            border: 1px solid #e5e7eb !important;
            page-break-inside: avoid;
            color: #000 !important;
          }
          
          /* Force light mode colors for all text elements */
          h2, h3, span, p, td, th, div {
            color: #000 !important;
          }
          
          /* Specific overrides for result card elements */
          .card h2 {
            color: #111827 !important;
          }
          
          .card .border-b-2 {
            border-color: #d1d5db !important;
          }
          
          .card .border-b {
            border-color: #9ca3af !important;
          }
          
          /* Table styling for print - force light mode */
          table {
            page-break-inside: avoid;
            background: white !important;
          }
          
          thead tr {
            background: #f3f4f6 !important;
            border-color: #e5e7eb !important;
          }
          
          th {
            color: #374151 !important;
            background: #f3f4f6 !important;
          }
          
          tbody tr {
            border-color: #e5e7eb !important;
          }
          
          tbody td {
            color: #1f2937 !important;
          }
          
          tbody td:first-child {
            color: #111827 !important;
          }
          
          /* Summary section */
          .border-t-2 {
            border-color: #d1d5db !important;
          }
          
          /* Override any remaining dark mode text */
          * {
            color-scheme: light !important;
          }
        }
      `}</style>

          <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50 dark:bg-gray-900 print:pt-0 print:pb-0 print:px-0">
            <div className="flex gap-6 max-w-7xl mx-auto print:block">
              {/* Left Sidebar - Top Performers */}
              <aside className="hidden xl:block w-64 flex-shrink-0 print:hidden">
                <div className="sticky top-28">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-slide-in-left">
                    {/* Minimal Header */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <span className="text-amber-500">🏆</span>
                        Top Performers
                      </h3>
                    </div>

                    {/* Compact List */}
                    <div className="p-3 space-y-2">
                      {[
                        { rank: 1, name: "Ahmed Khan", percentage: "98.5%" },
                        { rank: 2, name: "Fatima Ali", percentage: "97.2%" },
                        { rank: 3, name: "Hassan Raza", percentage: "96.8%" },
                        { rank: 4, name: "Ayesha Malik", percentage: "95.5%" },
                        { rank: 5, name: "Usman Ahmed", percentage: "94.9%" }
                      ].map((student, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                        >
                          <div className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-xs font-bold
                        ${idx < 3
                              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}
                      `}>
                            {student.rank}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs text-gray-900 dark:text-gray-100 truncate">
                              {student.name}
                            </p>
                          </div>
                          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                            {student.percentage}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main Content */}
              <div className="flex-1 min-w-0 print:max-w-none">
                {/* Search Card - Minimalist Design */}
                <div className="max-w-4xl mx-auto mb-6 print:hidden">
                  {/* Portal Disabled Warning */}
                  {!isPortalEnabled && (
                    <div className="mb-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-lg">
                      <div className="flex items-start">
                        <svg className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">Result Portal Disabled</h3>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">The result viewing portal has been temporarily disabled by administration. Please contact the office for more information.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder="Enter roll number (e.g., PGC-2024-001)"
                        className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        value={roll}
                        onChange={(e) => setRoll(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && isPortalEnabled && handleSearch()}
                        disabled={!isPortalEnabled}
                      />
                      <button
                        onClick={handleSearch}
                        disabled={loading || !isPortalEnabled}
                        className="btn-primary px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm font-medium"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Searching...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Search Result
                          </div>
                        )}
                      </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800 flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Result Display */}
                {result && (
                  <div className="animate-fade-in">
                    {/* Result Card - Same layout for screen and print */}
                    <div className="card overflow-hidden p-6 max-w-4xl mx-auto relative">
                      {/* Watermark Logo */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                        <img src={logo} alt="Watermark" className="w-64 h-64 object-contain opacity-5 rounded-lg" />
                      </div>

                      {/* Header */}
                      <div className="mb-4 pb-3 border-b-2 border-gray-300 dark:border-gray-600">
                        <div className="flex items-center justify-center gap-4 mb-3">
                          <img src={logo} alt="College Logo" className="w-16 h-16 object-contain rounded-lg" />
                          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">PUNJAB COLLEGE FORT ABBAS</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                          <div className="flex">
                            <span className="font-semibold w-24">Student Name:</span>
                            <span className="flex-1 border-b border-gray-400">{result.name}</span>
                          </div>
                          <div className="flex">
                            <span className="font-semibold w-24">Roll No:</span>
                            <span className="flex-1 border-b border-gray-400">{result.roll}</span>
                          </div>
                          <div className="flex">
                            <span className="font-semibold w-24">Class:</span>
                            <span className="flex-1 border-b border-gray-400">{result.class}</span>
                          </div>
                          {result.session && (
                            <div className="flex">
                              <span className="font-semibold w-24">Session:</span>
                              <span className="flex-1 border-b border-gray-400">{result.session}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                              <th className="text-left py-2 px-3 font-bold text-gray-700 dark:text-gray-300 text-sm">Subject</th>
                              <th className="text-center py-2 px-3 font-bold text-gray-700 dark:text-gray-300 text-sm">Max Marks</th>
                              <th className="text-center py-2 px-3 font-bold text-gray-700 dark:text-gray-300 text-sm">Obtained</th>
                              <th className="text-center py-2 px-3 font-bold text-gray-700 dark:text-gray-300 text-sm">Percentage</th>
                              <th className="text-center py-2 px-3 font-bold text-gray-700 dark:text-gray-300 text-sm">Grade</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {Object.entries(result.marks).map(([subject, mark]) => {
                              const maxMark = result.maxMarks?.[subject] || 100;
                              const subjectPercentage = maxMark > 0 ? ((mark / maxMark) * 100).toFixed(1) : 0;
                              const subjectGrade = calculateGrade(subjectPercentage);

                              return (
                                <tr key={subject} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                  <td className="py-2 px-3 font-semibold text-gray-800 dark:text-gray-100 text-sm">{subject}</td>
                                  <td className="py-2 px-3 text-center text-gray-600 dark:text-gray-400 text-sm">{maxMark}</td>
                                  <td className="py-2 px-3 text-center font-bold text-gray-800 dark:text-gray-100 text-sm">{mark}</td>
                                  <td className="py-2 px-3 text-center text-gray-600 dark:text-gray-400 text-sm">{subjectPercentage}%</td>
                                  <td className="py-2 px-3 text-center">
                                    <span className={`text-sm font-bold ${subjectGrade === 'A+' || subjectGrade === 'A' ? 'text-green-600 dark:text-green-400' :
                                      subjectGrade === 'B' ? 'text-blue-600 dark:text-blue-400' :
                                        subjectGrade === 'C' ? 'text-yellow-600 dark:text-yellow-400' :
                                          subjectGrade === 'D' ? 'text-orange-600 dark:text-orange-400' :
                                            'text-red-600 dark:text-red-400'
                                      }`}>
                                      {subjectGrade}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Summary Section */}
                      <div className="mt-4 pt-3 border-t-2 border-gray-300 dark:border-gray-600">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400 font-semibold mb-0.5">Obtained / Total</p>
                            <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                              {result.obtainedMarks} / {result.totalMarks}
                            </p>
                          </div>

                          <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <p className="text-blue-600 dark:text-blue-400 font-semibold mb-0.5">Percentage</p>
                            <p className="text-base font-bold text-blue-700 dark:text-blue-300">
                              {Number(result.percentage).toFixed(2)}%
                            </p>
                          </div>

                          <div className="text-center p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                            <p className="text-green-600 dark:text-green-400 font-semibold mb-0.5">Grade</p>
                            <p className="text-lg font-bold text-green-700 dark:text-green-300">
                              {result.grade}
                            </p>
                          </div>

                          <div className="text-center p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                            <p className="text-amber-600 dark:text-amber-400 font-semibold mb-0.5">Position</p>
                            <p className="text-base font-bold text-amber-700 dark:text-amber-300">
                              {result.position} 🏆
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Print Button */}
                    <div className="mt-8 flex justify-center print:hidden">
                      <button
                        onClick={() => window.print()}
                        className="btn-secondary inline-flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print Result
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Sidebar - Achievements */}
              <aside className="hidden xl:block w-64 flex-shrink-0 print:hidden">
                <div className="sticky top-28">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-slide-in-right">
                    {/* Minimal Header */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <span className="text-emerald-500">🎓</span>
                        Achievements
                      </h3>
                    </div>

                    {/* Compact Stats */}
                    <div className="p-3 space-y-2">
                      {[
                        { icon: "🎯", label: "Perfect Score", value: "3" },
                        { icon: "📈", label: "Class Average", value: "87.3%" },
                        { icon: "⭐", label: "Pass Rate", value: "96.8%" },
                        { icon: "🔥", label: "Best Subject", value: "Physics" }
                      ].map((stat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{stat.icon}</span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</span>
                          </div>
                          <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Result;
