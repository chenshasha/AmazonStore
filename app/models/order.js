/**
 * Created by shashachen on 2/19/14.
 */

var mongoose = require('mongoose');

// define
var orderSchema = mongoose.Schema({
    transactionDate        : Date,
    total                  : Number,
    items                  : [],
    shopper_id             : String,
    shopper_fn             : String,
    shopper_ln             : String,
    shopper_add            : String,
    shopper_phone          : Number,
    shopper_email          : String,
    shopper_CC_Number      : Number,
    shopper_CC_Exp_Month   : String,
    shopper_CC_Exp_Year    : String

});

module.exports = mongoose.model('Order', orderSchema);

