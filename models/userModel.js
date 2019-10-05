/* eslint-disable radix */
const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name'],
        trim: true,
        maxlength: [40, 'Name must have less than 30 characters']
    },

    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'super-guide', 'admin'],
        default: 'user'
    },

    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'Password must have more than 8 characters'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please provide a password confirmation'],
        validate: {
            // This only works on CREATE and SAVE
            validator: function(passwordConfirm) {
                return passwordConfirm === this.password;
            },
            message: 'Password confirmation does not match password'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

// We run this function between we receive the data and persist the data into DB
userSchema.pre('save', async function(next) {
    // Only run this function if password was modified. It means, updating user's other fields should not hash the password
    if (!this.isModified('password')) return next();

    // Hash the password with cost 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete the password confirm field
    this.passwordConfirm = undefined;
    next();
});

// Updates passwordChangedAt
userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function(next) {
    // this points to current query
    this.find({ active: { $ne: false } });
    next();
});

// This functions checks if the submitted password is the same as the one saved in DB
// We use bcrypt's compare method
userSchema.methods.isPasswordCorrect = async function(
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// This function checks if user has changed the password after JWT was issued.
// Imagine, someone has hacked your account and copied the JWT. You found out this and changed your password. Unfortunately, you and the guy stole your JWT can sign in. To Invalidate the stolen token, we need to make a user to sign in.
userSchema.methods.isPasswordChangedAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return changedTimestamp > JWTTimestamp;
    }
    return false;
};

// Creates passwordResetToken using crypto.
userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
