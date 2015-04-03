function BraintreePlugin() {
    var braintree = require('braintree');
    var config = require('../../../model/core/config.js');
    config.brainTreeInit.environment= braintree.Environment.Sandbox,
    this.gateway = braintree.connect(config.brainTreeInit);
}

BraintreePlugin.prototype.doPayment = function(paymentTransactionVO,callback) {
    var tVO = paymentTransactionVO;
    if (!tVO) throw new Error("paymentTransactionVO cant be null");
    this.gateway.transaction.sale({
        amount: tVO.amountOfMoney+".00",
        creditCard: {
            number: tVO.cardNumber,
            expirationMonth: tVO.expiryMonth,
            expirationYear: tVO.expiryYear
        }
    }, function(err, result) {
        console.log("braintree error: ");
        console.log(err);
        console.log("braintree result: ");
        console.log(result);
        if(result.success==false){
            callback(new Error(result.message),null);
            return;
        }

        callback(err,result);
    });
}

BraintreePlugin.prototype.ruleset = function(paymentTransactionVO) {
    var tVO = paymentTransactionVO;
    var useWithCurrencies = ['USD', 'EUR', 'AUD'];
    if (tVO.cardType == 'amex') return false;
    if (useWithCurrencies.indexOf(tVO.currency) < 0) return true;

    return false;
}

module.exports = BraintreePlugin;
