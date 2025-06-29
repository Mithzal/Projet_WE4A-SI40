const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  "name": {
    type: String,
    required: true
  },
  "email": {
    type: String,
    required: true,
    unique: true
  },
  "role": {
    type: String,
    enum: ['Student', 'Teacher', 'Admin'],
    required: true
  },
  "courses": {
    type :[{
      courseId: {
        type: Schema.Types.ObjectId,
        ref: 'UEs',
        required: true
      },
      enrollmentDate: {
        type: Date,
        default: Date.now
      },
      lastAccess: {
        type: Date,
        default: null
      }
    }],
    default: []
  },
  "password": {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);
