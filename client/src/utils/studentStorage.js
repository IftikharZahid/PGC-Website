/**
 * Student Storage Utility
 * Handles caching of student portal data to improve load performance.
 */

const STORAGE_PREFIX = 'student_portal_';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours (in milliseconds)

/**
 * Get student data from local storage
 * @param {string} email - Student email
 * @returns {object|null} - Cached data or null if not found or expired
 */
export const getStudentData = (email) => {
    if (!email) return null;

    try {
        const key = `${STORAGE_PREFIX}${email}`;
        const cachedItem = localStorage.getItem(key);

        if (!cachedItem) return null;

        const { data, timestamp } = JSON.parse(cachedItem);

        // Optional: Check for expiration if needed, but for now we might want to return stale data
        // and let the component decide to re-fetch.
        // For "stale-while-revalidate", we just return the data.

        return data;
    } catch (error) {
        console.error('Error reading student data from storage:', error);
        return null;
    }
};

/**
 * Save student data to local storage
 * @param {string} email - Student email
 * @param {object} data - Portal data to cache
 */
export const setStudentData = (email, data) => {
    if (!email || !data) return;

    try {
        const key = `${STORAGE_PREFIX}${email}`;
        const cacheObj = {
            data,
            timestamp: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(cacheObj));
    } catch (error) {
        console.error('Error saving student data to storage:', error);
    }
};

/**
 * Clear student data from local storage
 * @param {string} email - Student email
 */
export const clearStudentData = (email) => {
    if (!email) return;
    try {
        const key = `${STORAGE_PREFIX}${email}`;
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error clearing student data:', error);
    }
};
