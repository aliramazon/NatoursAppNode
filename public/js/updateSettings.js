/* eslint-disable */
import axios from 'axios';
import { displayAlert } from './alerts';

// Update email and name

export const updateData = async (name, email) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: 'http://127.0.0.1:8080/api/v1/users/updateMe',
            data: {
                name,
                email
            }
        });

        if (res.data.status === 'success') {
            displayAlert('success', 'Data updated successfully');
        }
    } catch (err) {
        displayAlert('error', err.response.data.message);
    }
};
