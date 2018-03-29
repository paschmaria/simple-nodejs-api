var helpers = require('../config/helperFunctions');
var userModel = require('../models/userModel');

// This is a fake database
// var users = {};
// var max_user_id = 0;

module.exports = function(server) {

	server.get("/", function(req, res, next) {
		userModel.find({}, function (err, user) {
			if (err) {
				helpers.failure(res, next, 'Users not found', 404);
			}
			helpers.success(res, next, user);
		});
	});

	// retrieve information for a single user
	server.get("/user/:id", function(req, res, next) {
		// To validate certain parameters using the Restify Validator
		req.assert('id', 'Id is required and must be numeric').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			helpers.failure(res, next, errors[0], 400);
		}
		// To validate our API in order to ensure that a helpers.failure message is given when an unknown user is searched for
		// if (typeof(users[req.params.id]) === 'undefined') {
		// 	helpers.failure(res, next, "The specified user could not be found in the database", 404);
		// }
		
		// Instead of using the fake DB...
		userModel.findOne({ _id: req.params.id }, function (err, user) {
			if (err) {
				helpers.failure(res, next, 'Something went wrong while fetching the user from the database', 500);
			}
			if (user === null) {
				helpers.failure(res, next, 'The specified user could not be found', 404);
			}
			helpers.success(res, next, user);
		});
	});

	// update information for a single user
	server.put("/user/:id", function(req, res, next) {
		req.assert('id', 'Id is required and must be numeric').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			helpers.failure(res, next, errors[0], 400);
		}
		// if (typeof(users[req.params.id]) === 'undefined') {
		// 	helpers.failure(res, next, "The specified user could not be found in the database", 404);
		// }
		// var user = users[parseInt(req.params.id)];
		
		// Instead of using the fake DB...
		userModel.findOne({ _id: req.params.id }, function (err, user) {
			if (err) {
				helpers.failure(res, next, 'Something went wrong while fetching the user from the database', 500);
			}
			if (user === null) {
				helpers.failure(res, next, 'The specified user could not be found', 404);
			}
			// store the body of our http put request in a variable
			var updates = req.params;
			// then we delete the id so we don't overwrite it
			delete updates.id;
			for (var field in updates) {
				user[field] = updates[field];
			}
			user.save(function (err) {
				if (err) {
					helpers.failure(res, next, 'Error saving user to the database', 500);
				}
				helpers.success(res, next, user);
			});
		});
	});

	// delete a user
	server.del("/user/:id", function(req, res, next) {
		req.assert('id', 'Id is required and must be numeric').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			helpers.failure(res, next, errors[0], 400);
		}
		// if (typeof(users[req.params.id]) === 'undefined') {
		// 	helpers.failure(res, next, "The specified user could not be found in the database", 404);
		// }
		// delete users[parseInt(req.params.id)];
		
		userModel.findOne({ _id: req.params.id }, function (err, user) {
			if (err) {
				helpers.failure(res, next, 'Something went wrong while deleting the user from the database', 500);
			}
			if (user === null) {
				helpers.failure(res, next, 'The specified user could not be found', 404);
			}
			user.remove(function (err) {
				if (err) {
					helpers.failure(res, next, 'Error removing user to the database', 500);
				}
				helpers.success(res, next, user);
			});
		});
	});

	server.post("/user", function(req, res, next) {
		req.assert('first_name', 'first_name is required').notEmpty();
		req.assert('last_name', 'last_name is required').notEmpty();
		req.assert('email_address', 'email_address is required and must be a valid email').notEmpty().isEmail();
		req.assert('career', 'Career must either be Student, Teacher or Professor').isIn(['Student', 'Teacher', 'Professor']);
		// Get others in npm node-restify-validation
		var errors = req.validationErrors();
		if (errors) {
			helpers.failure(res, next, errors, 400);
		}
		// var user = req.params;
		// max_user_id++;
		// user.id = max_user_id;
		// users[user.id] = user;
		
		// Create new instance of a User
		var user = new userModel();
		user.first_name = req.params.first_name;
		user.last_name = req.params.last_name;
		user.email_address = req.params.email_address;
		user.career = req.params.career;
		user.save(function (err) {
			if (err) {
				helpers.failure(res, next, 'Error saving user to the database', 500);
			}
			helpers.success(res, next, user);
		});
	});
};