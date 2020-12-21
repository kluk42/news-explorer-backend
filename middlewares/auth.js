const jwt = require('jsonwebtoken');
const WrongRequestErr = require('../errors/wrong-request-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const { JWT_SECRET, NODE_ENV } = process.env;
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
