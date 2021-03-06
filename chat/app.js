var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const ColorHash = require('color-hash');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();
const indexRouter = require('./routes');
var app = express();
const connect = require('./models');
connect();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));
const sessionmw = session({
	resave : false,
	saveUninitialized : false,
	secret : process.env.COOKIE_SECRET,
	cookie : {
		httpOnly : true,
		secure : false,
	},
});
app.set('sessionmw', sessionmw);
app.use(sessionmw);
app.use((req,res,next)=>{
	if(!req.session.color){
		req.session.color = new ColorHash().hex(req.sessionID);
		console.log(req.session.color);
	}
	
	next();
});

app.use(flash());


app.use('/', indexRouter);
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
