var User   = require('../models/user'); // get our mongoose model
var jwt    = require('jsonwebtoken'); 
var config = require('../../config.js');
var userService = require("../services/userService.js");


exports.authenticate=function(req,res){
	console.log(req.body);
	userService.authenticate(req.body.username,req.body.password,function(err,user){
		if(err){
			res.json({"error":err});
		}else{
			var token = jwt.sign(user, config.secret, {expiresIn: 86400 });
			res.json({"token":token});
		}
	});

}

exports.createEmployee=function(req,res){
	var registered = userService.createEmployee(req.body.user,function(data){
	
	if(data){
		res.json({ success: true });
	}else{
		res.json({error:"There was an error"});
	}

	});	
}

exports.createEmployer=function(req,res){
	var registered = userService.createEmployer(req.body.user,function(data){
	if(data){
		res.json({ success: true });
	}else{
		res.json({error:"There was an error"});
	}
	});	
}

exports.getPublicUsers=function(req,res){
	userService.getPublicUsers(function(err,users){
		if(err){
			res.json({"error":err});
		}else{
			res.json(users);
		}
	});
}


exports.getProfile= function(req,res){
	userService.getUserById(req.decoded._doc._id,function(err,user){
		if(user){
			res.json(user);	
		}else{
			res.json({success:false});
		}
	});
}

exports.upgradeToPremium= function(req,res){
	userService.upgradeToPremium(req.decoded._doc.id,function(err,upgrade){
		if(upgrade){
		res.json({ success: true });
		}else{
		res.json({success:false});
		}
	});
	
}

exports.deleteAccount=function(req,res){
	userService.deleteAccount(req.decoded._doc.id,function(err,deleted){
		if(deleted){
			res.json({ success: true });
		}else if(err){
			res.json({success:err});
		}else{
			res.json({success:false});
		}
	});
	
	
}








