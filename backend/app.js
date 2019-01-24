const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const routes = require('./routes');
const HttpCodeException = require('./lib/httpcode-exception');

const app = express();

app.use(require('connect-history-api-fallback')());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
// 전역 에러 핸들러, express 에서 네 개의 파라메터를 가져아만 에러 핸들러로 인식한
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  let newError;
  if (err instanceof HttpCodeException) {
    newError = {
      ...err,
      status: err.httpCode,
      code: err.errorCode,
      message: err.errorMessage,
    };
  } else if (err instanceof Error) {
    newError = {
      ...err,
      status: err.status || 500,
      code: err.errorCode || err.code || 'E500',
      message: err.errorMessage || err.message || '',
    };
  } else if (err instanceof Object) {
    newError = new Error();
    newError.status = err.status || 500;
    newError.code = err.errorCode || err.code || 'E500';
    newError.message = err.errorMessage || err.message || '';
    newError.data = err.data || {};
    newError.stack = err.stack;
  }

  // AJAX 여부에따른 응답형태 변화.
  if (req.xhr) {
    return res
      .status(newError.status)
      .send(newError);
  }

  return res
    .status(newError.status || 500)
    .json({
      message: newError.message,
      error: newError,
    });
});

// connect To DB
const models = require('./models');

models.sequelize.sync()
  .then(() => {
    console.log('✓ DB connection success.');
    console.log('  Press CTRL-C to stop\n');
  })
  .catch((err) => {
    console.error(err);
    console.log('✗ DB connection error. Please make sure DB is running.');
    process.exit();
  });

module.exports = app;
