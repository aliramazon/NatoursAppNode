const multer = require('multer');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

// Image upload | Users

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/users');
    },
    filename: (req, file, cb) => {
        // user-userId-timestamp.extension
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
    }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image. Please upload only images', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

//

const filterObj = (obj, ...allowedFields) => {
    return allowedFields.reduce((filteredObj, field) => {
        filteredObj[field] = obj[field];
        return filteredObj;
    }, {});
};

// Update Me
exports.updateMe = catchAsync(async (req, res, next) => {
    console.log(req.file);
    console.log(req.body);
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
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        filteredBody,
        {
            new: true,
            runValidators: true
        }
    );

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

// createUser
exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet. Please use /signup instead'
    });
};

// getMe
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

// getUser
exports.getUser = factory.getOne(User);

//updateUser DONT update passwords with this
exports.updateUser = factory.updateOne(User);

// deleteUser
exports.deleteUser = factory.deleteOne(User);

// getAllUsers
exports.getAllUsers = factory.getAll(User);
