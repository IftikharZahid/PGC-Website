import { apiSlice } from './apiSlice';

export const attendanceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAttendanceClasses: builder.query({
            query: () => '/attendance/classes',
            providesTags: ['Attendance'],
        }),
        getAttendanceStudents: builder.query({
            query: (className) => className ? `/attendance/students?class=${encodeURIComponent(className)}` : '/attendance/students',
            providesTags: ['Students'],
        }),
        getAttendanceByClassAndDate: builder.query({
            query: ({ className, date }) => `/attendance?class=${encodeURIComponent(className)}&date=${date}`,
            providesTags: (result, error, { className, date }) => [
                { type: 'Attendance', id: `${className}-${date}` },
                'Attendance'
            ],
        }),
        saveAttendance: builder.mutation({
            query: (payload) => ({
                url: '/attendance',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Attendance'],
        }),
    }),
});

export const {
    useGetAttendanceClassesQuery,
    useGetAttendanceStudentsQuery,
    useGetAttendanceByClassAndDateQuery,
    useSaveAttendanceMutation,
} = attendanceApi;
