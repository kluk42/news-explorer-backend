const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMe,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const { tokenValidation } = require('../middlewares/request-validation');

router.get('/users/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().custom(tokenValidation).required(),
  }).unknown(true),
}), auth, getMe);

module.exports = router;
