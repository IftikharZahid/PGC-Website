import { apiSlice } from './apiSlice';

export const resultsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getResults: builder.query({
            query: () => '/results',
            providesTags: ['Results'],
        }),
        getPublicStats: builder.query({
            query: () => '/results/public/stats',
        }),
        getResultByRoll: builder.query({
            query: (roll) => `/results/public/${roll}`,
        }),
        createResult: builder.mutation({
            query: (newResult) => ({
                url: '/results',
                method: 'POST',
                body: newResult,
            }),
            invalidatesTags: ['Results'],
        }),
        updateResult: builder.mutation({
            query: ({ id, ...updates }) => ({
                url: `/results/${id}`,
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: ['Results'],
        }),
        deleteResult: builder.mutation({
            query: (id) => ({
                url: `/results/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Results'],
        }),
        togglePublishResult: builder.mutation({
            query: (id) => ({
                url: `/results/${id}/toggle-publish`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Results'],
        }),
        syncFatherNames: builder.mutation({
            query: () => ({
                url: '/results/sync-father-names',
                method: 'POST',
            }),
            invalidatesTags: ['Results'],
        }),
    }),
});

export const {
    useGetResultsQuery,
    useGetPublicStatsQuery,
    useGetResultByRollQuery,
    useCreateResultMutation,
    useUpdateResultMutation,
    useDeleteResultMutation,
    useTogglePublishResultMutation,
    useSyncFatherNamesMutation,
} = resultsApi;
