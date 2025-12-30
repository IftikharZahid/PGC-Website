import { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Award, BookOpen, GraduationCap, Clock, Edit3, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TeacherProfile = () => {
    const { user } = useAuth();

    // Use user data from context or fallbacks
    const [profile] = useState({
        name: user?.name || 'Teacher Name',
        role: user?.designation || 'Senior Lecturer',
        email: user?.email || 'teacher@pgc.edu.pk',
        phone: user?.phone || '0300-1234567',
        address: user?.address || 'Punjab Group of Colleges, Fort Abbas',
        department: user?.department || 'Computer Science',
        education: user?.qualification || 'MS Computer Science',
        joiningDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'September 2020',
        experience: user?.experience || '5+ Years',
        image: user?.image || null,
        employeeId: user?.employeeId || 'PGC-TCH-001',
        status: 'Active'
    });

    const quickStats = [
        { label: 'Classes', value: '6', icon: BookOpen, color: 'bg-blue-500' },
        { label: 'Students', value: '180', icon: GraduationCap, color: 'bg-emerald-500' },
        { label: 'Experience', value: profile.experience, icon: Clock, color: 'bg-amber-500' },
        { label: 'Department', value: profile.department, icon: Briefcase, color: 'bg-purple-500' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4">
            <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">

                {/* Profile Header Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                    {/* Banner */}
                    <div className="h-40 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 relative">
                        <div className="absolute inset-0 bg-black/10"></div>
                        {/* Decorative elements */}
                        <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-4 left-4 w-24 h-24 bg-secondary-400/20 rounded-full blur-xl"></div>
                    </div>

                    {/* Profile Content */}
                    <div className="px-6 pb-6 relative">
                        {/* Avatar */}
                        <div className="absolute -top-16 left-6">
                            <div className="w-32 h-32 bg-white dark:bg-gray-700 rounded-2xl p-1.5 shadow-xl">
                                <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900 dark:to-primary-800 rounded-xl flex items-center justify-center overflow-hidden">
                                    {profile.image ? (
                                        <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-14 h-14 text-primary-600 dark:text-primary-400" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Info Row */}
                        <div className="pt-20 md:pt-6 md:pl-40 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h1>
                                    <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                        {profile.status}
                                    </span>
                                </div>
                                <p className="text-primary-600 dark:text-primary-400 font-semibold">{profile.role}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Employee ID: {profile.employeeId}</p>
                            </div>
                            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-600/25 hover:shadow-xl transition-all duration-300">
                                <Edit3 className="w-4 h-4" />
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickStats.map((stat, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Personal Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                                    <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                </div>
                                Personal Information
                            </h2>
                        </div>
                        <div className="p-6 space-y-5">
                            {[
                                { icon: Mail, label: 'Email Address', value: profile.email, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
                                { icon: Phone, label: 'Phone Number', value: profile.phone, color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
                                { icon: MapPin, label: 'Address', value: profile.address, color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-4 group">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${item.color}`}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">{item.label}</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Academic Details */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <div className="w-8 h-8 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
                                    <Briefcase className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                                </div>
                                Academic Details
                            </h2>
                        </div>
                        <div className="p-6 space-y-5">
                            {[
                                { icon: Briefcase, label: 'Department', value: profile.department, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
                                { icon: Award, label: 'Qualification', value: profile.education, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
                                { icon: Calendar, label: 'Joining Date', value: profile.joiningDate, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' },
                                { icon: Clock, label: 'Experience', value: profile.experience, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-4 group">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${item.color}`}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">{item.label}</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl p-5 border border-primary-100 dark:border-primary-800">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-800 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Profile Security</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Your profile information is securely stored and protected. Contact the administration if you need to update any sensitive information.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfile;
