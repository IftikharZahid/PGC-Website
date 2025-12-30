// LocalStorage utility functions for admin panel data management

import Principal from '../assets/staff/SirAhamdRaza.png';
import ComputerScience from '../assets/staff/IftikharSahab.png';
import Chemistry from '../assets/staff/ArshadSahab.png';
import Physics from '../assets/staff/JavedSahab.png';
import Biology from '../assets/staff/SyedSultanSahab.png';
import Islamiat from '../assets/staff/SaleemSahab.png';
import Urdu from '../assets/staff/SohaibSahab.png';
import IslamicStudies from '../assets/staff/BilalSahab.png';
import HaseebJalal from '../assets/staff/HaseebJalal.png';
import Farzana from '../assets/staff/FemaleUserProfile.png';
import Zainab from '../assets/staff/FemaleUserProfile.png';
import Aqsa from '../assets/staff/FemaleUserProfile.png';

/**
 * Get all items from localStorage by key
 */
export const getItems = (key) => {
    try {
        const items = localStorage.getItem(key);
        const parsed = items ? JSON.parse(items) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error(`Error getting items for key ${key}:`, error);
        return [];
    }
};

/**
 * Generate a random ID
 */
export const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
};

/**
 * Get a single item by ID
 */
export const getItemById = (key, id) => {
    const items = getItems(key);
    return items.find(item => item.id === id);
};

/**
 * Add a new item (auto-generates ID)
 */
export const addItem = (key, item) => {
    try {
        const items = getItems(key);
        const newItem = {
            ...item,
            id: item.id || generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        items.push(newItem);
        localStorage.setItem(key, JSON.stringify(items));
        return newItem;
    } catch (error) {
        console.error(`Error adding item to ${key}:`, error);
        throw error;
    }
};

/**
 * Update an existing item
 */
export const updateItem = (key, id, updates) => {
    try {
        const items = getItems(key);
        const index = items.findIndex(item => item.id === id);
        if (index === -1) {
            throw new Error(`Item with id ${id} not found in ${key}`);
        }
        items[index] = {
            ...items[index],
            ...updates,
            id, // Preserve the ID
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem(key, JSON.stringify(items));
        return items[index];
    } catch (error) {
        console.error(`Error updating item in ${key}:`, error);
        throw error;
    }
};

/**
 * Delete an item by ID
 */
export const deleteItem = (key, id) => {
    try {
        const items = getItems(key);
        const filteredItems = items.filter(item => item.id !== id);
        localStorage.setItem(key, JSON.stringify(filteredItems));
        return true;
    } catch (error) {
        console.error(`Error deleting item from ${key}:`, error);
        throw error;
    }
};

/**
 * Clear all items for a key
 */
export const clearItems = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error clearing items for ${key}:`, error);
        throw error;
    }
};



/**
 * Search items by query (searches all string fields)
 */
export const searchItems = (key, query) => {
    const items = getItems(key);
    if (!query) return items;

    const lowerQuery = query.toLowerCase();
    return items.filter(item =>
        Object.values(item).some(value =>
            typeof value === 'string' && value.toLowerCase().includes(lowerQuery)
        )
    );
};

/**
 * Filter items by field value
 */
export const filterItems = (key, field, value) => {
    const items = getItems(key);
    return items.filter(item => item[field] === value);
};

// Storage keys constants
export const STORAGE_KEYS = {
    STUDENTS: 'admin_students',
    TEACHERS: 'admin_teachers',
    COURSES: 'admin_courses',
    SUBJECTS: 'admin_subjects',
    RESULTS: 'admin_results',
    ADMISSIONS: 'admin_admissions',
    ANNOUNCEMENTS: 'announcements',
    FEES: 'admin_fees',
    SETTINGS: 'admin_settings',
    ACTIVITY: 'admin_activity',
    VIDEO_LECTURES: 'admin_video_lectures',
    GALLERY: 'admin_gallery',
    NOTIFICATION: 'admin_notification'
};

/**
 * Initialize demo data if storage is empty
 */
export const initializeDemoData = () => {
    // Initialize students
    if (getItems(STORAGE_KEYS.STUDENTS).length === 0) {
        const demoStudents = [
            { name: 'Ahmed Ali', rollNo: 'PGC-2024-001', course: 'FSc Pre-Engineering', semester: '1st Year', email: 'ahmed@example.com', phone: '0300-1234567', status: 'Active' },
            { name: 'Fatima Khan', rollNo: 'PGC-2024-002', course: 'FSc Pre-Medical', semester: '1st Year', email: 'fatima@example.com', phone: '0301-2345678', status: 'Active' },
            { name: 'Hassan Raza', rollNo: 'PGC-2024-003', course: 'ICS', semester: '2nd Year', email: 'hassan@example.com', phone: '0302-3456789', status: 'Active' },
            { name: 'Ayesha Malik', rollNo: 'PGC-2024-004', course: 'FSc Pre-Engineering', semester: '2nd Year', email: 'ayesha@example.com', phone: '0303-4567890', status: 'Active' },
            { name: 'Usman Tariq', rollNo: 'PGC-2024-005', course: 'FSc Pre-Medical', semester: '1st Year', email: 'usman@example.com', phone: '0304-5678901', status: 'Inactive' }
        ];
        demoStudents.forEach(student => addItem(STORAGE_KEYS.STUDENTS, student));
    }

    // Initialize teachers
    if (getItems(STORAGE_KEYS.TEACHERS).length === 0) {
        const demoTeachers = [
            {
                name: "Muhammad Ahmad Raza Watto",
                designation: "Principal/Director",
                department: "Administration",
                image: Principal,
                qualification: "Ph.D. Education",
                experience: "10+ Years",
                subjects: ["Management"],
                email: "principal@pgc.edu.pk",
                phone: "0300-1112223",
                status: "Active"
            },
            {
                name: "Mr. Arshad Bhutta",
                designation: "Disipline Incharge",
                department: "Chemistry",
                image: Chemistry,
                qualification: "MSc Chemistry",
                experience: "8+ Years",
                subjects: ["Chemistry"],
                email: "arshad.bhutta@pgc.edu.pk",
                phone: "0300-2223334",
                status: "Active"
            },
            {
                name: "Mr. Bilal Ahmad",
                designation: "Senior Lecturer Islamiat",
                department: "Islamic Studies",
                qualification: "MA Islamiat",
                experience: "8+ Years",
                image: IslamicStudies,
                subjects: ["Islamiyat", "Tarjuma tul Quran"],
                email: "bilal.ahmad@pgc.edu.pk",
                phone: "0300-3334445",
                status: "Active"
            },
            {
                name: "Mr. Saleem Khan",
                designation: "Senior Lecturer Islamiat",
                department: "Islamic Studies",
                qualification: "MA Islamiat",
                experience: "8+ Years",
                image: Islamiat,
                subjects: ["Islamiyat"],
                email: "saleem.khan@pgc.edu.pk",
                phone: "0300-4445556",
                status: "Active"
            },
            {
                name: "Mr. Sohaib Anjum",
                designation: "Senior Lecturer Urdu",
                department: "Humanities",
                qualification: "MA Urdu",
                experience: "8+ Years",
                image: Urdu,
                subjects: ["Urdu"],
                email: "sohaib.anjum@pgc.edu.pk",
                phone: "0300-5556667",
                status: "Active"
            },
            {
                name: "Mrs. Javed Iqbal",
                designation: "HOD Physics",
                department: "Science",
                qualification: "M.Phil Physics",
                experience: "8+ Years",
                image: Physics,
                subjects: ["Physics"],
                email: "javed.iqbal@pgc.edu.pk",
                phone: "0300-6667778",
                status: "Active"
            },
            {
                name: "Mr. Iftikhar Ahmad Zahid",
                designation: "Lecturer",
                department: "Computer Science",
                qualification: "MSC(CS)",
                image: ComputerScience,
                experience: "6+ Years",
                subjects: ["Computer Science"],
                email: "iftikhar.zahid@pgc.edu.pk",
                phone: "0300-7778889",
                status: "Active"
            },
            {
                name: "Mr. Syed Sultan Shah",
                designation: "Lecturer",
                department: "Biology",
                qualification: "MSC(Biology)",
                experience: "6+ Years",
                image: Biology,
                subjects: ["Biology"],
                email: "sultan.shah@pgc.edu.pk",
                phone: "0300-8889990",
                status: "Active"
            },
            {
                name: "Mr. Haseeb Jalal",
                designation: "Admin Officer",
                department: "Administration",
                qualification: "BS Remote Sensing & GIS",
                experience: "6+ Years",
                image: HaseebJalal,
                subjects: ["Administration"],
                email: "haseeb.jalal@pgc.edu.pk",
                phone: "0300-9990001",
                status: "Active"
            },
            {
                name: "Ms. Farzana",
                designation: "Assitant Professor",
                department: "Humanities",
                qualification: "MA Urdu",
                experience: "6+ Years",
                image: Farzana,
                subjects: ["Urdu"],
                email: "farzana@pgc.edu.pk",
                phone: "0300-1010101",
                status: "Active"
            },
            {
                name: "Ms. Zainab",
                designation: "English",
                department: "Humanities",
                qualification: "MA English",
                experience: "6+ Years",
                image: Zainab,
                subjects: ["English"],
                email: "zainab@pgc.edu.pk",
                phone: "0300-2020202",
                status: "Active"
            },
            {
                name: "Ms. Aqsa Chaudhry",
                designation: "Assistant Accountant",
                department: "Administration",
                qualification: "BSc",
                experience: "5+ Years",
                image: Aqsa,
                subjects: ["Accounting"],
                email: "aqsa.chaudhry@pgc.edu.pk",
                phone: "0300-3030303",
                status: "Active"
            }
        ];
        demoTeachers.forEach(teacher => addItem(STORAGE_KEYS.TEACHERS, teacher));
    }

    // Initialize courses
    if (getItems(STORAGE_KEYS.COURSES).length === 0) {
        const demoCourses = [
            { courseId: 'FSC-PE', courseName: 'FSc Pre-Engineering', duration: '2 years', semesters: 4, subjects: ['Physics', 'Chemistry', 'Mathematics', 'English', 'Urdu', 'Islamiyat'] },
            { courseId: 'FSC-PM', courseName: 'FSc Pre-Medical', duration: '2 years', semesters: 4, subjects: ['Physics', 'Chemistry', 'Biology', 'English', 'Urdu', 'Islamiyat'] },
            { courseId: 'ICS', courseName: 'ICS (Computer Science)', duration: '2 years', semesters: 4, subjects: ['Physics', 'Mathematics', 'Computer Science', 'English', 'Urdu', 'Islamiyat'] },
            { courseId: 'ICOM', courseName: 'I.Com (Commerce)', duration: '2 years', semesters: 4, subjects: ['Accounting', 'Economics', 'Business Studies', 'English', 'Urdu', 'Islamiyat'] }
        ];
        demoCourses.forEach(course => addItem(STORAGE_KEYS.COURSES, course));
    }

    // Initialize subjects
    if (getItems(STORAGE_KEYS.SUBJECTS).length === 0) {
        const demoSubjects = [
            { subjectId: 'PHY', subjectName: 'Physics', category: 'Science', totalMarks: 100 },
            { subjectId: 'CHEM', subjectName: 'Chemistry', category: 'Science', totalMarks: 100 },
            { subjectId: 'MATH', subjectName: 'Mathematics', category: 'Science', totalMarks: 100 },
            { subjectId: 'BIO', subjectName: 'Biology', category: 'Science', totalMarks: 100 },
            { subjectId: 'CS', subjectName: 'Computer Science', category: 'Science', totalMarks: 100 },
            { subjectId: 'ENG', subjectName: 'English', category: 'Languages', totalMarks: 100 },
            { subjectId: 'URD', subjectName: 'Urdu', category: 'Languages', totalMarks: 100 },
            { subjectId: 'ISL', subjectName: 'Islamiyat', category: 'Religious', totalMarks: 50 }
        ];
        demoSubjects.forEach(subject => addItem(STORAGE_KEYS.SUBJECTS, subject));
    }

    // Initialize sample results (with published status for testing)
    if (getItems(STORAGE_KEYS.RESULTS).length === 0) {
        // Get the subjects that were just added to get their IDs
        const subjects = getItems(STORAGE_KEYS.SUBJECTS);
        const getSubjectId = (code) => subjects.find(s => s.subjectId === code)?.id || code;

        const demoResults = [
            {
                studentName: 'Ahmed Ali',
                rollNo: 'PGC-2024-001',
                course: 'FSc Pre-Engineering',
                semester: '1st Year',
                marks: {
                    [getSubjectId('PHY')]: 85,
                    [getSubjectId('CHEM')]: 78,
                    [getSubjectId('MATH')]: 92,
                    [getSubjectId('ENG')]: 80,
                    [getSubjectId('URD')]: 75,
                    [getSubjectId('ISL')]: 45
                },
                maxMarks: {
                    [getSubjectId('PHY')]: 100,
                    [getSubjectId('CHEM')]: 100,
                    [getSubjectId('MATH')]: 100,
                    [getSubjectId('ENG')]: 100,
                    [getSubjectId('URD')]: 100,
                    [getSubjectId('ISL')]: 50
                },
                totalMarks: 550,
                obtainedMarks: 455,
                percentage: 82.73,
                grade: 'A',
                isPublished: true
            },
            {
                studentName: 'Fatima Khan',
                rollNo: 'PGC-2024-002',
                course: 'FSc Pre-Medical',
                semester: '1st Year',
                marks: {
                    [getSubjectId('PHY')]: 90,
                    [getSubjectId('CHEM')]: 88,
                    [getSubjectId('BIO')]: 95,
                    [getSubjectId('ENG')]: 85,
                    [getSubjectId('URD')]: 82,
                    [getSubjectId('ISL')]: 48
                },
                maxMarks: {
                    [getSubjectId('PHY')]: 100,
                    [getSubjectId('CHEM')]: 100,
                    [getSubjectId('BIO')]: 100,
                    [getSubjectId('ENG')]: 100,
                    [getSubjectId('URD')]: 100,
                    [getSubjectId('ISL')]: 50
                },
                totalMarks: 550,
                obtainedMarks: 488,
                percentage: 88.73,
                grade: 'A',
                isPublished: true
            },
            {
                studentName: 'Hassan Raza',
                rollNo: 'PGC-2024-003',
                course: 'ICS',
                semester: '2nd Year',
                marks: {
                    [getSubjectId('PHY')]: 70,
                    [getSubjectId('MATH')]: 85,
                    [getSubjectId('CS')]: 92,
                    [getSubjectId('ENG')]: 75,
                    [getSubjectId('URD')]: 68,
                    [getSubjectId('ISL')]: 42
                },
                maxMarks: {
                    [getSubjectId('PHY')]: 100,
                    [getSubjectId('MATH')]: 100,
                    [getSubjectId('CS')]: 100,
                    [getSubjectId('ENG')]: 100,
                    [getSubjectId('URD')]: 100,
                    [getSubjectId('ISL')]: 50
                },
                totalMarks: 550,
                obtainedMarks: 432,
                percentage: 78.55,
                grade: 'B',
                isPublished: true
            }
        ];
        demoResults.forEach(result => addItem(STORAGE_KEYS.RESULTS, result));
    }

    // Initialize admissions
    if (getItems(STORAGE_KEYS.ADMISSIONS).length === 0) {
        const demoAdmissions = [
            { name: 'Sara Iqbal', fatherName: 'Iqbal Ahmed', course: 'FSc Pre-Medical', previousMarks: '850/1100', email: 'sara@example.com', phone: '0330-1234567', status: 'Pending', appliedDate: '2024-12-20' },
            { name: 'Hamza Nadeem', fatherName: 'Nadeem Khan', course: 'ICS', previousMarks: '780/1100', email: 'hamza@example.com', phone: '0331-2345678', status: 'Pending', appliedDate: '2024-12-21' },
            { name: 'Mariam Asif', fatherName: 'Asif Mahmood', course: 'FSc Pre-Engineering', previousMarks: '920/1100', email: 'mariam@example.com', phone: '0332-3456789', status: 'Approved', appliedDate: '2024-12-19' }
        ];
        demoAdmissions.forEach(admission => addItem(STORAGE_KEYS.ADMISSIONS, admission));
    }

    // Initialize announcements
    if (getItems(STORAGE_KEYS.ANNOUNCEMENTS).length === 0) {
        const demoAnnouncements = [
            { title: 'Mid-Term Exams Schedule', date: 'Dec 20, 2024', type: 'exam', link: '/news' },
            { title: 'Winter Break Notice', date: 'Dec 18, 2024', type: 'general', link: '/news' },
            { title: 'Sports Day Registration', date: 'Dec 15, 2024', type: 'event', link: '/seminars' },
            { title: 'Library Extended Hours', date: 'Dec 12, 2024', type: 'facility', link: '/digital-library' }
        ];
        demoAnnouncements.forEach(announcement => addItem(STORAGE_KEYS.ANNOUNCEMENTS, announcement));
    }

    // Initialize Video Lectures
    if (getItems(STORAGE_KEYS.VIDEO_LECTURES).length === 0) {
        const demoVideoLectures = [
            // ... (keeping existing lectures, just ensuring context matches)
            {
                id: 'week1',
                title: 'Week 01',
                lessons: [
                    { id: 1, title: 'How to build logics in programming', videoId: 'HbNfCM4ilBQ', duration: '10:04', description: 'This video lecture covers the fundamental concepts of logic building in programming. You will learn about algorithms, flowcharts, and how to approach problem-solving systematically.' },
                    { id: 2, title: 'Introduction of the Instructor', videoId: 'jNQXAC9IVRw', duration: '10:45', description: 'Get to know your instructor, their background, and what you can expect to learn throughout this course. A brief overview of the teaching methodology is also provided.' },
                    { id: 3, title: 'Course Orientation', videoId: 'YE7VzlLtp-4', duration: '12:20', description: 'An orientation to the course structure, grading policy, and resources available to students. This session sets the stage for a successful learning journey.' },
                    { id: 4, title: 'Navigating the Course Tools', videoId: '9bZkp7q19f0', duration: '18:15', description: 'Learn how to navigate the online learning platform, access course materials, submit assignments, and participate in discussion forums effectively.' },
                    { id: 5, title: 'Safe Online Behavior', videoId: 'dQw4w9WgXcQ', duration: '14:50', description: 'Understand the importance of digital citizenship and safe online behavior. This lesson covers privacy settings, identifying threats, and maintaining a positive online presence.' }
                ]
            },
            {
                id: 'week2',
                title: 'Week 02',
                lessons: [
                    { id: 6, title: 'Introduction to Physics', videoId: 'dQw4w9WgXcQ', duration: '25:30', description: 'A fundamental introduction to the world of physics. We explore the basic laws of motion, energy, and the scientific method used to understand the physical universe.' },
                    { id: 7, title: 'Newton\'s Laws', videoId: 'jNQXAC9IVRw', duration: '30:15', description: 'Detailed explanation of Newton\'s three laws of motion with real-world examples and demonstrations. Essential for understanding classical mechanics.' }
                ]
            },
            {
                id: 'week3',
                title: 'Week 03',
                lessons: [
                    { id: 8, title: 'Mathematics Fundamentals', videoId: 'YE7VzlLtp-4', duration: '22:40', description: 'Review of essential mathematical concepts required for this course. Topics include algebra, trigonometry, and basic calculus concepts.' },
                    { id: 9, title: 'Algebra Basics', videoId: '9bZkp7q19f0', duration: '28:20', description: 'Deep dive into algebraic expressions, equations, and inequalities. This lesson provides the foundation for solving complex mathematical problems.' }
                ]
            }
        ];
        demoVideoLectures.forEach(week => addItem(STORAGE_KEYS.VIDEO_LECTURES, week));
    }

    // Initialize Fees
    if (getItems(STORAGE_KEYS.FEES).length === 0) {
        const students = getItems(STORAGE_KEYS.STUDENTS);
        if (students.length > 0) {
            // Generate fees for the first few students as demo
            students.slice(0, 3).forEach(student => {
                const totalFee = 50000; // Simplified default
                addItem(STORAGE_KEYS.FEES, {
                    studentId: student.id,
                    studentName: student.name,
                    rollNo: student.rollNo,
                    course: student.course,
                    semester: student.semester,
                    totalFee: totalFee,
                    paidAmount: 25000,
                    balance: 25000,
                    status: 'partial',
                    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
                    paymentHistory: [
                        { date: new Date().toISOString(), amount: 25000, method: 'Cash', receiptNo: 'DEMO-001' }
                    ],
                    lastPaymentDate: new Date().toISOString().split('T')[0]
                });
            });
        }
    }

    // Initialize Gallery (Merge strategy)
    const currentGallery = getItems(STORAGE_KEYS.GALLERY);
    const demoGallery = [
        { id: 'hero-bg', title: 'Hero Background', url: '/src/assets/College-Building.png', section: 'Home', type: 'image' },
        { id: 'intro-img', title: 'Intro Section', url: '/src/assets/students-collaboration.jpg', section: 'Home', type: 'image' },
        { id: 'news-1', title: 'Seminars', url: '/src/assets/convocation-ceremony.png', section: 'Home', type: 'image' },
        { id: 'news-2', title: 'Research', url: '/src/assets/research-laboratory.jpg', section: 'Home', type: 'image' },
        { id: 'news-3', title: 'Admissions', url: '/src/assets/college-admissions.jpg', section: 'Home', type: 'image' },
        { id: 'notif-logo', title: 'Notification Logo', url: '/src/assets/punjab-college-logo.png', section: 'Home', type: 'image' },
        { id: 'stats-bg', title: 'Stats Background', url: '', section: 'Home', type: 'image' },

        // Faculty Images
        { id: 'fac-principal', title: 'Principal', url: '/src/assets/staff/SirAhamdRaza.png', section: 'Faculty', type: 'image' },
        { id: 'fac-chem', title: 'Chemistry HOD', url: '/src/assets/staff/ArshadSahab.png', section: 'Faculty', type: 'image' },
        { id: 'fac-islam-1', title: 'Islamic Studies (Bilal)', url: '/src/assets/staff/BilalSahab.png', section: 'Faculty', type: 'image' },
        { id: 'fac-islam-2', title: 'Islamic Studies (Saleem)', url: '/src/assets/staff/SaleemSahab.png', section: 'Faculty', type: 'image' },
        { id: 'fac-urdu', title: 'Urdu', url: '/src/assets/staff/SohaibSahab.png', section: 'Faculty', type: 'image' },
        { id: 'fac-phy', title: 'Physics HOD', url: '/src/assets/staff/JavedSahab.png', section: 'Faculty', type: 'image' },
        { id: 'fac-cs', title: 'Computer Science', url: '/src/assets/staff/IftikharSahab.png', section: 'Faculty', type: 'image' },
        { id: 'fac-bio', title: 'Biology', url: '/src/assets/staff/SyedSultanSahab.png', section: 'Faculty', type: 'image' },
        { id: 'fac-admin', title: 'Admin Officer', url: '/src/assets/staff/HaseebJalal.png', section: 'Faculty', type: 'image' },
        { id: 'fac-female-1', title: 'Ms. Farzana', url: '/src/assets/staff/FemaleUserProfile.png', section: 'Faculty', type: 'image' },
        { id: 'fac-female-2', title: 'Ms. Zainab', url: '/src/assets/staff/FemaleUserProfile.png', section: 'Faculty', type: 'image' },
        { id: 'fac-female-3', title: 'Ms. Aqsa', url: '/src/assets/staff/FemaleUserProfile.png', section: 'Faculty', type: 'image' },

        // Campus Life Images
        { id: 'cl-lib', title: 'Modern Library', url: '/src/assets/modern-library.png', section: 'Campus Life', type: 'image' },
        { id: 'cl-lab', title: 'Science Labs', url: '/src/assets/science-laboratory.JPG', section: 'Campus Life', type: 'image' },
        { id: 'cl-sports', title: 'Sports Complex', url: '/src/assets/sports-complex.jpg', section: 'Campus Life', type: 'image' },

        // About Images
        { id: 'about-campus', title: 'College Campus', url: '/src/assets/College-Building.png', section: 'About', type: 'image' },
        { id: 'about-principal', title: 'Principal (Message)', url: '/src/assets/staff/SirAhamdRaza.png', section: 'About', type: 'image' },

        // Seminars Images
        { id: 'sem-1', title: 'Seminar Session', url: '/src/assets/Seminar01.png', section: 'Seminars', type: 'image' },
        { id: 'sem-2', title: 'Engaged Audience', url: '/src/assets/Seminar02.jpg', section: 'Seminars', type: 'image' },
        { id: 'sem-3', title: 'Distinguished Guests', url: '/src/assets/Seminar03.jpg', section: 'Seminars', type: 'image' },
        { id: 'sem-4', title: 'Workshop Activities', url: '/src/assets/Seminar04.jpg', section: 'Seminars', type: 'image' },
        { id: 'sem-5', title: 'Networking Sessions', url: '/src/assets/Seminar05.png', section: 'Seminars', type: 'image' },
        { id: 'sem-6', title: 'Memorable Moments', url: '/src/assets/Seminar06.png', section: 'Seminars', type: 'image' },

        // Admissions Fall 2025 Images
        { id: 'adm-fall-hero', title: 'Admissions Fall Hero', url: '/src/assets/college-admissions.jpg', section: 'Admissions Fall 2025', type: 'image' },
        { id: 'adm-fall-1', title: 'Campus Overview', url: '/src/assets/college-admissions.jpg', section: 'Admissions Fall 2025', type: 'image' },
        { id: 'adm-fall-2', title: 'Student Life', url: '/src/assets/Meeting.jpg', section: 'Admissions Fall 2025', type: 'image' },
        { id: 'adm-fall-3', title: 'Modern Classrooms', url: '/src/assets/college-admissions.jpg', section: 'Admissions Fall 2025', type: 'image' },
        { id: 'adm-fall-4', title: 'Student Activities', url: '/src/assets/Meeting.jpg', section: 'Admissions Fall 2025', type: 'image' },
        { id: 'adm-fall-5', title: 'Campus Facilities', url: '/src/assets/college-admissions.jpg', section: 'Admissions Fall 2025', type: 'image' },
        { id: 'adm-fall-6', title: 'Student Success', url: '/src/assets/Meeting.jpg', section: 'Admissions Fall 2025', type: 'image' },

        // Research Breakthrough Images
        { id: 'research-hero', title: 'Research Hero Banner', url: '/src/assets/research-laboratory.jpg', section: 'Research', type: 'image' },
        { id: 'research-1', title: 'Research Laboratory', url: '/src/assets/research-laboratory.jpg', section: 'Research', type: 'image' },
        { id: 'research-2', title: 'Science Laboratory', url: '/src/assets/science-laboratory.JPG', section: 'Research', type: 'image' },
        { id: 'research-3', title: 'Research Team', url: '/src/assets/research-laboratory.jpg', section: 'Research', type: 'image' },
        { id: 'research-4', title: 'Lab Equipment', url: '/src/assets/science-laboratory.JPG', section: 'Research', type: 'image' },
        { id: 'research-5', title: 'Data Analysis', url: '/src/assets/research-laboratory.jpg', section: 'Research', type: 'image' },
        { id: 'research-6', title: 'Innovation Hub', url: '/src/assets/science-laboratory.JPG', section: 'Research', type: 'image' }
    ];

    if (currentGallery.length === 0) {
        demoGallery.forEach(item => addItem(STORAGE_KEYS.GALLERY, item));
    } else {
        // Check for missing items and add them
        demoGallery.forEach(demoItem => {
            if (!currentGallery.find(item => item.id === demoItem.id)) {
                addItem(STORAGE_KEYS.GALLERY, demoItem);
            }
        });
    }

    // Initialize or migrate notification content
    const existingNotification = localStorage.getItem(STORAGE_KEYS.NOTIFICATION);
    if (!existingNotification) {
        // Create new default notification
        const defaultNotification = {
            title: 'Admissions Open',
            session: 'Fall 2025 Session',
            description: 'Secure your future at Punjab Group of Colleges. Applications are now open.',
            buttonText: 'Apply Now',
            buttonLink: '/admissions',
            imageUrl: '',
            enabled: true
        };
        localStorage.setItem(STORAGE_KEYS.NOTIFICATION, JSON.stringify(defaultNotification));
    } else {
        // Migrate existing notification data to ensure all fields exist
        try {
            const notifData = JSON.parse(existingNotification);
            let needsUpdate = false;
            if (notifData.buttonLink === undefined) { notifData.buttonLink = '/admissions'; needsUpdate = true; }
            if (notifData.imageUrl === undefined) { notifData.imageUrl = ''; needsUpdate = true; }
            if (needsUpdate) {
                localStorage.setItem(STORAGE_KEYS.NOTIFICATION, JSON.stringify(notifData));
            }
        } catch (e) {
            console.error('Failed to migrate notification data:', e);
        }
    }

    // Initialize settings
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
        const defaultSettings = {
            siteName: 'Punjab Group of Colleges',
            resultPortalEnabled: true,
            admissionsOpen: true,
            theme: 'light',
            lastBackup: null
        };
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
    }

    console.log('Demo data initialized successfully');
};

/**
 * Add activity log entry
 */
export const logActivity = (action, details) => {
    const activity = {
        action,
        details,
        timestamp: new Date().toISOString()
    };
    addItem(STORAGE_KEYS.ACTIVITY, activity);
};

/**
 * Get recent activities (last N items)
 */
export const getRecentActivities = (limit = 10) => {
    const activities = getItems(STORAGE_KEYS.ACTIVITY);
    return activities.slice(-limit).reverse();
};

/**
 * Export all data as JSON
 */
export const exportAllData = () => {
    const allData = {
        students: getItems(STORAGE_KEYS.STUDENTS),
        teachers: getItems(STORAGE_KEYS.TEACHERS),
        courses: getItems(STORAGE_KEYS.COURSES),
        subjects: getItems(STORAGE_KEYS.SUBJECTS),
        results: getItems(STORAGE_KEYS.RESULTS),
        admissions: getItems(STORAGE_KEYS.ADMISSIONS),
        announcements: getItems(STORAGE_KEYS.ANNOUNCEMENTS),
        settings: JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}'),
        exportDate: new Date().toISOString()
    };
    return JSON.stringify(allData, null, 2);
};

/**
 * Clear all admin data
 */
export const clearAllData = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
    console.log('All admin data cleared');
};
