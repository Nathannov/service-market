var mongoose = require('mongoose');
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
module.exports = mongoose.model('marketable_list', marketable_list);