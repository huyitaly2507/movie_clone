import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        loading: false,
        error: null,
    },
    reducers: {
        loginStart: (state) => {
            state.loading = true;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(state.user));
        },
        loginFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logOutUser: (state) => {
            localStorage.removeItem('user');
            state.user = null;
        },
        loadingStart: (state) => {
            state.loading = true;
        },
        loadingEnd: (state) => {
            state.loading = false;
        },
    },
});

export const { loginStart, loginSuccess, loginFailed, logOutUser, loadingStart, loadingEnd } = userSlice.actions;

export const selectLoading = (state) => state.user.loading;
export const selectError = (state) => state.user.error;
export const selectUser = (state) => state.user.user;

// Reducer
const userReducer = userSlice.reducer;
export default userReducer;
