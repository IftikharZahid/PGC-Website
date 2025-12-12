import { useState } from 'react';

const Result = () => {
  const [roll, setRoll] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchResult = async (rollNo) => {
    try {
      const response = await fetch(`/api/results/${rollNo}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        return null;
      }
    } catch (err) {
      console.error("Error fetching result:", err);
      return null;
    }
  };

  const handleSearch = async () => {
    if (!roll.trim()) {
      setError("Please enter a Roll Number");
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const data = await fetchResult(roll.trim());

    if (!data) {
      setError("Result not found for this Roll Number.");
      setResult(null);
    } else {
      setResult(data);
    }
    setLoading(false);
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
    return "F";
  };

  return (
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
          }
          
          /* Hide everything except marks table */
          nav, footer, .print\\:hidden, .no-print {
            display: none !important;
          }
          
          /* Reset page styles for print */
          .min-h-screen {
            min-height: auto !important;
            padding: 0 !important;
            background: white !important;
          }
          
          /* Show only marks table */
          .print-only {
            display: block !important;
          }
          
          /* Ensure colors print correctly */
          .card {
            background: white !important;
            box-shadow: none !important;
            border: 1px solid #e5e7eb !important;
          }
          
          /* Table print styles */
          table {
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50 dark:bg-gray-900 print:pt-0 print:pb-0 print:px-0">
        <div className="max-w-5xl mx-auto print:max-w-none">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Student Result Lookup</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Enter your roll number to view your exam results and academic performance.
          </p>
        </div>

        {/* Search Card */}
        <div className="max-w-4xl mx-auto mb-12 animate-slide-in">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Search Results</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Enter your roll number"
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all outline-none"
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </div>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800 flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="card overflow-hidden p-6 max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-4 pb-3 border-b-2 border-gray-300 dark:border-gray-600">
                <h2 className="text-xl font-bold text-center mb-3 text-gray-900 dark:text-gray-100">PUNJAB COLLEGE FORT ABBAS</h2>
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
                    <span className="font-semibold w-24">Course:</span>
                    <span className="flex-1 border-b border-gray-400">{result.course}</span>
                  </div>
                  {result.class && (
                    <div className="flex">
                      <span className="font-semibold w-24">Class:</span>
                      <span className="flex-1 border-b border-gray-400">{result.class}</span>
                    </div>
                  )}
                  {result.semester && (
                    <div className="flex">
                      <span className="font-semibold w-24">Semester:</span>
                      <span className="flex-1 border-b border-gray-400">{result.semester}</span>
                    </div>
                  )}
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
                    <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 px-3 font-bold text-gray-700 dark:text-gray-300 text-sm">Subject</th>
                      <th className="text-center py-2 px-3 font-bold text-gray-700 dark:text-gray-300 text-sm">Total Marks</th>
                      <th className="text-center py-2 px-3 font-bold text-gray-700 dark:text-gray-300 text-sm">Obtained</th>
                      <th className="text-center py-2 px-3 font-bold text-gray-700 dark:text-gray-300 text-sm">Percentage</th>
                      <th className="text-center py-2 px-3 font-bold text-gray-700 dark:text-gray-300 text-sm">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {Object.entries(result.marks).map(([subject, mark]) => {
                      const percentage = ((mark / 100) * 100).toFixed(2);
                      const grade = calculateGrade(percentage);
                      
                      return (
                        <tr key={subject} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="py-2 px-3 font-semibold text-gray-800 dark:text-gray-100 text-sm">{subject}</td>
                          <td className="py-2 px-3 text-center text-gray-600 dark:text-gray-400 text-sm">100</td>
                          <td className="py-2 px-3 text-center font-bold text-gray-800 dark:text-gray-100 text-sm">{mark}</td>
                          <td className="py-2 px-3 text-center text-gray-600 dark:text-gray-400 text-sm">{percentage}%</td>
                          <td className="py-2 px-3 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                              grade === 'A+' || grade === 'A' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                              grade === 'B' || grade === 'C' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {grade}
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
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 font-semibold mb-0.5">Total Marks</p>
                    <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                      {calculateTotal(result.marks)} / {Object.keys(result.marks).length * 100}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 font-semibold mb-0.5">Percentage</p>
                    <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                      {calculatePercentage(calculateTotal(result.marks), Object.keys(result.marks).length)}%
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 font-semibold mb-0.5">Grade</p>
                    <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                      {calculateGrade(calculatePercentage(calculateTotal(result.marks), Object.keys(result.marks).length))}
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
    </div>
    </>
  );
};

export default Result;
