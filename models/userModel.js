/* eslint-disable radix */
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
    passwordChangedAt: Date
});

userSchema.pre('save', async function(next) {
    // Only run this function if password was modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete the password confirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.isPasswordCorrect = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.isPasswordChangedAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        console.log(changedTimestamp, JWTTimestamp);
        return changedTimestamp > JWTTimestamp;
    }
    return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
