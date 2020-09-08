const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const logger = require('./logger');
require('dotenv').config();
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const app = express();
sequelize.sync();
passportConfig(passport);

const sessionMiddleware = session({
	resave: false,
	saveUninitialized: false,
	secret: process.env.COOKIE_SECRET,
	cookie: {
	  httpOnly : true,
	  secure : false,
	},
});

app.set('sessionMiddleware', sessionMiddleware);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname,'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use((req,res,next)=>{
	const err = new Error('Not Found');
	err.status=404;
	next(err);
});

app.use((err,req,res,next) => {
	logger.error(err.message);
	res.locals.message = err.message;
	res.locals.error = process.env.NODE_ENV === 'development' ? err : {};
	res.status(err.status||500);
	res.render('error');
});

app.listen(process.env.PORT, () => {
	logger.info(`Server listening on PORT ${process.env.PORT}`);
});

module.exports = app;