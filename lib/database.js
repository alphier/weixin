var collections = ["users", "products"],
	BSON = require('mongodb').BSONPure,
	db = require("mongojs").connect("localhost/weinxidb", collections);

//user table
exports.getUser = function (id, callback) {
	"use strict";
	
	db.users.findOne({openid: id}, function (err, user) {
        callback(user);
    });
};

exports.getAllUsers = function (name, callback) {
	"use strict";
	
	var res = db.users.find();
	res.toArray(function (err, users) {
        callback(users);
    });
};

exports.addUser = function (user, callback) {
    "use strict";

    db.users.findOne({"openid": user.openid}, function (err, u) {
    	if (u !== undefined && u !== null){
    		callback('failed');    		
    	}
    	else {
			db.users.save(user, function (error, saved) {
				callback('success');
			});
    	}
    });    
    
};

exports.removeUser = function (id, callback) {
	"use strict";
	
	db.users.remove({"openid": id}, function (err, count){
		if(count > 0)
			callback('success');
		else
			callback('failed');
	});
};
