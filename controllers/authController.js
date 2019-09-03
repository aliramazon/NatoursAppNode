const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

// Create Token JWT
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// create and send token

const createAndSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
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

    createAndSendToken(newUser, 201, res);
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
    createAndSendToken(user, 200, res);
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
    // Saving.
    await user.save({ validateBeforeSave: false });

    // 3) Sent it to user's email
    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}`;

    try {
        await sendEmail({
            email: req.body.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Try again later', 500));
    }
});

// It will reset the password by using resetToken sent to email.
exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    // 2) if token has not expired, and there is user, set the new password

    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    // We need to set the below field to undefined. After changing the password, we should invalid previously issued resettoken. When we forgotPassword, these fields will get populated again for future compution.
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // 3) Update changedPasswordAt property for the user

    // 4) Log the user in, send JWT
    createAndSendToken(user, 200, res);
});

// Update password
exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const currentUser = await User.findById(req.user._id).select('+password');

    // 2) Check if the Posted password is correct
    if (!(await currentUser.isPasswordCorrect(req.body.passwordCurrent, currentUser.password))) {
        return next(new AppError('Your current password is wrong', 401));
    }

    // 3) If so, update the password
    currentUser.password = req.body.password;
    currentUser.passwordConfirm = req.body.passwordConfirm;
    await currentUser.save();

    // 4) Log user in, send JWT

    createAndSendToken(currentUser, 200, res);
});