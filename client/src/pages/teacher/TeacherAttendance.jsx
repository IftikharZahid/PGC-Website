import { useState } from 'react';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

const TeacherAttendance = () => {
    const [selectedClass, setSelectedClass] = useState('BSCS-6');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // Dummy Students Data
    const students = [
        { id: 1, rollNo: 'BSCS-2022-001', name: 'Ali Ahmed', status: 'Present' },
        { id: 2, rollNo: 'BSCS-2022-002', name: 'Bilal Khan', status: 'Absent' },
        { id: 3, rollNo: 'BSCS-2022-003', name: 'Chaudhry Dawood', status: 'Present' },
        { id: 4, rollNo: 'BSCS-2022-004', name: 'Danish Taimoor', status: 'Present' },
        { id: 5, rollNo: 'BSCS-2022-005', name: 'Eshaal Fatima', status: 'Leave' },
        { id: 6, rollNo: 'BSCS-2022-006', name: 'Fahad Mustafa', status: 'Present' },
        { id: 7, rollNo: 'BSCS-2022-007', name: 'Gohar Rasheed', status: 'Absent' },
        { id: 8, rollNo: 'BSCS-2022-008', name: 'Hamza Ali', status: 'Present' },
    ];

    const [attendance, setAttendance] = useState(students);

    const toggleStatus = (id) => {
        setAttendance(attendance.map(student => {
            if (student.id === id) {
                const nextStatus = student.status === 'Present' ? 'Absent' : student.status === 'Absent' ? 'Leave' : 'Present';
                return { ...student, status: nextStatus };
            }
            return student;
        }));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Mark Attendance</h1>
                    <p className="text-gray-500">Track student presence</p>
                </div>
                <div className="flex gap-4">
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                        <option value="BSCS-6">BS Computer Science - Semester 6</option>
                        <option value="ICS-1">ICS - Part 1</option>
                    </select>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Roll No</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {attendance.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.rollNo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${student.status === 'Present' ? 'bg-green-100 text-green-800' :
                                                student.status === 'Absent' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button
                                            onClick={() => toggleStatus(student.id)}
                                            className="text-primary-600 hover:text-primary-900 font-medium"
                                        >
                                            Change Status
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                    <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors shadow-sm font-medium">
                        Save Attendance
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeacherAttendance;
