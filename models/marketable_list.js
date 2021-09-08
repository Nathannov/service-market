var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var marketable_list = new mongoose.Schema({
    name: {
        type: String,
        default: null
    },
    status: {
        type: Boolean,
        default: true
    },
});
marketable_list.plugin(uniqueValidator);
module.exports = mongoose.model('marketable_list', marketable_list);