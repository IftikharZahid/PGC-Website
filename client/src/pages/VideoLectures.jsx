import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Play, Home, Clock, BookOpen } from 'lucide-react';
import YouTube from 'react-youtube';
import DOMPurify from 'dompurify';
import RevealOnScroll from '../components/RevealOnScroll';
import collegeBuilding from '../assets/College-Building.png';

const VideoLectures = () => {
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [expandedWeeks, setExpandedWeeks] = useState({});
    const [videoProgress, setVideoProgress] = useState({});
    const playerRef = useRef(null);

    const [courseContent, setCourseContent] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // Load data from API
    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetch('/api/video-lectures');
                const data = await response.json();

                if (data.success) {
                    // Convert array to map for compatibility with existing code
                    const contentMap = data.data.reduce((acc, week) => {
                        acc[week.courseId] = {
                            ...week,
                            id: week.courseId,
                            lessons: (week.lessons || []).map(l => ({
                                ...l,
                                id: l.lessonId
                            }))
                        };
                        return acc;
                    }, {});
                    setCourseContent(contentMap);
                }
            } catch (error) {
                console.error('Failed to load video lectures:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // Set initial selection
    useEffect(() => {
        if (!isLoading && Object.keys(courseContent).length > 0 && !selectedWeek) {
            const firstWeek = Object.values(courseContent)[0];
            if (firstWeek) {
                setSelectedWeek(firstWeek.id);
                setExpandedWeeks({ [firstWeek.id]: true });
                if (firstWeek.lessons && firstWeek.lessons.length > 0) {
                    setSelectedLesson(firstWeek.lessons[0]);
                }
            }
        }
    }, [courseContent, isLoading, selectedWeek]);

    const toggleWeek = (week) => {
        setExpandedWeeks(prev => ({ ...prev, [week]: !prev[week] }));
    };

    const selectLesson = (weekId, lesson) => {
        setSelectedWeek(weekId);
        setSelectedLesson(lesson);
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    const getFirstLesson = () => {
        const weeks = Object.values(courseContent);
        if (weeks.length > 0 && weeks[0].lessons && weeks[0].lessons.length > 0) return weeks[0].lessons[0];
        return null;
    };

    const currentLesson = selectedLesson || getFirstLesson();

    // Progress Logic
    const handlePlayerReady = (event) => playerRef.current = event.target;

    const saveProgress = (player) => {
        if (!currentLesson) return;
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        const progressPercent = (currentTime / duration) * 100;
        const isCompleted = progressPercent > 90;

        setVideoProgress(prev => {
            const newProgress = {
                ...prev,
                [currentLesson.id]: { currentTime, duration, progressPercent, completed: (prev[currentLesson.id]?.completed || isCompleted) }
            };
            localStorage.setItem('video_progress', JSON.stringify(newProgress));
            return newProgress;
        });
    };

    const handleStateChange = (e) => {
        if (e.data === 2 || e.data === 0) saveProgress(e.target);
    };

    const playNextLesson = () => {
        if (!currentLesson) return;
        const allLessons = Object.values(courseContent).flatMap(week => week.lessons || []);
        const idx = allLessons.findIndex(l => l.id === currentLesson.id);
        if (idx < allLessons.length - 1) {
            const next = allLessons[idx + 1];
            const nextWeek = Object.entries(courseContent).find(([_, w]) => w.lessons && w.lessons.some(l => l.id === next.id));
            if (nextWeek) selectLesson(nextWeek[0], next);
        }
    };

    const youtubeOpts = {
        height: '100%',
        width: '100%',
        playerVars: { autoplay: 0, rel: 0 },
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (Object.keys(courseContent).length === 0) {
        return (
            <div className="min-h-screen pt-32 text-center bg-gray-50 dark:bg-gray-900">
                <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-2">No Lectures Available</h2>
                    <p className="text-gray-600 dark:text-gray-400">Video lectures will appear here once added by the administration.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-800 dark:text-gray-200">
            {/* Hero Section - University Style */}
            <section className="relative h-[200px] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={collegeBuilding}
                        alt="Digital Library"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-secondary-900/60 dark:bg-black/70 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-end pb-6 px-6 md:px-12">
                    <RevealOnScroll animation="animate-fade-up">
                        <div className="text-white mb-2 flex items-center gap-2 text-xs font-bold tracking-widest uppercase opacity-80">
                            <Link to="/student-dashboard" className="hover:underline">Home</Link>
                            <ChevronRight className="w-3 h-3" />
                            <Link to="/digital-library" className="hover:underline">Digital Library</Link>
                            <ChevronRight className="w-3 h-3" />
                            <span>Video Lectures</span>
                        </div>
                        <h1 className="text-2xl md:text-4xl font-serif font-bold text-white mb-2 shadow-md">
                            Video Lectures
                        </h1>
                        <p className="text-white/80 text-lg max-w-2xl font-light">
                            Access your course materials and recorded lectures anytime, anywhere.
                        </p>
                    </RevealOnScroll>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                    {/* Left Sidebar - Course Content */}
                    <div className="lg:col-span-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden sticky top-24">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <h2 className="text-gray-900 dark:text-gray-100 font-bold font-serif text-lg flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary-600" />
                                Course Content
                            </h2>
                        </div>

                        <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
                            {Object.entries(courseContent).map(([weekId, week]) => (
                                <div key={weekId}>
                                    <button
                                        onClick={() => toggleWeek(weekId)}
                                        className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left group"
                                    >
                                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                            {week.title}
                                        </span>
                                        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expandedWeeks[weekId] ? 'rotate-90' : ''}`} />
                                    </button>

                                    {expandedWeeks[weekId] && (
                                        <div className="bg-gray-50 dark:bg-gray-900/30">
                                            {week.lessons && week.lessons.map((lesson, index) => {
                                                const isActive = currentLesson?.id === lesson.id;
                                                return (
                                                    <button
                                                        key={lesson.id}
                                                        onClick={() => selectLesson(weekId, lesson)}
                                                        className={`w-full text-left px-4 py-3 text-xs md:text-sm border-l-4 transition-all flex items-start gap-3 hover:bg-white dark:hover:bg-gray-800 ${isActive
                                                            ? 'border-primary-600 bg-white dark:bg-gray-800 text-primary-700 dark:text-primary-400 font-medium shadow-sm'
                                                            : 'border-transparent text-gray-600 dark:text-gray-400'
                                                            }`}
                                                    >
                                                        <span className="shrink-0 pt-0.5 opacity-50 font-mono text-xs">{(index + 1).toString().padStart(2, '0')}</span>
                                                        <span className={`line-clamp-2 ${isActive ? 'text-gray-900 dark:text-white' : ''}`}>
                                                            {lesson.title}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Content - Video Player */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Video Card */}
                        <div className="bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-gray-900/10">
                            <div className="w-full aspect-video relative group">
                                <YouTube
                                    videoId={currentLesson?.videoId}
                                    opts={youtubeOpts}
                                    onReady={handlePlayerReady}
                                    onStateChange={handleStateChange}
                                    className="w-full h-full"
                                    iframeClassName="w-full h-full"
                                />
                            </div>
                        </div>

                        {/* Info Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                                        {currentLesson?.title}
                                    </h1>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700 font-medium">
                                            <Clock className="w-3.5 h-3.5" />
                                            {currentLesson?.duration}
                                        </span>
                                        {currentLesson && videoProgress[currentLesson.id]?.progressPercent > 0 && (
                                            <span className="text-secondary-600 dark:text-secondary-400 font-medium">
                                                {Math.round(videoProgress[currentLesson.id].progressPercent)}% watched
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex shrink-0">
                                    <button
                                        onClick={playNextLesson}
                                        className="btn-primary flex items-center gap-2 py-2 px-6 text-sm"
                                    >
                                        Next Lesson <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Lecture Overview</h3>
                                <div
                                    className="prose prose-sm md:prose-base max-w-none text-gray-600 dark:text-gray-300 prose-headings:font-serif prose-a:text-primary-600 hover:prose-a:text-primary-700"
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(currentLesson?.description || '')
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default VideoLectures;
