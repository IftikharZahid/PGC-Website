import { apiSlice } from './apiSlice';

export const studentsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getStudents: builder.query({
            query: () => '/students',
            providesTags: ['Students'],
        }),
        getStudent: builder.query({
            query: (id) => `/students/${id}`,
            providesTags: (result, error, id) => [{ type: 'Students', id }],
        }),
        createStudent: builder.mutation({
            query: (newStudent) => ({
                url: '/students',
                method: 'POST',
                body: newStudent,
            }),
            invalidatesTags: ['Students'],
        }),
        bulkCreateStudents: builder.mutation({
            query: (data) => ({
                url: '/students/bulk',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Students'],
        }),
        updateStudent: builder.mutation({
            query: ({ id, ...updates }) => ({
                url: `/students/${id}`,
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: ['Students', (result, error, { id }) => ({ type: 'Students', id })],
        }),
        deleteStudent: builder.mutation({
            query: (id) => ({
                url: `/students/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Students'],
        }),
    }),
});

export const {
    useGetStudentsQuery,
    useGetStudentQuery,
    useCreateStudentMutation,
    useBulkCreateStudentsMutation,
    useUpdateStudentMutation,
    useDeleteStudentMutation,
} = studentsApi;
