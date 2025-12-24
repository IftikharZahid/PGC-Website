import { Link } from 'react-router-dom';
import { useState } from 'react';

const CourseSyllabus = () => {
  const [selectedCourse, setSelectedCourse] = useState('CS101');

  const syllabusData = {
    'CS101': {
      code: 'CS101',
      name: 'Introduction to Computer Science',
      credits: 3,
      instructor: 'Prof. Iftikhar Zahid',
      description: 'An introduction to the intellectual enterprises of computer science and the art of programming. This course teaches students how to think algorithmically and solve problems efficiently.',
      objectives: [
        'Understand fundamental concepts of computer science',
        'Develop problem-solving skills using programming',
        'Learn basic data structures and algorithms',
        'Apply computational thinking to real-world problems'
      ],
      topics: [
        { week: '1-2', topic: 'Introduction to Programming', details: 'Variables, Data Types, Input/Output' },
        { week: '3-4', topic: 'Control Structures', details: 'Conditionals, Loops, Functions' },
        { week: '5-6', topic: 'Arrays and Strings', details: 'Array manipulation, String operations' },
        { week: '7-8', topic: 'Object-Oriented Programming', details: 'Classes, Objects, Inheritance' },
        { week: '9-10', topic: 'Data Structures', details: 'Lists, Stacks, Queues' },
        { week: '11-12', topic: 'Algorithms', details: 'Searching, Sorting, Complexity' },
        { week: '13-14', topic: 'File Handling', details: 'Reading/Writing files, Data persistence' },
        { week: '15-16', topic: 'Final Project & Review', details: 'Project presentation, Exam preparation' }
      ],
      grading: [
        { component: 'Assignments', weight: '20%' },
        { component: 'Quizzes', weight: '15%' },
        { component: 'Mid-Term Exam', weight: '25%' },
        { component: 'Final Exam', weight: '30%' },
        { component: 'Class Participation', weight: '10%' }
      ],
      textbooks: [
        'Introduction to Programming in Python by John Guttag',
        'Computer Science: An Overview by Glenn Brookshear'
      ]
    },
    'MATH201': {
      code: 'MATH201',
      name: 'Calculus II',
      credits: 4,
      instructor: 'Prof. Sara Ali',
      description: 'A continuation of Calculus I, covering integration techniques, applications of integration, sequences and series, and introduction to differential equations.',
      objectives: [
        'Master integration techniques and applications',
        'Understand sequences and series convergence',
        'Solve basic differential equations',
        'Apply calculus to solve real-world problems'
      ],
      topics: [
        { week: '1-2', topic: 'Integration Techniques', details: 'Integration by parts, Substitution' },
        { week: '3-4', topic: 'Applications of Integration', details: 'Area, Volume, Work' },
        { week: '5-6', topic: 'Parametric Equations', details: 'Curves, Arc length' },
        { week: '7-8', topic: 'Polar Coordinates', details: 'Polar curves, Area in polar coordinates' },
        { week: '9-10', topic: 'Sequences and Series', details: 'Convergence tests, Power series' },
        { week: '11-12', topic: 'Taylor Series', details: 'Taylor polynomials, Applications' },
        { week: '13-14', topic: 'Differential Equations', details: 'First-order ODEs, Applications' },
        { week: '15-16', topic: 'Review & Exam', details: 'Comprehensive review, Final exam' }
      ],
      grading: [
        { component: 'Homework', weight: '20%' },
        { component: 'Quizzes', weight: '15%' },
        { component: 'Mid-Term Exam', weight: '30%' },
        { component: 'Final Exam', weight: '35%' }
      ],
      textbooks: [
        'Calculus: Early Transcendentals by James Stewart',
        'Thomas\' Calculus by George B. Thomas'
      ]
    },
    'ENG102': {
      code: 'ENG102',
      name: 'English Composition',
      credits: 3,
      instructor: 'Ms. Fatima Noor',
      description: 'An intensive writing course focusing on analytical and argumentative essays, research methods, and effective communication in academic contexts.',
      objectives: [
        'Develop clear and effective writing skills',
        'Master research and citation techniques',
        'Analyze and critique various texts',
        'Improve grammar and style'
      ],
      topics: [
        { week: '1-2', topic: 'Academic Writing Basics', details: 'Thesis statements, Essay structure' },
        { week: '3-4', topic: 'Analytical Essays', details: 'Text analysis, Critical thinking' },
        { week: '5-6', topic: 'Argumentative Writing', details: 'Persuasive techniques, Evidence' },
        { week: '7-8', topic: 'Research Methods', details: 'Finding sources, Evaluating credibility' },
        { week: '9-10', topic: 'Research Paper', details: 'Outlining, Drafting, Citations' },
        { week: '11-12', topic: 'Revision and Editing', details: 'Peer review, Self-editing' },
        { week: '13-14', topic: 'Presentation Skills', details: 'Oral presentations, Visual aids' },
        { week: '15-16', topic: 'Final Portfolio', details: 'Portfolio compilation, Reflection' }
      ],
      grading: [
        { component: 'Essays', weight: '40%' },
        { component: 'Research Paper', weight: '25%' },
        { component: 'Participation', weight: '10%' },
        { component: 'Final Portfolio', weight: '25%' }
      ],
      textbooks: [
        'They Say / I Say by Gerald Graff',
        'The Norton Field Guide to Writing'
      ]
    }
  };

  const courses = [
    { code: 'CS101', name: 'Introduction to Computer Science' },
    { code: 'MATH201', name: 'Calculus II' },
    { code: 'ENG102', name: 'English Composition' }
  ];

  const selectedSyllabus = syllabusData[selectedCourse];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
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
              <div className="text-5xl">📄</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Course Syllabus
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Detailed course information and curriculum
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Select Course
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full md:w-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
          >
            {courses.map(course => (
              <option key={course.code} value={course.code}>
                {course.code} - {course.name}
              </option>
            ))}
          </select>
        </div>

        {/* Syllabus Content */}
        <div className="space-y-6">
          {/* Course Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {selectedSyllabus.name}
                </h2>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Course Code:</span> {selectedSyllabus.code}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Credits:</span> {selectedSyllabus.credits}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Instructor:</span> {selectedSyllabus.instructor}
                  </p>
                </div>
              </div>
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Description</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{selectedSyllabus.description}</p>
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Learning Objectives</h3>
            <ul className="space-y-2">
              {selectedSyllabus.objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Course Topics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Course Topics</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Week</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Topic</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {selectedSyllabus.topics.map((topic, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">{topic.week}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{topic.topic}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{topic.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Grading Policy */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Grading Policy</h3>
            <div className="space-y-3">
              {selectedSyllabus.grading.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{item.component}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-48 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: item.weight }}
                      ></div>
                    </div>
                    <span className="text-primary-600 dark:text-primary-400 font-bold w-12 text-right">{item.weight}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Required Textbooks */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Required Textbooks</h3>
            <ul className="space-y-2">
              {selectedSyllabus.textbooks.map((book, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{book}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Download Button */}
        <div className="mt-6 text-center">
          <button className="btn-primary inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Syllabus PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseSyllabus;
