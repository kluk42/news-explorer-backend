const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');
const auth = require('../middlewares/auth');
const { urlValidation, tokenValidation } = require('../middlewares/request-validation');

router.get('/articles', tokenValidation, auth, getArticles);

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
}), tokenValidation, auth, createArticle);

router.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24).required(),
  }),
}), tokenValidation, auth, deleteArticle);

module.exports = router;
