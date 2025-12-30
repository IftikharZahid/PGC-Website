import { getItems, STORAGE_KEYS } from '../utils/adminStorage';

const DebugResults = () => {
    const results = getItems(STORAGE_KEYS.RESULTS);
    const subjects = getItems(STORAGE_KEYS.SUBJECTS);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    🔍 Debug: Results Storage
                </h1>

                {/* Results */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        📊 Results in Storage: {results.length}
                    </h2>

                    {results.length === 0 ? (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300">
                            ❌ No results found in localStorage!
                            <br />
                            <span className="text-sm">Add results from admin panel: /admin/results</span>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {results.map((result, idx) => (
                                <div
                                    key={idx}
                                    className={`p-4 rounded-lg border-2 ${result.published
                                            ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                                            : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                                {result.studentName || 'Unknown Student'}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Roll No: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded font-mono font-bold">{result.rollNo}</code>
                                            </p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${result.published
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-yellow-600 text-white'
                                                }`}
                                        >
                                            {result.published ? '✅ Published' : '❌ Not Published'}
                                        </span>
                                    </div>

                                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                        <p>📚 Course: {result.course}</p>
                                        <p>📅 Semester: {result.semester}</p>
                                        <p>📝 Marks: {result.marks ? Object.keys(result.marks).length : 0} subjects</p>
                                        {result.position && <p>🏆 Position: {result.position}</p>}
                                    </div>

                                    {result.marks && (
                                        <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                                Subject Marks:
                                            </p>
                                            <code className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded block overflow-auto">
                                                {JSON.stringify(result.marks, null, 2)}
                                            </code>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Subjects */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        📚 Subjects in Storage: {subjects.length}
                    </h2>

                    {subjects.length === 0 ? (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300">
                            ❌ No subjects found!
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {subjects.map((subject, idx) => (
                                <div
                                    key={idx}
                                    className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-2 rounded"
                                >
                                    {subject.subjectName}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                    <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2">💡 How to Fix:</h3>
                    <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-decimal list-inside">
                        <li>If no results: Go to <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded">/admin/results</code> and add results</li>
                        <li>If "Not Published": Edit the result and check the "Published" checkbox</li>
                        <li>Make sure the roll number matches exactly (case-sensitive)</li>
                        <li>Verify subjects exist in the system</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default DebugResults;
