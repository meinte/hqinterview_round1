function PaymentService() {
    this.plugins = [];
    this.exceptions=[];
}


PaymentService.prototype.getSuitablePlugin = function(paymentTransactionVO) {
    if (!paymentTransactionVO) throw new Error("paymentTransactionVO can't be null");
    for (var i = 0; i < this.plugins.length; i++) {
        if (this.plugins[i].ruleset(paymentTransactionVO)) {
            return this.plugins[i];
        }
    }

    return null;
}
PaymentService.prototype.addException=function(exceptionMessage,exceptionFunction){
    this.exceptions.push({
        exception:exceptionFunction,
        message:exceptionMessage
    });
}

//plugin parameter is optional, if its null it will try to find one itself
PaymentService.prototype.doPayment = function(paymentTransactionVO, callback, plugin) {
    if (!paymentTransactionVO) {
        callback(new Error('Transaction data cant be null'),null);
    }
    for(var i=0;i<this.exceptions.length;i++){
        var exceptionFunction = this.exceptions[i].exception;
        if(typeof(exceptionFunction) === typeof(Function)){
            if(exceptionFunction(paymentTransactionVO)){
                callback(new Error(this.exceptions[i].message),null);
                return;
            }
        }
    }

    if(!this.validateClientData(paymentTransactionVO)){
        callback(new Error('Transaction Data is invalid'),null);
        return;
    }
    if(this.plugins.length==0){
        this.initializeAllPlugins();
    }
    if (!plugin) {
        plugin = this.getSuitablePlugin(paymentTransactionVO);
    }
    if(!plugin){
        callback(new Error('No suitable plugin for transaction'),null);
        return;
    }

    plugin.doPayment(paymentTransactionVO, callback);
}

//loads in plugins, instantiates and checks for validity.
PaymentService.prototype.initializeAllPlugins = function() {
    var normalizedPath = require("path").join(__dirname, "plugins");
    var that = this;
    //TODO change to async
    require("fs").readdirSync(normalizedPath).forEach(function(file) {
        var PluginClass = require("./plugins/" + file);
        that.plugins.push(new PluginClass());

    });

    for (var i = 0; i < this.plugins.length; i++) {
        var plugin = this.plugins[i];
        if (typeof(plugin.doPayment) != typeof(Function)) {
            throw new Error("Plugin " + plugin + " requires a doPayment method");
        }
        if (typeof(plugin.ruleset) != typeof(Function)) {
            throw new Error("Plugin " + plugin + " requires a ruleset method");
        }
    }
}

//initial check of data, not thorough, just a double check in case client did not check data,
//in the end the creditcard vendor itself will catch any errors
PaymentService.prototype.validateClientData = function(paymentTransactionVO) {
    function checkCurrency() {
        var validCurrencies = ['USD', 'EUR', 'THB', 'HKD', 'SGD', 'AUD'];
        var isValid = validCurrencies.indexOf(paymentTransactionVO.currency) > -1;
        if (!isValid) console.log("PaymentService: invalid currency: " + paymentTransactionVO.currency);
        return isValid;
    }

    function checkName() {
        var validFirstName = paymentTransactionVO.firstName.length > 0;
        var validLastName = paymentTransactionVO.lastName.length > 0;
        var isValid = validFirstName && validLastName;
        if (!isValid) console.log("PaymentService: invalid full name: " + paymentTransactionVO.firstName + " " + paymentTransactionVO.lastName);
        return isValid;
    }

    function checkExpiry() {
        var validMonth = paymentTransactionVO.expiryMonth > 1 && paymentTransactionVO.expiryMonth < 13;
        var validYear = paymentTransactionVO.expiryYear > 2014 && paymentTransactionVO.expiryYear < 2080;
        var isValid = validMonth && validYear;
        if (!isValid) console.log("PaymentService: invalid expiry: " + paymentTransactionVO.expiryMonth + " " + paymentTransactionVO.expiryYear);
        return isValid;
    }

    function checkCardType() {
        var validCardTypes = ['visa', 'amex', 'discover', 'mastercard'];
        var isValid = validCardTypes.indexOf(paymentTransactionVO.cardType) > -1;
        if (!isValid) console.log("PaymentService: invalid card type: " + paymentTransactionVO.cardType);
        return isValid;
    }

    function checkMoney() {
        var isValid = parseFloat(paymentTransactionVO.amountOfMoney) > 0;
        if (!isValid) console.log("PaymentService: invalid money amount: " + paymentTransactionVO.amountOfMoney);
        return isValid;
    }

    function checkCardName() {
        var isValid = paymentTransactionVO.cardName.length > 0;
        if (!isValid) console.log("PaymentService: invalid card name: " + paymentTransactionVO.cardName);
        return isValid;
    }

    function checkCardNumber() {
        var isValid = String(paymentTransactionVO.cardNumber).length >= 16;
        if (!isValid) console.log("PaymentService: invalid card number: " + paymentTransactionVO.cardNumber);
        return isValid;
    }

    function checkCVV() {
        var isValid = String(paymentTransactionVO.cvv).length == 3;
        if (!isValid) console.log("PaymentService: invalid cvv: " + paymentTransactionVO.cvv);
        return isValid;
    }

    return checkCurrency() && checkName() && checkExpiry() && checkCardType() && checkMoney() && checkCardName() && checkCardNumber() && checkCVV();

}

module.exports = PaymentService;
