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

    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'Password must have more than 8 characters']
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
    }
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

const User = mongoose.model('User', userSchema);

module.exports = User;
