const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
    // 1) Get tour data from collection
    const tours = await Tour.find();
    console.log(tours);
    // 2) Build template

    // 3) Render template using tour date from 1)
    res.status(200).render('overview', {
        title: 'All tours',
        tours
    });
});

exports.getTour = (req, res) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker Tour'
    });
};
