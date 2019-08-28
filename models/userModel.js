const mongoose = require('mongoose');
const validator = require('validator');

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
        required: [true, 'Please provide a password confirmation']
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
