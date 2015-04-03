var PaymentTransactionVO = require('../../service/payment/vo/PaymentTransactionVO.js');
module.exports = {
    "validClientInvalidPayment": new PaymentTransactionVO({
        amount_of_money: '1',
        currency: 'USD',
        first_name: 'us',
        last_name: 'tester',
        expiry_month: '5',
        expiry_year: '2017',
        card_type: 'visa',
        card_name: 'Meinte',
        card_number: '4375840375534567',
        cvv: '123'
    }),
    "invalidCreditCard": new PaymentTransactionVO({
        amount_of_money: '1',
        currency: 'USD',
        first_name: 'Meinte',
        last_name: 'vant Kruis',
        expiry_month: '5',
        expiry_year: '2012',
        card_type: 'visa',
        card_name: 'Meinte',
        card_number: '4375875534567',
        cvv: '123'
    }),
    "paypalData": new PaymentTransactionVO({
        amount_of_money: '1',
        currency: 'USD',
        first_name: 'us',
        last_name: 'tester',
        expiry_month: '3',
        expiry_year: '2020',
        card_type: 'visa',
        card_name: 'us tester',
        card_number: '4032036822485346',
        cvv: '123'
    }),
    "braintreeData": new PaymentTransactionVO({
        amount_of_money: '1',
        currency: 'HKD',
        first_name: 'user',
        last_name: 'tester',
        expiry_month: '3',
        expiry_year: '2020',
        card_type: 'visa',
        card_name: 'Meinte',
        card_number: '4009348888881881',
        cvv: '123'
    }),
    "amexNonUSD" : new PaymentTransactionVO({
        amount_of_money: '1',
        currency: 'HKD',
        first_name: 'John',
        last_name: 'Doe',
        expiry_month: '5',
        expiry_year: '2017',
        card_type: 'amex',
        card_name: 'Meinte',
        card_number: '4375840375534567',
        cvv: '123'
    })
};
