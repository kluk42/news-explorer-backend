const mongoose = require('mongoose');
const Article = require('../models/article');
const NotFoundErr = require('../errors/not-found-err');
const WrongRequestErr = require('../errors/wrong-request-err');
const ForbiddenError = require('../errors/forbidden.js');

const getArticles = async (req, res, next) => {
  try {
    const owner = req.user;
    const articles = await Article.find({ owner });
    return res.status(200).send(articles);
  } catch (err) {
    return next(err);
  }
};

const createArticle = async (req, res, next) => {
  try {
    const owner = req.user;
    const article = await Article.create({ owner, ...req.body })
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          throw new WrongRequestErr('Неправильно заполнен запрос');
        } else {
          throw err;
        }
      });
    return res.status(200).send(article);
  } catch (err) {
    return next(err);
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    const articleToDelete = await Article.findById(req.params.articleId).select('+owner')
      .orFail(new NotFoundErr('Новость не найдена'));
    if (articleToDelete.owner.toString() !== req.user._id) throw new ForbiddenError('Руки прочь');
    const deletedArticle = await Article.findByIdAndRemove(req.params.articleId);
    return res.status(200).send(deletedArticle);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
