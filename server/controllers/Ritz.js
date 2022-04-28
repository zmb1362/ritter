const models = require('../models');
const RitzModel = require('../models/Ritz');

const { Ritz } = models;

// Renders pages
const makerPage = (req, res) => res.render('app');
const settingsPage = (req, res) => res.render('settings');

// Creates a Ritz/tweet
const makeRitz = async (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({ error: 'Type out text!' });
  }

  // Gets data to store into the Ritz
  const ritzData = {
    text: req.body.text,
    owner: req.session.account._id,
    username: req.session.account.username,
  };

  try {
    const newRitz = new Ritz(ritzData);
    await newRitz.save();
    return res.status(201).json({ text: newRitz.text });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Ritz already exists!' });
    }
    return res.status(400).json({ error: 'An error occured' });
  }
};

// Gets the user's Ritzs that they have made
const getRitzs = (req, res) => RitzModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred!' });
  }

  return res.json({ ritzs: docs });
});

// Gets all of the Ritzs from across all accounts
const getAllRitzs = (req, res) => RitzModel.findAll((err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred!' });
  }

  return res.json({ ritzs: docs });
});

module.exports = {
  makerPage,
  settingsPage,
  makeRitz,
  getRitzs,
  getAllRitzs,
};
