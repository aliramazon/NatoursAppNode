const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.isAuthenticated);
router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.isAuthorized('user'),
        reviewController.setTourUserIds,
        reviewController.createReview
    );

router
    .route('/:id')
    .get(reviewController.getReview)
    .delete(
        authController.isAuthorized('user', 'admin'),
        reviewController.deleteReview
    )
    .patch(
        authController.isAuthorized('user', 'admin'),
        reviewController.updateReview
    );

module.exports = router;
