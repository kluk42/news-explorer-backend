const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnathorizedActionErr = require('../errors/unathorized-action-err.js');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator(v) {
                return validator.isEmail(v);
            },
            message: 'Неверный email',
        },
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
});

userSchema.statics.findUserByCredentials = async function findUserByCredentials(email, password) {
    const user = await this.findOne({ email }).select('+password');
    if (!user) throw (new UnathorizedActionErr('Неправильные почта или пароль!'));
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) throw (new UnathorizedActionErr('Неправильный пароль'));
    return user;
};

module.exports = mongoose.model('user', userSchema);
