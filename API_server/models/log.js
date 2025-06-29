const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
    type: {
        type: String,
        enum: ['logging', 'disconnect', 'post', 'reading', 'homework', 'creation', 'delete','update','assign', 'submission'],
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
    userId :{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required : true
    }
});

module.exports = mongoose.model('Log', logSchema);
