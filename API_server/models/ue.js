const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uesSchema = new Schema({
  "id" : {
    type: String,
    required: true,
    unique: true,
    match : /^[A-Z]{2,3}\d{2}$/ // Example format: "UE-123" or "CS-456"
  },
  "name":{
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
    type: String,
    required: true
  }
})

module.exports = mongoose.model('UEs', uesSchema);
