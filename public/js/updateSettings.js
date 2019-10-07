/* eslint-disable */
import axios from 'axios';
import { displayAlert } from './alerts';

// Update email and name

// type is password or data
export const updateDataSettings = async (data, type) => {
    const route = type === 'password' ? 'updateMyPassword' : 'updateMe';
    try {
        const res = await axios({
            method: 'PATCH',
            url: `http://127.0.0.1:8080/api/v1/users/${route}`,
            data
        });

        if (res.data.status === 'success') {
            displayAlert(
                'success',
                `${type.toUpperCase()} successfully updated`
            );
        }
    } catch (err) {
        displayAlert('error', err.response.data.message);
    }
};
