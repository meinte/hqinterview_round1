module.exports.execute=function(paymentTransactionVO,paymentError,paymentResult,callback){
	var DatabaseService = require('../service/storage/DatabaseService.js');
	var dbService = new DatabaseService();
	dbService.init(function(error,db){
		if(!error){
			//remove sensitive credit card data before storing
			delete paymentTransactionVO.cardNumber;
			delete paymentTransactionVO.cvv;
			delete paymentTransactionVO.expiryMonth;
			delete paymentTransactionVO.expiryYear;

			dbService.store({
				paymentData:paymentTransactionVO,
				paymentError:paymentError,
				paymentResult:paymentResult
			},
			'payments',
			function(error,result){
				callback(error,result);
			});
		}
	});
}