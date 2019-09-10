const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
    return allowedFields.reduce((filteredObj, field) => {
        filteredObj[field] = obj[field];
        return filteredObj;
    }, {});
};

// Update Me
exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user Posts password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /updateMyPassword route',
                400
            )
        );
    }

    // 2) Filtered out unwanted fields
    const filteredBody = filterObj(req.body, 'name', 'email');

    // 3) Update the user document
    const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

// Deactivate Account
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// getAllUsers
exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    });
});

// createUser
exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet'
    });
};

// getUser
exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet'
    });
};

//updateUser DONT update passwords with this
exports.updateUser = factory.updateOne(User);

// deleteUser
exports.deleteUser = factory.deleteOne(User);
