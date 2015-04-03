module.exports.execute=function(request,reply){
	var path = require('path');
	//todo put services and general purpose code in node_modules to avoid relative path seeking
	var PaymentService = require('../service/payment/PaymentService');
	var PaymentTransactionVO = require('../service/payment/vo/paymentTransactionVO');
	var storePayment = require('./storePayment.js');
	var paymentService = new PaymentService();
	var transactionVO = new PaymentTransactionVO(request.payload);

	//TODO get rid of magic strings
	paymentService.addException("You can only pay in USD when using American Express",
		function(transactionVO){
			return transactionVO.cardType=='amex' && transactionVO.currency!='USD';
		}
	);

	paymentService.doPayment(transactionVO,function(error,result){
		storePayment.execute(transactionVO,error,result,function(sErr,sRes){
			if(sErr){
				console.log('payment storage error');
			}else{
				console.log('payment storage success');
			}
		});
		var message="Success";
		if(error){
			message=error.message;
		}
		reply(message);
	});

}