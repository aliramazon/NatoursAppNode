const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// Use reviewRouter if /:tourId/review
router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);

router
    .route('/tour-stats')
    .get(
        authController.isAuthenticated,
        authController.isAuthorized('admin', 'super-guide', 'guide'),
        tourController.getTourStats
    );
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourController.getToursWithin);

router
    .route('/')
    .get(tourController.getAllTours)
    .post(
        authController.isAuthenticated,
        authController.isAuthorized('admin', 'super-guide'),
        tourController.createTour
    );

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(
        authController.isAuthenticated,
        authController.isAuthorized('admin', 'super-guide'),
        tourController.updateTour
    )
    .delete(
        authController.isAuthenticated,
        authController.isAuthorized('admin', 'super-guide'),
        tourController.deleteTour
    );
module.exports = router;
