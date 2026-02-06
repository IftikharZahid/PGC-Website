import { apiSlice } from './apiSlice';

export const settingsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSettings: builder.query({
            query: () => '/settings',
            providesTags: ['Settings'],
        }),
        updateSetting: builder.mutation({
            query: ({ key, value }) => ({
                url: `/settings/${key}`,
                method: 'PUT',
                body: { value },
            }),
            invalidatesTags: ['Settings'],
        }),
        changePassword: builder.mutation({
            query: (passwords) => ({
                url: '/settings/admin/change-password',
                method: 'PUT',
                body: passwords,
            }),
        }),
    }),
});

export const {
    useGetSettingsQuery,
    useUpdateSettingMutation,
    useChangePasswordMutation,
} = settingsApi;
