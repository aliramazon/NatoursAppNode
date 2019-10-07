/* eslint-disable */

import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { displayAlert } from './alerts';
import { updateDataSettings } from './updateSettings';

document.addEventListener('DOMContentLoaded', () => {
    // Logins user
    const loginForm = document.querySelector('.form--login');

    if (loginForm) {
        loginForm.addEventListener('submit', e => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            login(email, password);
        });
    }

    // Display map
    const mapBox = document.getElementById('map');

    if (mapBox) {
        const locations = JSON.parse(mapBox.dataset.locations);
        displayMap(locations);
    }

    // Logout
    const logoutLink = document.querySelector('.nav__el--logout');

    if (logoutLink) {
        logoutLink.addEventListener('click', logout);
    }

    // Update data
    const userDataForm = document.querySelector('.form-user-data');

    if (userDataForm) {
        userDataForm.addEventListener('submit', e => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const name = document.getElementById('name').value;

            updateDataSettings({ name, email }, 'data');
        });
    }

    // Update password

    const userPasswordForm = document.querySelector('.form-user-password');

    if (userPasswordForm) {
        userPasswordForm.addEventListener('submit', async e => {
            e.preventDefault();
            document.querySelector('.btn--save-password').textContent =
                'Updating...';

            const passwordCurrent = document.getElementById('password-current')
                .value;
            const password = document.getElementById('password').value;
            const passwordConfirm = document.getElementById('password-confirm')
                .value;

            await updateDataSettings(
                { password, passwordConfirm, passwordCurrent },
                'password'
            );
            document.querySelector('.btn--save-password').textContent =
                'Update Password';

            document.getElementById('password-current').value = '';
            document.getElementById('password').value = '';
            document.getElementById('password-confirm').value = '';
        });
    }
});
