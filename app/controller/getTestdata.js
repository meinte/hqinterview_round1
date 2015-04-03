module.exports.execute=function(request,reply){
	var testData = require('../model/payment/testAccounts.js');
	reply(JSON.stringify(testData));

}