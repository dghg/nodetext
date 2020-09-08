const winston = require('winston');
const winstondaily = require('winston-daily-rotate-file');
const { combine, timestamp, printf } = winston.format;
const logdir = 'logs'; // log 
const logFormat = printf(info=>{
	return `${info.message} ${info.level} : ${info.message}`;
});
const logger = winston.createLogger({
	format : combine(
		timestamp({
			format : 'YYYY-MM-DD HH:mm:ss',
		}),
		logFormat,),
	transports : [
		new winstondaily({
			level : 'info',
			datePattern : 'YYYY-MM-DD',
			dirname: logdir,
			filename : `%DATE%.log`,
			maxFiles : 30,
			zippedArchive : true,
		}),
		new winstondaily({
			level : 'error',
			datePattern : 'YYYY-MM-DD',
			dirname: logdir + '/error',
			filename : `%DATE%.error.log`,
			maxFiles : 30,
			zippedArchive : true,
		}),
	],
});

// Production 환경이 아닌 경우(dev 등) 
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),  // 색깔 넣어서 출력
      winston.format.simple(),  // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
    )
  }));
}

module.exports = logger;