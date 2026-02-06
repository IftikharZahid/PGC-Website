import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Admissions', 'Results', 'Attendance', 'Students', 'Teachers', 'Courses', 'Notifications', 'Settings'],
    endpoints: (builder) => ({})
});
