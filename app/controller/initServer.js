module.exports.execute=function(server){
	var config = require('../model/core/config.js')
	server.connection({ 
	    host: config.host, 
	    port: config.port
	});
	console.log('visit http://'+config.host+":"+config.port+"/");


}