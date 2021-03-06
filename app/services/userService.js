var User   = require('../models/user'); // get our mongoose model

exports.authenticate=function(username,password,callback){
	if(username==undefined||password==undefined){
		callback("Username and Password must be defined.",null);
	}
	else{

	User.findOne({
		username: username
	}, function(err, user) {
		if (err){  
			callback(err,null);
		}
		else{
			if (!user) {
				callback("User not found",null);
			}
			else {
				if (user.password != password) {
					callback("Incorrect Password",null);
				} else {
					callback(false,user);
				}		
			}
		}
		
		
	});
	}
}


exports.createEmployee = function(user,callback){

	var ee1 = new User({ 
	username: user.username, 
	password: user.password, 
	email: user.email,
	answer: user.answer,
	firstname: user.firstname,
	lastname: user.lastname,
	isPremium:false,
	enabled:true,
	accountNonExpired:true,
	credentialsNonExpired:true,
	accountNonLocked:true,
	applications:[],
	interviews:[],
	offers:[],
	rejected:[],
	role:1, //employee-1 | employer-2 |admin - 3
	reviews:[],//for Premium Employees
	following:[] //If employee - employers| if employer, memp
 });
	console.log(ee1);
	ee1.save(function(err) {
		if (err) callback(false,err);
		console.log('User saved successfully');
		callback(ee1);
	});
}	


exports.createEmployer = function(user,callback){

var er1 = new User({ 
	username: user.username, 
	password: user.password, 
	email: user.email,
	answer: user.answer,
	firstname: user.firstname,
	lastname: user.lastname,
	isPremium:user.isPremium,
	enabled:true,
	accountNonExpired:true,
	credentialsNonExpired:true,
	accountNonLocked:true,
	applications:[],
	interviews:[],
	offers:[],
	rejected:[],
	role:2, //employee-1 | employer-2 |admin - 3
	reviews:[],//for Premium Employees
	following:[] //If employee - employers| if employer, memp
 });
	console.log(er1);
	er1.save(function(err) {
		if (err) callback(false,err);
		console.log('User saved successfully');
		callback(er1);
	});
}	

exports.createAdmin = function(user,callback){

	var admin = new User({ 
	username: user.username, 
	password: user.password, 
	email: user.email,
	answer: user.answer,
	firstname: user.firstname,
	lastname: user.lastname,
	isPremium:user.isPremium,
	enabled:true,
	accountNonExpired:true,
	credentialsNonExpired:true,
	accountNonLocked:true,
	applications:[],
	interviews:[],
	offers:[],
	rejected:[],
	role:3, //employee-1 | employer-2 |admin - 3
	reviews:[],//for Premium Employees
	following:[] //If employee - employers| if employer, memp
 });
	console.log(admin);
	admin.save(function(err) {
		if (err) callback(false,err);
		console.log('User saved successfully');
		callback(admin);
	});
}	

exports.getPublicUsers=function(callback){
	User.find({}, function(err, users) {
		if(err){
			callback(err,null);
		}else{
			callback(false,users);
		}
	
	});
}


exports.getUserById=function(id,callback){
	User.findById(id, function(err, user) {
		if(err){ 
			callback(err,null);
		}
		else{
			callback(false,user);
		}	
	});
	
}



exports.deleteAccount=function(id,callback){
	User.findByIdAndRemove(id,function(err){
		if(err){
			callback(err);
		}else{
			callback(false,true);
		}
		
	});
	
}

exports.getEE = function(q,isPremium,callback){
	if(isPremium){
		User.find({"role":1,"username":RegExp(q,'i')},function(err,users){
		if(err){
			callback(err,users);
		}else{
			callback(err,users);
		}
		});
	}else{
		User.find({"role":1,"isPremium":false,"username":RegExp(q,'i')},function(err,users){
		if(err){
			callback(err,users);
		}else{
			callback(err,users);
		}
		});
	}
	
}


//Admin
exports.getEmployees = function(callback){
	
	User.find({"role":1},function(users,err){
		if(err){
			callback(err);
		}else{
			callback(users);
		}
		});
	
	
}
//Admin
exports.getEmployers = function(callback){
	User.find({"role":2},function(users,err){
		if(err){
			callback(err);
		}else{
			callback(users);
		}
	});
}


exports.upgrade=function(id,cc,callback){

	
validateCreditCard(cc,function(valid){

	if(valid){

		User.findById(id,function(err,user){
		if(err){
			callback(err);
		}else{
			if(user.isPremium==false){
				user.isPremium=true;
				user.cc.push(cc);
				user.save(function(err){
					if(err){
						callback(err);
					}else{
						callback(null,user);
					}
					
				});
			}
			else{
						callback("Already Premium User");
					}
				}
			})
		}else{
			callback("Error Processing Payment");
		}
			

});



	


	
	
}


var validateCreditCard=function(cc,callback){
	
	if(cc.cvc==undefined||cc.amount==undefined||cc.fullname==undefined||cc.exp==undefined||cc.ccn==undefined){
		 callback(false);
	}else{
	//Check to make sure that the amount paid is over $50
	console.log(cc.amount);
	 callback(eval("50<"+cc.amount));
	}



}
