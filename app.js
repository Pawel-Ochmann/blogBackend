var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
require('dotenv').config();
const compression = require('compression');
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');
const passport = require('./passport-config');

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,
});

const mongoose = require('mongoose');
const mongoDB = process.env.MONGODB_URI;
main().catch((err) => {
  console.log(err);
});
async function main() {
  console.log('start connecting')
  await mongoose.connect(mongoDB);
  console.log('connected');
}

var indexRouter = require('./routes/index');

var app = express();

app.use(passport.initialize());
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(limiter);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err)
  res.send(err.message);
});

module.exports = app;
