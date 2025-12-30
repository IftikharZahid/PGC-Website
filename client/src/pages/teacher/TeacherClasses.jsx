import { Clock, MapPin, Users } from 'lucide-react';

const TeacherClasses = () => {
    const classes = [
        { id: 1, name: 'BS Computer Science - Semester 6', subject: 'Web Engineering', time: '08:00 AM - 09:30 AM', room: 'Lab 3', students: 45 },
        { id: 2, name: 'ICS - Programming Fundamentals', subject: 'Computer Science', time: '10:00 AM - 11:30 AM', room: 'Room 204', students: 50 },
        { id: 3, name: 'BS IT - Semester 4', subject: 'Database Systems', time: '12:00 PM - 01:30 PM', room: 'Lab 1', students: 40 },
        { id: 4, name: 'FSc Pre-Engineering', subject: 'Physics', time: '02:00 PM - 03:30 PM', room: 'Room 105', students: 55 },
        { id: 5, name: 'MSc Computer Science', subject: 'Advanced Algorithms', time: '04:00 PM - 05:30 PM', room: 'Room 302', students: 20 },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">My Classes</h1>
                <p className="text-gray-500">Manage your course schedule</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                    <div key={cls.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">{cls.subject}</h3>
                                <p className="text-sm text-primary-600 font-medium">{cls.name}</p>
                            </div>
                            <span className="bg-primary-50 text-primary-700 text-xs font-bold px-2 py-1 rounded-full">
                                {cls.students} Students
                            </span>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-gray-50">
                            <div className="flex items-center text-sm text-gray-600">
                                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                {cls.time}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                {cls.room}
                            </div>
                        </div>

                        <div className="mt-6">
                            <button className="w-full bg-primary-50 text-primary-700 font-medium py-2 rounded-lg hover:bg-primary-100 transition-colors">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherClasses;
