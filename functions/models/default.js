const mongoose = require('mongoose');

const guinnessRecordSchema = new mongoose.Schema({
  title: String,
  description: String,
  year: Number
});

module.exports = mongoose.model('GuinnessRecord', guinnessRecordSchema);
