const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  ueId: {
    type: Schema.Types.ObjectId,
    ref: 'UEs',
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0,
    max: 20
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  comments: {
    type: String,
    required: false
  },
  assignmentId: {
    type: Schema.Types.ObjectId,
    ref: 'UeContent',
    required: false
  },
  submissionId: {
    type: Schema.Types.ObjectId,
    required: false
  }
});

module.exports = mongoose.model('Notes', noteSchema);
