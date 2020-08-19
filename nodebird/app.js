var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const passportConfig = require('./passport');
const postRouter = require('./routes/post');
require('dotenv').config();
var app = express();
var connect = require('./models');
connect();

passportConfig(passport);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SERCET));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	resave : false,
	saveUninitialized : false,
	secret : process.env.COOKIE_SECRET,
	cookie : {
		httpOnly : true,
		secure : false,
	},
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
