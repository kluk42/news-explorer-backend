const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMe,
  updateUser,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const { tokenValidation } = require('../middlewares/request-validation');

router.get('/users/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().custom(tokenValidation).required(),
  }).unknown(true),
}), auth, getMe);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2),
    about: Joi.string().min(2),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().custom(tokenValidation).required(),
  }).unknown(true),
}), auth, updateUser);

module.exports = router;
