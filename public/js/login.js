/* eslint-disable */
import axios from 'axios';
import { displayAlert } from './alerts';

// Login
export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/signin',
            data: {
                email,
                password
            }
        });

        if (res.data.status === 'success') {
            displayAlert('success', 'Logged in successfully');
            window.setTimeout(() => {
                location.assign('/');
            }, 1);
        }
    } catch (err) {
        displayAlert('error', err.response.data.message);
    }
};

// Logout
export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout'
        });

        if (res.data.status === 'success') {
            location.reload(true);
            displayAlert('success', 'Successfully logged out');
            location.assign('/');
        }
    } catch (error) {
        displayAlert('error', 'Error logging out! Try again');
    }
};
