import express from 'express';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import flash from 'connect-flash';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));
const sessionMiddleware = session({
	resave : false,
	saveUninitialized : false,
	secret : process.env.COOKIE_SECRET,
	cookie : {
		httpOnly : true,
		secure : false,
	}
});
app.use('sessionMiddleware', sessionMiddleware);
app.use(sessionMiddleware);
app.use(flash());


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

