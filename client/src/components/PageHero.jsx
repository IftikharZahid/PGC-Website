import { useTheme } from '../context/ThemeContext';

/**
 * Reusable Page Hero Component
 * Renders hero section based on heroStyle from ThemeContext
 * @param {string} title - Main heading text
 * @param {string} subtitle - Subheading text
 */
const PageHero = ({ title, subtitle }) => {
    const { heroStyle } = useTheme();

    if (heroStyle === 'classic') {
        // Classic Style: Solid teal background with dark overlay
        return (
            <section className="relative px-4 bg-secondary-700 dark:bg-gray-800 text-white overflow-hidden h-[180px] md:h-[200px]">
                <div className="absolute inset-0 bg-black/25 dark:bg-black/40"></div>
                <div className="relative max-w-7xl mx-auto h-full flex items-center justify-center">
                    <div className="text-center animate-fade-in w-full py-4">
                        <h1 className="text-2xl md:text-4xl font-bold mt-20 text-white">{title}</h1>
                        <p className="text-sm md:text-base text-white/90 dark:text-gray-300 max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    // Modern Style: Creamy background with diagonal gradient decorations
    return (
        <section className="relative px-4 bg-[#f4f1ea] dark:bg-gray-900 overflow-hidden h-[180px] md:h-[200px]">
            {/* Background Decor - Diagonals */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary-600 to-primary-800 transform rotate-45 translate-x-1/3 -translate-y-1/2 opacity-90 z-0"></div>
            <div className="absolute top-5 right-0 w-[550px] h-[550px] bg-primary-400 transform rotate-45 translate-x-1/3 -translate-y-1/2 opacity-60 z-0"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-primary-700 to-primary-900 transform rotate-45 -translate-x-1/2 translate-y-1/2 opacity-90 z-0"></div>

            <div className="relative max-w-7xl mx-auto h-full flex items-center justify-center z-10">
                <div className="text-center animate-fade-in">
                    <h1 className="text-2xl md:text-4xl font-bold font-serif text-white mt-14 drop-shadow-sm">{title}</h1>
                    <p className="text-sm md:text-base text-gray-100 dark:text-gray-300 max-w-xl mx-auto mt-2">
                        {subtitle}
                    </p>
                    <div className="h-1 w-16 bg-primary-600 rounded-full mx-auto mt-3"></div>
                </div>
            </div>
        </section>
    );
};

export default PageHero;
