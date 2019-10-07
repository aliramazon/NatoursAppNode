/* eslint-disable */

import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { displayAlert } from './alerts';

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
});
