const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
    getUsers,
    getUser,
    getMe,
    updateUser,
    updateAvatar,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const { urlValidation, tokenValidation } = require('../middlewares/request-validation');

router.get('/users', celebrate({
    headers: Joi.object().keys({
        authorization: Joi.string().custom(tokenValidation).required(),
    }).unknown(true),
}), auth, getUsers);

router.get('/users/me', celebrate({
    headers: Joi.object().keys({
        authorization: Joi.string().custom(tokenValidation).required(),
    }).unknown(true),
}), auth, getMe);

router.get('/users/:userId', celebrate({
    params: Joi.object().keys({
        userId: Joi.string().alphanum().length(24).required(),
    }),
    headers: Joi.object().keys({
        authorization: Joi.string().custom(tokenValidation).required(),
    }).unknown(true),
}), auth, getUser);

router.patch('/users/me', celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2),
        about: Joi.string().min(2),
    }),
    headers: Joi.object().keys({
        authorization: Joi.string().custom(tokenValidation).required(),
    }).unknown(true),
}), auth, updateUser);

router.patch('/users/me/avatar', celebrate({
    body: Joi.object().keys({
        avatar: Joi.string().custom(urlValidation).required(),
    }),
    headers: Joi.object().keys({
        authorization: Joi.string().custom(tokenValidation).required(),
    }).unknown(true),
}), auth, updateAvatar);

module.exports = router;
