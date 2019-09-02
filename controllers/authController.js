const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// Create Token JWT
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// Sign up a user
exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

// Sign in a user
exports.signin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email && password exist in req.body
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.isPasswordCorrect(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything ok, send jwt to clint;
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });
});

// Checks if user is authenticated
exports.isAuthenticated = catchAsync(async (req, res, next) => {
    // 1) Getting toke and  check if it exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You are not logged in! Please, log in to get access', 401));
    }

    // 2) Validate token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const parsedUser = await User.findById(decoded.id);
    if (!parsedUser) {
        return next(new AppError('User does not exist', 401));
    }

    // 4) Check if user changed password after the token was issued
    if (parsedUser.isPasswordChangedAfter(decoded.iat)) {
        return next(new AppError('Password recently was changed. Please log in again', 401));
    }

    // 5) GRANT ACCESS TO PROTECTED ROUTE
    req.user = parsedUser;
    next();
});

// Checks if user is authorized
exports.isAuthorized = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You are not authorized to perform this action', 403));
        }
        next();
    };
};

// Forgot password

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user found with email address', 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    // 3) Sent it to user's email
});

exports.resetPassword = (req, res, next) => {};
