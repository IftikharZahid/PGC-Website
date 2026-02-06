import { apiSlice } from './apiSlice';

export const teachersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTeachers: builder.query({
            query: () => '/teachers',
            providesTags: ['Teachers'],
        }),
        createTeacher: builder.mutation({
            query: (newTeacher) => ({
                url: '/teachers',
                method: 'POST',
                body: newTeacher,
            }),
            invalidatesTags: ['Teachers'],
        }),
        updateTeacher: builder.mutation({
            query: ({ id, ...updates }) => ({
                url: `/teachers/${id}`,
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: ['Teachers'],
        }),
        deleteTeacher: builder.mutation({
            query: (id) => ({
                url: `/teachers/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Teachers'],
        }),
        bulkCreateTeachers: builder.mutation({
            query: (data) => ({
                url: '/teachers/bulk',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Teachers'],
        }),
    }),
});

export const {
    useGetTeachersQuery,
    useGetTeacherQuery,
    useCreateTeacherMutation,
    useUpdateTeacherMutation,
    useDeleteTeacherMutation,
    useBulkCreateTeachersMutation,
} = teachersApi;
