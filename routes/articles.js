const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
    getArticles,
    createArticle,
    deleteArticle,
} = require('../controllers/articles');
const auth = require('../middlewares/auth');
const { tokenValidation, urlValidation } = require('../middlewares/request-validation');

router.get('/articles', celebrate({
    headers: Joi.object().keys({
        authorization: Joi.string().custom(tokenValidation).required(),
    }).unknown(true),
}), auth, getArticles);

router.post('/articles', celebrate({
    body: Joi.object().keys({
        keyword: Joi.string().required(),
        link: Joi.string().custom(urlValidation).required(),
        title: Joi.string().required(),
        text: Joi.string().required(),
        date: Joi.string().required(),
        source: Joi.string().required(),
        image: Joi.string().custom(urlValidation).required(),
    }),
    headers: Joi.object().keys({
        authorization: Joi.string().custom(tokenValidation).required(),
    }).unknown(true),
}), auth, createArticle);

router.delete('/articles/:articleId', celebrate({
    params: Joi.object().keys({
        articleId: Joi.string().alphanum().length(24).required(),
    }),
    headers: Joi.object().keys({
        authorization: Joi.string().custom(tokenValidation).required(),
    }).unknown(true),
}), auth, deleteArticle);

module.exports = router;
