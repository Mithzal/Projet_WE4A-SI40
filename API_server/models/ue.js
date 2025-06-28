const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uesSchema = new Schema({
  "code": {
    type: String,
    required: true,
    unique: true,
    match: /^[A-Z]{2,3}\d{2}$/ // Example format: "UE-123" or "CS-456"
  },
  "name": {
    type: String,
    required: true
  },
  "description": {
    type: String,
    required: true
  },
  "credits": {
    type: Number,
    required: true
  },
  "instructorId": {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
 "content": [
   {
     "type": {
       type: String,
       enum: ['info', 'warning', 'file','assignement'],
       required: true
     },
      "title": {
        type: String,
        required: true
      },
      "text": {
        type: String,
        required: true
      },
     "fileId" : {
        type: Schema.Types.ObjectId,
        ref: 'Files',
        required: false
     },
     "limitDate": {
        type: Date,
        required: false
     },
     "returns": [
       {
         "userId": {
           type: Schema.Types.ObjectId,
           ref: 'Users',
           required: true
         },
         "fileId": {
           type: Schema.Types.ObjectId,
           ref: 'Files',
           required: true
         },
         "fileName": {
           type: String,
           required: true
         },
         "submissionDate": {
           type: Date,
           default: Date.now
         }
       }
     ]
   }
 ]
})

module.exports = mongoose.model('UEs', uesSchema);
