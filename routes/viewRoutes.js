const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/me', authController.isAuthenticated, viewController.getAccount);
router.get(
    '/my-tours',
    // bookingController.createBookingCheckout,
    authController.isAuthenticated,
    viewController.getMyTours
);

router.post(
    '/submit-user-data',
    authController.isAuthenticated,
    viewController.updateUserData
);

module.exports = router;
