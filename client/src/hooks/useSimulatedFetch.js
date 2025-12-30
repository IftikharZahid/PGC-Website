import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook to simulate network latency for synchronous operations
 * @param {Function} fetchFn - Function that returns the data (e.g. getItems)
 * @param {Array} dependencies - Dependencies to re-trigger the fetch
 * @param {number} delay - Delay in milliseconds (default 800ms)
 */
const useSimulatedFetch = (fetchFn, dependencies = [], delay = 800) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Use a ref to store the latest fetchFn so we don't trigger re-runs when the function identity changes
    // This allows users to pass inline arrow functions without causing infinite loops
    const fetchFnRef = useRef(fetchFn);

    useEffect(() => {
        fetchFnRef.current = fetchFn;
    }, [fetchFn]);

    const fetchData = useCallback(() => {
        setLoading(true);
        setError(null);

        // Simulate network delay
        setTimeout(() => {
            try {
                // Call the latest version of the function
                const result = fetchFnRef.current();
                setData(result);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        }, delay);
    }, [delay]); // Removed fetchFn from dependencies to avoid infinite loops

    useEffect(() => {
        fetchData();
        // We want to trigger when dependencies change or fetchData changes (which relies on delay)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...dependencies, fetchData]);

    return { data, loading, error, refresh: fetchData };
};

export default useSimulatedFetch;
