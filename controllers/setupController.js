var helpers = require('../config/helperFunctions');

module.exports = function (server, restify, restifyValidator) {
	server.use(restifyValidator);
	server.use(restify.bodyParser());
	server.use(restify.queryParser());
	server.use(restify.authorizationParser());
	server.use(restify.acceptParser(server.acceptable));
	// queryParser isn't actually required here, but can help us handle GET parameters like: user?id=bar&name=foo

	// To whitelist an IP address...
	server.use(function (req, res, next) {
		var whitelistedIps = ['111.222.333.444'];
		var ip = res.headers['x-forwared-for'] || req.connection.remoteAddress;
		if (whitelistedIps.indexOf(ip) === -1) {
			helpers.failure(res, next, 'Invalid IP address', 403);
		}
		return next();
	});

	// To implement a basic autentication on your API's...
	server.use(function (req, res, next) {
		var apiKeys = {
			'user1': 'kuygc4tte7t4gre6sacfvhzb'
		};
		if (typeof(req.authorization.basic) === 'undefined' || !apiKeys[req.authorization.basic.username] || req.authorization.basic.password !== apiKeys[req.authorization.basic.username]) {
			helpers.failure(res, next, 'You must specify a valid API key', 403);
		}
		return next();
	});

	// To throttle our API i.e. limit the number of request per user. Take a look at the Restify website for more information.
	server.use(restify.throttle({
		rate: 1,
		burst: 2,
		xff: true
	}));
};