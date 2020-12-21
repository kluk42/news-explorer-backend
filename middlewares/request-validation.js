const mongoose = require('mongoose');
const validator = require('validator');
const WrongRequestErr = require('../errors/wrong-request-err');
const UnathorizedActionErr = require('../errors/unathorized-action-err');

const urlValidation = (value) => {
  const options = {
    protocols: ['http', 'https'],
    require_tld: true,
    require_protocol: true,
    require_host: true,
    require_valid_protocol: true,
    allow_underscores: true,
    host_whitelist: false,
    host_blacklist: false,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false,
    disallow_auth: false,
  };
  const testResult = validator.isURL(value, options);
  if (!testResult) {
    throw new WrongRequestErr('Неверная ссылка');
  }
  return value;
};

const urlValidationForModel = (value) => {
  const options = {
    protocols: ['http', 'https'],
    require_tld: true,
    require_protocol: true,
    require_host: true,
    require_valid_protocol: true,
    allow_underscores: true,
    host_whitelist: false,
    host_blacklist: false,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false,
    disallow_auth: false,
  };
  const testResult = validator.isURL(value, options);
  return testResult;
};

const tokenValidation = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    const err = new UnathorizedActionErr('Не передан JWT токен');
    return next(err);
  }
  if (!authorization.startsWith('Bearer ')) {
    const err = new WrongRequestErr('В authorization отсутствует Bearer');
    return next(err);
  }
  return next();
};

const requestValidation = (req, res, next) => {
  const { id, cardId } = req.params;

  if (((!mongoose.Types.ObjectId.isValid(id)) && (id !== undefined))) {
    const idErr = new WrongRequestErr('Неверный id');
    return next(idErr);
  }

  if (((!mongoose.Types.ObjectId.isValid(cardId)) && (cardId !== undefined))) {
    const idErr = new WrongRequestErr('Неверный id карточки');
    return next(idErr);
  }

  return next();
};

module.exports = {
  requestValidation,
  urlValidation,
  tokenValidation,
  urlValidationForModel,
};
