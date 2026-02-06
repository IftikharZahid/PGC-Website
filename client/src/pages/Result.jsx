import { useState, useEffect, useCallback } from 'react';
import logo from '../assets/punjab-college-logo.png';
import pgcLogo from '../assets/pgc-logo.png';
import MaintenancePage from './MaintenancePage';
import { RefreshCw, ShieldCheck } from 'lucide-react';

const Result = () => {
  const [roll, setRoll] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPortalEnabled, setIsPortalEnabled] = useState(true);
  const [isCheckingPortal, setIsCheckingPortal] = useState(true);

  const [topPerformers, setTopPerformers] = useState([]);
  const [stats, setStats] = useState({
    perfectScores: 0,
    average: '0%',
    passRate: '0%',
    bestSubject: 'N/A'
  });

  // Captcha state
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, operator: '+', answer: 0 });
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  // Generate new captcha
  const generateCaptcha = useCallback(() => {
    const operators = ['+', '-', '×'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let num1, num2, answer;

    switch (operator) {
      case '+':
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 20) + 10;
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = num1 - num2;
        break;
      case '×':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = num1 * num2;
        break;
      default:
        num1 = 5;
        num2 = 3;
        answer = 8;
    }

    setCaptcha({ num1, num2, operator, answer });
    setCaptchaInput('');
    // setCaptchaError(''); // Removed to keep error message visible on wrong answer
  }, []);

  // Initialize captcha on mount
  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  // Check if Result Portal is enabled
  useEffect(() => {
    const checkPortalStatus = async () => {
      try {
        const response = await fetch('/api/settings/resultPortalEnabled');
        const data = await response.json();
        if (data.success) {
          setIsPortalEnabled(data.data.value !== false);
        }
      } catch (error) {
        console.error('Failed to check portal status:', error);
        setIsPortalEnabled(true);
      } finally {
        setIsCheckingPortal(false);
      }
    };
    checkPortalStatus();
  }, []);

  // Fetch stats 
  useEffect(() => {
    const refreshData = async () => {
      try {
        const response = await fetch('/api/results/public/stats');
        const data = await response.json();
        if (data.success) {
          setTopPerformers(data.data.topPerformers || []);
          setStats(prev => ({ ...prev, ...data.data.stats }));
        }
      } catch (err) {
        console.error('Error fetching public stats:', err);
      }
    };
    refreshData();
  }, [result]);

  const fetchResult = async (rollNo) => {
    try {
      const response = await fetch(`/api/results/public/${rollNo}`);
      const data = await response.json();

      if (data.success) {
        const foundResult = data.data;
        return {
          name: foundResult.name,
          roll: foundResult.roll,
          class: foundResult.class || '10th',
          fatherName: foundResult.fatherName || 'N/A',
          session: '2024-25',
          marks: foundResult.marks,
          maxMarks: foundResult.maxMarks || {},
          totalMarks: foundResult.totalMarks || 0,
          obtainedMarks: foundResult.obtainedMarks || 0,
          percentage: foundResult.percentage || 0,
          grade: foundResult.grade || 'N/A',
          position: foundResult.position || '-'
        };
      }
      return null;
    } catch (err) {
      console.error("Error fetching result:", err);
      return null;
    }
  };

  const handleSearch = async () => {
    // Clear previous errors
    setError('');
    setCaptchaError('');

    // Step 1: Validate roll number first
    if (!roll.trim()) {
      setError("Please enter a Roll Number");
      setResult(null);
      return;
    }

    // Step 2: Check if captcha is filled
    if (!captchaInput.trim()) {
      setCaptchaError('Please solve the captcha first');
      return;
    }

    // Step 3: Validate captcha answer
    const userAnswer = parseInt(captchaInput, 10);
    if (isNaN(userAnswer) || userAnswer !== captcha.answer) {
      setCaptchaError('Incorrect captcha');
      generateCaptcha();
      return;
    }

    // All validations passed - proceed with search
    setLoading(true);
    setResult(null);

    // UX delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const data = await fetchResult(roll.trim());

    if (!data) {
      setError("Result not found for this Roll Number.");
      setResult(null);
    } else {
      setResult(data);
    }
    setLoading(false);

    // Generate new captcha for next search
    generateCaptcha();
  };

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

  const getRemarks = (grade) => {
    switch (grade) {
      case 'A+': return 'Excellent';
      case 'A': return 'Very Good';
      case 'B': return 'Good';
      case 'C': return 'Fair';
      case 'D': return 'Satisfactory';
      case 'E': return 'Needs Improvement';
      case 'F': return 'Fail';
      default: return '-';
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
        
        .seeks-font {
          font-family: 'Roboto', sans-serif;
        }

        @media print {
          @page {
            size: A4;
            margin: 0.5cm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            background: white !important;
          }
          /* Hide non-printable elements */
          nav, footer, aside, .print\\:hidden, .no-print {
            display: none !important;
          }
          /* Reset layout for print */
          .min-h-screen {
             height: auto !important;
             overflow: visible !important;
             padding: 0 !important;
             background: white !important;
          }
           /* Ensure generic Layout wrappers don't constrain width */
          .max-w-7xl, .max-w-5xl, .max-w-4xl {
            max-width: none !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>

      {isCheckingPortal ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : !isPortalEnabled ? (
        <MaintenancePage
          title="Portal Closed"
          message="The result viewing portal is temporarily unavailable."
          statusTitle="Notice"
          statusMessage="Results are currently being updated. Please verify with the administration office."
          icon="lock"
        />
      ) : (
        <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50 dark:bg-gray-900 print:pt-4 print:pb-0 print:px-0">
          <div className="flex gap-6 max-w-7xl mx-auto print:block">

            {/* Sidebar (Screen only) */}
            <aside className="hidden xl:block w-72 flex-shrink-0 print:hidden">
              <div className="sticky top-28 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2 uppercase">
                    🏆 Top Performers
                  </h3>
                </div>
                <div className="p-3 space-y-2">
                  {topPerformers.slice(0, 5).map((s, i) => (
                    <div key={i} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded border-b border-gray-100 last:border-0 dark:border-gray-700">
                      <div className="flex flex-col">
                        <span className="text-gray-900 dark:text-gray-100 font-medium">{s.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Roll: {s.roll}</span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-gray-100">{parseInt(s.percentage)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0 print:max-w-none">

              {/* Search Box (Screen Only) */}
              <div className="max-w-4xl mx-auto mb-6 print:hidden">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-all hover:shadow-md">
                  <label className="block text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wide">
                    Search Student Result
                  </label>
                  <div className="flex flex-row gap-2 sm:gap-3">
                    <input
                      type="text"
                      placeholder="Enter Roll No"
                      className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 min-w-0"
                      value={roll}
                      onChange={(e) => setRoll(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                      onClick={handleSearch}
                      disabled={loading}
                      className="btn-primary rounded-md px-3 sm:px-6 py-2 shadow-sm text-sm font-bold uppercase transition-colors bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
                    >
                      {loading ? 'Searching...' : 'View Result'}
                    </button>
                  </div>

                  {/* Compact Captcha Section */}
                  <div className="mt-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <div className="bg-slate-800 dark:bg-slate-900 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded font-mono text-sm sm:text-base font-bold select-none">
                        {captcha.num1} {captcha.operator} {captcha.num2} = ?
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="?"
                        value={captchaInput}
                        onChange={(e) => {
                          // Only allow numbers
                          const val = e.target.value.replace(/[^0-9-]/g, '');
                          setCaptchaInput(val);
                          if (captchaError) setCaptchaError('');
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className={`w-14 sm:w-16 px-2 py-1 sm:py-1.5 border rounded dark:bg-gray-700 dark:text-white text-center font-semibold text-sm transition-colors ${captchaError
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                          }`}
                      />
                      <button
                        onClick={() => {
                          setCaptchaError('');
                          generateCaptcha();
                        }}
                        type="button"
                        className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                        title="Refresh"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {captchaError && (
                      <div className="mt-2 text-red-600 dark:text-red-400 text-xs font-medium">
                        ⚠️ {captchaError}
                      </div>
                    )}
                  </div>

                  {error && <div className="mt-3 text-red-600 text-sm font-medium">{error}</div>}
                </div>
              </div>

              {/* RESULT SHEET CARD */}
              {result && (
                <div className="bg-white text-gray-900 font-sans shadow-lg print:shadow-none print:w-full max-w-[210mm] mx-auto p-4 sm:p-8 print:p-0 seeks-font overflow-x-auto">

                  {/* HEADER */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="flex items-center justify-center gap-4 mb-2 w-full relative">
                      {/* Logo Absolute Left for print, or flex for web */}
                      <div className="print:absolute print:left-0 md:absolute md:left-0">
                        <img src={logo} alt="Logo" className="w-20 h-20 object-contain" />
                      </div>

                      <div className="text-center w-full">
                        <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-1 tracking-tight">PUNJAB GROUP OF COLLEGES</h1>
                        <h2 className="text-base sm:text-xl md:text-2xl font-bold text-slate-700 mb-2">FORT ABBAS CAMPUS</h2>
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <h3 className="text-base md:text-lg font-medium text-slate-600 underline decoration-slate-400 underline-offset-4">
                            Haronabad Road, 2 Km Fort Abbas
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cut Line / Divider */}
                  <div className="border-t border-slate-200 mb-6"></div>

                  {/* STUDENT INFO GRID - 2 columns on mobile, 4 on desktop */}
                  <div className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto_1fr] gap-x-3 sm:gap-x-4 gap-y-2 sm:gap-y-4 mb-6 sm:mb-8 text-xs sm:text-sm md:text-base">
                    <div className="font-bold text-slate-800">Name:</div>
                    <div className="text-slate-900 font-medium">{result.name}</div>

                    <div className="font-bold text-slate-800">Roll No.</div>
                    <div className="text-slate-900 font-medium">{result.roll}</div>

                    <div className="font-bold text-slate-800">Father Name:</div>
                    <div className="text-slate-900 font-medium">{result.fatherName}</div>

                    <div className="font-bold text-slate-800">Class:</div>
                    <div className="text-slate-900 font-medium">{result.class}</div>
                  </div>

                  {/* TABLE */}
                  <div className="mb-6 border rounded-sm overflow-x-auto border-slate-300">
                    <table className="w-full text-xs sm:text-sm min-w-[500px]">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-300 text-slate-800">
                          <th className="py-3 px-4 text-left font-bold border-r border-slate-300 w-1/3">Subjects</th>
                          <th className="py-3 px-2 text-center font-bold border-r border-slate-300">Total</th>
                          <th className="py-3 px-2 text-center font-bold border-r border-slate-300">Obtained</th>
                          <th className="py-3 px-2 text-center font-bold border-r border-slate-300">%</th>
                          <th className="py-3 px-2 text-center font-bold border-r border-slate-300">Grade</th>
                          <th className="py-3 px-4 text-left font-bold">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {Object.entries(result.marks).map(([subject, mark]) => {
                          const max = result.maxMarks?.[subject] || 100;
                          const pct = ((mark / max) * 100).toFixed(1);
                          const grade = calculateGrade(pct);
                          const remarks = getRemarks(grade);

                          return (
                            <tr key={subject}>
                              <td className="py-3 px-4 font-medium italic text-slate-800 border-r border-slate-200">{subject}</td>
                              <td className="py-3 px-2 text-center text-slate-600 border-r border-slate-200">{max}</td>
                              <td className="py-3 px-2 text-center text-slate-600 border-r border-slate-200">{mark}</td>
                              <td className="py-3 px-2 text-center text-slate-600 border-r border-slate-200">{pct}</td>
                              <td className="py-3 px-2 text-center text-slate-600 border-r border-slate-200">{grade}</td>
                              <td className="py-3 px-4 text-left text-slate-500 text-xs">{remarks}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      {/* TOTAL FOOTER ROW */}
                      <tfoot className="bg-slate-50 border-t border-slate-300 font-bold text-slate-900">
                        <tr>
                          <td className="py-3 px-4 text-center border-r border-slate-300">Total</td>
                          <td className="py-3 px-2 text-center border-r border-slate-300">{result.totalMarks}</td>
                          <td className="py-3 px-2 text-center border-r border-slate-300">{result.obtainedMarks}</td>
                          <td className="py-3 px-2 text-center border-r border-slate-300">{Number(result.percentage).toFixed(1)}</td>
                          <td colSpan={2} className="py-3 px-4 text-right">
                            Position: {result.position}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* BOTTOM MESSAGE */}
                  <div className="text-center text-sm text-slate-900 font-medium mb-12 mt-8">
                    Please contact the Principal for further support with your child's progress.
                  </div>

                  {/* SIGNATURE */}
                  <div className="mb-12">
                    <div className="flex items-end gap-4">
                      <span className="font-bold text-slate-800 text-sm">Parent's Signature:</span>
                      <div className="flex-1 border-b border-slate-400"></div>
                      <div className="w-1/3"></div> {/* Spacer to keep line generic length */}
                    </div>
                  </div>
                </div>
              )}

              {/* Print Button (Screen Wrapper) */}
              {result && (
                <div className="text-center mt-8 print:hidden">
                  <button onClick={() => window.print()} className="bg-slate-800 text-white px-6 py-2 rounded font-bold shadow hover:bg-slate-700">
                    Print Result
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Result;
