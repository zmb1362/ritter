const mongoose = require('mongoose');
const _ = require('underscore');

let RitzModel = {};

const setName = (name) => _.escape(name).trim();

const RitzSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  username: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

RitzSchema.statics.toAPI = (doc) => ({
  text: doc.text,
});

RitzSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    // Convert the string ownerId to an object id
    owner: mongoose.Types.ObjectId(ownerId),
  };

  return RitzModel.find(search).select('username text createdDate').lean().sort({ createdDate: -1 })
    .exec(callback);
};

RitzSchema.statics.findAll = (callback) => RitzModel.find({}).select('username text createdDate').lean().sort({ createdDate: -1 })
  .exec(callback);

RitzModel = mongoose.model('Ritz', RitzSchema);

module.exports = RitzModel;
