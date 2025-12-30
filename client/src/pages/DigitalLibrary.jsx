import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, BookOpen, Search, Clock, Download, ExternalLink, ChevronRight, Library, FileText, Video, Headphones } from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';
import collegeBuilding from '../assets/College-Building.png';

const DigitalLibrary = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { id: 'all', label: 'All Resources', icon: Library },
        { id: 'books', label: 'E-Books', icon: Book },
        { id: 'journals', label: 'Journals', icon: FileText },
        { id: 'videos', label: 'Videos', icon: Video },
        { id: 'audio', label: 'Audio', icon: Headphones },
    ];

    const resources = [
        {
            id: 1,
            title: 'Introduction to Physics',
            author: 'Dr. Muhammad Ali',
            category: 'books',
            subject: 'Physics',
            type: 'PDF',
            size: '12.5 MB',
            downloads: 245,
            addedDate: '2024-12-15',
        },
        {
            id: 2,
            title: 'Organic Chemistry Fundamentals',
            author: 'Prof. Sarah Khan',
            category: 'books',
            subject: 'Chemistry',
            type: 'PDF',
            size: '8.2 MB',
            downloads: 189,
            addedDate: '2024-12-10',
        },
        {
            id: 3,
            title: 'Mathematics for Intermediate',
            author: 'Dr. Ahmad Raza',
            category: 'books',
            subject: 'Mathematics',
            type: 'PDF',
            size: '15.8 MB',
            downloads: 312,
            addedDate: '2024-12-08',
        },
        {
            id: 4,
            title: 'English Grammar Complete Guide',
            author: 'Ms. Fatima Zahra',
            category: 'books',
            subject: 'English',
            type: 'PDF',
            size: '6.4 MB',
            downloads: 423,
            addedDate: '2024-12-05',
        },
        {
            id: 5,
            title: 'Computer Science Basics',
            author: 'Mr. Bilal Ahmad',
            category: 'videos',
            subject: 'Computer',
            type: 'Video',
            duration: '2h 30m',
            views: 567,
            addedDate: '2024-12-01',
        },
        {
            id: 6,
            title: 'Urdu Literature Notes',
            author: 'Dr. Nazia Mahmood',
            category: 'journals',
            subject: 'Urdu',
            type: 'PDF',
            size: '4.1 MB',
            downloads: 156,
            addedDate: '2024-11-28',
        },
    ];

    const filteredResources = resources.filter(resource => {
        const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
        const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.subject.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const stats = [
        { label: 'E-Books', count: '500+', icon: Book, color: 'text-blue-500' },
        { label: 'Journals', count: '150+', icon: FileText, color: 'text-purple-500' },
        { label: 'Videos', count: '80+', icon: Video, color: 'text-red-500' },
        { label: 'Audio', count: '40+', icon: Headphones, color: 'text-green-500' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="relative h-[180px] md:h-[200px] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={collegeBuilding}
                        alt="Digital Library"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-secondary-900/70 dark:bg-black/75"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-end pb-6 px-4 sm:px-6">
                    <RevealOnScroll animation="animate-fade-up">
                        <div className="text-white mb-2 flex items-center gap-2 text-xs font-bold tracking-widest uppercase opacity-80">
                            <Link to="/student-dashboard" className="hover:underline">Home</Link>
                            <ChevronRight className="w-3 h-3" />
                            <span>Digital Library</span>
                        </div>
                        <h1 className="text-2xl md:text-4xl font-serif font-bold text-white">
                            Digital Library
                        </h1>
                        <p className="text-white/80 text-sm md:text-base max-w-2xl">
                            Access study materials, e-books, journals, and multimedia resources
                        </p>
                    </RevealOnScroll>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="py-4 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {stats.map((stat, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                <div>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.count}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Search & Filter */}
            <section className="py-4 px-4 bg-white dark:bg-gray-800 sticky top-16 z-20 shadow-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search books, journals, videos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                            />
                        </div>

                        {/* Categories */}
                        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${selectedCategory === cat.id
                                        ? 'bg-primary-600 text-white shadow-sm'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    <cat.icon className="w-3.5 h-3.5" />
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Resources Grid */}
            <section className="py-6 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredResources.length}</span> resources
                        </p>
                    </div>

                    {filteredResources.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">No resources found</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Try adjusting your search or filter</p>
                        </div>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredResources.map((resource) => (
                                <div
                                    key={resource.id}
                                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all group"
                                >
                                    {/* Resource Header */}
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className={`p-2 rounded-lg shrink-0 ${resource.category === 'books' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                                            resource.category === 'videos' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                                                resource.category === 'journals' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' :
                                                    'bg-green-100 dark:bg-green-900/30 text-green-600'
                                            }`}>
                                            {resource.category === 'books' && <Book className="w-4 h-4" />}
                                            {resource.category === 'videos' && <Video className="w-4 h-4" />}
                                            {resource.category === 'journals' && <FileText className="w-4 h-4" />}
                                            {resource.category === 'audio' && <Headphones className="w-4 h-4" />}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">
                                                {resource.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{resource.author}</p>
                                        </div>
                                    </div>

                                    {/* Meta Info */}
                                    <div className="flex items-center gap-3 mb-3 text-xs text-gray-500 dark:text-gray-400">
                                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">{resource.subject}</span>
                                        <span className="flex items-center gap-1">
                                            {resource.type === 'Video' ? (
                                                <>
                                                    <Clock className="w-3 h-3" />
                                                    {resource.duration}
                                                </>
                                            ) : (
                                                <>
                                                    <FileText className="w-3 h-3" />
                                                    {resource.size}
                                                </>
                                            )}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                                        <span className="text-xs text-gray-400">
                                            {resource.downloads ? `${resource.downloads} downloads` : `${resource.views} views`}
                                        </span>
                                        <div className="flex gap-1.5">
                                            <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-md transition-colors" title="Preview">
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </button>
                                            <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-md transition-colors" title="Download">
                                                <Download className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Quick Links */}
            <section className="py-6 px-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Access</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Link
                            to="/digital-library/video-lectures"
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700 group transition-colors"
                        >
                            <Video className="w-5 h-5 text-primary-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">Video Lectures</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Watch courses</p>
                            </div>
                        </Link>
                        <Link
                            to="/course-syllabus"
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700 group transition-colors"
                        >
                            <BookOpen className="w-5 h-5 text-purple-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">Syllabus</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Course outlines</p>
                            </div>
                        </Link>
                        <Link
                            to="/timetable"
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700 group transition-colors"
                        >
                            <Clock className="w-5 h-5 text-orange-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">Timetable</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Class schedule</p>
                            </div>
                        </Link>
                        <Link
                            to="/result"
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700 group transition-colors"
                        >
                            <FileText className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">Results</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">View grades</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DigitalLibrary;
