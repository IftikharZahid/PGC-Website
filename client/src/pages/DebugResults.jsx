import { getItems, STORAGE_KEYS, deleteItem } from '../utils/adminStorage';
import { useState } from 'react';

const DebugResults = () => {
    const [refresh, setRefresh] = useState(0);
    const results = getItems(STORAGE_KEYS.RESULTS) || [];
    const subjects = getItems(STORAGE_KEYS.SUBJECTS) || [];

    // Check for duplicates
    const rollCounts = results.reduce((acc, r) => {
        const roll = (r.rollNo || '').trim().toLowerCase();
        if (roll) acc[roll] = (acc[roll] || 0) + 1;
        return acc;
    }, {});

    const duplicates = Object.entries(rollCounts)
        .filter(([_, count]) => count > 1)
        .map(([roll]) => roll);

    const handleFixDuplicates = () => {
        if (!confirm('This will delete duplicate records, keeping only the published (or latest) version for each student. Continue?')) return;

        let deletedCount = 0;
        duplicates.forEach(duplicateRoll => {
            // Find all matches
            const matches = results.filter(r => (r.rollNo || '').trim().toLowerCase() === duplicateRoll);

            // Sort to find the "best" one to keep
            // Priority: Published > Most Marks > Latest
            matches.sort((a, b) => {
                if (a.isPublished !== b.isPublished) return a.isPublished ? -1 : 1; // Keep published
                if (a.published !== b.published) return a.published ? -1 : 1; // Legacy published
                return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0); // Keep latest
            });

            // Keep matches[0], delete the rest
            const toDelete = matches.slice(1);
            toDelete.forEach(r => {
                deleteItem(STORAGE_KEYS.RESULTS, r.id);
                deletedCount++;
            });
        });

        alert(`Fixed! Deleted ${deletedCount} duplicate records.`);
        setRefresh(prev => prev + 1); // Force re-render
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        🔍 Debug: Results Storage
                    </h1>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>

                {/* Duplicates Warning */}
                {duplicates.length > 0 && (
                    <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 shadow-lg rounded-r">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    CRITICAL: DUPLICATES DETECTED!
                                </h3>
                                <p className="mt-1">
                                    The system found {duplicates.length} roll number(s) with multiple entries.
                                    This explains why "Unpublished" results might still be visible (a published duplicate exists).
                                </p>
                                <ul className="list-disc list-inside mt-3 font-mono font-bold bg-white/50 p-2 rounded">
                                    {duplicates.map(roll => (
                                        <li key={roll}>
                                            {roll.toUpperCase()}
                                            <span className="text-sm font-normal ml-2 text-red-600">
                                                ({rollCounts[roll]} copies found)
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button
                                onClick={handleFixDuplicates}
                                className="ml-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-md transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
                            >
                                🔧 Auto-Fix All Duplicates
                            </button>
                        </div>
                    </div>
                )}

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
                            {results.map((result, idx) => {
                                const isDuplicate = rollCounts[(result.rollNo || '').trim().toLowerCase()] > 1;
                                return (
                                    <div
                                        key={idx}
                                        className={`p-4 rounded-lg border-2 relative ${result.published || result.isPublished
                                            ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                                            : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'}
                                            ${isDuplicate ? 'ring-4 ring-red-400' : ''}
                                    `}
                                    >
                                        {isDuplicate && <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl">DUPLICATE</div>}

                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                                    {result.studentName || 'Unknown Student'}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    Roll No: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded font-mono font-bold">{result.rollNo}</code>
                                                </p>
                                                <p className="text-xs text-gray-400 font-mono mt-1">ID: {result.id}</p>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${result.published || result.isPublished
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-yellow-600 text-white'
                                                    }`}
                                            >
                                                {result.published || result.isPublished ? '✅ Published' : '❌ Draft'}
                                            </span>
                                        </div>

                                        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                            <p>📚 Course: {result.course}</p>
                                            <p>📅 Semester: {result.semester}</p>
                                            <p className="text-xs text-gray-500">Raw Published Value: {String(result.isPublished)} (Legacy: {String(result.published)})</p>
                                        </div>
                                    </div>
                                )
                            })}
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
            </div>
        </div>
    );
};

export default DebugResults;
