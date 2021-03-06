var User   = require('../models/user'); // get our mongoose model
var jwt    = require('jsonwebtoken'); 
var Listing = require('../models/listing');
var config = require('../../config.js');
var employerService = require("../services/employerService.js");
var userService = require("../services/userService.js");
var listingService = require("../services/listingService.js");
var UIRoutes = require('./UIRoutes.js');

exports.createListing=function(req,res){
	var user=req.decoded._doc;
	var listing = {};
	listing.name=req.body.name;
	listing.deadline = req.body.deadline;
	listing.description=req.body.description;


	listingService.createListing(user,listing,function(err,result){
		if(result){
			res.redirect('/homepage');
		}else if(err){
			res.json({error:err});
		}else{
			res.json({success:false});
		}
	});
}

exports.updateListing=function(req,res){
	var id=req.decoded._doc._id;
	var listing=req.body;
	listingService.editListing(listing,function(err,success){
		if(err){
			res.send(err);
		}else{
			res.redirect('/homepage');
		}
	});

}

exports.getListings=function(req,res){
	var id=req.decoded._doc._id;
	employerService.getListingsByOwner(id,function(listings,err){
		if(listings){
			res.json(listings);
		}else if(err){
			res.json({error:err});
		}else{
			res.json({success:false});
		}
	});
}


exports.updateEmployer=function(req,res){
		var id=req.decoded._doc._id;
		console.log(req.body);
		employerService.updateEmployerUsername(id,req.body,function(err,user){
		if(err){
			res.json({error:err});
		}else{
			userService.authenticate(user.username,user.password,function(err,user){
				if(err){
				res.json({"error":err});
				}else{
				var token = jwt.sign(user, config.secret, {expiresIn: 86400 });
				res.redirect('/homepage?token='+token);
				}


			});
			
			
		}
	});
}


exports.acceptForOffer=function(req,res){

	
	var employeeId=req.query.employeeId;
	var listingId = req.query.listingId;
	employerService.acceptForOffer(employeeId,listingId,function(err,result){
		if(err){
			res.json({error:err});
		}else{
			res.json({success:true});
		}
	});
		
}

exports.acceptForInterview=function(req,res){
	var employeeId=req.query.employeeId;
	var listingId=req.query.listingId;
	employerService.acceptForInterview(employeeId,listingId,function(err,success){
		if(err){
			res.json({error:err});
		}else{
			res.json({success:true});
		}
	});
}



exports.rejectApplication=function(req,res){
	var employeeId=req.query.employeeId;
	var listingId=req.query.listingId;
	employerService.rejectApplication(employeeId,listingId,function(err,success){
		if(err){
			res.json({error:err});
		}else{
			res.json({success:true});
		}
	});
}


exports.search = function(req,res){
	var query=req.query.q;
	listingService.search(query,function(listings,err){
		if(listings){
			res.redirect("/search?listings="+listings);
		}else{
			res.json(err);
		}		
		
	});
	
}


exports.editListing=function(req,res){
	res.send("TO DO");
}

//Premium Services ================================================================================================================================
exports.followEmployee=function(req,res){
	var employerId=req.decoded._doc._id;
	var employeeId=req.body.employeeId;
	employerService.followEmployee(employerId,employeeId,function(err,success){
		if(err){
			res.json({error:err});
		}else{
			res.json({success:true});
		}
	});

}
//Premium Service
exports.getRequestedEmployees=function(req,res){
	var id=req.decoded._doc._id;
	employerService.getRequestedEmployees(id,function(err,requested){
		if(err){
			res.json({error:err});
		}else{
			res.json(requested);
		}

	});
}
//Premium Service
exports.deleteRequestedApplication =function(req,res){
	var employerId=req.decoded._doc._id;
	employerService.deleteRequestedEmployees(employerId,req.body.employeeId,function(err,requested){
		if(err){
			res.json({error:err});
		}else{
			res.json({success:true});
		}

	});
}






