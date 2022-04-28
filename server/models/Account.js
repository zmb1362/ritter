/* This file defines our schema and model interface for the account data.

   We first import bcrypt and mongoose into the file. bcrypt is an industry
   standard tool for encrypting passwords. Mongoose is our tool for
   interacting with our mongo database.
*/
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

/* When generating a password hash, bcrypt (and most other password hash
   functions) use a "salt". The salt is simply extra data that gets hashed
   along with the password. The addition of the salt makes it more difficult
   for people to decrypt the passwords stored in our database. saltRounds
   essentially defines the number of times we will hash the password and salt.
*/
const saltRounds = 10;

let AccountModel = {};

// Schema for data types used for a user's account
const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  password: {
    type: String,
    required: true,
  },
  accountStatus: {
    type: Number,
    min: 0,
    max: 1,
    require: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Converts a doc to something we can store in redis later on.
AccountSchema.statics.toAPI = (doc) => ({
  username: doc.username,
  _id: doc._id,
});

// Helper function to hash a password
AccountSchema.statics.generateHash = (password) => bcrypt.hash(password, saltRounds);

/* Helper function for authenticating a password against one already in the
   database. Essentially when a user logs in, we need to verify that the password
   they entered matches the one in the database. Since the database stores hashed
   passwords, we need to get the hash they have stored. We then pass the given password
   and hashed password to bcrypt's compare function. The compare function hashes the
   given password the same number of times as the stored password and compares the result.
*/
AccountSchema.statics.authenticate = async (username, password, callback) => {
  try {
    const doc = await AccountModel.findOne({ username }).exec();
    if (!doc) {
      return callback();
    }

    const match = await bcrypt.compare(password, doc.password);
    if (match) {
      return callback(null, doc);
    }
    return callback();
  } catch (err) {
    return callback(err);
  }
};

// Helper function to handle changing a user's password
AccountSchema.statics.changePass = async (username, password, newPass, callback) => {
  try {
    const doc = await AccountModel.findOne({ username }).exec();
    if (!doc) {
      return callback();
    }

    const match = await bcrypt.compare(password, doc.password);
    if (match) {
      await AccountModel.updateOne({ username }, { password: newPass });
      return callback(null, false);
    }

    return callback(null, true);
  } catch (err) {
    return callback(err);
  }
};

// Helper function to handle changing a user's account status
AccountSchema.statics.changeStatus = async (username) => {
  try {
    return AccountModel.updateOne({ username }, { accountStatus: 1 });
  } catch (err) {
    return null;
  }
};

// Helper function to return a user's account status when called
AccountSchema.statics.findStatus = (ownerId, callback) => {
  const search = {
    // Convert the string ownerId to an object id
    _id: mongoose.Types.ObjectId(ownerId),
  };

  return AccountModel.find(search).select('accountStatus').exec(callback);
};

AccountModel = mongoose.model('Account', AccountSchema);
module.exports = AccountModel;
