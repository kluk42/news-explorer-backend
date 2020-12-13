const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRoutes = require('./users.js');
const articlesRoutes = require('./articles');
const { createUser, login } = require('../controllers/users');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).required(),
  }),
}), createUser);
router.use(userRoutes);
router.use(articlesRoutes);

module.exports = router;
