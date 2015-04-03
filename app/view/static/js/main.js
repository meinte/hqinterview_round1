function init() {
    var CREDIT_CARD_TYPE_INVALID = 'invalid';

    var validators = {};
    var formInputChangedMap={}; //gets filled with input objects to see if the user changed it
    var mainForm = T.gid('main_form');
    var submitButton = T.gid('submit_btn');
    var firstSubmit = true;
    var formValues={};
    var testValuesSelect = T.gid('test_values');
    var testValues = null;
    var waitingScreen = T.gid('waiting_screen');
    var doneButton = T.gid('done_button');

    mainForm.addEventListener('submit', T.dlg(this, form_submitHandler));
    mainForm.addEventListener('change',T.dlg(this,form_changeHandler));
    testValuesSelect.addEventListener('change',T.dlg(this,testvalues_changeHandler));
    mainForm['card_number'].addEventListener('input', T.dlg(this, cardnumber_changeHandler));
    doneButton.addEventListener('click',doneButton_clickHandler);


    T.ajx('/getTestData',null,T.dlg(this,gettestdata_callback));

    function form_submitHandler(evt) {
    	evt.preventDefault();
        firstSubmit = false;
        if(validateFormAndShowFeedback()){
            T.gid('result').innerHTML = "Loading...."; 
            T.adcl(doneButton,'hidden');
            T.rmcl(waitingScreen,'hidden');
        	T.ajx('/handlePayment',formValues,T.dlg(this,dopayment_callback));
        }
    }

    function doneButton_clickHandler(evt){
        T.adcl(waitingScreen,'hidden');
        evt.preventDefault();
    }

    function dopayment_callback(result){
        T.rmcl(doneButton,'hidden');
        T.gid('result').innerHTML = result;        
    }

    function gettestdata_callback(json){
        testValues = json;
        testValuesSelect.options[0].text="Select testing data";
        for(var i in testValues){
            var option = document.createElement("option");
            option.value = i;
            option.text = i;
            testValuesSelect.add(option, null);
        }
    }

    function testvalues_changeHandler(evt){
        var testData = testValues[testValuesSelect.value];
       mainForm['amount_of_money'].value = testData.amountOfMoney;
       mainForm['currency'].value = testData.currency;
       mainForm['first_name'].value = testData.firstName;
       mainForm['last_name'].value = testData.lastName;
       mainForm['card_type'].value = testData.cardType;
       mainForm['expiry_month'].value = testData.expiryMonth;
       mainForm['expiry_year'].value = testData.expiryYear;
       mainForm['card_name'].value = testData.cardName;
       mainForm['card_number'].value = testData.cardNumber;
       mainForm['cvv'].value = testData.cvv;
    }

    function form_changeHandler(evt){
    	formInputChangedMap[evt.target.name]=true;
    	validateFormAndShowFeedback(true);
    }

    function validateFormAndShowFeedback(checkIfFilledIn){
    	var fElem = mainForm.elements;
        var allValid = true;
        var key = null;

        for (key in validators) {
            var validator = validators[key];
            var formName = key;
            var formElement = fElem[formName];
            var isValid = validator.call(this, formElement.value);
        	
            formValues[key] = formElement.value;

            T.rmcl(formElement,'input_error');
            if(checkIfFilledIn){
            	if(!formInputChangedMap[formElement.name]){
            		continue;
            	}
            }
            if (!isValid) {
                T.adcl(formElement, 'input_error');
                allValid = false;
            }

        }
        return allValid;
    }

    (function initValidators(){
        validators['amount_of_money'] = validateMoney;
        validators['currency'] = validateCurrency;
        validators['first_name'] = validateName;
        validators['last_name'] = validateName;
        validators['card_type'] = validateCardType;
        validators['card_name'] = validateName;
        validators['card_number'] = validateCardNumber;
        validators['expiry_month'] = validateMonth;
        validators['expiry_year'] = validateYear;
        validators['cvv'] = validateCVV;
    })();

    function validateMoney(money) {
        return money > 0;
    }

    function validateMonth(month){
    	return month>1 && month<13;
    }

    function validateYear(year){
    	return year>2013 && year<2080;
    }

    function validateCurrency(currency) {
        return currency.length > 0;
    }

    function validateName(name) {
        return name.length > 0;
    }

    function validateCardType(cardType) {
        return cardType != false;
    }

    function validateCardNumber(cardNumber) {
        return getCreditCardType(cardNumber) != CREDIT_CARD_TYPE_INVALID;
    }

    function validateCVV(cvv) {
        return String(cvv).length == 3;
    }

    function cardnumber_changeHandler(evt) {
        var creditCardType = getCreditCardType(evt.target.value);
        if (creditCardType != CREDIT_CARD_TYPE_INVALID) {
            mainForm['card_type'].value = creditCardType;
        }
    }

    function getCreditCardType(cardNumber) {
        var regs = [];
        regs['visa'] = new RegExp('^4[0-9]{6,}$');
        regs['discover'] = new RegExp('^6(?:011|5[0-9]{2})[0-9]{3,}$');
        regs['mastercard'] = new RegExp('^5[1-5][0-9]{5,}$');
        regs['amex'] = new RegExp('^3[47][0-9]{5,}$');
        for (var i in regs) {
            if (regs[i].test(cardNumber)) {
                return i;
            }
        }
        return CREDIT_CARD_TYPE_INVALID;
    }
}
