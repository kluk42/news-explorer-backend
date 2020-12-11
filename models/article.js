const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    keyword: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
        validate: {
            validator(v) {
                const regEx = /^https?:\/\/(www\.)?[\w-.~:/?#[\]@!$&'\\*+,;=]+#?$/gm;
                return regEx.test(v);
            },
            message: 'неправильная ссылка',
        },
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        select: false,
    },
    title: [{
        type: String,
        required: true,
    }],
    text: [{
        type: String,
        required: true,
    }],
    date: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        validate: {
            validator(v) {
                const regEx = /^https?:\/\/(www\.)?[\w-.~:/?#[\]@!$&'\\*+,;=]+#?$/gm;
                return regEx.test(v);
            },
            message: 'неправильная ссылка',
        },
    },
});

module.exports = mongoose.model('card', articleSchema);
