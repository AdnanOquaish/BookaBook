var mongoose = require('mongoose');
var crypto = require('crypto');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;
var Book = require('book.js');

var UserSchema = new Schema({
  phoneNum: {type: Number, required: true, unique: true},
  salt: {type: String, required: true, default: uuid.v1},
  passwordHash: {type: String, required: true},
  name: {type: String, required: true},
  location: {
    type: [Number],  // [<longitude>, <latitude>]
    index: '2d'      // create the geospatial index
  },
  ownedBooks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Book'}],
  wishListBooks: [
    status: {type: String, required: true, default: "wish"}, // would change between wish and request
    peer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    book: {type: mongoose.Schema.Types.ObjectId, ref: 'Book'}
  ],
  requestedBooks: [
    status: {type: String, required: true, default: "acknowledged"}, // would change between acknowledged and accepted
    peer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    book: {type: mongoose.Schema.Types.ObjectId, ref: 'Book'}
  ],
  transactionBooks: [
    status: {type: String, required: true, default: "lent"}, // would change between lent, borrowed, collected and return
    peer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    book: {type: mongoose.Schema.Types.ObjectId, ref: 'Book'}
  ],
  recommendedBooks: [
    peer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    book: {type: mongoose.Schema.Types.ObjectId, ref: 'Book'}
  ],
  createdOn: {type: Date, default: new Date()}
});

var hash = function(passwd, salt) {
    return crypto.createHmac('sha256', salt).update(passwd).digest('hex');
};

UserSchema.methods.setPassword = function(passwordString) {
    this.passwordHash = hash(passwordString, this.salt);
};

UserSchema.methods.isValidPassword = function(passwordString) {
    if(passwordString === undefined){return false;}
    return this.passwordHash === hash(passwordString, this.salt);
};

module.exports = mongoose.model('User', UserSchema);
