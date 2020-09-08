const express = require('express');
const logger = require('../logger');
const router = express.Router();

router.get('/', (req,res)=>{
	logger.info('GET /');
	res.send('hello world');
});

module.exports = router;