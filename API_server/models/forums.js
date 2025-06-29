const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const forumSchema = new Schema({
  "courseId" : {
    type: Schema.Types.ObjectId,
    ref: 'ues',
    required: true,
  },
  "title": {
    type: String,
    required: true
  },
  "messages": [
    {
      "content": {
        type: String,
        required: true
      },
      "type": {
        type: String,
        enum: ['announcement', 'message'],
        required: true
      },
      "timestamp": {
        type: Date,
        default: Date.now
      },
      "author": {
        type: Schema.Types.ObjectId,
        ref : 'Users',
        required: true
      }
    }
  ]
})

module.exports = mongoose.model('Forums', forumSchema);
