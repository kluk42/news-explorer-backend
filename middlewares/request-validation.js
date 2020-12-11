const mongoose = require('mongoose');
const WrongRequestErr = require('../errors/wrong-request-err');

const urlValidation = (value) => {
    const regEx = /^https?:\/\/(www\.)?[\w-.~:/?#[\]@!$&'\\*+,;=]+#?$/gm;
    const testResult = regEx.test(value);
    if (!testResult) {
        throw new WrongRequestErr('Неверная ссылка');
    }
    return value;
};

const tokenValidation = (value) => {
    if (!value.startsWith('Bearer ')) {
        throw new WrongRequestErr('В authorization отсутствует Bearer');
    }
    return value;
};

const requestValidation = (req, res, next) => {
    const { id, cardId } = req.params;
    const { authorization } = req.headers;

    if (((!mongoose.Types.ObjectId.isValid(id)) && (id !== undefined))) {
        const idErr = new WrongRequestErr('Неверный id');
        return next(idErr);
    }

    if (((!mongoose.Types.ObjectId.isValid(cardId)) && (cardId !== undefined))) {
        const idErr = new WrongRequestErr('Неверный id карточки');
        return next(idErr);
    }

    if ((authorization !== undefined) && (!authorization.startsWith('Bearer '))) {
        const tokenErr = new WrongRequestErr('В authorization отсутствует Bearer');
        next(tokenErr);
    }

    if (!authorization) {
        const tokenErr = new WrongRequestErr('Требуется авторизация');
        next(tokenErr);
    }

    return next();
};

module.exports = {
    requestValidation,
    urlValidation,
    tokenValidation,
};
