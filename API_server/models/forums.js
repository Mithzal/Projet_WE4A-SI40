const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const forumSchema = new Schema({
  "courseCode" : {
    type: String,
    required: true,
    match: /^[A-Z]{2,3}\d{2}$/
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
        enum: ['announcement', 'assignment', 'discussion'],
        required: true
      },
      "timestamp": {
        type: Date,
        default: Date.now
      },
      "author": {
        type: String,
        required: true
      }
    }
  ]
})

module.exports = mongoose.model('Forums', forumSchema);
