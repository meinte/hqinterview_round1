function PaypalRestPlugin() {
    var config = require('../../../model/core/config.js');
    this.paypal = require('paypal-rest-sdk');
    this.paypal.configure(config.paypalRestInit);
}

PaypalRestPlugin.prototype.doPayment = function(paymentTransactionVO, callback) {
    var tVO = paymentTransactionVO;
    if (!tVO) throw new Error("paymentTransactionVO can't be null");
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "credit_card",
            "funding_instruments": [{
                "credit_card": {

                    "type": paymentTransactionVO.cardType,
                    "number": paymentTransactionVO.cardNumber,
                    "expire_month": "3",
                    "expire_year": "2020",
                    "cvv2": paymentTransactionVO.cvv,
                    "first_name": paymentTransactionVO.firstName,
                    "last_name": paymentTransactionVO.lastName

                }
            }]
        },
        "transactions": [{
            "amount": {
                "total": paymentTransactionVO.amountOfMoney,
                "currency": paymentTransactionVO.currency,
                "details": {
                    "subtotal": paymentTransactionVO.amountOfMoney,
                    "tax": "0",
                    "shipping": "0"

                }
            },
            "description": "This is a test transaction"
        }]
    };
    this.paypal.payment.create(create_payment_json, null, function(error, payment) {
        /*console.log("paypal error:")
        console.log(error);
        console.log("paypal payment: ");
        console.log(payment);*/
        var friendlyError=null;
        if(error){
            friendlyError={};
            console.log(error.response.details);
            friendlyError = new Error(error.response.details[0].issue);
        }
        
        callback(friendlyError, payment);
    });
}

//this function defines under which conditions to use this plugin
//if more than one plugin returns true, the paymentservice simply picks the first one
PaypalRestPlugin.prototype.ruleset = function(paymentTransactionVO) {
    var tVO = paymentTransactionVO;
    var useWithCurrencies = ['USD', 'EUR', 'AUD'];
    if (tVO.cardType == 'amex' && tVO.currency == 'USD') return true;
    if (useWithCurrencies.indexOf(tVO.currency) > -1) return true;

    return false;
}


module.exports = PaypalRestPlugin;
