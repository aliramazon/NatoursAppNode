const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

// getAllReviews
exports.getAllReviews = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const reviews = await Review.find(filter);

    res.status(200).json({
        status: 'success',
        result: reviews.length,
        data: {
            reviews
        }
    });
});

// createReview
exports.setTourUserIds = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};
exports.createReview = factory.createOne(Review);

// deleteReview
exports.deleteReview = factory.deleteOne(Review);

// updateReview
exports.updateReview = factory.updateOne(Review);

// getReview
exports.getReview = factory.getOne(Review);
