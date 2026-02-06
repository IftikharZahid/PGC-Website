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
    const videoPlayerContainerRef = useRef(null);

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
        // Scroll to video player with a slight delay to ensure render
        setTimeout(() => {
            videoPlayerContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
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
            {/* Hero Section - Fully Responsive */}
            <section className="relative h-[140px] sm:h-[160px] md:h-[200px] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={collegeBuilding}
                        alt="Digital Library"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-secondary-900/60 dark:bg-black/70 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-end pb-4 sm:pb-6 px-4 sm:px-6">
                    <RevealOnScroll animation="animate-fade-up">
                        <div className="text-white mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-bold tracking-widest uppercase opacity-80 flex-wrap">
                            <Link to="/student-dashboard" className="hover:underline">Home</Link>
                            <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            <Link to="/digital-library" className="hover:underline">Digital Library</Link>
                            <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            <span>Video Lectures</span>
                        </div>
                        <h1 className="text-xl sm:text-2xl md:text-4xl font-serif font-bold text-white mb-1 sm:mb-2">
                            Video Lectures
                        </h1>
                        <p className="text-white/80 text-xs sm:text-sm md:text-lg max-w-2xl font-light hidden sm:block">
                            Access your course materials and recorded lectures anytime, anywhere.
                        </p>
                    </RevealOnScroll>
                </div>
            </section>

            {/* Main Content - Fully Responsive */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
                {/* Mobile: Video first, then Sidebar. Desktop: Sidebar left, Video right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start">

                    {/* Video Player - Shows second on mobile, takes 8 cols on right on desktop */}
                    <div ref={videoPlayerContainerRef} className="order-2 lg:order-2 lg:col-span-8 space-y-4 sm:space-y-6 scroll-mt-24">
                        {/* Video Card */}
                        <div className="bg-black rounded-lg sm:rounded-xl overflow-hidden shadow-xl sm:shadow-2xl ring-1 ring-gray-900/10">
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
                        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                                <div>
                                    <h1 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-gray-900 dark:text-white mb-1">
                                        {currentLesson?.title}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 font-medium">
                                            <Clock className="w-3 h-3" />
                                            {currentLesson?.duration}
                                        </span>
                                        {currentLesson && videoProgress[currentLesson.id]?.progressPercent > 0 && (
                                            <span className="text-secondary-600 dark:text-secondary-400 font-medium">
                                                {Math.round(videoProgress[currentLesson.id].progressPercent)}% watched
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={playNextLesson}
                                    className="btn-primary flex items-center gap-2 py-2 px-4 text-xs sm:text-sm self-start"
                                >
                                    Next Lesson <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Lecture Overview</h3>
                                <div
                                    className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300 prose-headings:font-serif prose-a:text-primary-600 hover:prose-a:text-primary-700 overflow-x-auto break-words prose-pre:overflow-x-auto prose-pre:text-xs prose-img:max-w-full prose-img:h-auto"
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(currentLesson?.description || '')
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Left Sidebar - Course Content - Shows first on mobile, takes 4 cols on left on desktop */}
                    <div className="order-1 lg:order-1 lg:col-span-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl shadow-sm overflow-hidden lg:sticky lg:top-24">
                        <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <h2 className="text-gray-900 dark:text-gray-100 font-bold font-serif text-sm md:text-base flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-primary-600" />
                                Course Content
                            </h2>
                        </div>

                        <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[50vh] lg:max-h-[calc(100vh-350px)] overflow-y-auto custom-scrollbar">
                            {Object.entries(courseContent).map(([weekId, week]) => (
                                <div key={weekId}>
                                    <button
                                        onClick={() => toggleWeek(weekId)}
                                        className="w-full flex items-center justify-between px-3 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left group"
                                    >
                                        <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
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
                                                        className={`w-full text-left px-3 py-2 text-xs border-l-4 transition-all flex items-start gap-2 hover:bg-white dark:hover:bg-gray-800 ${isActive
                                                            ? 'border-primary-600 bg-white dark:bg-gray-800 text-primary-700 dark:text-primary-400 font-medium shadow-sm'
                                                            : 'border-transparent text-gray-600 dark:text-gray-400'
                                                            }`}
                                                    >
                                                        <span className="shrink-0 pt-0.5 opacity-50 font-mono">{(index + 1).toString().padStart(2, '0')}</span>
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

                </div>
            </div>
        </div>
    );
};

export default VideoLectures;
