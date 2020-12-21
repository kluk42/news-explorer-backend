const validator = require('validator');
const WrongRequestErr = require('../errors/wrong-request-err');

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

module.exports = {
  urlValidation,
  urlValidationForModel,
};
