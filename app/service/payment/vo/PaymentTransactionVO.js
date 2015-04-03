//simple value object. It's not as useful as in static languages, 
//but it's more of a descriptor for developers, making sure people know what object to expect etc.
function PaymentTransactionVO(clientPayload) {
    this.amountOfMoney = clientPayload.amount_of_money;
    this.currency = clientPayload.currency;
    this.firstName = clientPayload.first_name;
    this.lastName = clientPayload.last_name;
    this.expiryMonth = clientPayload.expiry_month;
    this.expiryYear = clientPayload.expiry_year;
    this.cardType = clientPayload.card_type;
    this.cardName = clientPayload.card_name;
    this.cardNumber = clientPayload.card_number;
    this.cvv = clientPayload.cvv;
}
module.exports = PaymentTransactionVO;
