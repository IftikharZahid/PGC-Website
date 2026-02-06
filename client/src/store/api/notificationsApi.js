import { apiSlice } from './apiSlice';

export const notificationsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNotification: builder.query({
            query: () => '/notifications',
            providesTags: ['Notifications'],
        }),
        updateNotification: builder.mutation({
            query: (data) => ({
                url: '/notifications',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Notifications'],
        }),
    }),
});

export const {
    useGetNotificationQuery,
    useUpdateNotificationMutation,
} = notificationsApi;
