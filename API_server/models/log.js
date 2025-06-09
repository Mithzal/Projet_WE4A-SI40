const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
    level: {
        type: String,
        enum: ['logging', 'disconnect', 'post', 'reading', 'homework'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    source: String,
    metadata: Schema.Types.Mixed
});

module.exports = mongoose.model('Log', logSchema);
