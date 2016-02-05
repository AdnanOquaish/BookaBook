var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Book = require('user.js');

var BookSchema = new Schema({
  name: {type: String, required: true},
  auhor: {type: String, required: true, default: "Not available"},
  description: {type: String, required: true, default: "Not available"},
  ratings: {type: Number, required: true, default: 2},
  genre: {type: String, required: true},
  relevantBooks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Book'}],
  owbedBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  createdOn: {type: Date, default: new Date()}
});

module.exports = mongoose.model('Book', BookSchema);
