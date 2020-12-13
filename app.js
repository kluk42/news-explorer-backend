const express = require('express');
const helmet = require('helmet');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const router = require('./routes/index.js');
const errorsCentral = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rate-limiter');
const NotFoundError = require('./errors/not-found-err.js');

const { PORT = 4000 } = process.env;
const app = express();
app.use(cors());
app.set('trust proxy', 1);
app.use(limiter);
app.use(helmet());

const mongodbUrl = 'mongodb://localhost:27017/mydb';
mongoose.connect(mongodbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(requestLogger);

app.use('/', router);

app.use(errorLogger);

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errors());

app.use((err, req, res, next) => {
  errorsCentral(err, req, res, next);
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // console.log(`App listening on port ${PORT}`);
});

module.exports = app;
