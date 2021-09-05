var mongoose = require('mongoose');
var market = new mongoose.Schema({
    broker: {
        type: Number,
        default: null
    },
    name: {
        type: String,
        default: null
    },
    bid: {
        type: Number,
        default: null
    },
    last: {
        type: Number,
        default: null
    },
    ask: {
        type: Number,
        default: null
    },
    high24hr: {
        type: Number,
        default: null
    },
    low24hr: {
        type: Number,
        default: null
    },
    volume: {
        type: Number,
        default: null
    },
    isFrozen: {
        type: Number,
        default: 0
    },
    date_created: {
        type: Date,
        default: new Date()
    },
    mod: {
        type: Number,
        default: 0
    },
    prevDay: {
        type: Number,
        default: 0
    },
    percent: {
        type: Number,
        default: 0
    }
});
module.exports = mongoose.model('market', market);