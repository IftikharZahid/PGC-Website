import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    darkMode: localStorage.getItem('admin_theme') === 'dark',
    notification: null, // { message, type, id }
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.darkMode = !state.darkMode;
            localStorage.setItem('admin_theme', state.darkMode ? 'dark' : 'light');
            if (state.darkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        },
        setTheme: (state, action) => {
            state.darkMode = action.payload === 'dark';
            if (state.darkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        },
        showNotification: (state, action) => {
            // payload: { message, type }
            state.notification = {
                ...action.payload,
                id: Date.now(),
                type: action.payload.type || 'success'
            };
        },
        clearNotification: (state) => {
            state.notification = null;
        }
    }
});

export const { toggleTheme, setTheme, showNotification, clearNotification } = uiSlice.actions;

export default uiSlice.reducer;
