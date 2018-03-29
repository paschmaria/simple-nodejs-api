var restify = require('restify');
var restifyValidator = require('restify-validator');

var mongoose = require('mongoose');
var config = require('./config/dbConnection');
var userController = require("./controllers/userController.js");
var setupController = require("./controllers/setupController.js");

var server = restify.createServer();

mongoose.connect(config.getMongoConnection());
setupController(server, restify, restifyValidator);
userController(server);

// server.get("/", function (req, res, next) {
// // If the root URL is requested
// 	res.setHeader('content-type', 'application/json');
// 	// This tells the client calling the api to expect JSON to be returned in the response
// 	res.writeHead(200);
// 	// This returns the required header to the client (HTTP code 200)
// 	res.end(JSON.stringify(users));
// 	// Creates a JSON string containing whatever is in our users array
// 	return next();
// });

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

// Get is for retrieving information about a user, post is for creating a new users
// Put is for updating user information