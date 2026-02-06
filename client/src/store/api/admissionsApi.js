import { apiSlice } from './apiSlice';

export const admissionsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAdmissions: builder.query({
            query: () => '/admissions',
            providesTags: ['Admissions'],
        }),
        createAdmission: builder.mutation({
            query: (data) => ({
                url: '/admissions',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Admissions'],
        }),
        updateAdmissionStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/admissions/${id}/status`,
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: ['Admissions', 'Students'], // Invalidates Students too since approval creates a student
        }),
        deleteAdmission: builder.mutation({
            query: (id) => ({
                url: `/admissions/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Admissions'],
        }),
    }),
});

export const {
    useGetAdmissionsQuery,
    useCreateAdmissionMutation,
    useUpdateAdmissionStatusMutation,
    useDeleteAdmissionMutation,
} = admissionsApi;
