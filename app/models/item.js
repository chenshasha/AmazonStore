/**
 * Created by shashachen on 2/18/14.
 */
var mongoose = require('mongoose');

// define
var itemSchema = mongoose.Schema({
    quantity     : String,
    modifiedDate : Date,
    buyer_id     : String,
    status       : String,
    book_id      : String

});

module.exports = mongoose.model('Item', itemSchema);