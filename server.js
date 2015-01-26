var express = require('express')
    , io = require('socket.io')
    , weixin = require('./lib/weixin')
    , xmlBodyParser = require('./lib/xmlBodyParser')
    , port = (process.env.PORT || 80);

//Setup Express
var server = express();

server.configure(function(){
    server.use(express.bodyParser());
    server.use(xmlBodyParser);
    server.use(express.cookieParser());
    server.use(express.session({ secret: "shhhhhhhhh!"}));
    server.use(express.static(__dirname + '/static'));
    server.use(server.router);
});

server.listen(port);

server.get('/weixin', weixin.doGet);
server.post('/weixin', weixin.doPost);

console.log('Node listening on port %s', port);