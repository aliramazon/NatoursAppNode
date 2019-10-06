/* eslint-disable */
import axios from 'axios';
import { displayAlert } from './alerts';

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:8080/api/v1/users/signin',
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
