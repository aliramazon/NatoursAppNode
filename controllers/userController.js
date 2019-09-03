const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

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

// getAllUsers
exports.getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet'
    });
};

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

//updateUser
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet'
    });
};

// deleteUser
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet'
    });
};
