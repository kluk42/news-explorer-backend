const jwt = require('jsonwebtoken');
const WrongRequestErr = require('../errors/wrong-request-err');

module.exports = (req, res, next) => {
  const { JWT_SECRET } = process.env;
  const { authorization } = req.headers;
  const token = authorization.replace('Bearer ', '');
  let payload = '';
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    const tokenErr = new WrongRequestErr(JWT_SECRET);
    return next(tokenErr);
  }
  req.user = payload;
  return next();
};
