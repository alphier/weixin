var crypto = require('crypto'),
    util = require('util'),
    xmlbuilder = require('xmlbuilder'),
	API = require('./weixinAPI'),
	db = require('./database'),
	config = require('../config.js');

exports.doGet = function(req, res){
	
	console.log('##################doGet, body:', req.body);
    if(!checkSource(req)){
        res.end('error');
        return;
    }

    res.end(req.query.echostr);
}

exports.doPost = function(req, res){

    if(!checkSource(req)){
        res.end('error');
        return;
    }
	
	if(!req.body.hasOwnProperty('xml')){
		res.end('Invalid body');
		return;
	}
	
	var msg = req.body.xml;
	console.log('doPost...xml:', msg);
    var xml = buildXml(msg.FromUserName, msg.ToUserName, 'text', '0', function(xml) {		
		switch(msg.MsgType[0])
		{
			case 'event':
				if(msg.Event[0] == 'CLICK') {
					if(msg.EventKey[0] == 'HY'){	////签到消息
						API.getUserInfo(msg.FromUserName[0], function (user){
							if(user !== 'failed'){
								return xml.ele('Content')
									.dat('Hi, ' + user.nickname + '， 签到有礼哦！');
							}
						});
					}					
				}
				if(msg.Event[0] == 'subscribe') {
					API.getUserInfo(msg.FromUserName[0], function (user){
						if(user !== 'failed'){
							db.addUser(user, function(res){
								console.log('addUser:',res);
							});
						}
					});
					return xml.ele('Content')
							.dat('Hi, ' + msg.FromUserName[0] + '，欢迎您来到我的小店！');
				}
				if(msg.Event[0] == 'unsubscribe') {
					db.removeUser(msg.FromUserName[0], function(res){
						console.log('removeUser:', res);
					});
				}
				break;
			case 'text':				
				break;
			case 'image':
				break;
			case 'LOCATION':
				return xml.ele('Content')
						.dat('');;
			case 'voice':
				break;
		}
		return xml.ele('Content')
			.dat('hello world');
    });

    res.contentType('text/xml');
    res.send(xml, 200);
}

function checkSource(req){
    var signature = req.query.signature,
        timestamp = req.query.timestamp,
        nonce = req.query.nonce,
        shasum = crypto.createHash('sha1'),
        arr = [config.weixin.token, timestamp, nonce];

    shasum.update(arr.sort().join(''),'utf-8');
    return shasum.digest('hex') == signature;
}

function buildXml(to, from, msgType, funFlag, callback){
    var xml = xmlbuilder.create('xml')
        .ele('ToUserName')
        .dat(to)
        .up()
        .ele('FromUserName')
        .dat(from)
        .up()
        .ele('CreateTime')
        .txt(new Date().getMilliseconds())
        .up()
        .ele('MsgType')
        .dat(msgType)
        .up();
    xml = callback(xml);
    return xml.ele('FuncFlag',{},funFlag).end({pretty:true});
}