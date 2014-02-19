/**
 * Created by shashachen on 2/13/14.
 */

var mongoose = require('mongoose');

// define
var bookSchema = mongoose.Schema({
        category     : String,
        title        : String,
        author       : String,
        year         : String,
        language     : String,
        ISBN         : String,
        stock        : String,
        price        : Number
});

module.exports = mongoose.model('Books', bookSchema);





