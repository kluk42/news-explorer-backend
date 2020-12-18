const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundErr = require('../errors/not-found-err');
const WrongRequestErr = require('../errors/wrong-request-err');
const ConflictErr = require('../errors/conflict-err');

const User = require('../models/user');

const getMe = async (req, res, next) => {
  try {
    const requestedUser = await User.findById(req.user);
    if (!requestedUser) throw new NotFoundErr('Пользотватель не найден');
    return res.send(requestedUser);
  } catch (err) {
    return next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      name, email, password,
    } = req.body;
    const isUniqueEmail = await User.findOne({ email }); // Если не найдёт, то вернёт null
    if (isUniqueEmail) {
      throw new ConflictErr('Пользователь с таким адресом уже есть');
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      password: hash,
      email,
    })
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) throw new WrongRequestErr('Неправильно заполнен запрос');
        throw err;
      });
    const successMsg = `${user.name}, регистрация прошла успешно. Авторизуйтесь`;
    return res.status(200).send({ successMsg });
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const { NODE_ENV, JWT_SECRET } = process.env;
    let doesItWork;
    if (JWT_SECRET) doesItWork = true;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
    return res.status(200).send({ token, doesItWork });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getMe,
  createUser,
  login,
};
