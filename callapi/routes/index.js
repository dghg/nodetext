var express = require('express');
var router = express.Router();
const axios = require('axios');
/* GET home page. */
const URL = 'http://a3a3a.run.goorm.io/v2';

axios.defaults.headers.origin = 'http://a4a4a.run.goorm.io';
const request = async (req, api) => {
	try {
		if(!req.session.jwt) {
			const tokenResult = await axios.post(`${URL}/token`, {
				clientSecret : process.env.CLIENT_SECRET,
			});
			req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
		}
		
		return await axios.get(`${URL}${api}`, {
			headers : { authorization : req.session.jwt},
		});
	} catch(err) {
		console.error(err);
		if(err.response.status<500){
			return err.response;
		}
		throw err;
	}
};
router.get('/', (req,res)=>{
	res.render('main', { key : process.env.CLIENT_SECRET});
});

router.get('/test', async (req,res,next) => {
	try {
		if(!req.session.jwt){
			const tokenResult = await axios.post('http://a3a3a.run.goorm.io/v1/token', {
				clientSecret : process.env.CLIENT_SECRET,
			});
			
			if(tokenResult.data && tokenResult.data.code===200){
				req.session.jwt = tokenResult.data.token;
			}
			else{
				return res.json(tokenResult.data);
			}
		}
		
		const result = await axios.get('http://a3a3a.run.goorm.io/v1/test', {
			headers : { authorization : req.session.jwt},
		});
		return res.json(result.data);
		
	} catch(err){
		console.error(err);
		if(err.response.status===419){
			return res.json(err.response.data);
		}
		return next(err);
	}
});

router.get('/mypost', async(req,res,next) =>{
	try {
		const result = await request(req, '/posts/my');
		res.json(result.data);
	} catch(err){
		next(err);
	}
});

module.exports = router;
