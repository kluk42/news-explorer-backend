const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundErr = require('../errors/not-found-err');
const WrongRequestErr = require('../errors/wrong-request-err');

const User = require('../models/user');

const getUsers = async (req, res, next) => {
    try {
        const userInfo = await User.find({});
        return res.send(userInfo);
    } catch (err) {
        return next(err);
    }
};

const getMe = async (req, res, next) => {
    try {
        const requestedUser = await User.findById(req.user);
        if (!requestedUser) throw new NotFoundErr('Пользотватель не найден');
        return res.send(requestedUser);
    } catch (err) {
        return next(err);
    }
};

const getUser = async (req, res, next) => {
    try {
        const requestedUser = await User.findById(req.params.userId);
        if (!requestedUser) throw new NotFoundErr('Пользотватель не найден');
        return res.send(requestedUser);
    } catch (err) {
        return next(err);
    }
};

const createUser = async (req, res, next) => {
    try {
        const {
            name = 'Жак-Ив Кусто', email, password,
        } = req.body;
        const isUniqueEmail = await User.findOne({ email }); // Если не найдёт, то вернёт null
        if (isUniqueEmail) {
            throw new WrongRequestErr('Пользователь с таким адресом уже есть');
        }
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            password: hash,
            email,
        })
            .catch((err) => {
                if (err.name === 'ValidationError') throw new WrongRequestErr('Неправильно заполнен запрос');
                throw err;
            });
        const successMsg = `${user.name}, регистрация прошла успешно. Авторизуйтесь`;
        return res.status(200).send({ successMsg });
    } catch (err) {
        return next(err);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const oldUser = await User.findById(req.user);
        const { name = oldUser.name, about = oldUser.about } = req.body;
        const opts = { runValidators: true, new: true };
        const updatedUser = await User.findByIdAndUpdate(req.user, { name, about }, opts)
            .orFail(new NotFoundErr('Такого пользователя нет, зарегистрируйтесь'))
            .catch((err) => {
                if (err instanceof mongoose.Error.ValidationError) {
                    throw new WrongRequestErr('Введены некорректные данные');
                } else {
                    throw err;
                }
            });
        return res.status(200).send(updatedUser);
    } catch (err) {
        return next(err);
    }
};

const updateAvatar = async (req, res, next) => {
    try {
        const { avatar } = req.body;
        const opts = { runValidators: true };
        const oldUser = await User.findByIdAndUpdate(req.user, { avatar }, opts)
            .orFail(new NotFoundErr('Такого пользователя нет, зарегистрируйтесь'))
            .catch((err) => {
                if (err instanceof mongoose.Error.ValidationError) {
                    throw new WrongRequestErr('Введены некорректные данные');
                } else {
                    throw err;
                }
            });
        const updatedUser = await User.findById(oldUser._id);
        return res.status(200).send(updatedUser);
    } catch (err) {
        return next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { password, email } = req.body;
        const user = await User.findUserByCredentials(email, password);
        const NODE_ENV = 'production';
        const JWT_SECRET = '6161330a563a2857b56b2aa9773132b13955c9d8520992a9489fd8be5ae0d720';
        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
        return res.status(200).send({ token });
    } catch (err) {
        return next(err);
    }
};

module.exports = {
    getUsers,
    getMe,
    getUser,
    createUser,
    updateUser,
    updateAvatar,
    login,
};
