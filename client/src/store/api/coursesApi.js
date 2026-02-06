import { apiSlice } from './apiSlice';

export const coursesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCourses: builder.query({
            query: () => '/courses',
            providesTags: ['Courses'],
        }),
        createCourse: builder.mutation({
            query: (newCourse) => ({
                url: '/courses',
                method: 'POST',
                body: newCourse,
            }),
            invalidatesTags: ['Courses'],
        }),
        updateCourse: builder.mutation({
            query: ({ id, ...updates }) => ({
                url: `/courses/${id}`,
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: ['Courses'],
        }),
        deleteCourse: builder.mutation({
            query: (id) => ({
                url: `/courses/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Courses'],
        }),
    }),
});

export const {
    useGetCoursesQuery,
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useDeleteCourseMutation,
} = coursesApi;
