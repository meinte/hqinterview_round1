var assert = require('assert');
var PaymentService = require('../app/service/payment/PaymentService.js');
var DatabaseService = require('../app/service/storage/DatabaseService.js');
var PaymentTransactionVO = require('../app/service/payment/vo/PaymentTransactionVO.js');
var storePayment = require('../app/controller/storePayment.js');
var testData = require('../app/model/payment/testAccounts.js');


var paymentTestObject = new PaymentService();
var dbTestObject = new DatabaseService();

describe('PaymentService', function() {
    describe('Validate Client Data', function() {
        it('should return true with valid card data', function() {
            assert(paymentTestObject.validateClientData(testData.validClientData));
        });
        it('should return false with invalid card data', function() {
            assert.equal(paymentTestObject.validateClientData(testData.invalidCreditCard), false);
        });
    });

    describe('Initialize Plugins', function() {
        it('should not throw error', function() {
            assert.doesNotThrow(function() {
                paymentTestObject.initializeAllPlugins();
            });
        });
        it('should have at least one plugin that is valid', function() {
            assert(paymentTestObject.plugins.length > 0);
        });
    });

    describe('Pick correct plugin', function() {
        it('should throw error with null data', function() {
            assert.throws(function() {
                paymentTestObject.getSuitablePlugin()
            });
        });

        it('should pick paypal rest plugin', function() {
            assert.equal(paymentTestObject.getSuitablePlugin(testData.paypalData).constructor.name, "PaypalRestPlugin");
        });
        it('should pick braintree plugin', function() {
            assert.equal(paymentTestObject.getSuitablePlugin(testData.braintreeData).constructor.name, "BraintreePlugin");
        });
        it('should pick no plugin when amex and not USD', function() {
            assert.equal(paymentTestObject.getSuitablePlugin(testData.amexNonUSD), null);
        });
    });
    describe('Do payment', function() {
        it('should do a paypal payment without error', function(done) {
            this.timeout(50000);
            paymentTestObject.doPayment(testData.paypalData, function(error, result) {
                if (error) throw error;
                done();
            });
        });
        it.only('should do a braintree payment without error', function(done) {
            this.timeout(50000);
            paymentTestObject.doPayment(testData.braintreeData, function(error, result) {
                if (error) throw error;
                done();
            });
        });
    });
    describe('Store Payment Data', function() {
        it('should connect to the database without error', function(done) {
            this.timeout(50000);
            dbTestObject.init(function(error, result) {
                if (error) throw error;
                done();
            });
        });
        it('should store payment data without error', function(done) {
            this.timeout(50000);
            paymentTestObject.doPayment(testData.paypalData, function(error, result) {
                storePayment.execute(testData.paypalData, error, result, function(error, result) {
                    if (error) throw error;
                    done();
                });
                if (error) throw error;
            });

        });
    });

});
