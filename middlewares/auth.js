const jwt = require('jsonwebtoken');
const WrongRequestErr = require('../errors/wrong-request-err');
const UnathorizedActionErr = require('../errors/unathorized-action-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const { JWT_SECRET, NODE_ENV } = process.env;
  if (!authorization) {
    const err = new UnathorizedActionErr('Не передан JWT токен');
    return next(err);
  }
  if (!authorization.startsWith('Bearer ')) {
    const err = new WrongRequestErr('В authorization отсутствует Bearer');
    return next(err);
  }
  const token = authorization.replace('Bearer ', '');
  let payload = '';
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    const tokenErr = new WrongRequestErr('Необходима авторизация');
    return next(tokenErr);
  }
  req.user = payload;
  return next();
};
