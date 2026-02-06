import { apiSlice } from './apiSlice';

export const admissionNotificationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAdmissionNotification: builder.query({
            query: () => '/admission-notification',
            providesTags: ['AdmissionNotification'],
        }),
        updateAdmissionNotification: builder.mutation({
            query: (data) => ({
                url: '/admission-notification',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['AdmissionNotification'],
        }),
    }),
});

export const {
    useGetAdmissionNotificationQuery,
    useUpdateAdmissionNotificationMutation,
} = admissionNotificationApi;
