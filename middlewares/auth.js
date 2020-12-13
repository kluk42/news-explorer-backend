const jwt = require('jsonwebtoken');
const WrongRequestErr = require('../errors/wrong-request-err');

module.exports = (req, res, next) => {
  const JWT_SECRET = '6161330a563a2857b56b2aa9773132b13955c9d8520992a9489fd8be5ae0d720';
  const { authorization } = req.headers;
  const token = authorization.replace('Bearer ', '');
  let payload = '';
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    const tokenErr = new WrongRequestErr('Необходима авторизация');
    return next(tokenErr);
  }
  req.user = payload;
  return next();
};
