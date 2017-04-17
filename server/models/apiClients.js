var mongoose = require('mongoose');

var ApiClientSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  id: { type: String, required: true, unique: true },
  secret: { type: String, required: true },
  active: { type: Boolean, required: true }
});

module.exports = mongoose.model('ApiClient', ApiClientSchema);