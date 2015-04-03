module.exports.execute=function(server){
	var path = require('path');

	server.route({
	    method: 'GET',
	    path:'/', 
	    handler: function (request, reply) {
	       reply.file('index.html');
	    }
	});

	server.route({
	    method: 'GET',
	    path: '/{param*}',
	    handler: {
	        directory: {
	            path: path.join(global.APPROOT, 'view/static'),
	            listing:true
	        }
	    }
	});

	var getTestdata = require('./getTestdata.js');
	server.route({
		method:'POST',
		path:'/getTestData',
		handler:getTestdata.execute
	});

	var handlePayment = require('./handlePayment.js');
	server.route({
		method:'POST',
		path:'/handlePayment',
		handler:handlePayment.execute
	});
}