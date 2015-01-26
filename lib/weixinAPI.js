var https = require('https'),
	config = require('../config.js');

getAccessToken = function(callback){
	"use strict";
	
	var tokenUrl = config.weixin.server + '/token?grant_type=client_credential&appid=' + config.weixin.appid + '&secret=' + config.weixin.appsecret;
	https.get(tokenUrl, function(res){
		if(res.statusCode === 200){
			res.on('data', function (data) {
				var t = JSON.parse(data);
				callback(t.access_token);
			});
		}
		else {
			console.log("Error status: " + res.statusCode);
			callback('failed');
		}
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
		callback('failed');
	});
};

exports.getUserInfo = function(openid, callback){
	"use strict";
	
	getAccessToken(function(token){
		if(token !== 'failed'){
			var userUrl = config.weixin.server + '/user/info?access_token=' + token + '&openid=' + openid + '&lang=zh_CN';
			https.get(userUrl, function(res){
				if(res.statusCode === 200){
					res.on('data', function (data) {
						var t = JSON.parse(data);
						callback(t);
					});
				}
				else {
					console.log("Error status: " + res.statusCode);
					callback('failed');
				}
			}).on('error', function(e) {
				console.log("Got error: " + e.message);
				callback('failed');
			});
		}
	});
	
};